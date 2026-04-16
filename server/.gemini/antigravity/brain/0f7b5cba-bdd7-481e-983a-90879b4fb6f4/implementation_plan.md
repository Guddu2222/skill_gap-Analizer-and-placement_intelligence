# Implementation Plan - Hero and Navbar Upgrade

The goal is to upgrade the Hero Section and Navbar of the Landing Page with modern, animated, and responsive components using Tailwind CSS and Lucide React.

## User Review Required
> [!IMPORTANT]
> This change will completely replace the current `Navbar` and the inline Hero section in `LandingPage.jsx`.

## Proposed Changes

### Components
#### [MODIFY] [Navbar.jsx](file:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/client/src/components/Navbar.jsx)
- Replace existing code with the new responsive Navbar code provided by the user.
- Add features: Dropdown menus, scroll effect, mobile menu, improved styling.

#### [NEW] [HeroSection.jsx](file:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/client/src/components/HeroSection.jsx)
- Create a new component for the Hero Section.
- Features: Animated background, statistics, feature list, dashboard preview mockup.

### Pages
#### [MODIFY] [LandingPage.jsx](file:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/client/src/pages/LandingPage.jsx)
- Import `HeroSection`.
- Replace the inline Hero section with `<HeroSection />`.
- Retain existing sections (Trusted By, Features, Footer).

### Styling
#### [MODIFY] [index.css](file:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/client/src/index.css)
- Add keyframes and utility classes for animations: `fadeIn`, `slideUp`, `float`, `growUp`.

## Verification Plan

### Automated Tests
- None available for UI components.

### Manual Verification
1.  **Start the Client**: Ensure `npm run dev` is running in `client`.
2.  **Browser Check**: Open the local URL (usually http://localhost:5173).
3.  **Navbar Interaction**:
    - Scroll down -> Check if Navbar changes background (glassmorphism).
    - Hover over menu items -> Check dropdowns appearing.
    - Resize to mobile -> Check hamburger menu and mobile drawer.
4.  **Hero Section**:
    - Verify animations (slide up, float).
    - Check responsiveness of the layout (text left, image right on desktop; stacked on mobile).
5.  **Navigation**: Click "Log In" / "Get Started" to ensure links work (or at least point to the right place).
