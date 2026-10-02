# AnnMarie Dittell Portfolio

GitHub Pages portfolio for AnnMarie Dittell, go to: https://annmariedittell.github.io/.

## Publish

Upload the contents of this folder to the root of the `annmariedittell.github.io` repository. GitHub Pages should publish automatically from the `main` branch and `/ (root)`.

## Files

- `index.html` home page
- `about.html` about page
- `resume.html` resume highlights
- `case-studies/` three portfolio case studies
- `styles.css` responsive accessible design system
- `script.js` accessible mobile navigation
- `assets/` decorative SVG illustrations

## Accessibility features

- Skip link
- Semantic landmarks
- Logical heading structure
- Keyboard-operable navigation
- Visible focus indicators
- Responsive layout
- Reduced-motion support
- Decorative images use empty alt text
- No information conveyed by color alone

## Semantic accessibility testing

This repository includes [Semantica11y](https://www.npmjs.com/package/semantica11y) to check the portfolio HTML for semantic HTML and ARIA patterns.

### First-time setup

Install Node.js, then from the repository root run:

```bash
npm install
```

### Run the audit

```bash
npm run test:semantics
```

The audit automatically finds every `.html` file in the repository, analyzes it with Semantica11y, prints a summary in the terminal, and writes a detailed report to:

```text
reports/semantica11y-report.txt
```

The `reports/` folder and `node_modules/` are ignored by Git so generated reports and installed packages are not committed.

### Optional quality gate

```bash
npm run test:semantics:gate
```

This runs the same audit but returns a failing exit code when Semantica11y reports errors or warnings.

### Automated GitHub Actions check

GitHub Actions automatically runs Semantica11y whenever changes are pushed to the `main` branch or proposed in a pull request.

The automated workflow uses:

```bash
npm run test:semantics:ci
```

The CI check fails only when Semantica11y reports an error. Warnings are still shown in the report but do not fail the workflow. This allows reviewed warnings, such as the site's intentional `aria-expanded` mobile navigation pattern, to remain visible without blocking updates.

Each workflow run also uploads `reports/semantica11y-report.txt` as an artifact so the detailed findings can be reviewed from the GitHub Actions run.

Semantica11y is a focused semantic HTML and ARIA checker. It complements, but does not replace, manual WCAG review, keyboard testing, screen-reader testing, or broader automated accessibility testing.

