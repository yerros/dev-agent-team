---
name: backend-api
description: Conventions and patterns for Node.js + TypeScript backends — API routes, services, validation, error handling, and data access. Use when writing or reviewing server-side code.
---

# Backend API (Node.js + TypeScript)

## Core conventions
- Validate all input at the boundary (e.g. zod). Never trust client data.
- Thin route handlers; put logic in pure, testable service functions.
- Consistent error handling: typed errors, correct HTTP status, no stack traces leaked to clients.
- No secrets in code or logs; read from env/config.
- Data access isolated behind a repository/service layer.

## Reference material (load on demand)
- `reference.md` — route/service/validation/error checklist.

## Definition of Done for backend work
- Types compile, lint passes, tests green.
- Inputs validated; failure paths return correct status codes.
- No secret leakage; no unhandled promise rejections.
