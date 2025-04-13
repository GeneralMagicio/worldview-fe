import type { Metadata } from "next";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/context/AuthContext";
import { FetchPatchProvider } from "@/lib/FetchPatchProvider";
import { ReactQueryClientProvider } from "@/components/react-query-client-provider";

export const metadata: Metadata = {
  title: "WorldView - Voting App",
  description: "A quadritic voting app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ErudaProvider>
            <MiniKitProvider>
              <ReactQueryClientProvider>
                <FetchPatchProvider />
                {children}
              </ReactQueryClientProvider>
            </MiniKitProvider>
          </ErudaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
