<p align="center">
  <img src="public/image.png" alt="DevKit Logo" width="100" height="100" style="border-radius: 20px;" />
</p>

# DevKit

DevKit is a minimalist developer utility dashboard built with Next.js, providing essential tools for everyday development workflows in a single, fast, and unified interface.

## Tools Included

- **JSON Formatter**: Format and validate raw JSON with syntax highlighting.
- **JWT Decoder**: Decode JSON Web Tokens to view headers and payloads securely.
- **Regex Tester**: Test regular expressions against text strings with live match highlighting.
- **Base64 Encoder**: Encode and decode Base64 strings.
- **URL Encoder**: Quickly encode and decode URI components.
- **Hash Generator**: Generate SHA-1, SHA-256, and SHA-512 hashes instantly using the Web Crypto API.
- **UUID Generator**: Bulk generate v4 UUIDs with configurable hyphens and capitalization.

- **Epoch Converter**: Instantly convert Unix timestamps to human-readable dates and vice versa.
- **Color Converter**: Parse HEX, RGB, HSL, CMYK, and named colors with live preview and conversions.
- **Text Case Converter**: Transform strings into camelCase, PascalCase, snake_case, and more.
- **Lorem Ipsum Generator**: Generate fully customizable placeholder text (words, sentences, paragraphs).
- **SQL Formatter**: Format and beautify SQL queries across multiple dialects (PostgreSQL, MySQL, SQLite, etc.).

## Features

- Premium UI Aesthetics (MacOS-style Glassmorphism, deep dark mode, glowing accents).
- Local storage persistence for all tool states.
- CodeMirror integration for code formatting and syntax highlighting.
- Global Command Palette (`Cmd + K`) for instant navigation with categorized tools.
- Native `CopyToClipboard` integration with toast notifications.
- Robust unit testing suite with Vitest and React Testing Library.
- Automated code formatting via Husky and lint-staged pre-commit hooks.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- ShadCN UI
- NextAuth.js
- MongoDB
- Vitest & React Testing Library

## Local Development

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Configure your environment variables in a `.env.local` file:

```
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
MONGODB_URI=your_mongodb_connection_string
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.
