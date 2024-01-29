import { getIronSession } from "iron-session";
import useSWR from "swr"
import { sessionOptions } from "./session";
import { useCookies } from 'next-client-cookies';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useSession () {
  const cookies = useCookies();
  // @ts-ignore
  const session = getIronSession(cookies, sessionOptions);

  const { data = session, error, isLoading } = useSWR("/api/session/", fetcher, );
 
  return {
    user: data,
    isLoading,
    isError: error
  }
}