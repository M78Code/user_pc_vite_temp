
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