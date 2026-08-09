# Repository Guidelines

## Project Structure & Module Organization

This repository hosts a static Google Codelabs learning site. Author tutorial sources as `codelabs/<slug>.md`; `claat` exports each source into `codelabs/<slug>/index.html` and `codelab.json`. The catalog landing page is `codelabs/index.html`, with shared code in `codelabs/js/`, styles in `codelabs/css/`, and catalog metadata in `codelabs/data/codelabs.json`. Additional standalone material lives in `hermes-codelab/` and `presentations/`. Go learning exercises are under `practices/`.

Treat generated codelab directories as build artifacts paired with their Markdown source. When content changes, regenerate and commit both where applicable.

## Build, Test, and Development Commands

- `npm run dev` or `npm run serve`: start the local site at `http://localhost:9090`.
- `npm run stop`: stop the background development server.
- `npm run new`: interactively create a codelab Markdown template.
- `npm run export`: export all `codelabs/*.md` files with the latest Google `claat` tool.
- `npm run export:single -- <file>.md`: export one source from the `codelabs/` directory.
- `npm run build`: alias for the full export step.

Go and network access are required when `go run ...claat@latest` downloads the exporter.

## Coding Style & Naming Conventions

Use two-space indentation for JSON, HTML, and CSS; follow the existing four-space style in vanilla JavaScript files. Keep JavaScript classes in PascalCase (`SearchController`) and methods/variables in camelCase. Use lowercase kebab-case for codelab IDs, source filenames, and generated directories, for example `go-http-rest-api`. Ensure the Markdown `id` matches its filename and catalog URL. Format Go examples with `gofmt`.

## Testing Guidelines

No automated test suite or coverage threshold is configured. Before submitting, run the relevant export, start the local server, and verify the catalog card, search/pagination behavior, links, code blocks, and responsive layout in a browser. Confirm `codelabs/data/codelabs.json` remains valid JSON.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commits, commonly `feat:` and scoped forms such as `feat(codelabs): add ...`. Use an imperative, concise subject; use `fix:`, `docs:`, or `refactor:` when appropriate. Pull requests should explain the learning content or behavior changed, list validation performed, link related issues, and include screenshots for visible UI changes. Keep source, generated output, and catalog metadata synchronized.
