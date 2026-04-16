# Custom Hero Section: Senior Developer Design Blueprint

You provided a screenshot of the "Om Singh" minimal portfolio. It's a fantastic piece of inspiration. Let's break down *why* it works, and then design something completely original but equally powerful.

## 1. Analysis: What makes the inspiration good?
Looking closely at the screenshot, several elements stand out:
*   **Asymmetry:** A massive, high-contrast serif/sans-serif hybrid headline on the left, balanced by a large circular image masking a greyscale portrait on the right.
*   **"Bento Box" Micro-Widgets:** The inclusion of small, interactive-looking status bubbles:
    *   A pill-shaped widget showing location and local time.
    *   A Spotify "Last Played" card.
*   **Floating Navigation:** A small, icon-based dock at the bottom rather than a traditional top navbar.

## 2. The Redesign: A Unique "Senior Dev" Approach
We will NOT copy it. Instead, we'll take the concept of a **"Widget-Driven Split Hero"** and elevate it.

### A. Layout Structure (The "Grid Layout")
Instead of a simple left/right split, we'll use a CSS CSS Grid or Flexbox to create an asymmetrical, interlocking hero section.

*   **Left Column (The Impact Area):**
    *   Very large, sharp typography (using our `Geist` font). 
    *   Instead of "Hi, I'm...", we'll use an impactful statement: e.g., "Engineering the Web." followed by your name and title.
*   **Right Column (The "Bento" Showcase):**
    *   Instead of one giant circle, we create a staggered grid of 2-3 Glassmorphism cards.
    *   **Card 1:** A stylized, high-contrast headshot (or an abstract 3D geometrical shape).
    *   **Card 2 (Status Widget):** A live "availability" orb (pulsing green) with your current timezone and focus area.
    *   **Card 3 (Tech Stack Widget):** A minimal marquee or grid showing React, Node, MongoDB icons.

### B. Interactive Elements (Framer Motion)
*   **Magnetic Float:** The widgets on the right will slowly bob up and down independently, making the page feel "alive" even when the user isn't scrolling.
*   **On-Load Reveal:** 
    *   The text on the left slides up line-by-line.
    *   The Bento cards on the right scale up from `0.8` to `1` with a slight rotation that settles into place.

## 3. Implementation Plan
I will rewrite `src/components/Hero.jsx` to reflect this new design pattern.
1.  **Grid Architecture:** Set up an `xl:grid-cols-12` layout.
2.  **Typography:** Refine the headline classes for maximum contrast against `bg-zinc-950`.
3.  **Bento Widgets:** Build reusable mini-components inside the Hero file for the status and stack displays.
4.  **Animations:** Apply Framer Motion variants for the entrance sequence and the continuous ambient floating effect.
