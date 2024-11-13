import { User as PrismaUser, Objective } from "@prisma/client";

export interface UserSession {
  user: {
    id: number;
    email: string;
    name: string;
    lastName: string;
    age: number;
    gender: string;
    location: string;
  };
}

export interface UserResponse extends Omit<PrismaUser, "password"> {
  objectives: Objective[];
}

export interface UserUpdateData {
  name: string;
  lastName: string;
  age: number | string;
  gender: string;
  location: string;
}
