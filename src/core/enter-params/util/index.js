


  /**
   * @description: url地址增加参数
   * @param {String} url
   * @param {String} param_key
   * @param {String} param_val
   * @return {String}
   */
 export default  function url_add_param(url,param_key,param_val){
    let ret = url;
    if(ret && typeof(ret)=='string'){
      ret = `${ret}${((ret.indexOf('?') == -1)?'?':'&')}${param_key}=${param_val}`;
    }
    return ret;
  }