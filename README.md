<p align="center">
<a href ="https://t.me/abrosrobot" target="_blank" title="bot-logo">
<img src=".github/assets/logo.jpeg" width="150px" alt="bot-logo"/>
</a>
</p>
<div align="center">

[![Site/Version](https://img.shields.io/badge/@abrosrobot-v_1.0-2A8F3B)](https://t.me/abrosrobot)
[![Nest.js](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs)](https://nestjs.com)
[![Directus](https://img.shields.io/badge/Directus-263238?logo=directus)](https://directus.io)

</div>

## Introduction

Abros Robot is my personal product for managing and solving my clients' problems. It's a client-focused product that performs my specific tasks within my own stack. You can use it for yourself or your own projects, but I'm fairly certain you won't need it.

# Table of Contents

1. [Features](#features)
2. [Stack](#stack)
3. [Quick Start](#quick-start)
4. [Credits](#credits)

## Features

- 🌐 **Independent System** - A system that operates entirely on its own resources and capabilities
- 🤖 **Chatbot Integration** - Support for platforms such as Telegram, WhatsApp, and Facebook
- 👥 **Client Database** - A complete client database
- 🛠️ **Service Management** - Setting up and managing client services

## Stack

- **Backend:**
  ![NestJS](https://img.shields.io/badge/NestJS-^11.1.11-E0234E?logo=nestjs)
  ![Directus](https://img.shields.io/badge/Directus-^11.14.0-263238?logo=directus)

- **Tools & Services:**
  ![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
  ![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github)
  ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint)
  ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## Quick Start

❗ **Prerequisites:**

- ✅ Directus with tables configured

Clone the repository

```bash
git clone https://github.com/abrosdaniel/abros-robot.git
```

Install dependencies:

```bash
npm install
```

Create `.env` in the project root:

```env
DIRECTUS_URL=your_directus_url
DIRECTUS_TOKEN=your_directus_token
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
PORT=3010
```

Standard NestJS commands:

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Credits

- **Developer:** [Daniel Abros](https://abros.dev)
