import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Ese Connect CRM",
  description: "AI-powered CRM platform for modern sales teams",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#f8fafc",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: "500",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#f8fafc" },
              },
              error: {
                iconTheme: { primary: "#f43f5e", secondary: "#f8fafc" },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
