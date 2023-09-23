import { configureStore } from "@reduxjs/toolkit";

import langReducer from "./module/languages";
import themeReducer from "./module/theme";


// import configReducer from "./module/config";
import * as project_store from "project_path/src/store";
const store = configureStore({
  reducer: {
 
    langReducer,
    themeReducer,
    ...project_store,
  },
  middleware:getDefaultMiddleware=>getDefaultMiddleware({
    //关闭redux序列化检测
    serializableCheck:false
  })
});

export default store;
