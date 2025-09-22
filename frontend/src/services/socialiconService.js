import axios from "axios";

const API_URL = "http://localhost:1337/api/social-links";

export const getSocialLinks = async (locale = "en") => {
  try {
    const res = await axios.get(`${API_URL}?locale=${locale}`);
    console.log("Social links API response:", res.data);

    const first = res.data?.data?.[0]; // 👈 remove .attributes

    return first
      ? {
          instagram: first.instagram || "",
          twitter: first.twitter || "",
          linkedin: first.linkedin || "",
          tiktok: first.tiktok || "",
        }
      : {};
  } catch (err) {
    console.error("Error fetching social links:", err);
    return {};
  }
};
