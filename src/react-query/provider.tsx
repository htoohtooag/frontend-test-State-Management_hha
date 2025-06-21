"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

 

type ReactQueryProviderProps = {
  children: React.ReactNode
} 

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10
        }
    }
});

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}> 
       <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  )
}