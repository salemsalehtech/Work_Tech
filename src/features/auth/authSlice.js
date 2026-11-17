import { createSlice } from '@reduxjs/toolkit';

// user: { id, fullName, email, phone, addresses, ... } of a demo account, or null. Reducers are the account owner's task.
const initialState = { user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
});

export const selectCurrentUser = (state) => state.auth.user;

export default authSlice.reducer;
