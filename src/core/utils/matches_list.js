import _ from 'lodash';
import courseData from 'src/core/global/course.js'
import match_play from 'src/core/global/match_os.js';

const sort_odds_list = [ '2', "173", "244" ]
/**
 * 
 * @param {Array} odds_array 所有玩法的集合
 * @param {String} odds_hpid 需要拿出的玩法id
 * @description 用来处理接口返回的玩法列表
 * @returns {Array} 返回处理之后的单个玩法数组 
 */
export const filter_odds_func = (odds_array, csid, is15mins) => {
  // const sort_arr = [ '182', '4' ];
  let odds_list = [];
  let play_type = ['1', '4', '16'].includes(csid)
  let play_type_hpid = ['2']
  if (is15mins) {
    odds_array.forEach(item => {
      if (item.hpid === csid && item.hl && item.hl[0]) {
        let temporary_object = {
          ...item.hl[0],
          hpid: item.hpid,
        }
        odds_list.push(temporary_object);
      }
    })
  } else {
    // 足球、水球、冰球 有 胜平负； 其他 胜负
    odds_array.forEach(item => {
      if (match_play[csid][0].includes(item.hpid)) {
        let temporary_object = {
          ...item.hl[0],
          hpid: item.hpid,
        }
        odds_list.push(temporary_object);
      }
    })
  }
  // 通过otd对玩法进行排序
  odds_list.forEach(item => {
    // if (play_type && !play_type_hpid.includes(item.hpid)) {
      item.ol = _.sortBy(item.ol, ['otd'])
    // }
    // if (sort_odds_list.includes(item.hpid)) {
    //   item.ol = _.sortBy(item.ol, ['otd']).reverse();
    // }
  })
  if (!is15mins && odds_list.length < 2) {
    odds_list.push({})
  }
  return odds_list || [];
}

// 处理赛程
export const handle_course_data = payload => {
  const { mmp, csid, mgt, ms } = payload
  // mmp 赛事阶段  0 未开赛
  // 如果未开赛 返回开赛时间
  if (!Number(mmp)) {
    return format_mat_func(mgt);
  }
  return ms === 1 ? courseData[csid][mmp] : ms === 110 ? 'Soon': '';
}

// 开赛时间转换 分：秒
export const format_mst_data = (mst) => {
  const m = String(Math.floor((mst / 60))).padStart(2, '0')
  const s = String(Math.floor((mst % 60))).padStart(2, '0')
  return `${m}:${s}`
}

export const format_mat_func = payload => {
  const date = new Date(Number(payload));
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = add_zero(date.getMinutes());
  return day + '/' + month + ' ' + hour + ':' + minutes;
}

export const add_zero = payload => {
  if(payload < 10) {
    return '0' + payload;
  }
  return payload;
}