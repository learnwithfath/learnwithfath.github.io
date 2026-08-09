# Repository Agent Instructions Template

## Mission

Implement the approved TaskForge specification. Prefer the smallest change that satisfies the acceptance criteria. Do not expand product scope.

## Sources of truth

1. `docs/product-brief.md` for intent and non-goals.
2. `api/openapi.yaml` for network behavior.
3. ADRs for architecture decisions.
4. Existing tests for preserved behavior.

If sources conflict, stop and report the exact conflict. Never silently rewrite a source of truth.

## Work loop

1. Inspect relevant code and repository status.
2. Restate acceptance criteria and create a bounded plan.
3. Implement one coherent slice.
4. Run formatter, static checks, focused tests, then broader tests.
5. Review the diff for unrelated changes, secrets, generated noise, and missing error paths.
6. Record commands, results, remaining risk, and files changed.

## Guardrails

- Never access production, paste secrets, weaken tests, or bypass permission gates.
- Ask before dependency upgrades, migrations with data loss, deployment, or destructive commands.
- Use a dedicated branch/worktree. Do not modify another agent's files.
- A failing verifier means the task is not complete.

## Stack verification

- Go: `gofmt`, `go vet ./...`, `go test ./...`
- NestJS: formatter/lint, unit tests, integration tests, build
- Next/Nuxt: typecheck, lint, component/E2E tests, production build
- Flutter: `dart format`, `flutter analyze`, `flutter test`
- Android: `ktlint` or project formatter, unit tests, `assembleDebug`
- iOS: SwiftFormat/SwiftLint when configured, unit/UI tests, simulator build
