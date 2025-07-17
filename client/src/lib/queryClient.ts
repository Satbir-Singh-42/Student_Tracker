import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { CACHE_TIMES } from "./constants";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  
  // Add authorization token if available
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error adding token to request:', error);
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    // Add timeout for better error handling
    signal: AbortSignal.timeout(30000), // 30 second timeout
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: Record<string, string> = {};
    
    // Add authorization token if available
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const { token } = JSON.parse(authData);
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error adding token to request:', error);
    }

    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
      headers,
      // Add timeout for better error handling
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Enable background refetching for better data freshness
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // Cache data for 5 minutes
      staleTime: CACHE_TIMES.STALE_TIME,
      // Keep unused data for 10 minutes
      gcTime: CACHE_TIMES.CACHE_TIME,
      queryFn: getQueryFn({ on401: "throw" }),
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
});
