# Hack Club Advent of Code Leaderboard

A web application that displays the Hack Club's private Advent of Code leaderboard. Built with SvelteKit and Tailwind CSS.

## Features

- Real-time leaderboard display with member rankings
- Displays stars earned, local scores, and completion timestamps
- Responsive design that works on mobile and desktop
- Clear error handling for authentication and network issues
- Top 3 positions highlighted with distinct styling

## Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Access to the Hack Club Advent of Code private leaderboard

## Setup

1. Clone the repository and install dependencies:

```sh
pnpm install
```

2. Create a `.env` file in the root directory (copy from `.env.example`):

```sh
cp .env.example .env
```

3. Configure your environment variables in `.env`:

```env
AOC_LEADERBOARD_CODE=your_leaderboard_code_here
AOC_JOIN_CODE=your_join_code_here
```

### Finding Your Leaderboard Code

1. Go to [Advent of Code](https://adventofcode.com/2025/leaderboard/private)
2. Navigate to your private leaderboard
3. Look at the URL: `https://adventofcode.com/2025/leaderboard/private/view/XXXXXX`
4. The code is the number at the end (XXXXXX)

### Getting Your Session Cookie

**Required:** You need to provide your Advent of Code session cookie for the application to fetch leaderboard data.

1. Log in to [adventofcode.com](https://adventofcode.com)
2. Open your browser's Developer Tools (press F12)
3. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Under **Cookies**, click on `https://adventofcode.com`
5. Find the cookie named `session` and copy its **Value**
6. Paste this value into your `.env` file as `AOC_SESSION_COOKIE`

**Note:** Session cookies last about a month. If you start getting authentication errors, you may need to get a fresh session cookie.

**Important:** Keep your session cookie private! Don't commit it to version control or share it publicly.

## Development

Start the development server:

```sh
pnpm dev

# or open the app in a new browser tab
pnpm dev -- --open
```

The application will be available at `http://localhost:5173`

## Building for Production

Create a production build:

```sh
pnpm build
```

Preview the production build locally:

```sh
pnpm preview
```

## Deployment

The application can be deployed to any platform that supports SvelteKit:

- **Vercel**: Zero-config deployment with automatic adapter
- **Netlify**: Supports SvelteKit with the Netlify adapter
- **Cloudflare Pages**: Deploy with the Cloudflare adapter
- **Node.js**: Use the Node adapter for traditional hosting

Make sure to set the `AOC_LEADERBOARD_CODE` environment variable in your deployment platform.

## Project Structure

```
src/
├── lib/
│   └── types.ts           # TypeScript type definitions
├── routes/
│   ├── +page.svelte       # Main leaderboard page component
│   └── +page.server.ts    # Server-side data fetching
└── app.html               # HTML template
```

## Error Handling

The application handles three types of errors:

1. **Authentication Error**: Displayed when you don't have permission to view the leaderboard
2. **Configuration Error**: Shown when the `AOC_LEADERBOARD_CODE` environment variable is missing
3. **Network Error**: Displayed when the API request fails

## Technologies Used

- [SvelteKit](https://kit.svelte.dev/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Advent of Code API](https://adventofcode.com/) - Leaderboard data source
