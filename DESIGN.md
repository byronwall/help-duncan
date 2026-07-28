# Design System

## Direction

An application operations runbook presented as a candidate case file. The interface borrows from working folders, recruiter mark-up sheets, and control-room status boards: factual, dense, legible, and explicitly provisional. It should feel like a packet that helps someone make and record decisions, not a portfolio or a job-board clone.

## Palette and Material

- `--ink: #101828` - primary type and structural rules.
- `--paper: #f7f8fa` - app ground, cool enough to avoid faux-vintage paper.
- `--sheet: #ffffff` - resume pages and reading surfaces.
- `--folder: #d9e1eb` - rails, inactive tabs, and metadata bands.
- `--signal: #ffd338` - the single active/navigation color; never decorative.
- `--proof: #d92d20` - reserved for genuine cautions, gaps, and verification needs.
- `--good: #067647` - verified-fit signals.

Use crisp 1px rules and occasional offset shadows that read as stacked paper. Avoid glass, glow, gradients, rounded-card grids, and decorative texture.

## Typography

Use a dependable humanist system sans stack for all interface and resume text. Use a compact system monospace stack only for dates, ranks, counts, source stamps, and machine-like status labels. Headings rely on weight, scale, and narrow measure rather than display-font theatrics.

## Composition

- A narrow sticky tab rail provides the next decision rather than a conventional marketing header.
- The opening viewport is a working brief: mission and status on the left, a cropped live resume sheet and ranked-role strip on the right.
- Resume alternatives form a true contact sheet of scaled letter pages, not generic cards.
- Job dossiers are ranked rows that expand into evidence and gaps.
- Intake questions behave like a checklist worksheet with persistent local answers.
- Reading measure stays under 75 characters; dense metadata may span wider.

## Controls and State

Buttons look like file tabs or stamped actions: square-to-small-radius corners, firm outlines, no floating pills. Active state uses signal yellow plus ink. Focus uses a 3px ink outline with offset. Expand/collapse controls name the action and expose state to assistive technology.

Filters are compact fields in a single workbench strip. Empty results explain which filters to clear. Resume previews open in an accessible dialog and support print.

## Motion

One authored motion: the opening case file resolves from a slightly offset stack into aligned sheets. Subsequent interactions use quick height/clip reveals. Respect reduced motion and keep content visible without animation.

## Responsive Rules

Desktop uses a two-column workbench and three-to-five-column contact sheet. Tablet reduces to two resume columns. Mobile becomes a single decision stream; the sticky rail collapses to a horizontal tab strip, metadata wraps, and expanded resume sheets remain readable without horizontal scrolling.

## Imagery

No generated or stock imagery is required. The resume sheets, evidence marks, ranked roles, and source stamps are the visual content.
