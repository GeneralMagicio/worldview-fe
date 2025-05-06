import { MiniKit } from "@worldcoin/minikit-js";

export const sendHapticFeedbackCommand = () =>
  MiniKit.commands.sendHapticFeedback({
    hapticsType: "impact",
    style: "light",
  });
