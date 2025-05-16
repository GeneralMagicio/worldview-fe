import MiniKitProvider from "@/components/minikit-provider";
import { ReactQueryClientProvider } from "@/components/react-query-client-provider";
import { AuthProvider } from "@/context/AuthContext";
import { FetchPatchProvider } from "@/lib/FetchPatchProvider";
import type { Metadata } from "next";
import ErudaWrapper from "../components/ErudaWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorldView - Voting App",
  description: "A quadritic voting app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErudaWrapper>
            <MiniKitProvider>
              <AuthProvider>
                <ReactQueryClientProvider>
                  <FetchPatchProvider />
                  {children}
                </ReactQueryClientProvider>
              </AuthProvider>
            </MiniKitProvider>
        </ErudaWrapper>
      </body>
    </html>
  );
}
