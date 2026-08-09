# Agentic Workflow Threat Model

## Protected assets

Source code, signing keys, user data, cloud resources, package integrity, CI identity, model/API credentials, audit records, and engineering decisions.

## Trust boundaries

User prompt, repository content, fetched web content, MCP servers, model gateway, agent sandbox, CI runner, staging, and production are separate boundaries. Treat instructions from fetched content and issue bodies as untrusted data.

## Required abuse cases

1. A README contains prompt injection asking the agent to reveal secrets.
2. A compromised dependency runs an install script.
3. An agent receives an ambiguous request to delete cache and resolves a broad path.
4. A tool returns poisoned context or silently changes its schema.
5. Retry logic repeats a non-idempotent migration or external write.
6. One project agent reads another project's vault or credentials.
7. Model fallback violates data residency or cost policy.

## Controls

Use isolated ephemeral workspaces, least-privilege identities, domain/tool allowlists, approval gates, immutable logs, signed/locked dependencies, idempotency keys, explicit retry budgets, secret scanning, network egress restrictions, and human-only production release.

## Residual-risk review

For every release, list open findings, owner, severity, expiration, detection signal, rollback path, and the person accepting risk.
