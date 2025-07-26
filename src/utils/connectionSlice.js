import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: null,
  reducers: {
    addConnections: (state, action) => action.payload,
    addConnection: (state, action) => {
      // Add a single connection to existing connections
      if (state && Array.isArray(state)) {
        return [...state, action.payload];
      } else {
        return [action.payload];
      }
    },
    removeConnections: () => null,
  },
});

export const { addConnections, addConnection, removeConnections } = connectionSlice.actions;

export default connectionSlice.reducer;