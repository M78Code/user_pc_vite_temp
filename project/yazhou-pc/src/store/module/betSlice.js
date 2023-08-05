
import { createSlice } from '@reduxjs/toolkit'

import EMITTER from  "src/global/mitt.js"

const initialState = {
  bet_items: [],
  show_bet: false
}
const  betSlice =createSlice({
  name:"betReducer",
  initialState,
  reducers:{

    add_bet(state,action){
      state.bet_items.push( action.payload )
    },
    replace_bet(state,action){
      console.log('betReducer--------,replace_bet',action);

      let data = action.payload.data
      state.bet_items =[
        data
      ]

    },
    empty_bet(state,action){
      state.bet_items =[]

    },
    show_bet(state,action){
      console.log('betReducer--------,show_bet',action);
      state.show_bet = action.payload

      EMITTER.emit(EMITTER.TYPES.show_bet,action.payload)
    }


  }
})


// export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions

export default betSlice.reducer
