# Review Checklist and Definition of Done

## Reviewer checklist

- The diff maps to an approved requirement and contains no unrelated cleanup.
- Public behavior matches OpenAPI and ADRs; errors are explicit and typed.
- Authentication and authorization are tested separately.
- Logs contain correlation IDs but no token, password, or personal payload.
- Migration is forward-safe and has rollback/restore evidence.
- Generated code is identifiable and reproducible.
- Tests include happy path, boundary, failure, retry, and concurrency where relevant.
- UI includes loading, empty, validation, error, success, offline, and conflict states.

## Definition of Done

A task is done only when implementation, focused tests, full relevant checks, diff review, documentation, and evidence log are complete. “Agent says done,” compilation alone, or a screenshot alone is not completion.

## PR evidence

Include requirement link, approach, risk, screenshots for UI, API examples for backend, commands with outcomes, model/agent used, human corrections, and rollback notes.
