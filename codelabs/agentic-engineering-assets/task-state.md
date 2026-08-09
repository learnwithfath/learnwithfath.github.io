---
id: TF-001
title: Add idempotent task creation
status: backlog
owner: unassigned
worktree: null
risk: medium
budget_minutes: 60
attempts: 0
depends_on: []
acceptance:
  - Repeating the same idempotency key returns the original task
  - A different payload with the same key returns a conflict
  - Go and NestJS pass the same contract examples
verifiers:
  - contract:create-task-idempotency
  - integration:task-create
---

# Context

Link the approved requirement, OpenAPI operation, and relevant ADR. Include only information the worker cannot discover cheaply.

# Allowed transitions

`backlog → ready → in-progress → review → done`

Exceptional transitions: `in-progress → blocked`, `review → in-progress`, and `blocked → ready`. The tick runner must reject every other transition and must process the same event idempotently.

# Completion evidence

- Commit/diff reference:
- Commands and exit codes:
- Contract examples:
- Residual risk:
- Human approval:
