import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './module/menu'
import matchReducer from './module/match'
  const store = configureStore( {
    reducer:{
      menuReducer,
      matchReducer
    }
  })
  export default store
