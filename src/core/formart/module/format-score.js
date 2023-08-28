/**
 * @description: 比分合并
 * @param {Array} msc  原来的msc字段比分
 * @param {Object} skt_data 推送对象
 * @return {Array} msc 合并后的新比分数组
 */
export const merge_msc_array = (msc, skt_data) => {
  // 使用对象临时存放比分
  let score_obj = {};
  for (let i = 0; i < msc.length; i++) {
    let msc_item = msc[i];
    let check_msc_item =  msc_item && msc_item.includes('|') && msc_item.includes(':');
    if (check_msc_item) {
      let mcs_item_arr = msc[i].split('|');
      // 将比分转换成 score_obj={"S1": "0:0"} 的格式(可以进行去重)
      score_obj[mcs_item_arr[0]] = mcs_item_arr[1];
      if (_.isArray(skt_data.msc)) {
        skt_data.msc.forEach(skt_item => {
          if (skt_item && skt_item.includes('|')) {
            let skt_item_arr = skt_item.split('|');
            if (mcs_item_arr[0] == skt_item_arr[0]) {
              score_obj[mcs_item_arr[0]] = skt_item_arr[1];
            } else {
              score_obj[skt_item_arr[0]] = skt_item_arr[1];
            }
          }
        });
      }
    }
  }
  msc = [];
  // 将比分对象重新组合成列表接口中msc中的格式
  for (let [key, value] of Object.entries(score_obj)) {
    let item = `${key}|${value}`;
    msc.push(item);
  }
  if (msc.length==0) {
    msc = skt_data.msc || [];
  }
  return msc;
}
/**
 * @description: 将比分转换成数组中指定格式
 * @param {Array} msc 比分
 * @return {Array} msc 合并后的新比分对象
 */
export const msc_obj_arry = (msc) => {
  if (_.isArray(msc)) return msc;
  let arr = [],is_s1 = false;
  if(msc) {
    for (let [key, value] of Object.entries(msc)) {
      let obj = `${key}|${value.home}:${value.away}`;
      if(key=='S1') {
        is_s1 = true;
      }
      arr.push(obj);
    }
    // 如果不包含S1比分,则默认给0:0
    if(!is_s1) {
      arr.unshift('S1|0:0');
    }
  }
  return arr;
}
/**
 * @description: 将比分数组转换成对象中指定格式
 * @param {Array} msc 比分
 * @param {String} score_type 比分默认为S1
 * @return {Object} msc 合并后的新比分对象
 */
export const msc_array_obj = (msc,score_type="S1") => {
  let score_obj = {};
  if (msc instanceof Array) {
    msc.forEach(msc_item=>{
      let check_msc_item =  msc_item && msc_item.includes('|') && msc_item.includes(':');
      if(check_msc_item) {
        let msc_arr = msc_item.split('|');
        if(!_.isEmpty(msc_arr[0])&&!_.isEmpty(msc_arr[1])) {
          score_type = msc_arr[0];
          let team = msc_arr[1];
          let home = team.split(':')[0] ||'0';
          let away = team.split(':')[1] ||'0';
          let obj = {};
          obj[score_type] = {
            home,
            away,
            percentage: 0
          }
          if(!(home==0 && away==0)) {
            //统计面板百分比计算
            if (["S17", "S18"].includes(score_type)) {
              obj[score_type].percentage = parseInt(
                (parseInt(obj[score_type].home) /
                  (
                    parseInt(obj[score_type].home) +
                    parseInt(obj[score_type].away)
                  ).toFixed(2)) *
                  100
              );
            } else {
              obj[score_type].percentage = parseInt(
                (parseInt(obj[score_type].away) /
                  (
                    parseInt(obj[score_type].home) +
                    parseInt(obj[score_type].away)
                  ).toFixed(2)) *
                  100
              );
            }
          }
          Object.assign(score_obj, obj);
        }
      }
    });
  }
  return score_obj;
}