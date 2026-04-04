# Modern MERN Portfolio Implementation Plan

## Goal Description
Build a premium, modern, full-stack portfolio using the MERN stack. The portfolio will feature a sleek, dark-themed UI with smooth Framer Motion animations. Crucially, all core data (projects, experience, and contact messages) will be entirely dynamic, served from a custom Node.js/Express REST API backed by MongoDB.

## User Review Required
None at this stage. Proceeding to implementation once the plan is approved.

## Proposed Architecture & Changes

### 1. Database (MongoDB) 
We will design three core collections to make the portfolio fully dynamic:
*   **Projects Collection:**
    ```javascript
    {
      title: String,
      description: String,
      techStack: [String],
      githubUrl: String,
      liveUrl: String,
      imageUrl: String,
      featured: Boolean,
      order: Number
    }
    ```
*   **Experience Collection:**
    ```javascript
    {
      role: String,
      company: String,
      duration: String,
      description: [String],
      order: Number
    }
    ```
*   **Messages Collection (Contact Form):**
    ```javascript
    {
      name: String,
      email: String,
      message: String,
      dateSent: Date
    }
    ```

### 2. Backend API (Node.js/Express)
We will build a robust, modular Express application:
*   `GET /api/projects`: Fetch all projects, sorted by `order`.
*   `GET /api/experience`: Fetch work history, sorted chronologically.
*   `POST /api/contact`: Receive messages from the frontend, save to MongoDB, and (optionally) trigger an email notification via Nodemailer.

### 3. Frontend (React + Vite)
The UI will be built for extreme performance and stunning aesthetics.
*   **Stack:** React, Vite, Tailwind CSS, Framer Motion, React Router.
*   **UI/UX Aesthetic (Senior Developer Level):** 
    *   **Theme & Texture:** Deep Charcoal (`bg-zinc-950`) base. To prevent the dark mode from feeling "flat", we will overlay a very subtle SVG noise texture (grain) to give the background depth and a premium "physical" feel. 
    *   **Lighting Effects:** Implement dynamic CSS spotlight/glow effects (`radial-gradient`) that follow the user's cursor when hovering over project cards (similar to Linear's website design).
    *   **Typography:** Primary font 'Geist' or 'Inter'. We will use tight letter-spacing for headings to make them punchy, and elevated contrast ratios (e.g., `text-zinc-600` for subtitles, `text-zinc-200` for primary text) to establish clear visual hierarchy without relying on bold weights.
    *   **Components:** 
        *   **Glassmorphism 2.0:** Instead of just `backdrop-blur`, borders will have subtle, 1px semi-transparent gradients (`border-white/10`) to simulate edge lighting on glass cards.
        *   **Magnetic Buttons:** Buttons that gently "pull" towards the cursor on hover using Framer Motion springs.
        *   **Micro-interactions:** Staggered fade-ins for lists. Page transitions that feel instantaneous. Custom, minimal cursor that inverts colors when hovering over links.
*   **Core Pages/Sections:**
    *   **Hero Section:** High-impact bold typography stating role and philosophy. Interactive particle or subtle gradient background.
    *   **About/Skills:** Bento-box style grid detailing technical skills and tools.
    *   **Projects Showcase:** Large, high-quality images with hover-to-reveal details. Data fetched dynamically from the API.
    *   **Experience Timeline:** Minimalist vertical timeline.
    *   **Contact/Footer:** A sleek form that posts data back to our Express API.

## Verification Plan

### Automated Tests
*   Ensure the Express API correctly connects to MongoDB.
*   Verify API routes (`/api/projects`, `/api/contact`) return the expected JSON structures matching the frontend interfaces.

### Manual Verification
*   Run the React frontend locally (`npm run dev`) and test responsive behavior across mobile, tablet, and desktop views.
*   Visually confirm that Framer Motion animations trigger correctly on scroll.
*   Submit a test message via the UI contact form and verify it appears in the MongoDB database.
