
let str1=`


//网络错误时设置默认最大最小值
this.$root.$on(MITT_TYPES.EMIT_NET_ERR, this.net_err_fun)
// 串关的校验金额
this.$root.$on(MITT_TYPES.EMIT_BET_MIX_CHECK_MONEY_CMD, this.check_money);
// 触发清除串关输入框金额
this.$root.$on(MITT_TYPES.EMIT_BET_MIX_CLEAR_HANDLE_CMD, this.bet_clear_handle);
// 设置金额
this.$root.$on(MITT_TYPES.EMIT_BET_MIX_SET_MONEY_CMD, this.set_money);
// 设置输入框的最大金额
this.$root.$on(MITT_TYPES.EMIT_BET_MIX_INPUT_MAX_MONEY, this.set_input_max);
// 设置最小金额
this.$root.$on(MITT_TYPES.EMIT_BET_MIX_MIN_MONEY, this.set_min_money);
// 更新键盘按键状态
this.$root.$on(MITT_TYPES.EMIT_MIX_UPDATE_KEYBOARD_STATUS_CMD,this.update_keyboard_status);


`



// { type:MITT_TYPES.EMIT_NET_ERR, callback:this.net_err_fun} ,




let str2 = ''

str2= str1.replaceAll('this.$root.$on(','{ type:')

str2= str2.replaceAll(',',', callback:')
str2= str2.replaceAll(');','} ,')
str2= str2.replaceAll(')','} ,')

// str2= `[ ${str2}]`

console.log( str2);

// 使用的时候更改  str1 的值
// 运行方式：     node ./job/emitter-generator.js