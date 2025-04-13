export const handleShare = async (pollTitle: string, pollId: number) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/poll/${pollId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "World View",
        text: pollTitle,
        url: shareUrl,
      });
      console.log("Poll shared successfully");
    } catch (err) {
      console.error("Share canceled or failed", err);
    }
  } else {
    alert("Sharing not supported on this device");
  }
};
