/*
 * @Author: Cable
 * @Date: 2021-08-22 09:31:03
 * @Description: 列表每个模板的投注项大小
 */

import utils from "src/core/utils/index.js"
// import { store } from "src/store/index.js"
// 配置模板
const config_template = {
  // 赛事阶段区域宽度
  process_width: 0,
  // 主客队信息区域宽度
  team_width: 0,
  // 赛事阶段加主客队宽度
  process_team_width: 0,
  // 投注项宽度
  bet_width: 0,
  // 视频按钮区域宽度
  media_width: 0,
  // 投注项数量
  bet_col_count: 6
}


class match_list_tpl_size {
  // 足球 让球与大小
  template0 = {
    ...config_template,
    bet_col_count: 6
  }
  // 足球 半全场
  template2 = {
    ...config_template,
    bet_col_count: 9
  }
  // 足球 进球单双 
  template3 = {
    ...config_template,
    bet_col_count: 4
  }
  // 足球  进球区间
  template5 = {
    ...config_template,
    bet_col_count: 4
  }
  // 足球 净胜分
  template6 = {
    ...config_template,
    bet_col_count: 6
  }
  // 篮球 让球与大小
  template7 = {
    ...config_template,
    bet_col_count: 5
  }
  // 篮球净胜分
  template8 = {
    ...config_template,
    bet_col_count: 2
  }
  // 网球 让球与大小
  template9 = {
    ...config_template,
    bet_col_count: 4
  }
  // 网球 准确盘数
  template10 = {
    ...config_template,
    bet_col_count: 3
  }
  // 羽毛球  让球与大小
  template11 = {
    ...config_template,
    bet_col_count: 3
  }
  // 竟足 
  template12 = {
    ...config_template,
    bet_col_count: 4
  }
  // 13号模板 0号模板展开 
  template13 = {
    ...config_template,
    bet_col_count: 13
  }
  // 兵乓球 准确局数
  template15 = {
    ...config_template,
    bet_col_count: 4
  }
  // 冰球 让球与大小
  template16 = {
    ...config_template,
    bet_col_count: 4
  }
  // 棒球 让球与大小
  template17 = {
    ...config_template,
    bet_col_count: 4
  }
  // 拳击 让球与大小
  template19 = {
    ...config_template,
    bet_col_count: 2
  }
  // 水球  让球与大小
  template20 = {
    ...config_template,
    bet_col_count: 6
  }
  // 足球 比分
  template21 = {
    ...config_template,
    bet_col_count: 6
  }
  // 足球 独赢/让球胜平负
  template22 = {
    ...config_template,
    bet_col_count: 9
  }
  // 足球  下一 最后进球
  template23 = {
    ...config_template,
    bet_col_count: 3
  }
  // 足球  15分钟
  template24 = {
    ...config_template,
    bet_col_count: 6
  }
  // 足球  罚牌
  template25 = {
    ...config_template,
    bet_col_count: 6
  }

  // 电竞
  templateesports = {
    ...config_template,
    bet_col_count: 6
  }

  // 虚拟足球
  template1001 = {
    ...config_template,
    bet_col_count: 6
  }

  // 虚拟篮球
  template1004 = {
    ...config_template,
    bet_col_count: 4
  }

  // 虚拟赛狗、虚拟赛马、虚拟摩托
  template1002 = {
    ...config_template,
    bet_col_count: 3
  }


  /**
   * @Description 设置模板table宽度 
   * @param {number} total_width 列表总宽度
   * @param {undefined} undefined
  */
  set_template_width(total_width) {
    let is_iframe = utils.is_iframe
    // 基础信息宽度
    let process_team_width = parseInt(total_width * 0.292)
    //设置最小宽度
    if (process_team_width < 238) {
      process_team_width = 238
    }
    // 视频按钮区域宽度
    let media_width = parseInt(total_width * 0.06)
    if (total_width < 930) {
      media_width = 40
    }
    if (is_iframe) {
      process_team_width = 56 + 182
      media_width = 44
    }
    // if (window.$menu.menu_data.is_multi_column && store.getters.get_unfold_multi_column && store.getters.get_layout_cur_page.cur == 'home') {
    //   process_team_width = parseInt(total_width * 0.18)
    //   media_width = parseInt(total_width * 0.03)
    // }
    Object.keys(this).forEach(key => {
      // 竞彩足球
      if (key == 'template12') {
        let process_team_width_12 = parseInt(total_width * 0.45)
        if (is_iframe) {
          process_team_width_12 = 365
        }
        // 设置投注项宽度
        this[key].bet_width = parseInt((total_width - process_team_width_12 - media_width - 60) / this[key].bet_col_count)
        // 设置视频区域宽度
        this[key].media_width = total_width - process_team_width_12 - 60 - this[key].bet_width * this[key].bet_col_count
        // 设置赛事阶段加主客队宽度
        this[key].process_team_width = process_team_width_12
        // 设置主客队信息宽度
        if (is_iframe) {
          this[key].team_width = process_team_width_12 - 56
        } else {
          this[key].team_width = process_team_width_12 - 77
        }
      } else {
        let cur_media_width = media_width
        let cur_process_team_width = process_team_width
        if (key == 'templateesports') {
          cur_media_width = 48
          if (is_iframe) {
            cur_process_team_width = 56 + 142
          }
        }
        // 设置投注项宽度
        this[key].bet_width = parseInt((total_width - cur_process_team_width - cur_media_width) / this[key].bet_col_count)
        // 设置视频区域宽度
        this[key].media_width = total_width - cur_process_team_width - this[key].bet_width * this[key].bet_col_count
        // 设置赛事阶段加主客队宽度
        this[key].process_team_width = cur_process_team_width
        // 设置主客队信息宽度
        if (is_iframe) {
          this[key].team_width = cur_process_team_width - 56
        } else {
          this[key].team_width = cur_process_team_width - 77
        }
      }
    })
  }
}
export default new match_list_tpl_size
