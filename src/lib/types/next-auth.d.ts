// /types/next-auth.d.ts

declare module "next-auth" {
  interface User {
    id: string;
    isOnboardingComplete: boolean;
  }

  interface Session {
    user: {
      id: string;
      isOnboardingComplete: boolean;
    };
  }
}
