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

![API Doc image](https://github.com/mazeduldev/markopolo-ai-full-stack-challenge/blob/main/API_DOC.png?raw=true)

## License

This project is for evaluation purposes only.
