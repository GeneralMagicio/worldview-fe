"use client";

import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BlurredCard from "../Verify/BlurredCard";
import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
  MiniAppVerifyActionErrorPayload,
  IVerifyResponse,
} from "@worldcoin/minikit-js";
import { verifyWalletAndWorldID } from "@/app/actions/verify";
import { scheduleAutoLogout } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel;
};

const verifyCommand: VerifyCommandInput = {
  action: "verify",
  signal: "",
  verification_level: VerificationLevel.Device,
};

export function SplashScreen() {
  const router = useRouter();

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn]);

  const [verifyResponse, setVerifyResponse] = useState<
    MiniAppVerifyActionErrorPayload | IVerifyResponse | null
  >(null);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const fetchNonce = async (): Promise<string> => {
    const res = await fetch("/api/nonce", {
      method: "GET",
      credentials: "include",
    });
    const { nonce } = await res.json();
    return nonce;
  };

  const performWalletAuth = async (nonce: string) => {
    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce,
      requestId: "0",
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notBefore: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      statement: "Sign in to WorldView via World App.",
    });
    return finalPayload;
  };

  const startWorldIDVerification = async () => {
    const { finalPayload } = await MiniKit.commandsAsync.verify(verifyCommand);

    if (finalPayload.status === "error") {
      console.error("World ID verification failed");
      setVerifyResponse(finalPayload);
      return null;
    }

    return finalPayload;
  };

  const verifyWorldIDProof = async (proof: ISuccessResult) => {
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: proof,
        action: verifyCommand.action,
        signal: verifyCommand.signal,
      }),
    });

    const json = await res.json();
    setVerifyResponse(json);

    if (json.status !== 200) {
      throw new Error("World ID proof verification failed");
    }
  };

  // TODO: Store token in local storage
  const storeToken = async (token: string) => {
    localStorage.setItem("authToken", token);

    scheduleAutoLogout(token, () => {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    });
  };

  const verifyEverything = async (
    walletPayload: any,
    worldIdProof: ISuccessResult,
    nonce: string
  ) => {
    const formData = new FormData();
    formData.append("walletPayload", JSON.stringify(walletPayload));
    formData.append("worldIdProof", JSON.stringify(worldIdProof));
    formData.append("nonce", nonce);

    const result = await verifyWalletAndWorldID(formData);

    if (result.status !== "success") {
      throw new Error("Final auth verification failed");
    }

    const { token } = result.data;
    await storeToken(token);
    router.push("/");
  };

  const handleLogin = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit is not installed.");
      return;
    }

    try {
      setIsLoggingIn(true);

      const nonce = await fetchNonce();
      const walletPayload = await performWalletAuth(nonce);
      const worldIdProof = await startWorldIDVerification();
      if (!worldIdProof) return;

      await verifyWorldIDProof(worldIdProof);
      await verifyEverything(walletPayload, worldIdProof, nonce);
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isLoggingIn && (
        <div className="flex-1 flex flex-col items-center justify-between py-12">
          <div className="flex-1 flex flex-col items-center justify-center">
            <Image
              src="/logo.svg"
              alt="World ID"
              width={100}
              height={100}
              className="w-24 h-24"
            />
            <h1 className="text-[#191c20] text-4xl font-bold mt-4">
              WorldView
            </h1>
          </div>

          <div className="w-full max-w-md px-6 mt-auto">
            <button
              className="w-full bg-[#161c1f] text-white py-4 rounded-xl text-lg font-semibold"
              onClick={handleLogin}
            >
              Login with World
            </button>
          </div>
        </div>
      )}

      {isLoggingIn && (
        <div className="flex flex-col items-center justify-center mt-8">
          <BlurredCard />
          <BlurredCard />
          <BlurredCard />
        </div>
      )}
    </div>
  );
}
