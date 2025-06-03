import { createSlice } from "@reduxjs/toolkit";

const chatsSlice = createSlice({
  name: "chats",
  initialState: null,
  reducers: {
    addChat: (state, action) => {
      return action.payload;
    },
    removeChat: (state, action) => {
      return null;
    },
  },
});

export const { addChat, removeChat } = chatsSlice.actions;
export const chatsReducer = chatsSlice.reducer;
