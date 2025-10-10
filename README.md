<div align="center">
  <img src="/public/logo/logo.svg" alt="Wholesale BD Logo" width="400"/>
  <h1>Wholesale BD</h1>
  <p><strong>A Modern Digital Wholesale Marketplace for Bangladesh 🇧🇩</strong></p>
  <p>The official web application for Wholesale BD, a transparent and reliable e-commerce platform designed to solve the challenges of traditional sourcing for startups and retailers.</p>
</div>

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://wholesale-bd-web.vercel.app/)
[![Build Status](https://github.com/your-username/your-repo/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/your-repo/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🚀 Live Demo

**Check out the live version of the application:**

### 👉 **[https://wholesale-bd-web.vercel.app/](https://wholesale-bd-web.vercel.app/)**

---

## 📸 Screenshots

_Here is a preview of the application's interface across different themes and devices._

<div align="center">
  <img src="https://i.imgur.com/your-screenshot-url.png" alt="Project Screenshot Collage" width="800"/>
  <p><sub>(It's recommended to replace this with a real screenshot collage showing light/dark modes on desktop and mobile.)</sub></p>
</div>

---

## ✨ Key Features

-   **🌐 Full Internationalization (i18n):** Complete support for both **English (EN)** and **Bengali (BN)** across all UI components, forms, and validation messages, powered by React Context.
-   **🌓 Dark & Light Mode:** Beautiful, theme-aware UI using `next-themes` and Tailwind CSS, with persistence in `localStorage`.
-   **📱 Fully Responsive Design:** A mobile-first approach ensures a seamless experience on any device, featuring a responsive header, collapsible search modal, and adaptive layouts.
-   **🧩 Advanced UI Components:**
    -   A multi-column category dropdown with icons for easy navigation.
    -   A dynamic, location-based zone selector for localized content.
    -   A real-time search preview modal that appears after a search query.
-   **🔐 Modern Authentication Forms:** Secure and user-friendly Login and Register forms built with `react-hook-form` for state management and `zod` for robust, schema-based validation with translated error messages.
-   **🚀 Optimized for SEO:** Dynamic metadata and social media cards (Open Graph, Twitter) are generated on the server for key pages using the Next.js App Router's `generateMetadata` function.
-   **💪 Built with shadcn/ui:** Leverages a modern, accessible, and highly customizable component library for a consistent and professional look and feel.
-   **🎬 Smooth Animations:** Subtle page and component animations implemented with `framer-motion` to enhance the user experience.

---

## 🛠️ Tech Stack

| Technology         | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| **Next.js 14**     | The core React framework, utilizing the **App Router** for modern routing.    |
| **React 18**       | A JavaScript library for building user interfaces.                          |
| **TypeScript**     | A strongly typed programming language that builds on JavaScript.            |
| **Tailwind CSS**   | A utility-first CSS framework for rapid UI development.                     |
| **shadcn/ui**      | A beautifully designed, reusable component library.                         |
| **React Hook Form**| A performant, flexible, and extensible forms library.                       |
| **Zod**            | A TypeScript-first schema declaration and validation library.               |
| **React Context**  | Used for managing global state like language, theme, and zone.              |
| **Lucide React**   | A beautiful and consistent icon toolkit.                                    |
| **Framer Motion**  | A production-ready motion library for React.                                |
| **Vercel**         | The deployment platform, optimized for Next.js applications.                |

---

## 📦 Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18.17 or later)
-   [pnpm](https://pnpm.io/) (recommended), `npm`, or `yarn`

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install / yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add the necessary environment variables.
    ```bash
    cp .env.example .env.local
    ```
    Now, open `.env.local` and set the `NEXT_PUBLIC_BASE_URL`.

4.  **Run the development server:**
    ```bash
    pnpm run dev
    # or npm run dev / yarn dev
    ```

5.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📄 Environment Variables

This project requires the following environment variables to be set in `.env.local`:

```plaintext
# .env.example

# The base URL of your deployed application.
# Used for generating absolute URLs for SEO metadata and social media cards.
# For local development, this should be http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

## 📁 Project Structure
This project follows the standard Next.js App Router structure.
.
├── /app                  # Main application directory
│   ├── (routes)          # Grouped application routes
│   │   ├── /about        # About page components
│   │   ├── /login        # Login page components
│   │   └── page.tsx      # Home page
│   ├── /components       # Reusable components
│   │   ├── /common       # Layout components (Header, Footer, etc.)
│   │   ├── /contexts     # React Context providers (Theme, Language)
│   │   └── /forms        # Form components (Login, Register)
│   ├── layout.tsx        # Root layout of the application
│   └── globals.css       # Global styles
├── /components/ui        # Unstyled components from shadcn/ui
├── /lib                  # Utility functions and data
│   ├── data.tsx          # i18n content for pages
│   ├── menu.tsx          # Navigation, zone, and footer data
│   └── utils.ts          # Shared utility functions (e.g., cn)
├── /public               # Static assets (images, logos, fonts)
├── next.config.ts        # Next.js configuration
└── tailwind.config.ts    # Tailwind CSS configuration