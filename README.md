# Segmenta: AI-Powered Expense Splitting and Management

<p align="center">
  <img src="./screenshots/Screenshot 2025-07-10 224509.png" alt="Segmenta Application Screenshot"/>
  <br/>
  <strong><a href="https://segmenta-flax.vercel.app">View Live Application</a></strong>
</p>

Segmenta is a full-stack web application inspired by Splitwise, designed to simplify expense tracking and management among groups. Built with a modern tech stack, it allows users to create groups, add expenses, and settle balances seamlessly. The platform features secure user authentication, real-time data synchronization, and leverages AI to provide users with intelligent spending insights via email.

The frontend is built with **Next.js**, **React**, and styled with **Tailwind CSS** and **Shadcn UI**, offering a responsive and intuitive user experience. The backend is powered by **Convex**, a serverless platform that provides a real-time database, cloud functions, and seamless integration with authentication services like **Clerk**. Asynchronous background jobs for sending AI-powered email reports are handled by **Inngest**, using **Google's Gemini API** for content generation and **Resend** for email delivery.

## Key Features

-   **Secure User Authentication:** Managed by Clerk for robust and secure user sign-up and sign-in.
-   **Group & Contact Management:** Easily create groups, add friends, and manage contacts.
-   **Expense Tracking:** Add new expenses with detailed descriptions, amounts, and participants.
-   **Flexible Splitting Options:** Split expenses equally among participants.
-   **Real-time Balance Updates:** View up-to-date balances with friends and within groups.
-   **Simplified Settlements:** Record payments to settle debts and clear balances.
-   **AI-Powered Spending Insights:** Receive periodic emails with AI-generated summaries of your spending habits.
-   **Responsive Design:** A clean, modern UI that works beautifully across all devices.

## Screenshots

| Dashboard | New Expense | Group View |
| :---: | :---: | :---: |
| <img src="./screenshots/Screenshot 2025-07-10 224516.png" alt="Dashboard Screenshot" width="100%"/> | <img src="./screenshots/Screenshot 2025-07-10 224604.png" alt="New Expense Screenshot" width="100%"/> | <img src="./screenshots/Screenshot 2025-07-10 224620.png" alt="Group View Screenshot" width="100%"/> |

## Technology Stack

| Area | Technologies |
| --- | --- |
| **Frontend** | Next.js, React, Tailwind CSS, Shadcn UI, Clerk |
| **Backend** | Convex (Real-time Database, Cloud Functions) |
| **Background Jobs & AI**| Inngest, Google Gemini API, Resend |
| **Deployment** | Vercel, GitHub |

## Local Setup and Installation

To run this project locally, please follow the steps below.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Naman281004/segmenta.git
cd ai-splitwise-clone-main
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
Your `CONVEX_DEPLOYMENT` variable will be managed automatically by the Convex CLI.

### 5. Seed the Database

To populate the application with initial sample data, run the seed script:
```bash
npx convex run seed
```
*Note: You may need to adjust the `seed.js` script to match the users you have created in your Clerk development instance.*

### 6. Run the Application

Ensure the Convex development server is running in one terminal (`npx convex dev`). In a separate terminal, start the Next.js frontend server:
```bash
npm run dev
```
