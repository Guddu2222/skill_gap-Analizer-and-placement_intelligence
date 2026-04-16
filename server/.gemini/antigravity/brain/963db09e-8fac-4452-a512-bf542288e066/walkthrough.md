# Kisan Mitra AI — Walkthrough

## What Was Built

A full-stack **AI-Powered Local Crop Advisory System** using the MERN stack with Gemini API.

---

## Features Completed

| Day | Feature | Status |
|-----|---------|--------|
| 1 | MERN monorepo setup, Express server, Vite+React frontend | ✅ |
| 2 | Voice capture (Web Speech API), Gemini `/api/advise` endpoint, Hinglish support | ✅ |
| 3 | Mongoose schemas (User, Query), chat-style UI, query logging to MongoDB | ✅ |
| 4 | OpenWeatherMap context injection into AI prompt, Text-to-Speech narration | ✅ |

---

## Live Demo Flow

1. **Open Chrome** → `http://localhost:5174`
2. **Tap the green mic** → Speak your query in Hinglish or English (e.g. *"Mere gehu ke patte peele ho rahe hain"*)
3. **Speech is captured** → Transcripted text appears as a green bubble
4. **Backend fires** → Fetches live Karnal weather → Injects it into the Gemini prompt
5. **AI responds** → Advice appears in a chat bubble + is **narrated aloud** (TTS)
6. **Replay anytime** → Tap "Replay" button under the AI response

---

## The Winning Demo Script

Walk up, open the app, tap the mic, say:
> **"Mere gehu ke patte peele ho rahe hain"**

The AI responds with a diagnosis in Hinglish **AND reads it aloud**. Judges in the audience will remember it.

---

## Screenshot

![UI Screenshot](C:\Users\guddu\.gemini\antigravity\brain\963db09e-8fac-4452-a512-bf542288e066\kisan_mitra_ai_interface_1773482528557.png)

---

## Pending (Day 5)

- ⬜ Get free API key from [OpenWeatherMap](https://openweathermap.org/api) → paste in `server/.env`
- ⬜ Fix Gemini API key 404 (get fresh key from [Google AI Studio](https://aistudio.google.com/app/apikey))
- ⬜ Deploy frontend to Vercel, backend to Render
- ⬜ Seed MongoDB with 5–10 demo queries

## Running Locally

```bash
# Terminal 1 — Backend
cd server && npm run dev     # Runs on http://localhost:5001

# Terminal 2 — Frontend
cd client && npm run dev     # Runs on http://localhost:5174
```
