# Coffee Finder

Coffee Finder is an open-source web application for discovering nearby coffee shops from your current location. It combines map-based exploration, a browsable results list, and a contributor-friendly codebase built with Next.js.

## Features

- Discover nearby coffee shops using browser geolocation
- Explore results on an interactive map
- Browse shops in a companion list view
- Search coffee shops by name or query
- Show project contributors from GitHub
- Use a responsive UI built with Tailwind CSS and shadcn/ui

## Tech Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- Prisma
- NextAuth.js

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- npm

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment Variables

Create a `.env` file in the project root:

```dotenv
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GITHUB_TOKEN=
```

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is used for map and location-based shop discovery.
- `GITHUB_TOKEN` is optional, but recommended to avoid GitHub API rate limits for the contributor section.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:push
npm run db:generate
npm run db:migrate
npm run db:reset
```

## Project Structure

```text
src/
├── app/                # App Router pages and API routes
├── components/         # Reusable UI and feature components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and shared configuration
└── types/              # Shared TypeScript types
```

## Deployment

For clean-install environments, use:

```bash
npm ci
npm run build
```

Make sure `package-lock.json` stays committed and in sync with `package.json` so deployment installs remain reproducible.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test locally.
5. Open a pull request with a clear description.

Good contribution areas include:

- UI and UX improvements
- Search and discovery enhancements
- Geolocation and map behavior
- Performance and accessibility
- Documentation improvements
- Bug fixes and test coverage

## Open Source

Coffee Finder is developed in the open. If you find the project useful, consider:

- Starring the repository
- Opening issues for bugs or feature ideas
- Submitting pull requests
- Sharing the project with other developers

## License

This project is open source and available under the MIT License.
