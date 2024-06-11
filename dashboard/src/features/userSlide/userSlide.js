import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email: '',
    access_token: '',
    isAdmin: false,
    phone: '',
    usename: '',
    id: '',
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {isAdmin, email = '', username = '', access_token , _id = '', phone = '' } = action.payload
            state.email = email;
            state.usename = username;
            state.id = _id;
            state.phone = phone
            state.access_token = access_token;
            state.isAdmin= isAdmin;
        },
        resetUser: (state) => {
            state.email = "";
            state.usename = "";
            state.access_token = "";
            state.phone=""
            state.id = "";
            state.isAdmin= false
        },

    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer