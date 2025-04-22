export const getUserDetails = async (walletAddress: string) => {
  const response = await fetch("https://usernames.worldcoin.org/api/v1/query", {
    method: "POST",
    body: JSON.stringify({ addresses: [walletAddress] }),
  });

  const data = await response.json();

  const addressDetails = data[0];

  return {
    username: addressDetails.username,
    profilePicture: addressDetails.profile_picture_url,
  };
};
