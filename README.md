# PaperPal AI

An AI-powered tool that helps you understand research papers. Upload a PDF, ask questions in plain language, and get answers grounded in the paper's own text.


![PaperPal screenshot](c:\Users\LENOVO\OneDrive\Pictures\Screenshots\1.png)

## Why I built it
Research papers are long and dense. PaperPal lets you ask questions about a paper instead of reading it cover to cover, and it answers from the paper's actual content rather than guessing.

## How it works (RAG pipeline)
1. **Upload:** the user uploads a PDF through the React frontend.
2. **Extract:** the FastAPI backend extracts the text using PyMuPDF.
3. **Chunk:** the text is split into smaller passages.
4. **Embed:** each chunk is converted into a vector using a local sentence-transformers model.
5. **Store:** the vectors are indexed in FAISS for fast similarity search.
6. **Retrieve:** the user's question is embedded and the most relevant chunks are fetched.
7. **Generate:** the question and retrieved chunks are sent to LLaMA 3.3 70B via the Groq API, which writes the answer.

The core pipeline logic lives in `[backend]/analyzer.py`.

## Tech stack
- **Frontend:** React, Vite
- **Backend:** Python, FastAPI
- **AI/RAG:** LangChain, FAISS, sentence-transformers, Groq API (LLaMA 3.3 70B), PyMuPDF
- **Deployment:** frontend on Vercel

## Project structure
```
paperpal-ai/
├── [frontend folder]/   # React + Vite app
├── [backend folder]/    # FastAPI app and RAG pipeline
└── README.md
```

### Backend
```bash
cd [ C:\Users\LENOVO\Downloads\paperpal-ai\backend ]
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # add your Groq API key
uvicorn [main:app] --reload
```

### Frontend
```bash
cd [C:\Users\LENOVO\Downloads\paperpal-ai\frontend]
npm install
npm run dev
```

### Environment variables
| Variable | Description |
|---|---|
| `[GROQ_API_KEY]` | API key for Groq |

## Design decisions
- Built to run without a GPU: embeddings run locally with a small sentence-transformers model, and generation uses an API.
- RAG instead of sending the whole paper to the LLM, which keeps context focused and cheaper.

## Future improvements
- Show the source passage for each answer (citations)
- Cache embeddings so repeated uploads of the same paper are faster
- Host the backend so the live demo works end to end

## Author
Afrah Khatoon, [https://github.com/Afrah-Khan25/paperpal-ai](https://github.com/Afrah-Khan25)