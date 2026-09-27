# StatSaksham AI — Working Prototype

Combined Next.js frontend + FastAPI backend + supplied training-video dataset.

## Local run
Backend:
```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000. API docs: http://localhost:8000/docs.

## Demo accounts
Learner: `ananya.sharma@mospi.gov.in` / `StatSaksham@2026`
Trainer: `trainer@nssta.gov.in` / `Trainer@2026`
Admin: `admin@mospi.gov.in` / `Admin@2026`

## Docker
`docker compose up --build`

## Integrated dataset
The supplied `training_videos_2.json` is loaded by `GET /api/v1/training/videos` and supports domain, competency-tag, and difficulty filters. The new Training Library page consumes this API.

## Important
This is a demonstration prototype: backend persistence is in-memory and external iGOT/NSSTA/TPAC adapters are mock adapters. Production deployment requires authorized integrations, production secrets, persistent storage, and security hardening.
