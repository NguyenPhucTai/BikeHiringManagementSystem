import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchKey: null,
    color: [],
    manufacturer: [],
    status: null,
    sortBy: "id",
    sortType: "ASC",
    isSubmitting: false
};

const reduxSlice = createSlice({
    name: "redux",
    initialState: initialState,
    reducers: {
        searchBike(state, action) {
            state.searchKey = action.payload.searchKey;
        },
        sortByBike(state, action) {
            state.sortBy = action.payload;
        },
        sortTypeBike(state, action) {
            state.sortType = action.payload;
        },
        filterBike(state, action) {
            state.color = action.payload.color;
            state.manufacturer = action.payload.manufacturer;
        },
        setIsSubmitting(state, action) {
            state.isSubmitting = action.payload.isSubmitting;
        }
    }
});

export const reduxAction = reduxSlice.actions;

export default reduxSlice;