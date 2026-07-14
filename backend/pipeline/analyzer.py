import os, json
from groq import Groq
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import FakeEmbeddings
from langchain_core.documents import Document
from models.schemas import AnalyzeResponse

print("=== ANALYZER LOADED ===")
print(f"MOCK_MODE env var: {os.getenv('MOCK_MODE')}")
print(f"GROQ_API_KEY set: {bool(os.getenv('GROQ_API_KEY'))}")

MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() == "true"
client = Groq(api_key=os.getenv("GROQ_API_KEY", "")) if not MOCK_MODE else None

vector_stores = {}

def build_vector_store(paper_id: str, text: str):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)
    docs = [Document(page_content=chunk) for chunk in chunks]
    embeddings = FakeEmbeddings(size=512)
    vs = FAISS.from_documents(docs, embeddings)
    vector_stores[paper_id] = vs
    return vs

def call_groq(prompt: str, max_tokens: int = 1500) -> str:
    try:
        print("Calling Groq API...")
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.3
        )
        print("Groq response received!")
        return response.choices[0].message.content
    except Exception as e:
        print(f"Groq API ERROR: {e}")
        return None

def analyze_paper(text: str, paper_id: str) -> AnalyzeResponse:
    if MOCK_MODE:
        return AnalyzeResponse(
            paper_id=paper_id,
            title="Attention Is All You Need",
            summary="This paper proposes the Transformer architecture, a novel approach to sequence modeling that relies entirely on attention mechanisms, dispensing with recurrence and convolutions. The model achieves state-of-the-art results on machine translation tasks while being significantly more parallelizable and requiring less training time.",
            key_contributions=[
                "Introduced the Transformer architecture based solely on attention mechanisms",
                "Proposed multi-head self-attention for capturing different representation subspaces",
                "Demonstrated superior performance on WMT 2014 English-to-German translation tasks",
                "Showed the model generalizes well to other tasks like English constituency parsing"
            ],
            limitations=[
                "Quadratic complexity with respect to sequence length limits use on very long documents",
                "Requires large amounts of training data to perform well",
                "Limited interpretability of attention weights as explanations",
                "High computational cost for training from scratch"
            ],
            methodology="The Transformer uses an encoder-decoder structure where both use stacked self-attention and feed-forward layers. The encoder maps input tokens to continuous representations, and the decoder generates output tokens auto-regressively using cross-attention over encoder outputs.",
            difficulty_score=78,
            related_topics=["Self-Attention", "Neural Machine Translation", "BERT", "GPT", "Sequence-to-Sequence Models", "Positional Encoding"]
        )

    build_vector_store(paper_id, text)

    chunk = text[:8000]
    prompt = f"""Analyze this research paper and respond ONLY with a valid JSON object. No preamble, no markdown, no backticks.

Paper text:
{chunk}

Return this exact JSON structure:
{{
  "title": "paper title",
  "summary": "2-3 sentence plain English summary",
  "key_contributions": ["contribution 1", "contribution 2", "contribution 3"],
  "limitations": ["limitation 1", "limitation 2"],
  "methodology": "1-2 sentence explanation of methods used",
  "difficulty_score": 75,
  "related_topics": ["topic1", "topic2", "topic3", "topic4"]
}}"""

    raw = call_groq(prompt)
    print(f"Raw response: {raw[:200] if raw else 'None'}")

    if raw is None:
        return AnalyzeResponse(
            paper_id=paper_id,
            title="API Error",
            summary="Could not connect to Groq API. Check your GROQ_API_KEY in .env file.",
            key_contributions=["Check GROQ_API_KEY in .env"],
            limitations=["API connection failed"],
            methodology="Unable to extract",
            difficulty_score=50,
            related_topics=[]
        )

    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        data = json.loads(raw)
        return AnalyzeResponse(paper_id=paper_id, **data)
    except Exception as e:
        print(f"JSON parse ERROR: {e}")
        return AnalyzeResponse(
            paper_id=paper_id,
            title="Parse Error",
            summary="Groq responded but JSON parsing failed. Check terminal for details.",
            key_contributions=["See terminal logs"],
            limitations=["JSON parse error"],
            methodology="Unable to extract",
            difficulty_score=50,
            related_topics=[]
        )

def ask_about_paper(text: str, question: str) -> str:
    if MOCK_MODE:
        return f"This is a mock answer to: '{question}'. In real mode, Groq reads the actual paper content."

    context = text[:6000]
    prompt = f"""You are a research assistant. Answer this question based ONLY on the paper content below.
Be specific and accurate. If the answer is not in the paper, say so.

Question: {question}

Paper content:
{context}

Answer:"""

    print(f"Asking Groq: {question}")
    result = call_groq(prompt, max_tokens=800)
    print(f"Groq answer: {result[:100] if result else 'None'}")
    return result if result else "Could not get an answer. Please try again."

def generate_flashcards(text: str) -> list:
    if MOCK_MODE:
        return [
            {"term": "Self-Attention", "definition": "A mechanism that allows each position in a sequence to attend to all positions in the same sequence."},
            {"term": "Multi-Head Attention", "definition": "Running multiple attention functions in parallel to capture different representation subspaces."},
            {"term": "Positional Encoding", "definition": "Injecting position information into token embeddings since Transformers have no recurrence."},
            {"term": "Feed-Forward Network", "definition": "A fully connected layer applied to each position separately with a ReLU activation."},
            {"term": "Encoder-Decoder", "definition": "Architecture where encoder maps input to representations and decoder generates output auto-regressively."}
        ]

    chunk = text[:6000]
    prompt = f"""Generate 6 flashcards from this research paper. Respond ONLY with a JSON array. No preamble, no markdown, no backticks.

Paper:
{chunk}

Return this exact format:
[
  {{"term": "key term", "definition": "clear definition from the paper"}},
  ...
]"""

    raw = call_groq(prompt, max_tokens=1000)
    if raw is None:
        return [{"term": "Error", "definition": "Could not connect to Groq API."}]

    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        return json.loads(raw)
    except Exception as e:
        print(f"Flashcard parse error: {e}")
        return [{"term": "Error", "definition": "Could not generate flashcards. Please try again."}]