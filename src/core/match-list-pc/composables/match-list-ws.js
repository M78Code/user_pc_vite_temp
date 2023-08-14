import { ref } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { i18n } from "src/boot/i18n.js";
import PageSourceData from "src/core/page-source/index.js";
import MatchListCard from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListData from "src/core/match-list-pc/match-data/match-list-data-class.js";

import utils from  "src/core/utils/utils.js"




     //  订阅所需 赛事ID
 
     const skt_mid = ref({});
     //  可视区域赛事ID
     const show_mids = ref( []);





const ws_c8_subscribe =()=> {
    let match_list = []
    show_mids.value.forEach( mid => {
      let match = MatchListData.mid_obj['mid_'+mid]
      if(match){
        match_list.push(match)
      }
    })
    if(match_list.length==0) return;
    let _skt_mid_obj = utils.ws_c8_obj_format(match_list);
    match_list.map(match => {

      let match_c8 = null;
      match.hpsPns && match.hpsPns.map(item => {
        match_c8 = _skt_mid_obj[match.mid];
        if (match_c8) {
          if (match.tpl_id == 18) {
            match_c8.hpids.push('*');
          } else {
            match_c8.hpids.push(item.hpid)
          }
        }
      })
      if(match.cosCorner) {
        _.forEach(["113","114","111","119","121","122"], item=>{
          if(!match_c8.hpids.includes(item)) {
            match_c8.hpids.push(item);
          }
        });
        // match_c8.hpids.push(...[113,114,111,119,121,122]); // 角球玩法
      }
      if(match.cosOvertime) { // 加时赛玩法
        _.forEach(["126","128","127","129","130","332"], item=>{
          if(!match_c8.hpids.includes(item)) {
            match_c8.hpids.push(item);
          }
        });
        // match_c8.hpids.push(...[126,128,127,129,130,332]);
      }
      if(match.cosPenalty) { // 点球大战玩法
        _.forEach(["333","335","334"], item=>{
          if(!match_c8.hpids.includes(item)) {
            match_c8.hpids.push(item);
          }
        });
        // match_c8.hpids.push(...[1333,335,334]);
      }
      if(match.cosPromotion) { // 晋级赛玩法
        _.forEach(["135","136"], item=>{
          if(!match_c8.hpids.includes(item)) {
            match_c8.hpids.push(item);
          }
        });
        // match_c8.hpids.push(...[135,136]);
      }
      if(match.cosPunish) { // 罚牌玩法
        _.forEach(["310","306","307","311","308","309"], item=>{
          if(!match_c8.hpids.includes(item)) {
            match_c8.hpids.push(item);
          }
        });
        // match_c8.hpids.push(...[310,306,307,311,308,309]);
      }
    })
    // console.log(`===22222====专业版订阅的赛事=============skt_mid_obj:${JSON.stringify(_skt_mid_obj)}`);
     return  _skt_mid_obj;
  }
 const   refresh_c8_subscribe=()=>{
      if(this.SCMD_C8){
   const   skt_mid_obj = ws_c8_subscribe();
      // 订阅赛事
    //  this.SCMD_C8(skt_mid_obj);
    }
  }


  export { 
    show_mids
  }