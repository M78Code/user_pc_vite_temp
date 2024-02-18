/*
 * @Author: 使用自定义方法进行运算,保证精度准确
 * 使用例子 let res = this.$mathjs.multiply(1.13,100000,4);
 * 1.13 赔率 , 100000 常量（十万位赔率）, 4 投注金额
 * @Date: 2022-06-14 20:31:51
 * @Description: 
 */
import calc from "calculatorjs"
const math = {
  //加减乘除混合运算this.$mathjs.calc('1+1-1*1/2+(1/1)/-1')
  calc(){
    return calc(...arguments)
  },
  //加法
  add() {
    // 加法
    // 原理：将浮点数转换为整数进行加法运算，运算结果再除以10的N次幂
    // 例子：10.333+5.1232 ===> (103330+51232)÷10000
    // 方法：
    // let addition = function(arg1,arg2){
    //   var r1,r2,m;
    //   try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    //   try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    //   m=Math.pow(10,Math.max(r1,r2))
    //   return (arg1*m+arg2*m)/m
    // }
    return comp(calc.add, arguments)
  },
  //减法
  subtract() {
    // 减法
    // 原理：将浮点数转换为整数进行减法运算，运算结果再除以10的N次幂
    // 例子：16.733+5.1232 ===> (167330-51232)÷10000
    // 方法：
    // let subtration = function(arg1,arg2){
    //   var r1,r2,m,n;
    //   try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    //   try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    //   m=Math.pow(10,Math.max(r1,r2));
    //   //last modify by deeka
    //   //动态控制精度长度
    //   n=(r1>=r2)?r1:r2;
    //   return ((arg1*m-arg2*m)/m).toFixed(n);
    // }
    return comp(calc.sub, arguments)
  },
  // 乘法
  multiply() {
    // 乘法
    // 原理：将浮点数转换为整数进行乘法运算，运算结果再除以10的N次幂
    // 例子：45.123*6 ===> (45123*6000)÷1000
    // 方法：
    // let multiplication = function(arg1,arg2){
    //   var m=0,s1=arg1.toString(),s2=arg2.toString();
    //   try{m+=s1.split(".")[1].length}catch(e){}
    //   try{m+=s2.split(".")[1].length}catch(e){}
    //   return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
    // }
    return comp(calc.mul, arguments)
  },
  // 除法
  divide() {
    // 除法
    // 原理：将浮点数转换为整数进行除法运算
    // 例子：123.23÷1.11 ===> 12323÷111
    // 方法：
    // let division = function(arg1,arg2){
    //   var t1=0,t2=0,r1,r2;
    //   try{t1=arg1.toString().split(".")[1].length}catch(e){}
    //   try{t2=arg2.toString().split(".")[1].length}catch(e){}
    //   r1=Number(arg1.toString().replace(".",""))
    //   r2=Number(arg2.toString().replace(".",""))
    //   return (r1/r2)*Math.pow(10,t2-t1);
    // }
    return comp(calc.div, arguments)
  },
}

/**
 * @description: 累加运行方法
 * @param {*} _func 方法体
 * @param {*} args 参数
 * @return {*} 运算结果
 */
function comp(_func, args) {
  let res= args[0];
  for (let i = 1; i < args.length; i++) {
    res = _func(res,[args[i]])
  };
  //防止超过6位使用科学计数法
  return res
}
export default math;