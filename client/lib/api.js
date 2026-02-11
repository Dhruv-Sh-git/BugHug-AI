import axios from "axios";

export const sendMessage = async (token, payload) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};
