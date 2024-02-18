
const OL_RESULTS=['r-unkown','r-unkown2','r-tie','r-lose','r-win','r-win-half','r-lose-half'];


      /**
    * 获取单个投注项信息
    * @param  {object} match
    * @param  {string} ol_index
    * @param  {string} field
    * @return {undefined} undefined
    */
      export const  mx_get_bet_simple=(match, ol_index, field) =>{
    let play = match.hps[0].hl[0];
    let value = "";
    switch (field) {
      case "play":
        value = play;
        break;
      case "oid":
        value = lodash.get(play, `ol.${ol_index}.${field}`);
        break;
      case "bet_data":
        value = lodash.get(play, `ol.${ol_index}`);
        break;
      case "ol_data":
        value = lodash.get(play, `ol.${ol_index}`);
        break;
      case "bet_id":
        value = {
          mid: match.mid,
          hid: lodash.get(play, `hid`),
          oid: lodash.get(play, `ol.${ol_index}.oid`)
        };
        break;
    }
    return value;
  }
  /** 计算ol.result的值返回投注项状态
   * 
   * @param {K.result[keyof K.result]} val ol.result
   * @returns {TYPES.OlResultState}
   */
  export function   calcOlResult(val){
    if(val > 0 && val <=6 ){
      return OL_RESULTS[val]
    }
    return "r-unkown"
  }


  
  /**
   *@description 根据result 的值返回是否赢钱
         "0": '未知',
         "1": '未知',
         "2": '走水',
         "3": '输',
         "4": '赢',
         "5": '赢半',
         "6": '输半',
   *@param {K.result[keyof K.result]} val result的值
   *@return {Boolean}
   */
   export function  calc_win(val){
    if(val != undefined && (val == 4 || val == 5)){
      return true
    }else{
      return false
    }
  }

 