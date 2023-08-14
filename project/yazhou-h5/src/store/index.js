import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './module/menu'
import matchReducer from './module/match'

import betInfoReducer from './module/betInfo'
import userInfoReducer from './module/userinfo'
import detailsReducer from './module/details'
import virtualSportsReducer from './module/virtual-sports'
import cathecticReducer from './module/cathectic'
import themeReducer from './module/theme'
  const store = configureStore( {
    reducer:{
      betInfoReducer,
      userInfoReducer,
      menuReducer,
      matchReducer,
      detailsReducer,
      virtualSportsReducer,
      cathecticReducer,
      themeReducer
    }
  })
  export default store
