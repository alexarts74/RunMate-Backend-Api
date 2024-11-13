import { DefaultSession, DefaultUser } from "next-auth";

// Définition des types personnalisés pour l'utilisateur
interface IUser {
  id: number;
  email: string;
  name: string;
  lastName: string;
  age: number;
  gender: string;
  location: string;
  objectives?: {
    id: number;
    title: string;
    description: string;
    status: string;
  }[];
}

declare module "next-auth" {
  // Étend la session par défaut
  interface Session {
    user: IUser & DefaultSession["user"];
  }

  // Étend l'utilisateur par défaut
  interface User extends IUser, DefaultUser {}
}

declare module "next-auth/jwt" {
  // Étend le JWT par défaut
  interface JWT extends IUser {
    iat?: number;
    exp?: number;
    jti?: string;
  }
}

// Export des types pour une utilisation ailleurs dans l'application
export type { IUser };
