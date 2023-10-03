import { ref } from "vue";
import lodash_ from "lodash";

class UseGlobal {
  constructor() {}
  init() {
    // 当前网站是否处于后台运行中
    this.vue_hidden_run = false;

    // 赛事列表排序 1:按联赛排序 2:按时间排序
    this.match_sort = 1;

    //全局点击事件数
    this.global_click = 0;
    //catch错误数据
    this.error_data = "";
    // 是否为非常规菜单选择（搜索关键词点击）
    this.menu_special_choose = false;
    this.is_show_banner = false; // 是否显示banner
    this.is_roll_show_banner = false; // 滚动时是否显示banner
    this.is_first_introduce_write = false; // 是否完成引导页
    this.is_unfold_multi_column = false; //是否展开多列玩法
    //列表滚动数据
    this.retain_scroll_obj = {
      status: false,
      height: 0,
    };
    //全局开关
    this.global_switch = {
      //热门推荐
      hot_recommend: true,
      //统计
      statistics_switch: true,
      //收藏
      collect_switch: true,
      //近期
      recent_switch: true,
      //活动
      activity_switch: true,
      //搜索
      search_switch: true,
      //联赛筛选
      filter_switch: true,
      //盘口数量
      handicap_num: true,
      //热门赛事
      hot_match_num: true,
      //排序
      sort_cut: true,
      //滚球全部
      play_all_show: true,
      //多列
      multi_column: true,
    };
    //视频是否展开状态
    this.is_fold_status = true;
    this.champion_fold_obj = {};
    // 投注记录版本变更
    this.bet_record_version = ref("1111");
  }
}

export default new UseGlobal();
