# MarkoPolo AI Full Stack Challenge

## Overview

This repository contains my solution to the full stack development challenge for MarkoPolo AI. The project demonstrates modern web development practices and technical proficiency across frontend and backend, Database, and Agentic AI technologies.

## Demo Video

https://youtu.be/48Kcbrtp2y0

## Project Structure

```
markopolo-ai-full-stack-challenge/
├── client/                    # Frontend application (Next.js)
├── server/                    # Backend API (Nest.js)
├── docker-compose.yml         # Compose file for local development
├── docker-compose.prod.yml    # Compose file for production deployment
└── README.md                  # This file
```

## Technologies Used

- **Frontend**: React.js, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Nest.js, Postgres
- **AI Technology**: OpenAI SDK and OpenAI Agents SDK for JavaScript
- **Authentication**: JWT, Passport
- **Deployment**: Docker, Docker Compose

## Architecture

### Core Components

- **Frontend (Client)**: Next.js React application serving as the user interface
- **Backend (Server)**: NestJS API server handling business logic and data operations
- **Database**: PostgreSQL for persistent data storage
- **Deployment**: Docker and docker-compose for containerized deployment

### Agentic AI For Campaign Generation

AI chat and campaign generation feature is backed by 4 AI Agents. Every agent has it's clear scope and ability to handle incoming user prompt.

- **Triage Agent**:

  - All incoming user prompt comes to the Triage Agent. - It is responsible to understand the intent and handoff to the appropriate agent.
  - It can handoff to either one of these:
    _Campaign Generator Agent_
    _General Chat Agent_.
  - LLM: `gpt-4o-mini`

- **Campaign Generator Agent**:

  - Generates marketing campaigns based on user prompt, available shop information in database, and fetched data from connected data sources.
  - Fetch data from database using available **Tool**.
  - Responds in structured JSON format.
  - If there is no datasource connection available for the shop then it handoff the prompt to _Insufficient Data Responder Agent_.
  - LLM: `gpt-5-nano`

- **General Chat Agent**:

  - Handles general chat when the user is not asking for a marketing campaign.
  - Responds in plain text.
  - LLM: `gpt-5-nano`

- **Insufficient Data Responder Agent**:
  - Responds to users when there is insufficient data to generate a marketing campaign.
  - Responds in plain text.
  - LLM: `gpt-5-nano`

### Frontend Layer

- **Next.js Framework**: Server-side rendering and routing
- **React Components**: Modular UI components
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type safety and developer experience

### Backend Layer

- **NestJS Framework**: Modular, scalable Node.js framework
- **RESTful API**: Standard HTTP endpoints for client communication, and Server Sent Event (SSE) for real-time chat experience with AI
- **JWT Authentication**: Stateless authentication using Passport
- **Zod Validation**: Runtime type checking and input validation
- **Data Ingestion**: For this demo project no real data ingestion is implemented. Instead of that, when user connects a datasource, backend generate mock data using OpenAI models.

### Data Layer

- **PostgreSQL**: Relational database for structured data

### External Services

- **OpenAI Integration**: AI capabilities through OpenAI SDK and Agents SDK

### Security & Validation

- JWT-based authentication for secure API access
- Input validation at API boundaries using Zod schemas
- Environment-based configuration management using Nest.js ConfigModule

## Features

- User authentication and authorization using JWT
- RESTful API design
- Responsive UI design
- Data persistence in Postgres
- Error handling
- Input validation using Zod

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- Postgres (v17 or higher)
- Docker (optional)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mazeduldev/markopolo-ai-full-stack-challenge.git
cd markopolo-ai-full-stack-challenge
```

2. Install dependencies:

```bash
# Backend
cd server
pnpm install

# Frontend
cd ../client
pnpm install
```

3. Set up environment variables:
   There are 3 `.env.example` files. Remove their `.example` suffix and update with your configuration.

```
markopolo-ai-full-stack-challenge/
├── client/                     # Frontend application (Next.js)
⏐   └── .env.example            # Example .env for client application
├── server/                     # Backend API (Nest.js)
⏐   └── .env.example            # Example .env for server application
├── .env.example                # Example .env (Only for production, otherwise ignore.)
└── README.md                   # This file
```

```bash
cp .env.example .env
cd server && cp .env.example .env && cd ..
cd client && cp .env.example .env && cd ..
```

### Running the Application

```bash
# Start backend
cd backend
pnpm install
pnpm run start:dev

# Start frontend (in new terminal)
cd frontend
pnpm install
pnpm run dev
```

### Using Docker

```bash
docker-compose up --build -d
```

## API Documentation

When server is running OpenApi documentation can be found at `http://localhost:8080/api`.

![API Doc image](https://github.com/mazeduldev/markopolo-ai-full-stack-challenge/blob/main/docs/API_DOC.png?raw=true)

## License

This project is for evaluation purposes only.
