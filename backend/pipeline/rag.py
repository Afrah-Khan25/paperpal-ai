import math
import os
import re

CHUNK_SIZE = int(os.getenv("RAG_CHUNK_SIZE", "1200"))
CHUNK_OVERLAP = int(os.getenv("RAG_CHUNK_OVERLAP", "200"))
TOP_K = int(os.getenv("RAG_TOP_K", "5"))


def _has_api_key() -> bool:
    key = os.getenv("GEMINI_API_KEY", "")
    return bool(key and key != "your_key_here")


def split_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    text = re.sub(r"\s+", " ", text.strip())
    if not text:
        return []

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(text):
            break
        start = max(start + 1, end - overlap)

    return chunks if chunks else [text]


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def _tokenize(text: str) -> set[str]:
    return {w.lower() for w in re.findall(r"[a-zA-Z0-9]+", text) if len(w) > 2}


def _lexical_score(chunk: str, question: str) -> float:
    chunk_tokens = _tokenize(chunk)
    question_tokens = _tokenize(question)
    if not question_tokens:
        return 0.0
    overlap = len(chunk_tokens & question_tokens)
    return overlap / len(question_tokens)


def _embed_texts(texts: list[str], task_type: str) -> list[list[float]]:
    import google.generativeai as genai

    embeddings = []
    for text in texts:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type=task_type,
        )
        embeddings.append(result["embedding"])
    return embeddings


def build_rag_index(text: str) -> dict:
    chunks = split_text(text)
    if _has_api_key():
        try:
            embeddings = _embed_texts(chunks, "retrieval_document")
            return {"chunks": chunks, "embeddings": embeddings, "method": "semantic"}
        except Exception:
            pass
    return {"chunks": chunks, "embeddings": None, "method": "lexical"}


def retrieve_chunks(index: dict, question: str, top_k: int = TOP_K) -> list[str]:
    chunks = index.get("chunks", [])
    if not chunks:
        return []

    if index.get("method") == "semantic" and index.get("embeddings"):
        query_embedding = _embed_texts([question], "retrieval_query")[0]
        scores = [
            _cosine_similarity(query_embedding, emb)
            for emb in index["embeddings"]
        ]
        ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
        return [chunks[i] for i in ranked[:top_k]]

    scored = [(i, _lexical_score(chunk, question)) for i, chunk in enumerate(chunks)]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [chunks[i] for i, _ in scored[:top_k] if _ > 0] or chunks[:top_k]


def _format_extractive_answer(chunks: list[str], question: str) -> str:
    context = "\n\n".join(f"• {chunk}" for chunk in chunks[:3])
    return (
        f"Based on the uploaded paper, here are the most relevant passages for "
        f'"{question}":\n\n{context}\n\n'
        "Set GEMINI_API_KEY and MOCK_MODE=false for full AI-generated RAG answers."
    )


def generate_rag_answer(chunks: list[str], question: str) -> str:
    if not chunks:
        return "I could not find relevant content in this paper to answer your question."

    if not _has_api_key():
        return _format_extractive_answer(chunks, question)

    import google.generativeai as genai

    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    context = "\n\n---\n\n".join(
        f"[Passage {i + 1}]\n{chunk}" for i, chunk in enumerate(chunks)
    )

    prompt = f"""You are a research paper assistant using RAG (Retrieval Augmented Generation).
Answer the question using ONLY the retrieved passages below from the uploaded paper.
If the passages do not contain enough information, say so clearly.
Be concise, accurate, and cite specific details from the passages when possible.

Question: {question}

Retrieved passages from the paper:
{context}

Answer:"""

    response = model.generate_content(prompt)
    return response.text.strip()


def ask_with_rag(index: dict, question: str) -> str:
    chunks = retrieve_chunks(index, question)
    return generate_rag_answer(chunks, question)
