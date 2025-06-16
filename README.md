# 🌌 OneirVision

> **Decode. Discover. Develop.**  
> An AI-powered platform to interpret, visualize, and explore your dreams in stunning 3D and generative experiences.

---

## ✨ Overview

**OneirVision** is a futuristic web application that blends psychology, AI, and immersive design to help users understand their subconscious through dream interpretation and visualization. It uses advanced natural language processing and AI-generated art to create personalized insights based on user-submitted dreams.

---

## 🚀 Features

- 🌠 **AI Dream Interpreter** – NLP-powered analysis of user-submitted dream content
- 🖼️ **Dream Visualizer** – AI-generated dream illustrations using Stable Diffusion
- 📓 **Dream Journal** – Save, edit, and track dreams with emotional tags and calendar filtering
- 💡 **Did You Know?** – Animated dream trivia cards with cultural, mythological, and scientific facts
- 🧠 **User Profile** – Personalized dream trends and analytics (Coming Soon)
- 🎨 **Immersive UI** – Built with React, TailwindCSS, Framer Motion, and Spline 3D integration

---

## 🛠️ Tech Stack

### Frontend
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Styled Components
- **Animation & 3D**: Framer Motion, Three.js, @react-three/fiber, @react-three/drei
- **UI Components**: Headless UI, Hero Icons, Lucide Icons
- **State Management**: React Context API
- **Routing**: React Router v6
- **Charts**: Chart.js
- **Audio**: Howler.js
- **Particles**: tsparticles
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT
- **API**: RESTful API
- **AI Integration**: 
  - Google's Gemini AI
  - Hugging Face (for potential ML models)
- **Environment Management**: dotenv
- **CORS**: Built-in CORS middleware

### Development Tools
- **Package Manager**: npm
- **Bundler**: Vite
- **Linting/Formatting**: ESLint, Prettier
- **Type Checking**: TypeScript
- **Version Control**: Git
- **Deployment**: Vercel (Frontend), Render/Vercel (Backend)

### APIs & Services
- **AI/ML**: Google Gemini, Hugging Face
- **Authentication**: Google OAuth
- **Hosting**: Vercel, Render

---

## 📸 Screenshots

> Coming Soon: UI previews, Spline hero, Interpreter & Visualizer in action

---

## 📂 Folder Structure

```bash
oneirvision/
│
├── public/              # Static files
├── src/
│   ├── assets/          # Images, fonts, Spline scenes
│   ├── components/      # Reusable UI components
│   ├── pages/           # Home, Interpreter, Visualizer, Journal, etc.
│   ├── routes/          # Page routing logic
│   ├── styles/          # Tailwind config + global styles
│   └── App.jsx
├── .env                 # API keys (in .gitignore)
├── tailwind.config.js
└── package.json
