'use client';

import TanStackProvider from "./TanStack";

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <TanStackProvider>
            {children}
        </TanStackProvider>
    );
}