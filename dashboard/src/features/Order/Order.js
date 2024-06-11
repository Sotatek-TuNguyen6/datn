import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  address_city: "",
  address_country: "",
  address_line1: "",
  namePay: "",
  type: "",
  email: "",
  isSucces: false,
  isShip: false,
  isDelivery: false,
  isReturn: false,
};

export const paySlide = createSlice({
  name: "pay",
  initialState,
  reducers: {
    updatePay: (state, action) => {
      const [
        products,
        address_city,
        address_country,
        address_line1,
        namePay,
        email,
        isSucces,
        isShip,
        isDelivery,
        isReturn,
      ] = action.payload;

      const updatedState = {
        ...state,
        paymentInfo: {
          products,
          address_city,
          address_country,
          address_line1,
          namePay,
          email,
          isSucces,
          isShip,
          isDelivery,
          isReturn,
        },
      };
      return updatedState;
    },
    resetPay: (state) => {
      state.products = [];
      state.address_city = "";
      state.address_country = "";
      state.namePaystate.id = "";
      state.email = "";
      state.isSucces = false;
      state.isShip = false;
      state.isDelivery = false;
      state.isReturn = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updatePay, resetPay } = paySlide.actions;

export default paySlide.reducer;
