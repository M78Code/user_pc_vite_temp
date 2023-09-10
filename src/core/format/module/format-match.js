/**
 * @description 虚拟体育赛事格式化
 * @return {undefined} undefined
 */
export const virtual_sport_format = (match_list_input) => {
	let match_list = [...match_list_input];
	match_list_input.forEach((item) => {
		match_list = match_list.concat(item.matchs);
	});
	let _match_index = 0;
	// 是否为新批次
	let _vshow_group = true;
	let pre_index = 0;
	// 赛事显示状态 1：进行中 2： 停止投注 3：停留1分后移除
	let _show_status = 1;
	let remote_time = get_remote_time();
	/** 第1场赛事的特殊处理 ***************/
	let first_match = match_list[0] || {};
	// 篮球 && 赛前赛事
	if (first_match.csid == "1004" && first_match.mmp == "PREGAME") {
		// 开赛时间后 10S
		let over_time = Number(first_match.mgt) + 10000;
		if (remote_time > over_time) {
			// 移除 赛前相关的 5 场赛事
			match_list.splice(0, 5);
		}
	}
	// 上一个赛事
	let pre_match = {};
	match_list.forEach((match, cur_index) => {
		if (cur_index > 0) {
			pre_index = cur_index - 1;
			if (match.batchNo != pre_match.batchNo) {
				_match_index = 0;
				_vshow_group = true;
			} else {
				_vshow_group = false;
			}
		} else {
			// 右侧切换
			MatchListDetailMiddleware.set_vsport_params({
				mid: match.mid,
				csid: match.csid,
				tid: match.tid,
				batchNo: match.batchNo,
				orderNo: match.orderNo,
			});
		}
		_match_index += 1;
		match._match_index = _match_index;
		match._show_status = _show_status;
		match._vshow_group = _vshow_group;
		// 防止重新拉赛事后 先展开后再收起的闪烁问题
		if (remote_time > match.mgt) {
			match.mhs = 2;
		}
		pre_match = match;
	});
	return match_list;
};

/**
* @description: 计算胜平负次数
*/
export const format_result = (data) => {
  let obj = {
    win: 0,
    dogfall: 0,
    lose: 0
  }
  data.forEach(item => {
    if (item.result == 2) {
      obj.dogfall += 1
    } else if (item.result == 3) {
      obj.lose += 1
    } else if (item.result == 4) {
      obj.win += 1
    }
  })
  return obj
}