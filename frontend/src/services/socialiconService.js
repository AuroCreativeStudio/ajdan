import axios from "axios";

const API_URL = "http://localhost:1337/api/social-links";

export const getSocialLinks = async () => {
  try {
    const res = await axios.get(`${API_URL}?locale=en`);
    console.log("Social links API response:", res.data);

    const first = res.data?.data?.[0];

    return first
      ? {
          id: first.id,
          instagram: first.instagram || "",
          twitter: first.twitter || "",
          linkedin: first.linkedin || "",
          tiktok: first.tiktok || "",
          whatsapp: first.whatsapp || "",
        }
      : { id: null };
  } catch (err) {
    console.error("Error fetching social links:", err);
    return { id: null };
  }
};




// Update social links
export const updateSocialLink = async (documentId, updateData) => {
  try {
    const updateRes = await axios.put(`${API_URL}/${documentId}`, {
      data: updateData,
    });
    console.log("Social link updated:", updateRes.data);
    return updateRes.data;
  } catch (err) {
    console.error("Error updating social link:", err.response?.data || err);
    throw err;
  }
};
