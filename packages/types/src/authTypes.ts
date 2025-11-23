import { z } from "zod";
import { JWTPayload } from "jose";

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const logInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type RegisterType = z.infer<typeof RegisterSchema>;

export type LogInType = z.infer<typeof logInSchema>;

export interface JwtPayLoad extends JWTPayload {
  userId: string;
  email: string;
}
