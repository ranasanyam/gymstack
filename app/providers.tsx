"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Initialize QueryClient on the client to avoid passing class instances from server
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="bottom-right" richColors />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
