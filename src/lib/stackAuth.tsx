import { StackProvider } from "@stackframe/react";
import { ReactNode } from "react";

interface StackAuthProviderProps {
    children: ReactNode;
}

export function StackAuthProvider({ children }: StackAuthProviderProps) {
    return (
        <StackProvider
            projectId={import.meta.env.VITE_STACK_PROJECT_ID || "cf7dac03-0f88-43d8-8c0b-91d608c8b0f5"}
            publishableClientKey={import.meta.env.VITE_STACK_PUBLISHABLE_KEY || "pck_h1qe98mgzw1mz1g5e76k47x2a37fyzrjemkv2ywffg9gg"}
        >
            {children}
        </StackProvider>
    );
}
