# NV Vogue 🛍️✨

**NV Vogue** is an ultra-premium, full-stack, AI-powered fashion eCommerce website. Designed with a luxury, modern brand identity (crimson, gold, and glassmorphism styling) to replicate international haute couture portals. It features secure user authorization, persistent shopping baskets, address profiles, detailed timelines for order dispatching, administrative dashboards, and a smart, conversational AI Fashion Assistant widget ("NV Stylist") that matches your catalog items directly in real time.

---

## Architectural Layout Blueprint

The codebase features a clean, highly structured ES-module layout splitting backend APIs and the Vite React frontend:

```text
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
```

---

## Technical Stack & Features

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion (for fluid, modern transitions) + Lucide Icons + React Router DOM (v6)
- **State Management**: Unified React Context API (Modular contexts for Auth, Cart, and Theme mode)
- **Backend API Gateway**: Node.js + Express.js
- **Database**: MongoDB with Mongoose Schemas (User, Product, Order)
- **Security**: JWT (JSON Web Tokens) with Authorization Bearer headers, bcryptjs password hashing, and Role-Based Access Control (Admin vs Customer)
- **Interactive AI Assistant**: "NV Stylist" Chatbot widget featuring a localized NLP query parser that extracts categories/colors/trends to query real database products, displaying interactive clickable shop cards inside the chat. Backed by optional Google Gemini API support!
- **Luxury Theme**: Immersive Light/Dark switching, gold gradients, customized scrollbars, and Outfit/Inter typography.

---

## Standard Installation & Run Instructions

Ensure [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) (running locally) are installed on your machine.

### 1. MongoDB Database Check
Ensure MongoDB is running locally on your default port:
- Windows: Open command prompt/PowerShell and run `mongod` or confirm the MongoDB Service is active in Task Manager.

### 2. Backend Installation & Database Seeding
Open a terminal in the `backend` directory and run the following commands:
```bash
cd backend
npm install
npm run seed
```
> [!NOTE]
> `npm run seed` will wipe any existing database items, seed the database with **24 premium catalog fashion items** spread across all 8 modules (Men, Women, Kids, Jeans, Tops, Beauty, Shoes, Accessories), and register a Customer profile and an Admin profile.

### 3. Start Backend server
```bash
npm run dev
```
The Express server will start up on `http://localhost:5000`.

### 4. Frontend Installation & Client Startup
Open a separate terminal in the `frontend` directory and run the following:
```bash
cd frontend
npm install
npm run dev
```
The Vite React client will compile and host on `http://localhost:3000`.

---

## High-Quality Demo Accounts

Utilize these pre-configured user credentials during testing:

### 1. Boutique Customer Profile
- **Email**: `user@nv.com`
- **Password**: `password123`
- *Features: Shop the grid, like items, add addresses, checkout credit mock cards, and view timeline tracking orders under order history.*

### 2. Platform Administrator Profile
- **Email**: `admin@nv.com`
- **Password**: `password123`
- *Features: Accesses the full **Admin Dashboard** in the profile dropdown, tracks platform revenue summaries, adds new products to catalog, deletes items, and fulfills orders by shipping/delivering them.*

---

## Detailed AI Integration Options

By default, the **NV Stylist** AI chatbot operates on an advanced local NLP pattern-parser. If you ask:
- *"I need a crimson top"* -> It queries the database for Tops matching the Crimson color.
- *"Suggest formal shoes"* -> It queries formal shoes and returns them as interactive cards.
- *"Show me best accessories"* -> Returns trending watches/glasses.

To enable **Generative Gemini AI conversations**, simply add your API key in `backend/.env`:
```text
GEMINI_API_KEY=YOUR_ACTUAL_GOOGLE_GEMINI_API_KEY
```
Restart the backend server, and **NV Stylist** will converse with absolute elegance, backed by real Gemini intelligence while injecting catalog items seamlessly!
