# MarkVault

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

A markdown note-taking application focused on local-first workflows, fast editing, and file portability.

## Overview

MarkVault is a clean, simple, and completely local markdown note-taking tool. It provides a distraction-free writing environment that stays out of your way. The application supports standard markdown syntax, wiki-style internal linking, embedded code block highlighting, and drag-and-drop file imports. All data is stored locally in your browser.

## Why This Project Exists

This project started as a personal experiment to build a lightweight markdown note-taking application without relying on external services. Most note-taking tools either felt too heavy, were slow to load, or required an account. The goal was to create something simple, fast, and self-contained that respects standard markdown formatting and works entirely offline.

## Features

- Markdown editing
- Local note management
- File import and export
- Real-time syntax highlighting
- Split-pane interface and focus mode
- Search and filtering via command palette
- Responsive layout
- Dark mode support
- Mobile-friendly interface

## Tech Stack

| Technology | Purpose |
|------------|----------|
| React | Frontend Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Markdown | Markdown rendering |
| PrismJS | Code syntax highlighting |

## Project Structure

The application is organized by feature rather than file type. Components, hooks, stores, and utilities are grouped together to keep related code close and make maintenance easier as the project grows.

- `src/components/`: Reusable user interface components, dialogs, and layout structures.
- `src/hooks/`: Custom React hooks handling state, keyboard shortcuts, and local storage connectivity.
- `src/utils/`: Pure functions for text parsing, link generation, and import/export logic.
- `src/types/`: Shared TypeScript and domain models.

## Installation

```bash
git clone <repository-url>
cd markvault
npm install
npm run dev
```

## Development

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

No required environment variables. The application relies entirely on standard browser APIs (LocalStorage, Web Storage) to store and manage content.

## Building for Production

To create an optimized production build, run:

```bash
npm run build
```

The output will be placed in the `dist` directory, fully prepared for static deployment.

## Deployment

Since the application is purely client-side, it can be hosted on any static file hosting service such as GitHub Pages, Vercel, Netlify, or Cloudflare Pages. Simply configure the deployment target to point to the `dist` folder.

## Known Limitations

- No cloud synchronization
- Local storage only
- Advanced table markdown support is currently basic
- Mobile editor still being refined

## Future Improvements

- Note templates
- Tag management
- Better offline support
- Improved mobile editing experience
- Export workspace as compressed archive

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
