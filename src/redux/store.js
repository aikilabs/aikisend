import { configureStore } from "@reduxjs/toolkit";
import errorMessageReducer from "./errorMessage";
import aikiSend from "./aikiSend";

export default configureStore({
    reducer: {
        errorMessage: errorMessageReducer,
        aikiSend: aikiSend,
    },
});
