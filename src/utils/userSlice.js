import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload; // Make sure action.payload includes photo
    },
    removeUser: () => null,
  },
});


export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
