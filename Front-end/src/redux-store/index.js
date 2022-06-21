/** Store setup using configureStore method from redux-toolkit */
import { configureStore } from "@reduxjs/toolkit";

/** Where to import slice reducers */
// import userSlice from "./user/user.slice";

const store = configureStore({
    reducer: {
        // user: userSlice.reducer,
    },
});

export default store;
