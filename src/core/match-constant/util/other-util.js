


import   {get_handicap_w_id} from  "./hid-util.js"
import  MenuData from  "src/core/menu-pc/menu-data-class.js"








    /**
     * @description: 获取赛事的让球方
     * @param {Object} match
     * @return {Number} 0未找到让球方 1主队为让球方 2客队为让球方
     */
    const  get_handicap_index_by=(match)=>{
        let result = 0;
        if(match && match.hps){
          let hpid =  get_handicap_w_id(match.csid);
          let hp_item = match.hps.filter(item => item.hpid == hpid)[0];
          if(hp_item){
            let hl_item = hp_item.hl[0];
  
            // 网球csid 5  让盘hpid 154
            if(!hl_item || !hl_item.ol){
              if(match.csid == 5){
                hp_item = match.hps.filter(item => item.hpid == 154)[0];
                if(hp_item){
                  hl_item = hp_item.hl[0];
                }
              }
            }
  
            if(hl_item && hl_item.ol){
              let found_i = 0;
              hl_item.ol.forEach((ol_item,i) => {
                if(ol_item.on){
                  let on_str = String(ol_item.on);
                  if(on_str[0] == '-'){
                    found_i = (i + 1);
                  }
                }
              });
              result = found_i;
            }
          }
        }
        return result;
      }



          /**
     * 添加赛事对象前端使用字段 : 让球方
     * @param { }   match  赛事对象
     * @return {Array}  filtered
    */

      export const   match_init=(match)=>{

             // 当前选中的主菜单 类型
             let main_menu_type =    MenuData.get_current_lv_1_menu_type()   ;

        if(main_menu_type != 28){ // 28 赛果
            //ms = 1 为 已开赛 否则未完赛 ms: 3	结束
            if(match.ms == 3){
              return;
            }
            // 当前选中的日期（串关与早盘）
            let third_menu_type = _.get(this.get_current_menu,'date_menu.menuType');
            if(main_menu_type != 100 && third_menu_type != 100){
              if(match && match.hps && match.hps.length < 3){
                // 如果盘口投注项小于3个，则push 进hps
                for(let i1 = match.hps.length; i1 < 3;i1++){
                  match.hps.push({
                    hl:[{}]
                  });
                }
              }
            }
            if(!match.hps){
              match.hps = [];
            }
          }
          let assign_obj = { handicap_index:0 }
          // 如果当前赛事没有mid，有 matchId，则赋值给mid
          if(!match.mid && match.matchId) { match.mid = match.matchId }
          // 获取赛事的让球方 0未找到让球方 1主队为让球方 2客队为让球方
          assign_obj.handicap_index = this.get_handicap_index_by(match);
          // 对象浅拷贝
          Object.assign(match, assign_obj);

    }







          /**
     * 添加赛事对象前端使用字段 : 让球方
     * @param {Array} match_list
     * @return {Array}  filtered
     */
          export const match_list_init=(match_list)=> {
      
   
        //附加前端逻辑字段
        match_list.map(match =>match_init(match));
        return match_list;
      }