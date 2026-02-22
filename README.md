# Dino Video Player

A modern, mobile-first video player application built with React and TypeScript.

## Features

- ☁️ **Cloudinary Optimized Delivery**: High-performance image and video delivery with smart caching and browser-specific format selection (WebM/MP4).
- 📱 **Advanced Mini-Player**: Native-like Picture-in-Picture (PiP) experience, draggable and persistent across the app.
- 🎬 **Fluid Motion & Animations**: Premium transitions powered by **Framer Motion**, including:
  - Seamless video card to player overlay expansion.
  - Smooth tab switching animations.
  - Active video indicator animations in the drawer list.
- 📐 **Dynamic Header Behavior**: Smart header that automatically shows or hides based on scroll direction.
- 📥 **Interactive Drawer Interface**: YouTube-inspired drawer system with snap points and unified gesture controls (drag-to-minimize).
- 🔄 **Smart Playback Features**:
  - **Auto-Play Next**: Seamless transition to the next video in the feed.
  - **Visual Seek Feedback**: Instant visual indicators when skipping forward or backward.
  - **Intelligent Filtering**: Category-based filtering in both the home feed and the upcoming videos drawer.
- 🌓 **Dark Mode Support**: Seamless integration with system preferences.
- ⚠️ **Robust Error Handling**: Dedicated error screens to ensure a graceful and reliable user experience.
- ⚡ **High Performance**: Built with Vite for fast HMR and optimized production builds.
- 🧩 **Modern Tech Stack**: Powered by React 18, TypeScript, Tailwind CSS v4, and Zustand.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dino-video-player-v2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` (or the URL shown in the terminal).

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.
