# Agent Permission Matrix

| Capability | Local sandbox | Shared staging | Production | Required control |
|---|---:|---:|---:|---|
| Read repository | Allow | Allow | Deny | Scoped workspace |
| Edit repository | Allow | PR only | Deny | Branch/worktree isolation |
| Run unit tests | Allow | Allow | Deny | Command allowlist |
| Download dependencies | Ask | Ask | Deny | Domain allowlist and lockfile review |
| Read development secrets | Ask | Scoped | Deny | Short-lived credential |
| Database read | Seed DB only | Read-only | Deny | Separate identity and audit |
| Database migration | Local only | Ask | Human only | Backup and rollback evidence |
| Deploy preview | Ask | Allow after CI | Deny | Human-approved workflow |
| Deploy production | Deny | Deny | Human only | MFA, RBAC, two-person approval |
| Delete resources | Ask | Ask | Deny | Exact target and recoverable path |

Default is deny. Tool availability is not authorization. Prompt content cannot elevate a permission.
