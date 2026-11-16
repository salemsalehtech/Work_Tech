# WorkTech

A laptop e-commerce storefront built with React (DEPI Round 5 graduation project).

## Tech stack

| Area         | Tools                                            |
| ------------ | ------------------------------------------------ |
| UI           | React 18                                         |
| Build        | Vite                                             |
| Routing      | React Router                                     |
| State        | Redux Toolkit, React Redux                       |
| HTTP         | Axios                                            |
| i18n         | i18next, react-i18next (English / Arabic)        |
| Testing      | Vitest, Testing Library, jsdom                   |
| Code quality | ESLint, Prettier, Husky, lint-staged, commitlint |
| Mock API     | JSON Server (`db.json`)                          |
| Hosting      | Vercel                                           |

## Requirements

- Node.js 24 or later (see `.nvmrc`; run `nvm use` if you use nvm)
- npm (comes with Node.js; do not use yarn or pnpm)

## Getting started

```bash
git clone https://github.com/salemsalehtech/Work_Tech.git
cd Work_Tech
npm ci
cp .env.example .env   # Windows PowerShell: copy .env.example .env
```

Run the app and the mock API in two terminals:

```bash
npm run dev   # the store at http://localhost:5173
npm run api   # the mock API at http://localhost:3001
```

## Scripts

| Script                  | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start the dev server                |
| `npm run build`         | Build for production into `dist`    |
| `npm run preview`       | Preview the production build        |
| `npm run lint`          | Lint the project (0 warnings)       |
| `npm run lint:fix`      | Lint and auto-fix                   |
| `npm run format`        | Format all files with Prettier      |
| `npm run format:check`  | Check formatting without writing    |
| `npm run test`          | Run tests in watch mode             |
| `npm run test:run`      | Run tests once                      |
| `npm run test:coverage` | Run tests once with coverage report |
| `npm run api`           | Start the mock API on port 3001     |

## Contributing

### Branches

- `main`: always deployable.
- `develop`: integration branch; open pull requests against it.
- `feature/<scope>-<short-name>`: one branch per task, e.g. `feature/cart-add-item`.

### Pull requests

- Open a pull request into `develop` and fill in the template.
- At least one teammate must review and approve before merging.
- Lint, format check, tests and build must pass. They run automatically before every `git push`.

### Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(cart): add quantity selector
fix(auth): redirect to login when the token expires
docs: explain the branch naming rules
```

Git hooks are installed by `npm ci`:

- **pre-commit:** staged files are linted and formatted.
- **commit-msg:** the message is checked by commitlint.
- **pre-push:** lint, format check, tests and build run; a failure blocks the push.
