import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  name: "",
  phone: "",
  email: "",
  addresses: [],
  role: "unknown",
  orders: [],
  wishlist: [],
  id: '',
  access_token: ''
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        username = "",
        name,
        email = "",
        _id = "",
        phone = "",
        addresses,
        orders,
        roles,
        access_token,
        wishlist
      } = action.payload;
      state.username = username;
      state.name = name;
      state.phone = phone;
      state.email = email;
      state.addresses = addresses;
      state.role = roles;
      state.id = _id;
      state.orders = orders;
      state.access_token = access_token;
      state.wishlist = wishlist
    },
    resetUser: (state) => {
        state.username = "";
        state.name = "";
        state.phone = "";
        state.email = "";
        state.addresses = [];
        state.role = "";
        state.id = "";
        state.orders = [];
        state.access_token = "";
        state.wishlist = []
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;