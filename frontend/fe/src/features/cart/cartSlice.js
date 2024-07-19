import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listCart: []
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        updateCart: (state, action) => {
            const { _id: productId, quantity } = action.payload;
            const existingProductIndex = state.listCart.findIndex(
                (item) => item._id === productId
            );

            if (existingProductIndex !== -1) {
                state.listCart[existingProductIndex].quantity = quantity;
            }
        },
        updateCartV2: (state, action) => {
            const updatedItem = action.payload;
            state.listCart = updatedItem
            // const existingItemIndex = state.listCart.findIndex(item => item._id === updatedItem._id);
            // if (existingItemIndex !== -1) {
            //     state.listCart[existingItemIndex] = updatedItem;
            // }
        },
        addToCart: (state, action) => {
            const newProduct = action.payload;
            const existingProductIndex = state.listCart.findIndex(
                (item) => item._id === newProduct._id
            );

            if (existingProductIndex !== -1) {
                state.listCart[existingProductIndex].quantity += newProduct.quantity;
            } else {
                state.listCart.push(newProduct);
            }
        },
        removeFromCart: (state, action) => {
            state.listCart = state.listCart.filter(
                (item) => item._id !== action.payload
            );
        },
        resetCart: (state) => {
            state.listCart = [];
        }
    },
});

export const { updateCart, resetCart, removeFromCart, addToCart, updateCartV2 } = cartSlice.actions;

export default cartSlice.reducer;
