# Frontend Architecture & UI/UX Walkthrough

## 🧭 Executive Overview
The MovieDay frontend is engineered to deliver a frictionless, "BookMyShow"-inspired ticketing experience. Built using React 19 and Vite, the architecture prioritizes ultra-low latency rendering, modular component design, and a robust state management lifecycle. The application seamlessly integrates a dynamic Day/Night mode and houses a sophisticated, deeply integrated conversational AI Chatbot interface.

---

## 🎨 Core UI/UX Architecture

Our frontend infrastructure is designed with a mobile-first, responsive paradigm utilizing **Tailwind CSS**.

- **Dynamic Theming System**:
  - Implemented a unified light/dark mode ("Day/Night") powered by root CSS variables (`--bg-primary`, `--text-primary`, etc.) in `index.css`.
  - The Tailwind configuration is extended with a custom color palette (`#F84464` for primary calls-to-action) matching modern structural aesthetics.
  - Users can instantly toggle contexts via the navigation layer without hydration performance hits.
- **Micro-Component Design**:
  - Encapsulated UI logic into reusable micro-components (e.g., Skeleton Loaders for Data Fetching, Modular Booking Strips).

---

## 🤖 The AI Chatbot: Frontend Integration

The crown jewel of the MovieDay experience is the integrated **Intelligent AI Chatbot Concierge**. On the frontend, this is not merely an iframe; it is a deeply integrated React sub-application communicating in real-time with the backend RAG pipeline.

### Engineering the Chat Interface
- **Persistent Floating UI**: The widget is globally accessible via a seamless, floating action button (FAB) that maintains state across client-side router navigations.
- **Asynchronous State Handling**: 
  - Manages real-time message arrays utilizing React local state combined with Redux for global user context.
  - Features intelligent loading indicators (typing dots) to manage user expectations during the backend OpenRouter multi-model LLM inference.
- **Contextual Rendering**:
  - The Chatbot is engineered to parse markdown and structured JSON data returned from the backend's intent-detection engine, rendering actionable links directly inside the chat (e.g., dynamically piping users directly to the `/booking/:id` route).
- **Accessibility (a11y)**: Focus traps inside the open modal, precise ARIA labels, and keyboard-navigation readiness ensure the agent bounds to strict accessibility standards.

---

## 🏗️ State Management & Data Flow

- **Redux Toolkit (RTK)**: Centralized state store managing authentication payloads, cached user profiles, and global UI toggles. 
- **Optimistic UI Updates**: Seat selection and cart management utilize rapid local state modifications before dispatching finalized payloads to the backend, ensuring a zero-lag perception during mission-critical booking flows.

---

## 📍 Key Page Implementations

> [!NOTE]
> All primary routing is handled via `react-router-dom` (v7) implementing strict client-side transitions to prevent full DOM repaints.

1. **Home (`Home.jsx`)**:
   - Features a dynamic, auto-rotating carousel banner utilizing heavily optimized asset delivery.
   - Paginates top-tier movie cards in horizontal, scroll-snapped lists.

2. **Exploration Hub (`Movies.jsx`)**:
   - Complex side-panel filtering interface natively bound to URL search parameters for link persistence (Genres, Languages).
   - Real-time debounced text-search hooks.

3. **Product Page (`MovieDetails.jsx`)**:
   - High-conversion layout featuring a sticky booking bar that persists as the user scrolls through Cast/Crew metadata.
   - Cinematic hero background rendering.

4. **Theater & Seat Selection (`SeatSelection.jsx`)**:
   - A geometrically scaled React component mapping the theater grid.
   - Implements advanced conflict-detection logic locally to grey-out reserved seats retrieved from the backend API.

5. **Fulfillment (`BookingConfirmation.jsx`)**:
   - Generates a skeuomorphic "Ticket" layout complete with CSS-rendered perforation lines and dynamic QR-code placeholder integration.

---

## 🧪 Verification & Release Plan

> [!IMPORTANT]
> The following checks must be manually verified prior to production branch merges.

### 1. Theme Resilience
- Toggle the Day/Night switch repeatedly. Verify absolute consistency across modals, dropdowns, and the Chatbot background contrast.

### 2. Chatbot Pipeline Check
- Open the Chatbot UI. Prompt: *"I want to watch a thriller."*
- Verify the backend correctly interprets the `recommendation` intent and returns the data to the frontend within ~3 seconds without UI freezing.
- Ensure the structural formatting output (Stars, Movie Title, actionable links) renders correctly.

### 3. Booking Fidelity
- Select 5 seats rapidly. Verify Redux accurately computes the subtotal locally.
- Forward payload to confirmation page and intercept the resulting receipt card for data accuracy.

---
> The frontend architecture is built to parallel operational standards of high-availability enterprise retail and entertainment platforms.
