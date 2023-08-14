/*
 * @Description: 用户信息
 */

import { uid } from 'quasar';
import lodash from 'lodash'
import userCtr from 'src/public/utils/user/userCtr.js';
import { api_admin } from "src/api/index.js";
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  uuid: "",
  // 用户信息,用户金额,userId,语言 需要监听变化
  user: {
    balance:'',
    userId:'',
    languageList:''
  },
  // 用户令牌信息
  user_token: '',
  // 登录用户的id
  user_logined_id:'',
  // 用户是否长时间未操作
  is_user_no_handle:false,
  // 用户信息数据
  user_info_data: {}
}

const matchSlice = createSlice({
  name: 'matchReducer',
  initialState,
  reducers: {
    set_uuid(state) {
      if (!state.uuid) {
        let unique = localStorage.getItem("unique_uuid");
        if (unique) {
          state.uuid = unique;
        } else {
          state.uuid = uid().replace(/-/g, "");
          localStorage.setItem("unique_uuid", state.uuid);
        }
      }
    },
    clear_uuid(state) {
      state.uuid = "";
      localStorage.setItem("unique_uuid", state.uuid);
    },
    set_loaded_user_id(state,value){
      state.user_logined_id = value;
    },
    set_user(state,user_obj) {
      if(!user_obj) {
        return;
      }
      if(user_obj.balance === null) delete user_obj.balance;
      if(state.user) {
        Object.assign(state.user, user_obj)
      } else{
        state.user = user_obj;
      }
      // 设置用户信息，存入localStorage中
      userCtr.set_user_base_info(state.user);
    },
    set_balance(state,balance) {
      state.user.balance = +balance;
    },
    clear_user(state) {
      state.user = '';
    },
    //设置用户是否长时间未操作
    set_is_user_no_handle(state, val) {
      state.is_user_no_handle = val;
    },
    set_user_token(state,token_) {
      state.user_token = token_;
    },
    set_user_info_data(state,value) {
      state.user_info_data = value;
    }, 
    // 获取用户余额
    fetch_balance: lodash.debounce(function ({ commit, state }) {
      api_admin.get_amount({ uid: state.user.userId }).then(res => {
        if (res.code == 200) {
          const amount = _.get(res, "data.amount")
          state.user.balance = +amount;
        }
      }).catch(err => {
        console.error(err);
      });
    }, 1000, { 'leading': true, 'trailing': false })
  }
})

export default matchSlice.reducer
