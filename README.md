# Help Duncan

A static candidate case file for improving Duncan Bartley's resume and triaging remote-US or Washington, DC-area data roles.

The site contains:

- 10 one-page resume directions derived from the supplied resume
- full-page expandable resume proofs with print / PDF support
- 20 intake questions whose answers save in the browser
- 50 TrueUp role dossiers split into a priority shortlist and explicit stretch / blocked leads
- an auditable methodology ledger covering resume extraction, all 15 TrueUp searches, scoring, limitations, and verification
- a verbatim archive of Byron's six project prompts, embedded directly in the static HTML
- a recruiter-derived five-second scan standard applied across all 10 resume directions
- privacy-safe public contact placeholders

## Preview

```sh
pnpm dev
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173).

Run the checks with:

```sh
pnpm check
```

## Publish on GitHub Pages

1. Create a GitHub repository and push this project.
2. In the repository settings, open **Pages**.
3. Choose **Deploy from a branch**, select the default branch, and use `/ (root)`.
4. Keep `source/` untracked. It contains private source material and is intentionally ignored.

No build step or hosted backend is required.

## Refreshing job data

`data/trueup-raw.json` is a dated working snapshot. After replacing it with a new export, run:

```sh
pnpm build:jobs
pnpm check
```

The scoring is an editorial triage aid, not an employer or TrueUp score. Every listing must be checked at its source before tailoring or applying.
The July 27 snapshot did not surface a Washington, DC-area listing; the site states that gap rather than manufacturing local coverage.
