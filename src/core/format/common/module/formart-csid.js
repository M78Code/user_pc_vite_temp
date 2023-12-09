
  /**
   * @Description 根据球种ID获取球种中文名称
   * @param {undefined} undefined
  */
  export function  csid_to_sport_name(csid){
    csid = parseInt(csid)
    let sport_name = ''
    switch(csid){
      case 1:
        sport_name = '足球'
        break
      case 2:
        sport_name = '篮球'
        break
      case 3:
        sport_name = '棒球'
        break
      case 4:
        sport_name = '冰球'
        break
      case 5:
        sport_name = '网球'
        break
      case 6:
        sport_name = '美式足球'
        break
      case 7:
        sport_name = '斯诺克'
        break
      case 8:
        sport_name = '乒乓球'
        break
      case 9:
        sport_name = '排球'
        break
      case 10:
        sport_name = '羽毛球'
        break
      case 11:
        sport_name = '手球'
        break
      case 12:
        sport_name = '拳击'
        break
      case 13:
        sport_name = '沙滩排球'
        break
      case 14:
        sport_name = '联合式橄榄球'
        break
      case 15:
        sport_name = '曲棍球'
        break
      case 16:
        sport_name = '水球'
        break
    }
    return sport_name
  }