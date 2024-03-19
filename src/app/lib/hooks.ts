"use client";

import useSWR from "swr"
import axios from "axios";
import { SessionData, defaultSession, sessionOptions } from "./session";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useSession () {
  const { data, error, isLoading } = useSWR("/api/session/", fetcher);
 
  return {
    user: data,
    isLoading,
    isError: error
  }
}