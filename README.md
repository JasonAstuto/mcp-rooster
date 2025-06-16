# MCP Rooster – The Early Warning System

MCP Rooster is a full-stack threat analysis and telemetry platform designed to demo advanced AI-assisted cybersecurity workflows — built for DefCon, and built to impress.

This project uses OpenAI to generate **multi-context analysis** from logs, emulating the perspectives of a red team attacker, blue team defender, and a security executive. The goal is to showcase how AI can enrich security tooling with real-time, human-style context.

> ⚠️ This is a work in progress. Contributions, suggestions, and feedback are welcome.

---

## Features

- ⚙️ **Backend (ASP.NET Core)**  
  - REST API with structured logging (Serilog)
  - ECS Fargate-deployable with CDK
  - AI-driven log analysis with red/blue/executive personas
  - Health checks, file uploads, and cached history

- 🖥 **Frontend (React + Material UI)**  
  - Log upload and analysis interface
  - AI insight cards per persona
  - Tuning panel for future protocol fuzzing
  - Alert panel with mock threat activity

- ☁️ **Infrastructure (AWS CDK)**  
  - S3 buckets for input/output
  - ECS Fargate backend deployment
  - Static hosting for React frontend
  - CloudWatch logging + placeholder for AI secret

---

## Red Team / Blue Team / Executive AI

The `/analyze` endpoint leverages OpenAI’s API to generate three independent analyses of a log snippet:

| Perspective | Description |
|------------|-------------|
| 🔴 **Red Team** | How would an attacker exploit this? |
| 🔵 **Blue Team** | What threat is this, and how should we defend? |
| 🧑‍💼 **Executive** | What's the risk and business impact? |

The frontend displays all three responses side-by-side for easy comparison and situational awareness.

---

## Setup

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js + npm](https://nodejs.org)
- [AWS CLI + CDK](https://docs.aws.amazon.com/cdk/)
- OpenAI API Key (create one and store it in Secrets Manager)

---

### Backend

```bash
cd src/backend/McpRooster.API
dotnet build
dotnet run
