# MCP Rooster – The Early Warning System

This is a full-stack AI-powered log analysis system, designed as a technical showcase for DefCon. It runs on ECS Fargate with CDK infrastructure, and includes a React frontend, a .NET backend, and OpenAI integration for log insights.

Everything in here is built to demonstrate capability: log ingestion, AI-backed analysis, protocol tuning, and real-time alerts.

## What It Does

- Accepts log files through the frontend
- Sends them to an ASP.NET Core API hosted on ECS Fargate
- Analyzes logs using OpenAI API and returns feedback
- Allows tuning of protocol parameters for future analysis
- Caches previous results
- Displays alerts (mocked for now) in a live-style feed
- All infrastructure is provisioned via AWS CDK

## Structure

- `src/backend`: C# API with controllers, services, DI, logging, unit tests
- `src/frontend`: React app using Material UI, routing, theming
- `cdk`: CDK app for provisioning S3 buckets, ECS Fargate service, Secrets Manager, and logging

## Requirements

- Node 18+
- .NET 8 SDK
- AWS CLI configured with appropriate credentials
- Docker running
- OpenAI key (stored in AWS Secrets Manager under `McpRoosterOpenAIKey`)
