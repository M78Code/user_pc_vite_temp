import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./module/user-info";
import langReducer from "./module/languages";
import themeReducer from "./module/theme";


// import configReducer from "./module/config";
import * as project_store from "project_path/src/store";
const store = configureStore({
  reducer: {
    userReducer,
    langReducer,
    themeReducer,
    ...project_store,
  },
});

export default store;
