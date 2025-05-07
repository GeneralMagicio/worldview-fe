const appUrl = `https://world.org/mini-app?app_id=${process.env.NEXT_PUBLIC_APP_ID}&path=`;

export const handleSharePoll = async (pollTitle: string, pollId: number) => {
  const shareUrl = `${appUrl}/poll/${pollId}`;
  console.log(shareUrl);
  await handleShareLink(shareUrl);
};

export const handleShareResults = async (pollTitle: string, pollId: number) => {
  const shareUrl = `${appUrl}/poll/${pollId}/results`;
  console.log(shareUrl);
  await handleShareLink(shareUrl);
};

export const handleShareLink = async (link: string) => {
  if (navigator.share) {
    try {
      await navigator.share({ url: link });
      console.log("Link shared successfully");
    } catch (err) {
      console.error("Share canceled or failed", err);
    }
  } else {
    alert("Sharing not supported on this device");
  }
};
