import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchKey: null,
    color: [],

    /*
        filterList = [
            {type: "Color", value: 1},
            {type: "Color", value: 2},
            {type: "Color", value: 3},
            {type: "Manufacturer", value: 1}
        ]
    */
    manufacturer: [],
    status: null,
    sortBy: "id",
    sortType: "DESC"
};

const listBikeSlice = createSlice({
    name: "listBike",
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
        filterBike(state, action){
            state.color = action.payload.color;
            state.manufacturer = action.payload.manufacturer;
        }
    }
});

export const listBikeAction = listBikeSlice.actions;

export default listBikeSlice;