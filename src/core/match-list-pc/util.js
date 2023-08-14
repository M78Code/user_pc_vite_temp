


  /**
   * @Description 根据csid获取对应的模板ID
   * @param {undefined} undefined
  */
  export const  csid_to_tpl_id=(csid)=>{
    csid = csid * 1
    let tpl_id = 99
    switch(csid){
      case 1: // 足球
      case 11:// 手球
        tpl_id = 0
        break
      case 2: // 篮球
        tpl_id = 7
        break
      case 3: // 棒球
        tpl_id = 17
        break
      case 4: // 冰球
        tpl_id = 16
        break
      case 5: // 网球
        tpl_id = 9
        break
      case 6: // 美足
        tpl_id = 0
        break
      case 7: // 斯诺克
      case 8: // 乒乓球
      case 9: // 排球
      case 10: // 羽毛球
      case 13: // 沙滩排球
        tpl_id = 11
        break
      case 12: // 拳击
        tpl_id = 19
        break
      case 14: // 橄榄球
      case 15: // 曲棍球
      case 16: // 水球
        tpl_id = 20
        break
      case 100: // lol
      case 101: // dota2
      case 102: // CSgo
      case 103: // 王者荣耀
        tpl_id = 'esports'
        break
    }
    return tpl_id
  }