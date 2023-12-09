/**
 * @Description 是否虚拟体育的球种ID
 * @param {String} csid 球种id
 * @returns {Boolean} 返回是否是虚拟体育的布尔值
 */
export const is_virtual_csid = (csid) => {
	// 虚拟足球1001  虚拟赛狗1002  虚拟篮球1004 虚拟摩托1010 虚拟赛马1011 泥地摩托车1009
	return [1001, 1002, 1004, 1010, 1011, 1009].includes(Number(csid));
};

/**
 * @Description 是否电竞的球种ID
 * @param {undefined} undefined
 */
export const is_eports_csid = (csid) => {
	// 英雄联盟100  dota2 101 csgo 102 王者荣耀103
	return [100, 101, 102, 103].includes(+csid);
};

/**
   * 根据  一级 菜单ID 计算 赛种 ID
   * @param {*} mi
   */
export const compute_sport_id = (mi) => {
	let obj = {
		101: 1,
		102: 2,
		103: 3,
		104: 4,
		105: 5,
		106: 6,
		107: 7,
		108: 8,
		109: 9,
		110: 10,
		111: 11,
		112: 12,
		113: 13,
		114: 14,
		115: 15,
		116: 16,
		118: 18,
		300: 10001,
		400: 10002,
		2000: 10003,
	};
	return obj[mi];
}

 /**
   * @Description 根据csid获取对应的模板ID
   * @param {undefined} undefined
  */
 export const csid_to_tpl_id = (csid) => {
    csid = csid * 1
    let tpl_id = 99
    switch(csid){
      case 1: // 足球
      case 11:// 手球
        tpl_id = 1
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