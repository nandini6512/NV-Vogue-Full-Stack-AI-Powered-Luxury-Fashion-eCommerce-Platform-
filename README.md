 NV Vogue

NV Vogue is an ultra-premium, full-stack, AI-powered fashion eCommerce website. Designed with a luxury, modern brand identity (crimson, gold, and glassmorphism styling) to replicate international haute couture portals. It features secure user authorization, persistent shopping baskets, address profiles, detailed timelines for order dispatching, administrative dashboards, and a smart, conversational AI Fashion Assistant widget ("NV Stylist") that matches your catalog items directly in real time.

 Architectural Layout Blueprint

The codebase features a clean, highly structured ES-module layout splitting backend APIs and the Vite React frontend:

nv-vogue/
 ├── backend/                   # Node.js + Express + Mongoose API Gateway
 │    ├── config/               # DB connection configurations
 │    ├── controllers/          # Business logic handlers (auth, products, orders, AI)
 │    ├── middleware/           # JWT authenticators & central error boundary handlers
 │    ├── models/               # MongoDB models (User, Product, Order)
 │    ├── routes/               # API Router mappings
 │    ├── data/                 # Catalog seed products JSON
 │    ├── server.js             # Express server bootstrap
 │    ├── seed.js               # Database seeder scripting
 │    └── .env                  # Port variables, local DB URIs, and API secret keys
 │
 └── frontend/                  # React + Vite + Tailwind CSS Client
      ├── public/               # Static assets
      └── src/
           ├── assets/          # Custom vector gold monogram branding
           ├── components/      # Navigation, footers, protected routes, and float chat widget
           ├── context/         # Auth, cart, and light/dark theme providers
           ├── pages/           # Shop grids, detail galleries, timeline orders, and admin panels
           ├── utils/           # Axios helper with JWT interceptors
           ├── App.jsx          # Route mappings
           ├── index.css        # Tailwind layers and premium gold animations
           └── main.jsx         # React bootstrapping mounting
           

 Technical Stack & Features

- Frontend : React (Vite) + Tailwind CSS + Framer Motion (for fluid, modern transitions) + Lucide Icons + React Router DOM (v6)
- State Management : Unified React Context API (Modular contexts for Auth, Cart, and Theme mode)
- Backend API Gateway : Node.js + Express.js
- Database : MongoDB with Mongoose Schemas (User, Product, Order)
- Security : JWT (JSON Web Tokens) with Authorization Bearer headers, bcryptjs password hashing, and Role-Based Access Control (Admin vs Customer)
- Interactive AI Assistant : "NV Stylist" Chatbot widget featuring a localized NLP query parser that extracts categories/colors/trends to query real database products, displaying interactive clickable shop cards inside the chat. Backed by optional Google Gemini API support!
- Luxury Theme : Immersive Light/Dark switching, gold gradients, customized scrollbars, and Outfit/Inter typography.
