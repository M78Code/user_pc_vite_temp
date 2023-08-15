




   /**
     * 根据体育类型的csid获取赛事的让球玩法id
     * @param {Number} csid 体育类型id
     */
   export const  get_handicap_w_id=(csid)=>{
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
  }