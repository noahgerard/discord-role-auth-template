import useSWR from "swr"
import { SessionOptions } from "iron-session";
import crypto from "crypto";

export interface SessionData {
  id: string;
  isLoggedIn: boolean;
  expiresAt: number;
  roles: string[];
}

export const defaultSession: SessionData = {
  id: "",
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
  return Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
}

export function generateId() {
  return crypto.randomBytes(16).toString('hex');
}