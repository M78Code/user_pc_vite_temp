
let str1=`


// 重置串关红升绿降状态
this.$root.$on(MITT_TYPES.EMIT_BET_MIX_ITEM_RESET_CMD, this.bet_mix_reset);
// 更改串关的match_update字段值
this.$root.$on(MITT_TYPES.EMIT_BET_MIX_CHANGE_MATCH_UPDATE, this.change_match_update);
//更新串关投注项上的match_udpate字段
this.$root.$on(MITT_TYPES.EMIT_BET_MIX_MATCH_UPDATE, this.reset_match_update);
//更新主客队信息(主要用于国际化切换时调用)
this.$root.$on(MITT_TYPES.EMIT_UPDATE_HOME_AWAY_CMD, this.update_home_away); 


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


// created() 内 ：


////生成事件监听
// this.handle_generat_emitters()


// beforeUnmount() 内

//  //移除相应监听事件 //视图销毁钩子函数内执行
//  if(this.emitters_off){this.emitters_off()}  