import { configureStore } from "@reduxjs/toolkit";
import  {PROJECT_STORE} from "app/job/output/entry/index.js";
const store = configureStore({
  reducer: {
    ...PROJECT_STORE,
  },
  middleware:getDefaultMiddleware=>getDefaultMiddleware({
    //关闭redux序列化检测
    serializableCheck:false
  })
});
export default store;
