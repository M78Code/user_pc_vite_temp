

  
  
 
    /**
     * @description: 金额格式化带货币符号
     * @param {Number} num 金额
     * @return {String} 转换后的金额
     */
    export   const  format_currency=(num)=>{
        if(num) {
          let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/);
          // 保留两位小数
          let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00";
          let _num = _split[1] + '.' + decimal;
          return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
        return '0.00';
      }
      /**
       * @description: 金额格式化带货币符号
       * @param {Number} num 金额
       * @return {String} 转换后的金额
       */
      export   const  format_currency2=(num)=>{
        if(num) {
          let _num = num.toString();
          return _num.replace(/\d+/, function(n){ // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function($1){
               return $1+",";
             });
          });
        }
        return '0';
      }
     
  