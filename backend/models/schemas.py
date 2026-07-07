from pydantic import BaseModel
from typing import List

class AnalyzeResponse(BaseModel):
    paper_id: str
    title: str
    summary: str
    key_contributions: List[str]
    limitations: List[str]
    methodology: str
    difficulty_score: int
    related_topics: List[str]

class AskRequest(BaseModel):
    paper_id: str
    question: str

class AskResponse(BaseModel):
    answer: str

class Flashcard(BaseModel):
    term: str
    definition: str

class FlashcardResponse(BaseModel):
    flashcards: List[dict]