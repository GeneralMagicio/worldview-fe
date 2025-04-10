import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  MiniAppVerifyActionPayload,
  MiniAppWalletAuthSuccessPayload,
} from "@worldcoin/minikit-js";

interface IRequestPayload {
  walletPayload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
  worldIdProof: MiniAppVerifyActionPayload;
}

export const POST = async (req: NextRequest) => {
  const { walletPayload, worldIdProof, nonce } =
    (await req.json()) as IRequestPayload;
  const siweCookie = cookies().get("siwe")?.value;

  if (nonce != siweCookie) {
    return NextResponse.json({
      status: "error",
      isValid: false,
      message: "Invalid nonce",
    });
  }

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/verify-world-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletPayload, worldIdProof, nonce }),
    });

    const data = await res.json();

    return NextResponse.json({
      status: "success",
      data,
    });
  } catch (error) {
    return NextResponse.json({ status: "error", error });
  }
};
