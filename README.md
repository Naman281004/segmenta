# Segmenta: AI-Powered Expense Manager

Segmenta is a full-stack, real-time web application inspired by Splitwise, designed to simplify expense tracking and management among groups. Built with a modern tech stack, it allows users to create groups, add friends, and settle balances seamlessly. The platform features secure user authentication, real-time data synchronization, and leverages AI to provide users with intelligent spending insights via email.

---

### 🚀 Live Demo

**[https://segmenta-flax.vercel.app/](https://segmenta-flax.vercel.app/)**

---

### 📸 Screenshots

*A look at the Segmenta application's clean and intuitive interface.*

<p align="center">
  <img src="./screenshots/Screenshot 2025-07-10 224557.png" alt="Segmenta Dashboard" />
  <img src="./screenshots/Screenshot 2025-07-10 224516.png" alt="Segmenta Hero Section" />
</p>

| Dashboard | Add New Expense | View Contacts |
| :---: | :---: | :---: |
| <img src="./screenshots/Screenshot 2025-07-10 224509.png" alt="Dashboard Screenshot" width="100%"/> | <img src="./screenshots/Screenshot 2025-07-10 224620.png" alt="New Expense Screenshot" width="100%"/> | <img src="./screenshots/Screenshot 2025-07-10 224604.png" alt="Contacts Screenshot" width="100%"/> |

---

## ✨ Key Features

-   **Real-time Group & Expense Management:** Create groups, add friends, and track shared expenses with real-time updates for all members.
-   **Secure User Authentication:** Managed by **Clerk** for robust and secure user sign-up, sign-in, and session management.
-   **AI-Powered Spending Insights:** Receive periodic emails with AI-generated summaries of your spending habits, powered by **Google's Gemini API**.
-   **Flexible Splitting Options:** Split expenses equally among participants.
-   **Simplified Settlements:** Easily record payments to settle debts and clear balances between users or within groups.
-   **Responsive & Modern UI:** Built with **Next.js**, **Tailwind CSS**, and **Shadcn UI** for a clean, intuitive experience across all devices.
-   **Asynchronous Background Jobs:** Email delivery and AI-insight generation are handled by **Inngest**, ensuring the user experience is never blocked by long-running tasks.

---

## 🛠️ Tech Stack

| Area                     | Technologies                                       |
| ------------------------ | -------------------------------------------------- |
| **Frontend**             | Next.js, React, Tailwind CSS, Shadcn UI            |
| **Backend & Database**   | Convex (Real-time Database, Serverless Functions)  |
| **Authentication**       | Clerk                                              |
| **Background Jobs & AI** | Inngest, Google Gemini API, Resend                 |
| **Deployment**           | Vercel, GitHub                                     |

---

## 🔬 Technical Deep Dive

### 1. Real-time Serverless Architecture with Convex

This project avoids a traditional monolithic backend server in favor of a modern, serverless architecture powered by Convex.

-   **Real-time Database:** Convex provides a real-time database out of the box. The frontend subscribes to queries, and the UI updates automatically whenever data changes on the backend. This is how all users in a group can see new expenses or settlements appear instantly without needing to refresh the page.
-   **Serverless Functions:** All backend logic, such as creating expenses or calculating balances, is written as TypeScript functions that run in a serverless environment. Convex manages the infrastructure, scaling, and execution of this code.
-   **Seamless Authentication Integration:** Convex is tightly integrated with Clerk. When a user logs in via Clerk on the frontend, the JWT they receive is passed with every request to the backend. Convex automatically validates this token and provides an authenticated context to the serverless functions, making it easy to identify the current user and enforce security rules.

### 2. AI-Powered Insights with Inngest and Gemini

A key feature of Segmenta is its ability to send users intelligent summaries of their spending.

-   **Asynchronous Processing with Inngest:** To avoid blocking the user experience or creating long-running serverless functions, the task of generating and sending emails is offloaded to Inngest. This is an event-driven system designed for reliable background jobs.
-   **AI Content Generation:** An Inngest function calls the **Google Gemini API**, sending it a user's recent expense data. The AI processes this information and generates a natural language summary of their spending habits, identifying top categories and potential insights.
-   **Reliable Email Delivery:** The AI-generated content is then passed to the **Resend API** for reliable email delivery to the user.

---

## 🚀 Getting Started Locally

To run this project locally, please follow the steps below.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Naman281004/segmenta.git
cd segmenta
```

### 2. Install Dependencies

This project has some legacy peer dependencies. Use the following command to install them correctly:
```bash
npm install --legacy-peer-deps
```

### 3. Set up Convex

1.  Sign up for a free account at [Convex](https://www.convex.dev/).
2.  From your terminal, in the project root, run the development server. This will also link your local project to a Convex backend deployment.
    ```bash
    npx convex dev
    ```
3.  Follow the on-screen prompts to create a new project and link it. This command will create a `convex.json` file containing your project's deployment URL.

### 4. Environment Variables

Create a `.env.local` file in the root of the project and add the following variables.

```env
# Get this from your Convex project's dashboard settings
NEXT_PUBLIC_CONVEX_URL=

# Get these from your Clerk application dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Set this to the Token Issuer URL from your Clerk JWT template
CLERK_JWT_ISSUER_DOMAIN=

# Get this from your Resend account (for sending emails)
RESEND_API_KEY=

# Get this from Google AI Studio (for spending insights)
GEMINI_API_KEY=
```

### 5. Seed the Database

To populate the application with initial sample data, you first need to create at least four user accounts by signing up in the application. Then, run the seed script:
```bash
npx convex run seed:seedDatabase
```

### 6. Run the Application

Ensure the Convex development server is running in one terminal (`npx convex dev`). In a separate terminal, start the Next.js frontend server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.
