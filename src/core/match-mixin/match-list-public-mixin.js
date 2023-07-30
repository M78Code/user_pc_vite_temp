/*
 * @Description: 赛事列表公共minxins
 */

export default{
  data(){
    return {
      // 赛事csid映射二级菜单menu_type
      csid_map_smenu_type:{
        1: 5 ,// 足球"
        2: 7 ,// 篮球"
        3: 19 ,// 棒球"
        4: 18 ,// 冰球"
        5: 13 ,// 网球"
        6: 20 ,// 美式足球"
        7: 14 ,// 斯诺克"
        8: 16 ,// 乒乓球"
        9: 17 ,// 排球"
        10: 15 ,// 羽毛球"
        11: 43 ,// 手球"
        12: 44 ,// 拳击"
        13: 45 ,// 沙滩排球"
        14: 22 ,// 联合式橄榄球"
        // 14: 45 ,// 橄榄球"
        15: 23 ,// 曲棍球"
        16: 24 ,// 水球"
      }
    }
  },
  methods:{
    /**
     * @description: 获取赛事的让球方
     * @param {Object} match
     * @return {Number} 0未找到让球方 1主队为让球方 2客队为让球方
     */
    get_handicap_index_by(match){
      let result = 0;
      if(match && match.hps){
        let hpid = this.get_handicap_w_id(match.csid);
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
    },

    /**
     * 根据体育类型的csid获取赛事的让球玩法id
     * @param {Number} csid 体育类型id
     */
    get_handicap_w_id(csid){
      const sport_id = csid * 1;
      let sport_id_convert = 4;
      switch(sport_id){
        // 网球
        case 5:
          sport_id_convert = 154  //让盘154 让局155
          break;
        // 羽毛球
        case 10:
          sport_id_convert = 172
          break;
        // 乒乓球
        case 8:
          sport_id_convert = 172
          break;
        // 斯诺克
        case 7:
          sport_id_convert = 181
          break;
        // 篮球
        case 2:
          sport_id_convert = 39
          break;
        // 足球
        case 1:
          sport_id_convert = 4;
          break;
        // 3、4、6、9棒冰美排
        case 3:  //棒
          sport_id_convert = 243
          break;
        case 4:  //冰
          sport_id_convert = 4;
          break;
        case 6:  //美
          sport_id_convert = 39
          break;
        case 9: //排
          sport_id_convert = 172
          break;
        default:
          sport_id_convert = 4;
          break;
      }
      return sport_id_convert;
    },
  }
}
