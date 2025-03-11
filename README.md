# TimeFlies

A modern countdown app that helps you track important dates and events. Built with SvelteKit and IndexedDB.

## Features

- Create and manage countdown events
- Pin important events
- Color-code events for better organization
- Search through your events
- Works offline
- Mobile-friendly interface

## Screenshots

![TimeFlies App Screenshot](/static/assets/shots.png)

## Development

First, clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/timeflies.git
cd timeflies
pnpm install
```

To start the development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version:

```bash
pnpm run build
```

Preview the production build with:

```bash
pnpm run preview
```

## Tech Stack

- SvelteKit - Web framework
- Dexie.js - IndexedDB wrapper
- Bits UI - UI components
- TailwindCSS - Styling
- Phosphor Icons - Icons
- date-fns - Date utilities

## License

MIT
