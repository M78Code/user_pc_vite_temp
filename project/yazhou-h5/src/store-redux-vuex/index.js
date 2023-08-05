import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './module/menu'
  const store = configureStore( {
    reducer:{
      menuReducer
    }
  })
  export default store
