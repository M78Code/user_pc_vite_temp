

/**
 * @description 赛事 虚拟列表 类
 * @remarks 该文件所有H5项目共用， 禁止私自改动改文件, 要改动这里 请先问下 dolphin
 */

import { ref } from 'vue'
import { MenuData } from 'src/output/project/index.js'
import { PROJECT_NAME } from 'src/output/module/constant-utils.js'
import MatchFold from 'src/core/match-fold/index.js'
import { useMittEmit, MITT_TYPES } from "src/core/mitt"
import UserCtr from "src/core/user-config/user-ctr.js";
import PageSourceData from "src/core/page-source/page-source.js";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';

import { compute_style_template_by_match_height } from '../match-card/module/compute-style-template.js'

class VirtualList {
  constructor () {
    // 赛事与dom高度的映射
    this.mid_top_map = {};
    // 赛事 mid 高度 映射 对象
    this.match_mid_map_height = ref({})
    // 容器总高度
    this.container_total_height = ref(0);
    // 是否需要显示球种类别 (欧洲版 有的需要，有的不需要， 默认需要， 不需要得页面需提前设置)
    this.is_show_ball = true

    this.is_change_handicap_height = 0

    this.already_folded = 0;
    this.mid_dom_height_dict = {};
    this.match_height_map_list = []
  }

  /** 
   * @description  设置是否需要显示球种类别
   * @param { Boolean } val
   */
  set_is_show_ball (val) {
    this.is_show_ball = val
  }

  /** 
   * @description  设置是否需要加减赛事高度
   * @param { Number } val
 */
  set_is_change_handicap_height (val) {
    this.is_change_handicap_height = val
  }

  /**
   * @description 设置 赛事 mid 虚拟高度 映射
   * @param { match } 赛事对象
   * @param { config } 赛事默认配置
   * @remarks
   */
  set_match_mid_map_base_info (match, params) {
    const config = Object.assign({ 
      match_stage_height: 0, 
      ball_title_height: 20,
      reduce_buffer_height: 5,
      show_league_height: 26,
      playing_title_height: 20, 
      main_handicap_height: 133
    }, params)
    const key = this.get_match_height_key(match.mid)
    const { reduce_buffer_height, match_stage_height, ball_title_height, playing_title_height, show_league_height, main_handicap_height } = config
    Object.assign(this.match_mid_map_height.value, {
      [key]: {
        // 赛事阶段高度 （开赛、未开赛）
        match_stage_height,
        // 球种标题高度
        ball_title_height,
        // 联赛标题高度
        show_league_height,
        // 玩法标题高度
        playing_title_height,
        // 主盘口高度
        main_handicap_height,
        // 需要减去的缓冲容器高度
        reduce_buffer_height
      }
    })
  }

  // 获取该赛事高度 
  get_match_total_height (match, index) {
    const { is_show_league, mid, csid, start_flag, is_show_ball_title } = match
    // 赛事是否显示
    const show_card = this.get_match_show_card(match)
    // 获取模板默认高度
    const template_config = MatchMeta.get_match_default_template_config(csid)
    // 模板预设高度
    const { reduce_buffer_height, match_stage_height, show_league_height, playing_title_height, main_handicap_height, ball_title_height } 
      = template_config.match_template_config

    // 要减去的缓冲高度  3  赛事间隔高度 为 5
    const buffer_height = 3
    // --------- 以下是赛事高度计算逻辑  只要有改动均需看下其他 H5 项目有没有影响 改动需谨慎； 特别配置去模板默认配置加上 ------------------------------------
    // 赛事相叠高度 缓冲容器是 8px - buffer_height  就是交叠高度
    let match_overlap_height = reduce_buffer_height ? reduce_buffer_height - buffer_height : 0
    let total = 0
    // 显示开赛、未开赛 match_stage_height - 缓冲高度  并且不需要缓冲高度 所以 - 5
    if (match_stage_height && [1, 2].includes(+start_flag)) total += match_stage_height - 5
    // 显示球种类别
    if (this.is_show_ball && is_show_ball_title) total += ball_title_height
    // 本来应该是 联赛高度 show_league_height + 缓存容器高度 5 = 30； 
    // 但是并不需要那么高的间隙（赛事之间的间隙， 取缓存容器的高度） 所以减去 buffer_height ； 赛事之间相叠避免漏光
    if (is_show_league && show_card) {
      // 联赛 赛事均显示
      total += (show_league_height + playing_title_height + main_handicap_height + match_overlap_height)
    } else if (is_show_league && !show_card) {
      // 联赛显示 赛事不显示
      total += (show_league_height + match_overlap_height)
    } else if (!is_show_league && show_card) {
      // 联赛不显示 赛事显示
      total += main_handicap_height
    }
    // 特殊高度
    const special_height = this.get_match_special_height(match, index)
    total += special_height
    return total
  }

  /**
   * @description 计算渲染的数据
   * @param {*} scrollTop 滑动的距离
   * @returns 
   */
  compute_current_page_render_list (scrollTop = 0) {

    this.clear_virtual_info()

    // 可视区高度
    let match_count = 0
    let page_count = 22;
    let accrual_height = 0
    let already_folded = 0;
    // 顶部滚动距离减去  上面5个列表赛事  的距离
    const start_position = this.get_scorll_position(scrollTop)
    const complete_matchs = lodash.get(MatchMeta, `complete_matchs`, [])
    // 赛事总数
    const match_datas = []
    // 高度映射 对象
    complete_matchs.some((match, index) => {
      const { mid, is_show_league } = match
      // 赛事是否显示
      const show_card = this.get_match_show_card(match)
      const virtual_key = this.get_match_height_key(mid)
      // 赛事高度
      const match_height = this.get_match_total_height(match, index)
      
      // 退出循环
      if (match_count >= page_count) return true 
      if (match.mid && accrual_height > start_position) {

        // 列表页每一个赛事的 translateY( ${top}px) top 定位值
        this.mid_top_map[virtual_key] = accrual_height;
        
        if (match_height > 0 && (is_show_league || show_card)) {
          // debugger
          // console.log(`mid-${mid}:::${match_height}`)

          // 列表页赛事数据
          match_datas.push(match);
          match_count++; //赛事容器数量加1
        }
        // 如果当前折叠 并且 当前赛事 显示联赛，则 -1 操作
        if (is_show_league && !show_card) {
          // 赛事容器数量减1，相当于页面可视区域 总数量 page_count 加1个
          if (already_folded <= 10) match_count--; 
          already_folded++;
        }
      }
      if (match.mid) accrual_height += match_height
    })

    // 计算总高度
    this.compute_container_total_height()

    // 是否到底了
    const flag = accrual_height >= this.container_total_height.value || match_datas.length < page_count || MatchMeta.complete_matchs.length < page_count
    useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MAX_HEIGHT, flag);

    return match_datas
  }

  // 计算容器总高度
  compute_container_total_height () {
    let total_height = 0
    MatchMeta.complete_matchs.forEach((match, index) => {
      const { mid, is_show_league } = match
      // 赛事是否显示
      const show_card = this.get_match_show_card(match)
      const height = this.get_match_total_height(match, index)
      // if (mid && height > 0 && (is_show_league || show_card)) console.log(height, mid, is_show_league)
      if (mid && height > 0 && (is_show_league || show_card)) total_height += height
    })
    this.container_total_height.value = total_height + 181
  }

  // 赛事是否显示
  get_match_show_card = (match) => {
    // 折叠对象
    const fold_data = MatchFold.match_mid_fold_obj.value
    // 赛事折叠信息
    const fold_key = MatchFold.get_match_fold_key(match)
    // 赛事是否显示
    const show_card = lodash.get(fold_data[fold_key], `show_card`, false)
    return show_card
  }

  // 计算虚拟滚动初始计算高度
  get_scorll_position (scrollTop) {
    let position = 0
    const is_result = MenuData.is_results()
    if (PROJECT_NAME === 'ouzhou-h5') {  // 欧洲版
      // 是否全部折叠状态
      const csid_status = MenuData.menu_csid && MatchFold.ball_seed_csid_fold_obj.value[`csid_${MenuData.menu_csid}`]
      if (is_result) {
        // 赛果
        position = scrollTop - 800
      } else if (csid_status) {
        // 球种非折叠状态
        position = scrollTop - 700
      } else {
        // 球种折叠
        position = scrollTop - 200
      }
    } else if (PROJECT_NAME === 'app-h5') { // 复刻版
      const is_show_all = MenuData.is_zaopan() || MenuData.is_scroll_ball()
      const csid = MenuData.menu_csid || '1' 
      const all_csid_fold_status = MatchFold.all_csid_fold_status.value
      const not_begin_collapsed = !lodash.get(MatchFold.not_begin_csid_fold_obj.value, `csid_${csid}`, true)
      const progress_seed_collapsed = !lodash.get(MatchFold.progress_csid_fold_obj.value, `csid_${csid}`, true)
      if (is_result) {
        // 赛果
        position = scrollTop - 800
      } else {
        position = scrollTop - 300
        if (is_show_all) {
          // 滚球 早盘
          position = !all_csid_fold_status ? scrollTop - 300 : scrollTop - 6 * 198
        } else {
          position = progress_seed_collapsed || not_begin_collapsed ? scrollTop - 300 : scrollTop - 6 * 198
        }
      }
    }
    
    return position
  }

  // 赛事 特殊高度 
  // 例如： 复刻版下的新手版、高度不同
  get_match_special_height (match, index) {
    const menu_lv_v1 = MenuData.current_lv_1_menu_i
    // 折叠对象
    const fold_data = MatchFold.match_mid_fold_obj.value
    // 赛事折叠信息
    const fold_key = MatchFold.get_match_fold_key(match)
    // 赛事是否显示
    const show_card = lodash.get(fold_data[fold_key], `show_card`)
    let special_height = 0
    if (PROJECT_NAME === 'app-h5') {
      if (UserCtr.standard_edition == 1) {
        if (show_card) {
          special_height += -34
          if (match.is_show_league) special_height += -22
        }
      } else {
        if (index === 0 && [1,3].includes(+menu_lv_v1)) special_height += 25
      }
    }
    return special_height
  }

  /**
   * @description 获取 赛事对象 key
   * @param {*} match 
   * @returns String
   */
  get_match_height_key (mid) {
    return `mid_height_${mid}`
  }

  /**
   * @description 清除折叠信息
   */
  clear_virtual_info () {
    this.mid_top_map = {}
    this.container_total_height.value = 0
    this.match_mid_map_height.value = {}
  }

  // 计算 容器 总高度
  compute_container_total_height1 () {
    this.match_height_map_list = MatchMeta.complete_matchs.map((match, i) => {
      let result = compute_style_template_by_match_height(match);
      this.mid_dom_height_dict[match.mid] = result;
      return result
    });
    // 计算每个赛事容器的高度，累加 = 总高度
    const total_height = this.match_height_map_list.reduce((total, map_obj) => {
      let p_total = 0;
      if (typeof total == "number") p_total = total;
      return p_total + this.get_match_dom_height_by_match_data(map_obj);
    }, 0);
    //页面容器 总高度
    this.container_total_height.value = total_height;
  }

  // 赛事卡片高度
  get_match_dom_height_by_match_data (match_height_map) {
    let r = 0;
    match_height_map && Object.keys(match_height_map).forEach((p_key) => {
      if (p_key != "" && p_key != "mid") {
        r += match_height_map[p_key];
      }
    });
    return r;
  }

  /** 更新 赛事列表 进程
   *  重新计算 每个容器 的 top 定位     核心算法可视区域头尾进行插入新数据操作
   *  调用  vuex 里面 set_match_top_map_dict 设置容器 定位 top 值 表征对象
   */
  compute_container_list_by_scroll_top( scroll_top ) {
    const menu_lv_v1 = MenuData.current_lv_1_menu_i
    const menu_lv_v2 = MenuData.current_lv_2_menu_i
    
    this.compute_container_total_height()

    let page_count = 18;
    // 新手版
    if (UserCtr.standard_edition == 1) {
      page_count = 20;
    } else if (menu_lv_v1 == 28) {
      //赛果虚拟赛狗|赛马 摩托车
      if ([1002, 1011, 1010, 1009].includes(menu_lv_v2)) {
        page_count = lodash.get(MatchMeta.complete_matchs, 'length')
      } else {
        page_count = 20;
      }
    }
    this.already_folded = 0
    this.mid_top_map = {}
    let match = null
    const buffer_height = 2
    let show_card = false
    let is_show_league = false
    let current_match_dom_top = 0, // 可视区域的赛事的top 值  18场
      match_list_length = this.match_height_map_list.length, // 当前列表数据的总数量  长度
      get_match_total = 0, // 当前页面的赛事数量
      start_rem = scroll_top - 234 * 5, // 顶部滚动距离减去  上面5个列表赛事  的距离
      current_screen_match = []; // 列表页可视区域 赛事的数据
    // 只有在列表页才有计算逻辑，节省性能
    if ( !["detail_match_list", "home_hot_page_schedule"].includes( PageSourceData.page_source) ) {
      // aaaaaaa. 虚拟滚动 真正的滑动 算法
      for (let i = 0; i < match_list_length; i++) {
        // 当前赛事
        match = MatchMeta.complete_matchs[i]
        
        is_show_league = match.is_show_league
        let h_map = this.match_height_map_list[i];
        const key = MatchFold.get_match_fold_key(match)
        show_card = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_card`)
        // 计算出 当前赛事的容器高度，以rem 计算
        let match_height = this.get_match_total_height(match, i)
        // let match_height = this.get_match_dom_height_by_match_data(h_map);
        // 当前赛事id 在整体列表页的高度位置， 大于滑动 的距离，就是可视区域的赛事了
        if (current_match_dom_top > start_rem) {
          // 数量小于 18 或者 20 时，执行下边 赋值操作，列表页每一个赛事的 translateY( ${top}rem) top 定位值
          if (get_match_total < page_count) {
            // 显示的 top 值，在 scroll_wrapper.vue 文件中引用
            this.mid_top_map[h_map.mid] = current_match_dom_top;
          } else {
            // 执行break，则立即退出 循环
            break;
          } 
          if (match && match_height > 0 && (is_show_league || show_card)) {
            // 列表页赛事的数据
            current_screen_match.push(match);
            get_match_total++; //赛事容器数量加1
          }
          // 如果当前折叠 并且 当前赛事 显示联赛，则 -1 操作
          if (!show_card && match.is_show_league) {
            if (this.already_folded <= 7) {
              get_match_total--; //赛事容器数量减1，相当于页面可视区域 总数量 page_count 加1个
            }
            this.already_folded++;
          }
        }
        current_match_dom_top += match_height
        // // 第一个显示球种
        // if (i === 0) current_match_dom_top += 17
        // // 显示开赛、未开赛
        // if ([1, 2].includes(+match.start_flag)) current_match_dom_top += 25
        // // 本来应该是 联赛高度 26 + 缓存容器高度 5 = 31； 
        // // 但是并不需要那么高的间隙（赛事之间的间隙， 取缓存容器的高度） 所以减去3； 赛事之间相叠避免漏光
        // if (is_show_league && show_card) {
        //   // 联赛合赛事均显示
        //   current_match_dom_top += (26 + 20 + 132 + 5 - buffer_height)
        // } else if (is_show_league && !show_card) {
        //   // 联赛显示卡片不显示
        //   current_match_dom_top += (26 + 5 - buffer_height)
        // } else if (!is_show_league && show_card) {
        //   // 联赛不显示卡片显示
        //   current_match_dom_top += 132
        // }
        
      }

      // 如果当前赛事折叠超过 8场赛事 并且 高度 大于5.5  走  虚拟滚动 真正的滑动 算法，和上边 aaaaaaa 逻辑一模一样
      // if (this.already_folded > 7 && this.container_total_height.value > 550) {
      //   current_match_dom_top = 0; // 可视区域的赛事的top 值  18场
      //   get_match_total = 0; // 当前页面的赛事数量
      //   this.mid_top_map = {}; // 对应的 赛事id 的  偏移 位置值
      //   let current_list_total_length = current_screen_match.length,
      //     current_list_total_height = 0,
      //     list_visible_areas_number = 25;
      //   // 计算出 当前可视区域赛事的容器总高度，以rem 计算
      //   for (let j = 0; j < current_list_total_length; j++) {
      //     let h_map = this.mid_dom_height_dict[current_screen_match[j].mid];
      //     // 计算出 当前赛事的容器高度，以rem 计算
      //     current_list_total_height += +this.get_match_dom_height_by_match_data(h_map);
      //   }
      //   let many_distances = px_2_rem(scroll_top) - (current_list_total_height / page_count) * 7; // 可视区域  每一场的平均高度 × 7
      //   current_screen_match = []; // 列表页可视区域 赛事的数据
      //   for (let i = 0; i < match_list_length; i++) {
      //     let h_map = this.match_height_map_list[i];
      //     let match_height = this.get_match_dom_height_by_match_data(h_map);
      //     if (current_match_dom_top > many_distances) {
      //       if (get_match_total < list_visible_areas_number) {
      //         this.mid_top_map[h_map.mid] = current_match_dom_top;
      //       } else {
      //         break;
      //       }
      //       const match = MatchMeta.complete_matchs[i]
      //       if (match && match_height > 0) {
      //         current_screen_match.push(match);
      //         get_match_total++; //赛事容器数量加1
      //       }
      //     }
      //     current_match_dom_top += match_height;
      //   }
      // }
      // H5 列表页显示的 可视区域的  数据源
      // MatchDataBaseH5.set_list(current_screen_match)
    } else {
      // H5 列表页显示的 可视区域的  数据源
      // MatchDataBaseH5.set_list(current_screen_match)
    }
    return { match_datas: current_screen_match }
  }
}

export default new VirtualList()