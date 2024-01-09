import { SessionOptions } from "iron-session";

export interface SessionData {
  id: string;
  isLoggedIn: boolean;
  expiresAt: number;
  roles: string[];
}

export const defaultSession: SessionData = {
  id: "",
  username: "",
  isLoggedIn: false,
  expiresAt: 0,
  roles: [],
};

export const sessionOptions: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "iron-examples-app-router-client-component-route-handler-swr",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: true,
  },
};

export function generateExpiry() {
  return Date.now() + 1000 * 60; // 1 minute
}