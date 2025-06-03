import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../Slices/userSlice";
import { feedReducer } from "../Slices/feedSlice";
import requestReducer from "../Slices/requestSlice";
import { chatsReducer } from "../Slices/chatsSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    request: requestReducer,
    chats: chatsReducer,
  },
});
export default appStore;
