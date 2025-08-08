# Job Copilot 🚀

Job Copilot is your AI-powered career assistant — helping you chat with a career advisor, review your CV, and find relevant job opportunities.  
Think of it as your personal recruiter, available 24/7.

## ✨ Features

- **💬 AI Chat** — Get instant career advice and guidance tailored to you.
- **📄 CV Reviewer** — Upload your CV and receive actionable improvement tips.
- **🔍 Job Search** — Find job listings that match your skills and preferences.

## 🛠 Tech Stack

- **Frontend:** [Next.js 15](https://nextjs.org/) with App Router
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Validation:** [Zod](https://zod.dev/)
- **3D Graphics:** [Three.js](https://threejs.org/) / [react-three-fiber](https://github.com/pmndrs/react-three-fiber)

## 🚀 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/jobcopilot.git
cd jobcopilot
npm install
```

Create a .env.local file and add your credentials:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
REPLICATE_API_TOKEN="your_replicate_api_token"
BROWSERLESS_TOKEN="your_browserless_token"
```

Run the Development Server

```
npm run dev
```
