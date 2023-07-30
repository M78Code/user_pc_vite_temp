import { get, each } from "lodash";

export const utils_info = {
	// 是否内嵌
	is_iframe: window.frames.length != parent.frames.length,
};

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

/**
 * @description: 数字转中文
 * @param {Integer} number 形如123的数字
 * @return {String} 返回转换成的形如 一百二十三 的字符串
 */
export const numberToChinese = (number) => {
	// // 单位 字符
	let t = { units: "个十百千万@#%亿^&~", chars: "零一二三四五六七八九" };
	let a = (number + "").split(""),
		s = [];
	if (a.length > 12) {
		throw new Error("too big");
	} else {
		for (var i = 0, j = a.length - 1; i <= j; i++) {
			if (j == 1 || j == 5 || j == 9) {
				//两位数 处理特殊的 1*
				if (i == 0) {
					if (a[i] != "1") s.push(t.chars.charAt(a[i]));
				} else {
					s.push(t.chars.charAt(a[i]));
				}
			} else {
				s.push(t.chars.charAt(a[i]));
			}
			if (i != j) {
				s.push(t.units.charAt(j - i));
			}
		}
	}
	//return s;
	return s
		.join("")
		.replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {
			//优先处理 零百 零千 等
			b = t.units.indexOf(d);
			if (b != -1) {
				if (d == "亿") return d;
				if (d == "万") return d;
				if (a[j - b] == "0") return "零";
			}
			return "";
		})
		.replace(/零+/g, "零")
		.replace(/零([万亿])/g, function (m, b) {
			// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
			return b;
		})
		.replace(/亿[万千百]/g, "亿")
		.replace(/[零]$/, "")
		.replace(/[@#%^&~]/g, function (m) {
			return {
				"@": "十",
				"#": "百",
				"%": "千",
				"^": "十",
				"&": "百",
				"~": "千",
			}[m];
		})
		.replace(/([亿万])([一-九])/g, function (m, d, b, c) {
			c = t.units.indexOf(d);
			if (c != -1) {
				if (a[j - c] == "0") return d + "零" + b;
			}
			return m;
		});
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
