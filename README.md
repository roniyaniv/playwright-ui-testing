# playwright-ui-testing

UI test automation project written in TypeScript with [Playwright Test](https://playwright.dev/).
Built while following the Playwright course from **Bondar Academy**.

It demonstrates locators and assertions, UI component interactions, the Page Object Model,
custom fixtures, test-step reporting, environment-based configuration, test data generation
with faker, screenshots/videos, and desktop + mobile browser projects.

## Prerequisites

- Node.js (LTS) and npm
- Access to the web application under test (its URL goes in `.env`)

## Setup

```bash
npm install                 # install dependencies
npx playwright install      # download browser binaries (Chromium, Firefox, WebKit)
cp .env.example .env        # then edit .env and fill in the values
```

### Environment variables

| Variable                 | Purpose                                                        |
|--------------------------|----------------------------------------------------------------|
| `URL`                    | Base URL of the app under test. Used as Playwright `baseURL`, so `page.goto('/')` opens it. |
| `TEST_USER_EMAIL_DOMAIN` | Email domain used when faker generates test-user emails.       |

`.env` files are gitignored. Only `.env.example` (a template with no values) is tracked.

### Multiple environments

`playwright.config.ts` loads `.env` by default. If `TEST_ENV` is set, it loads `.env.<TEST_ENV>` instead:

```bash
cp .env.example .env.qa                       # create a QA environment file
TEST_ENV=qa npx playwright test               # run against QA
```

## Running tests

### npm scripts

| Command                       | What it does                                              |
|-------------------------------|-----------------------------------------------------------|
| `npm run po-test-chromium`    | Runs `test-with-page-objects.spec.ts` in Chromium         |
| `npm run po-test-chromium:qa` | Same, using `.env.qa`                                     |
| `npm run po-test-firefox`     | Runs `test-with-page-objects.spec.ts` in Firefox          |
| `npm run po-test-all`         | Runs the Chromium script, then the Firefox script         |

### Direct Playwright commands

```bash
npx playwright test                                   # all specs, all projects
npx playwright test tests/ui-components.spec.ts       # a single spec file
npx playwright test --project=chromium                # a single browser project
npx playwright test -g "Input fields"                 # tests whose title matches
npx playwright test --headed                          # show the browser
npx playwright test --ui                              # interactive UI mode
npx playwright test --debug                           # step through with the inspector
npx playwright show-report                            # open the last HTML report
```

### Browser projects

Defined in `playwright.config.ts`. Every spec runs on all of them unless you pass `--project`:

| Project         | Device           |
|-----------------|------------------|
| `chromium`      | Desktop Chrome   |
| `firefox`       | Desktop Firefox  |
| `webkit`        | Desktop Safari   |
| `Mobile Chrome` | Pixel 10         |
| `Mobile Safari` | iPhone 17        |

Note: desktop-oriented specs may fail on the mobile projects (e.g. the sidebar is collapsed on small screens).

### Timeouts and retries

- Per-test timeout: 10 s. Whole-run timeout: 60 s.
- Retries: 2 on CI (`CI` env var set), 0 locally.
- Trace and video are recorded on the first retry.

## Project structure

```
.
├── playwright.config.ts          # Playwright config: env loading, timeouts, reporter, projects
├── fixture.ts                    # Custom `test` with a `pom` fixture (opens '/' and provides PageManager)
├── helpers/
│   └── test-step-decorator.ts    # @step decorator: wraps page-object methods in test.step()
├── page-objects/
│   ├── helper-base.ts            # Base class shared by page objects
│   ├── page-manager.ts           # Single entry point exposing all page objects
│   ├── navigation-page.ts        # Sidebar / menu navigation
│   ├── form-layouts-page.ts      # Form Layouts page actions
│   └── datepicker-page.ts        # Datepicker page actions
├── tests/
│   ├── example.spec.ts                   # Playwright's generated sample (targets playwright.dev)
│   ├── locators-and-assertions.spec.ts   # Locator and assertion exercises
│   ├── ui-components.spec.ts             # UI component interactions
│   ├── test-with-page-objects.spec.ts    # Tests using page objects, fixture, faker
│   └── test-mobile.spec.ts               # Mobile viewport test (work in progress)
├── .env.example                  # Template for environment variables
└── package.json                  # Dependencies and npm scripts
```

### Page Object Model and fixture

Tests import `test` from `fixture.ts` instead of `@playwright/test` to get the `pom` fixture:

```ts
import { test } from '../fixture'

test('example', async ({ pom }) => {
  await pom.navigateTo.formLayoutsPage()
  await pom.formsLayoutPage.submitInlineForm('Name', 'name@example.com', true)
})
```

Page-object methods decorated with `@step` appear as named steps (`ClassName.methodName`) in the HTML report.

## Test output

All of these are generated and gitignored:

| Location             | Contents                                         |
|----------------------|--------------------------------------------------|
| `playwright-report/` | HTML report (`npx playwright show-report`)       |
| `test-results/`      | Per-test artifacts: traces, videos, failure screenshots |
| `screenshots/`       | Screenshots saved explicitly by tests            |

## Dependencies

- `@playwright/test`: test runner and browser automation
- `@faker-js/faker`: random test data
- `dotenv`: loads `.env` files
- `@types/node`: Node.js type definitions
