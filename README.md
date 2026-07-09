# CyberShield AI 🛡️

> **AI-powered cybersecurity education and fraud detection platform**  
> Built with React + Node.js + Express + **IBM Granite AI** via IBM watsonx.ai  
> An IBM SkillsBuild Project

---

## 📌 Overview

CyberShield AI is a full-stack web application that combines IBM Granite foundation models with interactive educational content to help users:

- **Detect fraud** in suspicious messages, SMS, and emails
- **Learn** about digital banking, UPI, OTP safety, and online fraud
- **Stay protected** with interactive safety checklists, scam awareness, and a cybersecurity quiz

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat Assistant** | Conversational AI powered by IBM Granite — ask anything about cybersecurity |
| 🔍 **Fraud Analyzer** | Risk scoring for suspicious messages with threat category, explanation & recommendations |
| 🎓 **Financial Literacy Hub** | Interactive accordion lessons on UPI, debit/credit cards, net banking, OTP safety |
| 🕵️ **Scam Awareness Portal** | 8 scam types with warning signs, real examples, safety tips — filterable by category |
| 📝 **Cyber Safety Quiz** | 15 randomized questions with Easy/Medium/Hard difficulty, scoring, and full review |
| ✅ **Safety Checklists** | Interactive checklist cards for 8 cybersecurity topics — track your completion |
| 🏠 **Premium Landing Page** | Animated counters, How It Works, Testimonials, FAQ, CTA sections |
| 📊 **Professional UI** | Dark glassmorphism theme, responsive design, smooth animations |

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7, Vite |
| **Backend** | Node.js, Express |
| **AI** | IBM Granite 3.3 via IBM watsonx.ai (`@ibm-cloud/watsonx-ai`) |
| **Styling** | Custom CSS with CSS variables, glassmorphism |
| **Build Tool** | Vite 8 |
| **Linting** | OxLint |

---

## 📁 Project Structure

```
cybershield-ai/
├── backend/
│   ├── controllers/
│   │   ├── chatController.js       # IBM Granite AI chat handler
│   │   └── fraudController.js      # IBM Granite fraud analysis handler
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/                     # API route definitions
│   ├── services/                   # IBM watsonx.ai service integration
│   ├── server.js                   # Express app entry point
│   └── .env.example                # Environment variable template
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Sticky navbar with mobile menu
│   │   └── Footer.jsx              # Multi-column footer
│   ├── pages/
│   │   ├── Home.jsx                # Landing page with animated counters
│   │   ├── Chat.jsx                # AI chat interface (chat bubbles)
│   │   ├── FraudAnalyzer.jsx       # Fraud analysis with risk score bar
│   │   ├── Learn.jsx               # Accordion learning modules
│   │   ├── ScamAwareness.jsx       # Filterable scam awareness cards
│   │   ├── SafetyTips.jsx          # Interactive safety checklists
│   │   ├── Quiz.jsx                # 15-question gamified quiz
│   │   └── About.jsx               # Timeline, tech stack, mission
│   ├── services/
│   │   └── api.js                  # Frontend API functions (DO NOT MODIFY)
│   ├── styles/
│   │   ├── global.css              # CSS variables & base styles
│   │   ├── Navbar.css
│   │   ├── Footer.css
│   │   ├── Home.css
│   │   ├── Chat.css
│   │   ├── FraudAnalyzer.css
│   │   ├── Learn.css
│   │   ├── ScamAwareness.css
│   │   ├── SafetyTips.css
│   │   ├── Quiz.css
│   │   └── About.css
│   ├── App.jsx                     # Router + layout shell
│   └── main.jsx                    # React entry point
│
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
# IBM watsonx.ai credentials
IBM_WATSONX_API_KEY=your_ibm_api_key_here
IBM_WATSONX_PROJECT_ID=your_project_id_here
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Server
PORT=5000
```

> **Never commit `.env` to version control.**

---

## 🏃 How to Run

### 1. Clone & Install

```bash
# Frontend
cd cybershield-ai
npm install

# Backend
cd backend
npm install
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
# Fill in IBM watsonx.ai credentials in backend/.env
```

### 3. Start Backend

```bash
cd cybershield-ai/backend
npm run dev        # nodemon (auto-reload)
# or
node server.js
```

Backend runs on: `http://localhost:5000`

### 4. Start Frontend

```bash
cd cybershield-ai
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔌 API Endpoints (DO NOT MODIFY)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | IBM Granite AI chat |
| `POST` | `/api/fraud/analyze` | Fraud risk analysis |

### Chat Request
```json
POST /api/chat
{ "message": "How do I protect my UPI account?" }
```

### Fraud Analyze Request
```json
POST /api/fraud/analyze
{ "content": "Congratulations! You won ₹50,000. Click here..." }
```

### Fraud Analyze Response
```json
{
  "data": {
    "riskScore": 92,
    "threatCategory": "Lottery Scam",
    "explanation": "...",
    "recommendation": "..."
  }
}
```

---

## 🧠 IBM Granite Integration

CyberShield AI uses the **IBM Granite 3.3 8B Instruct** model via `@ibm-cloud/watsonx-ai`:

- **Chat endpoint**: Provides cybersecurity guidance and financial literacy answers
- **Fraud endpoint**: Analyzes content and returns structured JSON with risk assessment

Both endpoints are handled in [`backend/controllers/`](./backend/controllers/).

---

## 🔮 Future Enhancements

- [ ] Multilingual support (Hindi, Tamil, Bengali, Telugu)
- [ ] WhatsApp bot integration for fraud reporting
- [ ] Real-time SMS scanning via device APIs
- [ ] Browser extension for phishing detection
- [ ] Gamified badges and leaderboard system
- [ ] Community forum for reporting new scam patterns
- [ ] User authentication and progress tracking

---

## 📄 License

This project is built for educational purposes as part of the IBM SkillsBuild initiative.

---

## 🤝 Acknowledgements

- **IBM SkillsBuild** — for providing access to IBM watsonx.ai and Granite models
- **NPCI** — for UPI documentation
- **CERT-In** — for cybersecurity guidelines
- **National Cybercrime Reporting Portal** (cybercrime.gov.in)

---

<p align="center">Made with 🛡️ by CyberShield AI | IBM SkillsBuild Project</p>
