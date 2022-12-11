/** Store setup using configureStore method from redux-toolkit */
import { configureStore } from "@reduxjs/toolkit";

/** Where to import slice reducers */
import reduxSlice from "./redux/redux.slice";

const store = configureStore({
    reducer: {
        redux: reduxSlice.reducer,
    },
});

export default store;
