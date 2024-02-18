/**
 * 这个js 提供的是更新表征的方法
 * 1. 对外提供一个c8订阅数据更新 更新表征数据的方法 传入参数为c8订阅的几个赛事id
 * 2. 通过每个赛事id 去数据仓库拿对应id的赛事对象 然后通过模板表征计算出新的表征数据 
 * 3. 用新的表征数据替换旧的表征数据 
 * 4. 依托于新的整个列表表征数据 计算出偏移量等 相关列表信息
 * 
 */


/**
 * @param {Object} mids 
 * @description 这里接收的是需要重新计算表征的mids  会去重新计算表征
 */
export const update_match_style = (mids) => {
  // 用于盛放需要重新计算表征的match 对象
  let match_update_style_info = {};
  for (const mid in mids) {
    match_update_style_info[mid] = mids[mid]
  }
  return match_update_style_info;
}