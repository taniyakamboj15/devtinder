import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userSlice";
import feedSlice from "./feedSlice";
import requestSlice from "./requestsSlice"

const appStore = configureStore({
    reducer:{
       user:userReducer,
       feed:feedSlice,
       request:requestSlice
    }
});
export default appStore;