# AI Interview & Resume Copilot — Production-Grade AI Career Platform

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql)
![OpenAI](https://img.shields.io/badge/OpenAI-LLM_Powered-412991?style=for-the-badge&logo=openai)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

# Hero Description

A production-style **AI-powered career assistant** built to help users ace interviews and craft standout resumes.

This platform combines intelligent resume analysis, AI-driven mock interview sessions, and personalized feedback — all powered by LLMs with a robust, secure backend and a modern TypeScript frontend.

Built with a strong focus on:

- scalable AI application architecture
- secure authentication & role-based access control
- production-ready backend with PostgreSQL persistence
- modular service design
- containerized deployment
- modern TypeScript frontend experience

<!-- --- -->

<!-- # Demo / Screenshots -->

<!-- 
/screenshots
   ├── dashboard.png
   ├── resume-analysis.png
   ├── interview-session.png
   ├── analytics.png -->

<!-- ![Dashboard](./screenshots/dashboard.png) -->

---

# Features

## Core AI Features

- **AI Mock Interview Sessions**
- **Resume Analysis & Scoring**
- **Personalized Question Generation**
- **Real-Time AI Feedback**
- **Context-Aware Response Evaluation**
- **Role & JD-Based Interview Preparation**
- **Performance Analytics Dashboard**

## Engineering & Infrastructure

- **JWT Authentication & Authorization**
- **Role-Based Access Control (RBAC)**
- **PostgreSQL with Alembic Migrations**
- **Dockerized Infrastructure**
- **Production-Ready Configurations**
- **Modular Backend Architecture**
- **Secure API Design**

---

# System Architecture

```text
                  ┌─────────────────────┐
                  │  TypeScript Frontend │
                  │  Interview + Resume  │
                  └─────────┬───────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   FastAPI Backend   │
                  │  API + Orchestration│
                  └─────────┬───────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  Auth Service  │  │Interview Service│  │ Resume Service │
│  JWT + RBAC    │  │ AI Q&A Engine  │  │ Analysis Engine│
└────────┬───────┘  └────────┬───────┘  └────────┬───────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
              ┌────────────────────────┐
              │     LLM Service        │
              │  OpenAI / OpenRouter   │
              └──────────┬─────────────┘
                         ▼
              ┌────────────────────────┐
              │   PostgreSQL Database  │
              │   Alembic Migrations   │
              └────────────────────────┘
```

---

# Core Workflow

## 1. User Authentication

Users register and log in securely. JWT tokens handle session management with RBAC controlling access to resources.

## 2. Resume Upload & Analysis

The resume service parses uploaded resumes and uses LLM inference to score, critique, and suggest improvements.

## 3. Interview Session Setup

Users specify a target role or paste a job description. The AI generates contextually relevant interview questions.

## 4. AI Mock Interview

Users answer questions through the interview interface. The LLM evaluates responses in real time.

## 5. Feedback & Scoring

Detailed, structured feedback is returned per answer — covering correctness, clarity, and depth.

## 6. Analytics & History

Session data is persisted to PostgreSQL. Users can review past interviews, track progress, and monitor improvement over time.

---

# Tech Stack

## Backend

| Technology | Purpose |
|---|---|
| FastAPI | API framework |
| Python | Core backend language |
| PostgreSQL | Relational database |
| Alembic | Database migrations |
| SQLAlchemy | ORM |
| OpenAI / OpenRouter SDK | LLM inference |
| JWT | Authentication |

## Frontend

| Technology | Purpose |
|---|---|
| TypeScript | Frontend language |
| React | Frontend framework |
| CSS | UI styling |
| Axios | API communication |

---

# Folder Structure

```bash
ai-interview-resume-copilot/
│
├── frontend/                         # TypeScript/React frontend application
│
├── backend/
│   ├── alembic.ini                   # Alembic migration configuration
│   │
│   ├── app/
│   │   ├── api/                      # API route handlers
│   │   │   ├── analytics.py
│   │   │   ├── auth.py
│   │   │   ├── interview.py
│   │   │   └── resume.py
│   │   │
│   │   ├── core/                     # Application configuration & utilities
│   │   │   ├── config.py
│   │   │   ├── llm.py
│   │   │   ├── llmResponse.py
│   │   │   ├── logger.py
│   │   │   ├── permissions.py
│   │   │   └── security.py
│   │   │
│   │   ├── db/                       # Database connection & dependencies
│   │   │   ├── database.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── interview_message.py
│   │   │   ├── interview_session.py
│   │   │   ├── resume.py
│   │   │   └── user.py
│   │   │
│   │   ├── prompts/                  # LLM prompt templates
│   │   │   ├── interview_template.py
│   │   │   └── question_generation.py
│   │   │
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   │   ├── analytics.py
│   │   │   ├── interview.py
│   │   │   └── user.py
│   │   │
│   │   ├── services/                 # Core business logic & AI services
│   │   │   ├── ai_service.py
│   │   │   ├── evaluator.py
│   │   │   ├── generate_question.py
│   │   │   ├── interview_service.py
│   │   │   ├── overview_service.py
│   │   │   ├── resume_parser.py
│   │   │   ├── session_retriver.py
│   │   │   └── summary_generator.py
│   │   │
│   │   └── utils/                    # Utility/helper functions
│   │
│   ├── main.py                       # FastAPI application entry point
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/RahulBhargavR2/ai-interview-resume-copilot

cd ai-interview-resume-copilot
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows:
# venv\Scripts\activate

pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=your_api_key
OPENROUTER_API_KEY=your_api_key

MODEL_NAME=gpt-4o-mini

DATABASE_URL=postgresql://user:password@localhost:5432/copilot_db

SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

ENVIRONMENT=development
```

### Run Database Migrations

```bash
alembic upgrade head
```

### Run Backend

```bash
uvicorn main:app --reload
```

Backend runs on:

```bash
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

### Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/auth/register` | POST | Register a new user |
| `/auth/login` | POST | Authenticate and receive JWT token |
| `/interview/start` | POST | Start a new interview session |
| `/interview/answer` | POST | Submit an answer and receive AI feedback |
| `/resume/analyze` | POST | Upload and analyze a resume |
| `/analytics` | GET | Fetch user analytics & session history |
| `/health` | GET | Health check endpoint |

---

# Authentication & Security

The platform implements a secure, production-ready auth system.

## Auth Features

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Password hashing with bcrypt
- Permission-gated API routes
- Secure token expiry management

---

# Future Improvements

- Streaming LLM responses
- Voice-based interview mode
- Resume PDF parsing
- Kubernetes deployment
- CI/CD automation pipelines
- Cloud PostgreSQL (RDS / Supabase)
- Async job queues for heavy AI tasks
- Multi-tenant architecture
- Email notifications & reminders
- Interview performance trend graphs

---

# Resume-Level Highlights

- Engineered a production-style AI career assistant platform using FastAPI, TypeScript/React, PostgreSQL, and OpenAI LLM APIs.
- Implemented JWT-based authentication with Role-Based Access Control (RBAC) for secure, permission-gated API access.
- Designed modular backend architecture with dedicated services for interview management, resume analysis, and analytics.
- Built AI-driven mock interview and resume analysis pipelines using LLM inference with structured response handling.
- Architected a layered service design separating API routes, business logic, ORM models, Pydantic schemas, and LLM prompt templates for maintainability and scalability.

---

# Deployment

The system is designed for cloud-ready deployment.

## Supported Deployment Options

| Platform | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| Supabase / RDS | Managed PostgreSQL |
| Cloud VM / VPS | Full-stack hosting |

## Deployment Readiness

- Environment-based configuration
- Production Gunicorn setup
- Alembic-managed database schema
- Modular, scalable architecture

---

# Learning Outcomes

This project demonstrates practical engineering concepts across modern AI application development:

- LLM Application Development
- JWT Authentication & RBAC
- Relational Database Design with PostgreSQL
- Alembic Schema Migrations
- Production FastAPI Architecture
- AI Feedback & Evaluation Systems
- Frontend/Backend Integration with TypeScript
- Secure API Design Patterns
- Scalable AI Application Engineering

---

# Author

## Rahul Bhargav R

- GitHub: https://github.com/RahulBhargavR2
- LinkedIn: https://www.linkedin.com/in/rahul-bhargav-r/
- Email: rahulbhargavrgk@gmail.com

---

<div align="center">

### If you found this project interesting, consider starring the repository.

Built with scalable AI engineering principles and production-focused system design.

</div>