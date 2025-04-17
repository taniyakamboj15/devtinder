import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../Slices/userSlice";
import { feedReducer } from "../Slices/feedSlice";
import requestReducer from "../Slices/requestSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    request: requestReducer,
  },
});
export default appStore;
