/**
 *@description 将金额转化为千位符格式保留2位小数
 *@param {Number} num 待格式化的金额 
 *@return {String} 转化后的金额 比如 '64,464.95'
 */
 export const format_money2 = function (num) {
    try {
      if(num && num < 0){
          num = 0
      }
      num = (num || 0).toString();
      let result = '';
      let [num1, num2 = '00'] = num.split('.');
      num2 = num2.padEnd(2, '0')
      while (num1.length > 3) {
        result = ',' + num1.slice(-3) + result;
        num1 = num1.slice(0, num1.length - 3);
      }
      if (num1) { num1 = num1 + result; }
      return num1 + '.' + num2;
    } catch (error) {
      console.error(error)
      return ''
    }
}
/**
 *@description 将金额转化为千位符格式 小数位不做处理
 *@param {Number} num 待格式化的金额 
 *@return {String} 转化后的金额 比如 '64,464.95' '1,005'
 */
 export const format_money3 = function (num) {
    try {
      num = (num || 0).toString();
      let result = '';
      let [num1, num2] = num.split('.');
      num2 = num2 || ''
      while (num1.length > 3) {
        result = ',' + num1.slice(-3) + result;
        num1 = num1.slice(0, num1.length - 3);
      }
      if (num1) { num1 = num1 + result; }
      if (num.includes('.')) {
        return num1 + '.' + num2
    } else {
        return num1;
      }
    } catch (error) {
      console.error(error)
      return ''
    }
}


const money_filter = function (num) {
    return num.toString().indexOf(".") !== -1
        ? num.toLocaleString()
        : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
}