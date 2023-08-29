import { get, each } from "lodash";

export const utils_info = {
	// 是否内嵌
	is_iframe: window.frames.length != parent.frames.length,
};



/**
 *
 * @param {Array} msc 赛事比分数组
 * @param {Boolean} is_init 是否初始化
 * @returns {Object} 返回比分对象
 */
export const serialized_score = (msc = [], is_init = false) => {
	let score_obj = {};
	if (is_init) {
		score_obj = {
			S11: { home: "", away: "" },
			S103: { home: "0", away: "0" },
			S5: { home: "", away: "" },
			S10102: { home: "", away: "" },
		};
	}
	// 遍历接口比分数据 转成比分对象
	each(msc, (score_str) => {
		let [key, value] = score_str.split("|");
		if (value) {
			let [home, away] = value.split(":");
			score_obj[key] = { home, away };
		}
	});
	return score_obj;
};

/**
 * @description 根据 ms 返回是否是滚球
 * @param  {number} ms  赛事的当前状态
 * @oaran {array} exclude 排除的状态
 * @return {number} is_play 是否滚球：0 非滚球 1 滚球
 */
export const get_match_status = (ms, exclude) => {
	let _ms = Number(ms);
	// 为滚球的所有状态
	let all_ms = [1, 2, 7, 10, 110];
	// 排除某些滚球状态
	if (exclude) {
		all_ms = all_ms
			.concat(exclude)
			.filter((v) => !all_ms.includes(v) || !exclude.includes(v));
	}
	// 非滚球
	let is_play = 0;
	// 进行中,暂停,延迟,比赛中断,即将开赛
	if (all_ms.includes(_ms)) {
		is_play = 1;
	}
	return is_play;
};

 

//获取服务器时间
export const get_remote_time = () => {
	let { local_time, remote_time } = JSON.parse(
		localStorage.getItem("get_timestamp")
	);
	let now = new Date().getTime();
	let time = remote_time + (now - local_time);
	return time;
};

/**
 * @Description 获取媒体索引
 * @param {string} type
 * @return {NUmber}  1 ：源视频 2：动画 3 ：演播室 4 ：主播 5：专题
 *
 */
export const get_media_icon_index = (type) => {
	const media_icons = ["video", "animation", "studio", "anchor", "topic"];
	return media_icons[type - 1] || media_icons.indexOf(type) + 1 || 1;
};
/**
 *
 * @param {String} url
 * @description 检测视频地址是否可用
 */

export const url_exists = (url) => {
	var http = new XMLHttpRequest();
	http.open("HEAD", url, false);
	http.send();
	return http.status != 404;
};

/**
 * 红猫赛事显示倒计时优化
 * @param  match 赛事信息
 * @param  counting_time 显示时间
 *
 */
export const counting_time_ctr_show_format = (match, counting_time) => {
	// counting_time 格式00:00
	let counting_time_ = counting_time;
	// 红猫赛事只显示分钟不显示秒
	if (
		get(match, "cds") == "RC" &&
		get(match, "csid") == 1 &&
		counting_time
	) {
		counting_time_ = get(counting_time_.split(":"), "[0]");
	}
	return counting_time_;
};
