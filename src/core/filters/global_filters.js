/*
 * @Author: Router
 * @Date: 2020-08-20 18:35:54
 * @Description: 多出用到的filter写到全局
 */
/**
 *@description 将金额转化为千位符格式保留2位小数
 *@param {Number} num 待格式化的金额 
 *@return {String} 转化后的金额 比如 '64,464.95'
 */
 const format_money2 = function (num) {
    try {
      if(num && num < 0){
          num = 0
      }
      num = (num || 0).toString();
      let result = '';
      let [num1, num2 = '00'] = num.split('.');
      num2 = num2.padEnd(2, '0')
      while (num1.length > 3) {
        result = ',' + num1.slice(-3) + result;
        num1 = num1.slice(0, num1.length - 3);
      }
      if (num1) { num1 = num1 + result; }
      return num1 + '.' + num2;
    } catch (error) {
      console.error(error)
      return ''
    }
}
/**
 *@description 将金额转化为千位符格式 小数位不做处理
 *@param {Number} num 待格式化的金额 
 *@return {String} 转化后的金额 比如 '64,464.95' '1,005'
 */
const format_money3 = function (num) {
    try {
      num = (num || 0).toString();
      let result = '';
      let [num1, num2] = num.split('.');
      num2 = num2 || ''
      while (num1.length > 3) {
        result = ',' + num1.slice(-3) + result;
        num1 = num1.slice(0, num1.length - 3);
      }
      if (num1) { num1 = num1 + result; }
      if (num.includes('.')) {
        return num1 + '.' + num2
    } else {
        return num1;
      }
    } catch (error) {
      console.error(error)
      return ''
    }
}
const score_format = function (str) {
    return str.replace(/:/, "-");
}
const format_score = function (str) {
    return str.split(":").join("-");
}
const money_filter = function (num) {
    return num.toString().indexOf(".") !== -1
        ? num.toLocaleString()
        : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
}

const format_Y_M_D_H_M = function (payload) {
    if (!payload) return ''
    let time = new Date(parseInt(payload));
    let y = (time.getFullYear() + "")
    let M = (time.getMonth() + 1 + "").padStart(2, 0);
    let d = (time.getDate() + "").padStart(2, 0);
    let h = (time.getHours() + '').padStart(2, 0);
    let m = (time.getMinutes() + '').padStart(2, 0);
    return `${y}-${M}-${d} ${h}:${m}`
}
const formcht_Y_M_D_H_M = function (payload) {
    if (!payload) return ''
    let time = new Date(parseInt(payload));
    let y = (time.getFullYear() + "")
    let M = (time.getMonth() + 1 + "").padStart(2, 0);
    let d = (time.getDate() + "").padStart(2, 0);
    let h = (time.getHours() + '').padStart(2, 0);
    let m = (time.getMinutes() + '').padStart(2, 0);
    return `${y}年${M}月${d}日  ${h}:${m}`
}
// 示例： 1 月 2 日
const format_M_D = function (payload, that) {
    if (!payload) return ''
    let time = new Date(parseInt(payload));
    let m = time.getMonth();
    let d = (time.getDate() + "");
    let monthes = i18n_t('time.monthes');
    let format = i18n_t('time.time_date_1');
    format = format.replace('%date', d);
    format = format.replace('%month', monthes[m]);
    return format;
}
// 示例： 12 ：30
const format_H_M = function (payload) {
    if (!payload) return ''
    let time = new Date(parseInt(payload));
    let h = (time.getHours() + '').padStart(2, 0);
    let m = (time.getMinutes() + '').padStart(2, 0);
    return `${h}:${m}`
}
// 示例： 23:30
const format_mgt_time = function (num) {
    class MatchTime {
        constructor(time) {
            this.time = time
        }
        showTime() {
            let m = Math.floor(this.time / 60)
                .toString()
                .padStart(2, '0')
            let s = Math.floor((this.time % 60) / 1)
                .toString()
                .padStart(2, '0')
            return `${m}:${s}`
        }
    }
    let time = new MatchTime(num).showTime()
    return time;
}

/**
 * 日期格式化
 * @param {String} val 时间戳  
 * @return {String} 
 */
const formete_date = (val) => {
    val = Number(val)
    let difference = Date.now() - val, str = ''
    if (difference > 1000 * 60 * 60 * 24) {
        str = new Date(val).getMonth() + 1 + '月' + new Date(val).getDate() + '日'
    } else if (difference > 1000 * 60 * 60) {
        str = Math.ceil(difference / (1000 * 60 * 60)) + '小时前'
    } else {
        str = Math.ceil(difference / (1000 * 60)) + '分钟前'
    }
    return str
}

// 示例： 5 15 23
const format_min_time = function (num) {
    class MatchTime {
        constructor(time) {
            this.time = time
        }
        showTime() {
            let m = Math.ceil(this.time / 60).toString()
            return `${m}`
        }
    }
    let time = new MatchTime(num).showTime()
    return time;
}

    /**
     *@description 赔率展示优化，见优化单 13807,电竞不走这个逻辑
     *@param {Number|String} val 最终赔率 30.40 100.00
     *@param {Number|String} csid 球类id
     *@return {String} 优化后的赔率，30.4 100
     */
const format_odds = function (val,csid) {
    val = (val || '0').toString()
    if (!val.includes('.') || [100,101,102,103].includes(+csid)) return val
    if (val >= 100) {
        if (val.split('.')[1] == '00') {
            return val.split('.')[0]
        } else {
            return val
        }
    }
    if (val >= 10) {
        if (val.split('.')[1][1] == '0') {
            return val.slice(0,val.length-1)
        } else {
            return val
        }
    }
    return val
}
/**
 *@description 根据不同赛事阶段取不同的比分
 *@param {Object} match 赛事数据对象
 *@param {Number} num 0-主队  1-客队
 *@param {String} key 比赛结束显示指定比分
 *@return {Number} 主队或客队得分
 */
 const format_total_score = function (match, num,key) {
	try {
		if (!(match.msc && Array.isArray(match.msc) && match.msc.length)) return 0;
		let score_, mscmap = new Map(match.msc.map(item => [item.split('|')[0], item.split('|')[1].split(':')]));
		if (match.csid == "1" || match.csid == "11") {    //足球和手球
			switch (String(match.mmp)) {
				//  41 加时赛上半场  33 加时休息  42 加时下半场 110 加时赛结束
				case '41': case '33': case '42': case '110':
					score_ = mscmap.get('S7')
					break;
				// 50 点球大战  120 点球大战结束
				case '50': case '120':
					score_ = mscmap.get('S170')
					break;
				// 即将加时和等待点球的阶段固定取0
				case '32': case '34':
					score_ = 0
					break;
				//全场结束,取点球大战比分，加时赛比分或者全场比分
				case '999':
					score_ = mscmap.get('S170') || mscmap.get('S7') || mscmap.get('S1')
                    key && key.includes("S") && (score_ = mscmap.get(key))
					break;
				default:
					score_ = mscmap.get('S1')
					break;
			}
		} else {
			score_ = mscmap.get('S1')
		}
		return score_ && score_[num] || 0
	} catch (error) {
		console.error(error)
		return 0
	}	 
}
export default {
    score_format,
    format_score,
    money_filter,
    format_Y_M_D_H_M,
    formcht_Y_M_D_H_M,
    format_M_D,
    format_H_M,
    format_mgt_time,
    format_min_time,
    format_money2,
    format_money3,
    format_odds,
    format_total_score,
    formete_date,
}
