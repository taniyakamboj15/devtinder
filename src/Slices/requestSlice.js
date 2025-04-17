import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequest: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      const newReq = state.filter((req) => req._id != action.payload);
      return newReq;
    },
  },
});
export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
