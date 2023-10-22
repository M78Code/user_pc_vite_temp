

/**
 * @description 赛事 虚拟列表 类
 */

import { ref } from 'vue'
import MatchFold from 'src/core/match-fold'

class VirtualList {
  constructor () {
    // 开始下标
    this.start_index = 0
    // 结束下标
    this.end_index = 15
    // 赛事 mid 高度 映射 对象
    this.match_mid_map_height = ref({})
  }
  /**
   * @description 设置 赛事 mid 虚拟高度 映射
   * @param { match } 赛事对象
   * @param { height } 赛事初始化高度，初始只展示 联赛标题 40
   * @remarks
   *  1: 初始化时，赋值虚拟高度即 默认高度 40 
   *  2：赛事折叠/展开/次要玩法展开/次要玩法收起 均需更新对应赛事 高度（即真实高度）
   */
  set_match_mid_map_height (mid, height = 40) {
    const key = this.get_match_height_key(mid)
    Object.assign(this.match_mid_map_height.value, {
      [key]: height
    })
    // console.log(this.match_mid_map_height.value)
  }
  /**
   * @description 计算页面渲染数据
   */
  compute_page_render_list_end_index (list) {
    // console.log(this.match_mid_fold_obj)
    const total_height = window.innerHeight - 48 - 44 - 59 - 13
    let result = 0
    let target_index = 0
    // 折叠信息
    const fold_data = MatchFold.match_mid_fold_obj.value
   
    // 高度映射 对象
    const source_data = this.match_mid_map_height.value
    list.some((match, index) => {
      const { mid, is_show_league } = match
      const fold_key = MatchFold.get_match_fold_key(match)
      const fold_info = fold_data[fold_key]
      const virtual_key = this.get_match_height_key(mid)
      const height = source_data[virtual_key]
      if (!fold_info.show_card) {
        if (is_show_league) result += +height
      } else {
        result += +height
      }
      if (result > total_height + 100) {
        target_index = index
        this.end_index = index
        // 退出循环
        return true
      }
    })
    return target_index
  }
  /**
   * @description 获取 赛事对象 key
   * @param {*} match 
   * @returns String
   */
  get_match_height_key (mid) {
    return `mid_height_${mid}`
  }
}

export default new VirtualList()