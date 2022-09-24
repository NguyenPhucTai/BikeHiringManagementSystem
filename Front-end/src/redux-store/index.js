/** Store setup using configureStore method from redux-toolkit */
import { configureStore } from "@reduxjs/toolkit";

/** Where to import slice reducers */
import listBikeSlice from "./listBike/listBike.slice";

const store = configureStore({
    reducer: {
        listBike: listBikeSlice.reducer,
    },
});

export default store;
