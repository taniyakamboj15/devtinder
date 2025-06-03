import { addChat } from "../Slices/chatsSlice";
import { BASE_URL } from "../constants/constants";

const fetchChats = async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/chats`, {
      method: "GET",
      credentials: "include",
    });
    const json = await response.json();
    if (response.ok) {
      console.log("dispatch");
      dispatch(addChat({ chats: json.data || null }));
    }
  } catch (err) {
    console.error("Error fetching chat list:", err);
  }
};

export default fetchChats;
