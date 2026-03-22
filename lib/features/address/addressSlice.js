import { createSlice } from '@reduxjs/toolkit'

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
    },
    reducers: {
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
        setAddress: (state, action) => {
            state.list = action.payload
        },
        deleteAddress: (state, action) => {
            state.list = state.list.filter(a => a.id !== action.payload)
        },
        updateAddress: (state, action) => {
            const index = state.list.findIndex(a => a.id === action.payload.id)
            if (index !== -1) state.list[index] = action.payload
        },
    }
})

export const { addAddress, setAddress, deleteAddress, updateAddress } = addressSlice.actions
export default addressSlice.reducer