"use server";

import { cookies } from "next/headers";

export async function verifyWalletAndWorldID(formData: FormData) {
  if (!process.env.BACKEND_URL) throw new Error("BACKEND_URL is not set");

  const walletPayload = JSON.parse(formData.get("walletPayload") as string);
  const worldIdProof = JSON.parse(formData.get("worldIdProof") as string);
  const nonce = formData.get("nonce") as string;

  const siweCookie = cookies().get("siwe")?.value;

  if (nonce !== siweCookie) {
    return {
      status: "error",
      isValid: false,
      message: "Invalid nonce",
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/verify-world-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletPayload, worldIdProof, nonce }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    return {
      status: "success",
      data,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Server verification failed",
      error,
    };
  }
}
