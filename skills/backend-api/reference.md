# Backend reference checklist

## Routes
- One responsibility per handler; delegate to a service.
- Parse + validate input before any logic runs.
- Return typed responses and correct status codes (2xx/4xx/5xx).

## Services
- Pure where possible; inject dependencies (db, clients) rather than importing singletons.
- No framework objects (req/res) inside services.

## Validation & errors
- Validate with a schema; reject early with 400 + a safe message.
- Map domain errors to HTTP; log server-side detail, return safe client message.

## Security
- Secrets from env only. Never log tokens, passwords, or PII.
- Authorize every protected route; deny by default.
