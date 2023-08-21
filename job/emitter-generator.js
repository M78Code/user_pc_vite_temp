
let str1=`

$root.$off(MITT_TYPES.EMIT_REMOVE_INVALID_, reomve_invalid_handle)
$root.$off(MITT_TYPES.EMIT_C201_UPDATE2, c201_update2_handle)
$root.$off(MITT_TYPES.EMIT_CHANGE_ODDS, change_odds_handle)
$root.$off(MITT_TYPES.EMIT_CHANGE_MARKET, change_market_handle)




`



// { type:MITT_TYPES.EMIT_NET_ERR, callback:this.net_err_fun} ,




let str2 = ''

str2= str1.replaceAll('this.$root.$on(','{ type:')
str2= str1.replaceAll('$root.$on(','{ type:')
str2= str1.replaceAll('this.$root.$off(','{ type:')
str2= str1.replaceAll('$root.$off(','{ type:')

str2= str2.replaceAll(',',', callback:')
str2= str2.replaceAll(');','} ,')
str2= str2.replaceAll(')','} ,')

// str2= `[ ${str2}]`

console.log( str2);

// 使用的时候更改  str1 的值
// 运行方式：     node ./job/emitter-generator.js




/**
 * 
// created() 内 ：

//生成事件监听
this.handle_generat_emitters()


// beforeUnmount() 内


 //移除相应监听事件 //视图销毁钩子函数内执行
 if(this.emitters_off){this.emitters_off()}  



// mrthods 内 
 
//生成事件监听 
handle_generat_emitters(){
let event_pairs=  [

//单关投注完成
{ type:MITT_TYPES.EMIT_SINGLE_COMPLETE_HANDLE_CMD, callback:this.complete_handle} ,

]
let  { emitters_off } =  useMittEmitterGenerator(event_pairs)
this.emitters_off=emitters_off

},





 * 
 * 
 * 
 */

 