

/**
 * @description 赛事 虚拟列表 类
 */

import { ref } from 'vue'
import MatchFold from 'src/core/match-fold'
import { utils } from "src/core/index.js";
import MenuData from "src/core/menu-app-h5/menu-data-class.js"
import PageSourceData from "src/core/page-source/page-source.js";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { compute_style_template_by_match_height } from '../match-card/module/compute-style-template.js'

class VirtualList {
  constructor () {
    // 开始下标
    this.start_index = 0
    // 结束下标
    this.end_index = 15
    // 赛事 mid 高度 映射 对象
    this.match_mid_map_height = ref({})
    this.match_height_map_list = []
    this.already_folded = 0;
    this.container_total_height = 0;
    // 赛事与dom高度的映射
    this.mid_top_map = {};
    this.mid_dom_height_dict = {};
    this.prev_scroll = 0
  }
  /**
   * @description 设置 赛事 mid 虚拟高度 映射
   * @param { match } 赛事对象
   * @param { height } 赛事初始化高度，初始只展示 联赛标题 40
   * @remarks
   *  1: 初始化时，赋值虚拟高度即 默认高度 40 
   *  2：赛事折叠/展开/次要玩法展开/次要玩法收起 均需更新对应赛事 高度（即真实高度）
   */
  set_match_mid_map_base_info (mid, info = { height: 40, top: 0, bottom: 0 }) {
    const key = this.get_match_height_key(mid)
    const { height, top, bottom } = info
    Object.assign(this.match_mid_map_height.value, {
      [key]: {
        top: top,
        bottom: bottom,
        height: height,
      }
    })
    // console.log(this.match_mid_map_height.value)
  }
  /**
   * @description 校正元素位置大小信息
   */
    check_match_base_info () {
      const nodes = document.querySelectorAll('.scroll-i-con > .s-w-item')
      nodes.forEach(node => {
        const mid = lodash.get(node, 'dataset.mid')
        const match_rect = node.getBoundingClientRect()
        this.set_match_mid_map_base_info(mid, match_rect)
      })
    }

  /**
   * @description 计算渲染的数据
   * @param {*} scrollTop 滑动的距离
   * @returns 
   */
  compute_page_render_list (scrollTop = 0) {
    this.check_match_base_info()
    // 可视区高度
    const view_height = window.innerHeight - 48 - 44 - 59 - 13
    let result = 0
    let end_index = 0
    let scroll_height = 1
    let start_index = Math.ceil(scrollTop / 31)
    const arr = []
    // 折叠对象
    const fold_data = MatchFold.match_mid_fold_obj.value
    // 高度映射 对象
    const source_data = this.match_mid_map_height.value
    MatchMeta.complete_matchs.some((match, index) => {
      const { mid, is_show_league } = match
      const fold_key = MatchFold.get_match_fold_key(match)
      const fold_info = fold_data[fold_key]
      const virtual_key = this.get_match_height_key(mid)
      const height = lodash.get(source_data[virtual_key], 'height', 0)
      
      if (scrollTop > 0) scroll_height += height
      if (scroll_height >= scrollTop) {
        if (!fold_info.show_card) {
          if (is_show_league) {
            result += +height
            arr.push(match)
          }
        } else {
          result += +height
          arr.push(match)
        }
        if (result > view_height + 100) {
          end_index = index
          this.end_index = index
          // 退出循环
          return true
        }
      }
      
    })
    console.log(start_index, end_index)
    return { 
      arr, 
      start_index, 
      end_index 
    }
  }

  /**
   * @description 获取 赛事对象 key
   * @param {*} match 
   * @returns String
   */
  get_match_height_key (mid) {
    return `mid_height_${mid}`
  }

  // 计算 容器 总高度
  compute_container_total_height () {
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
    this.container_total_height = total_height;
  }

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
   run_process_when_need_recompute_container_list_step_three_recompute_next_list_container_top_obj( scroll_top ) {
    this.compute_container_total_height()
     // 菜单 ID 对应的 元数据赛事 mids
     const menu_lv_v1 = MenuData.current_lv_1_menu_mi.value
     const menu_lv_v2 = MenuData.current_lv_2_menu_mi
    // 冠军  或者  电竞冠军 或者   赛果虚拟体育  ，赋值全部数据， 不走下边计算逻辑
    if ([100, 300].includes(menu_lv_v1) || (menu_lv_v1 == 28 && [1001, 1002, 1004, 1011, 1010, 1009, 100].includes(menu_lv_v2)) ) {
      // return MatchDataBaseH5.set_list(MatchMeta.complete_matchs, false);
    }

    let page_count = 18;
    // 新手版
    if (PageSourceData.newer_standard_edition == 1) {
      page_count = 20;
    }
    //赛果虚拟赛狗|赛马 摩托车
    if (menu_lv_v1 == 28) {
      if ([1002, 1011, 1010, 1009].includes(menu_lv_v2)) {
        page_count = lodash.get(MatchMeta.complete_matchs, 'length')
      } else {
        page_count = 20;
      }
    }
    let match = null
    let show_card = false
    let is_show_league = false
    let current_match_dom_top = 0, // 可视区域的赛事的top 值  18场
      match_list_length = this.match_height_map_list.length, // 当前列表数据的总数量  长度
      get_match_total = 0, // 当前页面的赛事数量
      start_rem = utils.px_2_rem(scroll_top) - 2.34 * 5, // 顶部滚动距离减去  上面5个列表赛事  的距离
      current_screen_match = []; // 列表页可视区域 赛事的数据
    // 只有在列表页才有计算逻辑，节省性能
    if ( !["detail_match_list", "home_hot_page_schedule"].includes( PageSourceData.page_source) ) {
      // aaaaaaa. 虚拟滚动 真正的滑动 算法
      for (let i = 0; i < match_list_length; i++) {
        let h_map = this.match_height_map_list[i];
        // 计算出 当前赛事的容器高度，以rem 计算
        let match_height = this.get_match_dom_height_by_match_data(h_map);
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
          // 当前赛事
          match = MatchMeta.complete_matchs[i]
          const key = MatchFold.get_match_fold_key(match)
          is_show_league = match.is_show_league
          show_card = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_card`)
          if (match && match_height > 0 && (is_show_league || !show_card)) {
            // 列表页赛事的数据
            current_screen_match.push(match);
            get_match_total++; //赛事容器数量加1
          }
          // 获取赛事对应的dom显示区域属性
          let dom_show_obj = compute_style_template_by_match_height(match);
          // 如果当前折叠 并且 当前赛事 显示联赛，则 -1 操作
          if (dom_show_obj.is_collapse && dom_show_obj.is_show_league) {
            if (this.already_folded <= 7) {
              get_match_total--; //赛事容器数量减1，相当于页面可视区域 总数量 page_count 加1个
            }
            this.already_folded++;
          }
        }
        if (i === 0) current_match_dom_top += 0.25
        if (is_show_league || !show_card) current_match_dom_top += !show_card ? match_height : 0.31;
        
        
        // if (!is_show_league && !show_card) {
        //   const prev_match = MatchMeta.complete_matchs[i - 1]
        //   if (prev_match && prev_match.is_show_league && prev_match.tid === match.tid) {
        //     current_match_dom_top += 0.05
        //   }
        // }
      }

      // 如果当前赛事折叠超过 8场赛事 并且 高度 大于5.5  走  虚拟滚动 真正的滑动 算法，和上边 aaaaaaa 逻辑一模一样
      if (this.already_folded > 7 && this.container_total_height > 550) {
        current_match_dom_top = 0; // 可视区域的赛事的top 值  18场
        get_match_total = 0; // 当前页面的赛事数量
        this.mid_top_map = {}; // 对应的 赛事id 的  偏移 位置值
        let current_list_total_length = current_screen_match.length,
          current_list_total_height = 0,
          list_visible_areas_number = 25;
        // 计算出 当前可视区域赛事的容器总高度，以rem 计算
        for (let j = 0; j < current_list_total_length; j++) {
          let h_map = this.mid_dom_height_dict[current_screen_match[j].mid];
          // 计算出 当前赛事的容器高度，以rem 计算
          current_list_total_height += +this.get_match_dom_height_by_match_data(h_map);
        }
        let many_distances = utils.px_2_rem(scroll_top) - (current_list_total_height / page_count) * 7; // 可视区域  每一场的平均高度 × 7
        current_screen_match = []; // 列表页可视区域 赛事的数据
        for (let i = 0; i < match_list_length; i++) {
          let h_map = this.match_height_map_list[i];
          let match_height = this.get_match_dom_height_by_match_data(h_map);
          if (current_match_dom_top > many_distances) {
            if (get_match_total < list_visible_areas_number) {
              this.mid_top_map[h_map.mid] = current_match_dom_top;
            } else {
              break;
            }
            const match = MatchMeta.complete_matchs[i]
            if (match && match_height > 0) {
              current_screen_match.push(match);
              get_match_total++; //赛事容器数量加1
            }
          }
          current_match_dom_top += match_height;
        }
      }
      // H5 列表页显示的 可视区域的  数据源
      // MatchDataBaseH5.set_list(current_screen_match)
    } else {
      // H5 列表页显示的 可视区域的  数据源
      // MatchDataBaseH5.set_list(current_screen_match)
    }
    console.log(current_screen_match)
    return { arr: current_screen_match }
  }
}

export default new VirtualList()