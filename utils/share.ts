export const handleSharePoll = async (pollTitle: string, pollId: number) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/poll/${pollId}`;
  await handleShareLink(shareUrl);
};

export const handleShareResults = async (pollTitle: string, pollId: number) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/poll/${pollId}/results`;
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
