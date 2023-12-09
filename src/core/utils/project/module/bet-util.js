
const OL_RESULTS=['r-unkown','r-unkown2','r-tie','r-lose','r-win','r-win-half','r-lose-half'];

import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
       /**
    * @description:H5详情盘口
    * @param {*} ol_item
    * @return {*}
    */
    export const   go_to_bet=(ol_item)=>{
        const {oid,_hid,_hn,_mid } = ol_item
        let params = {
          oid, // 投注项id ol_obj
          _hid, // hl_obj 
          _hn,  // hn_obj
          _mid,  //赛事id mid_obj
        }
        let other = {
          is_detail: false,
          // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
          // 根据赛事纬度判断当前赛事属于 那种投注类型
          bet_type: 'common_bet',
          // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
          device_type: 1,  
          // 数据仓库类型
          match_data_type: "h5_detail",
      }
        set_bet_obj_config(params,other)
    }

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

 