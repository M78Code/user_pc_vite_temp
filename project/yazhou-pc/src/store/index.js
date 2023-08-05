import { configureStore } from '@reduxjs/toolkit'

import todosReducer from './module/todos'
import counterReducer from './module/counter'
import betReducer from './module/betSlice'
import userReducer from './module/userInfo'
import betInfoReducer from './module/betInfo'
import matchesReducer from './module/matches'
import menuReducer from './module/menu'

  const store = configureStore( {

    reducer:{
      todosReducer,
      counterReducer,
      betReducer,
      userReducer,
      betInfoReducer,
      matchesReducer,
      menuReducer,
    }
  })

  export default store
