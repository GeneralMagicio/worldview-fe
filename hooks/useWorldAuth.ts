import { useCallback, useState } from "react";
import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { verifyWalletAndWorldID } from "@/app/actions/verify";
import { useAuth } from "@/context/AuthContext";

const verifyCommand = {
  action: "verify",
  signal: "",
  verification_level: VerificationLevel.Device,
};

export const useWorldAuth = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { storeToken, isLoggedIn } = useAuth();

  const fetchNonce = async () => {
    const res = await fetch("/api/nonce", { credentials: "include" });
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
    if (finalPayload.status === "error")
      throw new Error("World ID verification failed");
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
    if (json.status !== 200)
      throw new Error("World ID proof verification failed");
  };

  const verifyPayload = async (
    walletPayload: any,
    worldIdProof: ISuccessResult,
    nonce: string
  ) => {
    const formData = new FormData();
    formData.append("walletPayload", JSON.stringify(walletPayload));
    formData.append("worldIdProof", JSON.stringify(worldIdProof));
    formData.append("nonce", nonce);

    const result = await verifyWalletAndWorldID(formData);
    if (result.status !== "success")
      throw new Error("Final auth verification failed");

    storeToken(result.data.token);
  };

  const handleLogin = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit not installed");
      return;
    }

    try {
      setIsLoggingIn(true);
      const nonce = await fetchNonce();
      const walletPayload = await performWalletAuth(nonce);
      const worldIdProof = await startWorldIDVerification();

      await verifyWorldIDProof(worldIdProof);
      await verifyPayload(walletPayload, worldIdProof, nonce);
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  return { handleLogin, isLoggingIn, isLoggedIn };
};
