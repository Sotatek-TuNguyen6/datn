import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    productSingle: [],
}

export const productSingleSlide = createSlice({
    name: 'product',
    initialState,
    reducers: {
        updateProductSingle: (state, action) => {
            const { res } = action.payload
            state.productSingle = res
        },
        restProductSingle: (state) => {
            state.productSingle = []
        },

    },
})

// Action creators are generated for each case reducer function
export const { updateProductSingle, restProductSingle } = productSingleSlide.actions

export default productSingleSlide.reducer