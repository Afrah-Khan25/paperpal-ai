import os, json
from models.schemas import AnalyzeResponse, Flashcard

MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() == "true"
client = None

def chunk_text(text: str, max_chars: int = 12000) -> str:
    return text[:max_chars]

def analyze_paper(text: str, paper_id: str) -> AnalyzeResponse:
    return AnalyzeResponse(
        paper_id=paper_id,
        title="Attention Is All You Need",
        summary="This paper proposes the Transformer architecture, a novel approach to sequence modeling that relies entirely on attention mechanisms, dispensing with recurrence and convolutions. The model achieves state-of-the-art results on machine translation tasks while being significantly more parallelizable and requiring less training time.",
        key_contributions=[
            "Introduced the Transformer architecture based solely on attention mechanisms",
            "Proposed multi-head self-attention for capturing different representation subspaces",
            "Demonstrated superior performance on WMT 2014 English-to-German and English-to-French translation tasks",
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

def ask_about_paper(text: str, question: str) -> str:
    return f"This is a demo answer to: '{question}'. In production, the AI reads the full paper and answers based on its actual content using RAG architecture."

def generate_flashcards(text: str) -> list:
    return [
        {"term": "Self-Attention", "definition": "A mechanism that allows each position in a sequence to attend to all positions in the same sequence."},
        {"term": "Multi-Head Attention", "definition": "Running multiple attention functions in parallel to capture different representation subspaces."},
        {"term": "Positional Encoding", "definition": "Injecting position information into token embeddings since Transformers have no recurrence."},
        {"term": "Feed-Forward Network", "definition": "A fully connected layer applied to each position separately with a ReLU activation."},
        {"term": "Encoder-Decoder", "definition": "Architecture where encoder maps input to representations and decoder generates output auto-regressively."}
    ]