
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os, uuid, shutil
from pipeline.extractor import extract_text
from pipeline.analyzer import analyze_paper
from pipeline.rag import build_rag_index
from models.schemas import AnalyzeResponse, AskRequest, AskResponse, FlashcardResponse

load_dotenv()

app = FastAPI(title="PaperPal AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = os.getenv("OUTPUT_DIR", "./outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)
app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

paper_store = {}

@app.get("/api/health")
def health():
    from pipeline.rag import _has_api_key
    return {
        "status": "ok",
        "mock_mode": os.getenv("MOCK_MODE", "true"),
        "rag_enabled": True,
        "gemini_configured": _has_api_key(),
    }

@app.post("/api/upload", response_model=AnalyzeResponse)
async def upload_paper(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    paper_id = str(uuid.uuid4())
    path = os.path.join(OUTPUT_DIR, f"{paper_id}.pdf")
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    text = extract_text(path)
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")
    result = analyze_paper(text, paper_id)
    rag_index = build_rag_index(text)
    paper_store[paper_id] = {"text": text, "analysis": result, "rag_index": rag_index}
    return result

@app.post("/api/ask", response_model=AskResponse)
async def ask_question(req: AskRequest):
    if req.paper_id not in paper_store:
        raise HTTPException(status_code=404, detail="Paper not found. Please upload again.")
    from pipeline.analyzer import ask_about_paper
    store = paper_store[req.paper_id]
    answer = ask_about_paper(paper_store[req.paper_id]["text"], req.question)
    return AskResponse(answer=answer)

@app.get("/api/flashcards/{paper_id}", response_model=FlashcardResponse)
async def get_flashcards(paper_id: str):
    if paper_id not in paper_store:
        raise HTTPException(status_code=404, detail="Paper not found.")
    from pipeline.analyzer import generate_flashcards
    cards = generate_flashcards(paper_store[paper_id]["text"])
    return FlashcardResponse(flashcards=cards)