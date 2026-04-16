# AI-Powered Local Crop Advisory System - 5-Day Roadmap

This document outlines the strategic implementation plan for the **AI-Powered Local Crop Advisory System**, aimed at winning the **MAESTROS 4x Idea Tank** at PIET, Haryana.

## Goal Description
To build a scalable, voice-first AI assistant tailored for small-scale farmers. It provides real-time, hyperlocal crop advisory in regional languages (Hindi/English) without requiring high smartphone literacy. This directly addresses the event's core criteria: Innovation, Scalability, Technical Depth, and Demo-ability.

## User Review Required
Please review this roadmap to ensure the technical stack, MVP features, and daily milestones align with your team's capabilities and presentation strategy for the event. If approved, we can proceed to set up the MERN stack repository.

## Proposed Strategy & Tech Stack (MERN + Gemini)
- **Frontend (Client)**: React.js (Vite), Tailwind CSS (for fast UI), Web Speech API (for voice-to-text in Hindi/English).
- **Backend (Server)**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ORM) to store user profiles, query history, and analytics.
- **AI Brain**: Google Gemini API (`@google/generative-ai`) for processing agronomy queries and returning localized advice.
- **External APIs (Bonus)**: OpenWeatherMap API for fetching real-time weather context (adds massive technical depth).

---

## The 5-Day "Winner's" Execution Plan

### Day 1: Foundation & "Hello World"
**Goal: Get the core stack running and prove the AI works.**
1. **Repository Setup**: Initialize the MERN monorepo structure (client and server folders).
2. **Backend Init**: Setup Express server and connect to MongoDB Atlas (free tier).
3. **Gemini API Check**: Create a simple POST endpoint `/api/test-ai`. Integrate `gemini-1.5-flash` model. Send a hardcoded prompt ("Wheat leaves turning yellow") and verify a sensible text response is returned.
4. **Frontend Init**: Setup Vite + React + Tailwind. Create a temporary landing page.

### Day 2: The Core Feature (Voice & AI Integration)
**Goal: Build the "Wow" Demo feature.**
1. **Web Speech API**: Implement the microphone feature on the React frontend. Capture spoken Hindi/English and transcribe it into text.
2. **Advisory Logic Endpoint**: Create `/api/advise`.
    - Accept transcribed text from the frontend.
    - Inject context into the Gemini Prompt: *"You are an expert agronomist in Haryana. Provide a short, actionable diagnosis and solution for the following farmer query: [TEXT]. Keep it under 50 words and respond in the same language."*
3. **Frontend Display**: Connect the microphone component to the backend. Speak a query -> See the AI's response appear on screen.

### Day 3: Database & UI Polish
**Goal: Make it look like a real, deployed product.**
1. **Database Schema**: 
    - `User`: Basic profile (Region: Karnal, Crop: Wheat).
    - `Query`: Log what farmers ask, AI responses, timestamps (shows scalability and data collection potential to judges).
2. **Rural-Friendly UI**: Design a mobile-first, highly accessible interface. Large "Hold to Speak" button, weather icons, earthy color palette, minimalistic text.
3. **Localization**: Ensure the UI accommodates Hindi nicely.

### Day 4: The Edge (Contextual Intelligence)
**Goal: Add technical depth that destroys the competition.**
1. **Weather Context**: Integrate a weather API. When the farmer asks a question, the backend fetches their local weather (e.g., "35°C, high humidity") and invisibly adds it to the Gemini prompt. The AI can then say, *"Since it is highly humid today, do not spray X..."*
2. **Voice Output (TTS)**: Use browser's built-in text-to-speech to narrate the AI's answer back to the farmer. This completes the "zero literacy required" loop.

### Day 5: Presentation & Rehearsal
**Goal: Flawless demo and pitch execution.**
1. **Deployment**: Deploy Frontend to Vercel and Backend to Render. (Shows technical completeness).
2. **Seed Data**: Pre-populate MongoDB with realistic data to show a "live" dashboard of farmer queries for the presentation.
3. **Slide Deck & Scripting**: Finalize the 6-slide deck. Rehearse the live 60-second demo: "*Mere gehu ke patte peele ho rahe hain.*"

---

## Verification Plan
### Automated & Manual Tests
1. **Voice Input Test**: Open the React app in Chrome, click the microphone, and speak a test phrase in Hindi. Verify the text appears correctly in the input field.
2. **AI Advisory Test**: Send the transcribed text to the backend `/api/advise` endpoint. Verify that Gemini returns a contextually accurate, sub-50-word response.
3. **End-to-End Demo Test**: Execute the full flow from pressing the microphone on the UI to receiving the AI response on the screen within 3-4 seconds.
