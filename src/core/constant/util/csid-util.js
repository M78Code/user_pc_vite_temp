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