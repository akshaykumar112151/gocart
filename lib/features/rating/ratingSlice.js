import { createSlice } from '@reduxjs/toolkit'

const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
    },
    reducers: {
        setRatings: (state, action) => {
            state.ratings = action.payload
        },
        addRating: (state, action) => {
            // Agar pehle se hai toh update, warna add
            const index = state.ratings.findIndex(
                r => r.orderId === action.payload.orderId && r.productId === action.payload.productId
            )
            if (index !== -1) {
                state.ratings[index] = action.payload
            } else {
                state.ratings.push(action.payload)
            }
        },
    }
})

export const { setRatings, addRating } = ratingSlice.actions
export default ratingSlice.reducer