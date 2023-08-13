import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './module/menu'
import matchReducer from './module/match'

import betInfoReducer from './module/betInfo'
import userInfoReducer from './module/userinfo'
import detailsReducer from './module/details'
import virtualSportsReducer from './module/virtual-sports'
  const store = configureStore( {
    reducer:{
      betInfoReducer,
      userInfoReducer,
      menuReducer,
      matchReducer,
      detailsReducer,
      virtualSportsReducer
    }
  })
  export default store
