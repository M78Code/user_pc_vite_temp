import { reactive, ref } from "vue";
import lodash from "lodash"

// 全局toast默认值
const defaultGlobalToastTxt = 'Replicating Success'
// 全局toast定时器
let globalToastTimer = null;
class UseGlobal {
  constructor() {}
  init() {
    // 当前网站是否处于后台运行中
    this.vue_hidden_run = false;

    // 赛事列表排序 1:按联赛排序 2:按时间排序
    this.match_sort = 1;
    // 全局toast
    this.tip_show_state = { 
      isShow: false,
      text: defaultGlobalToastTxt
    };

    //全局点击事件数
    this.global_click = 0;
    //catch错误数据
    this.error_data = "";
    // 是否为非常规菜单选择（搜索关键词点击）
    this.menu_special_choose = false;
    this.is_show_banner = false; // 是否显示banner
    this.is_roll_show_banner = false; // 滚动时是否显示banner
    this.is_first_introduce_write = false; // 是否完成引导页
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
    // 全局开关变更
    this.global_switch_version =ref('22222');
    //近期开赛
    this.kick_off_time = localStorage.getItem('kick_off_time')?JSON.parse (localStorage.getItem('kick_off_time')) :'';
    // 附加盘开关
    this.show_additional_disk = localStorage.getItem('additional_disk')?JSON.parse (localStorage.getItem('additional_disk')) : true;
    // 附加玩法开关
    this.show_additional_plays = localStorage.getItem('additional_plays')?JSON.parse (localStorage.getItem('additional_plays')) :true;
    // 附加玩法配置展示行数
    this.additional_plays_list_num = localStorage.getItem('additional_plays_num') || 11;
    // 附加玩法配置展示更多行数
    this.show_more_other_list_obj = {};
  }
  /**
   * @description: 设置全局点击事件
   * @param {} 
   * @return {*}
   */
  set_global_click(){
    this.global_click++;
    this.set_global_data_version()
  }
  set_tip_show_state(bool = false, o){
    const {
      text = defaultGlobalToastTxt,
      timer = 3000
    } = o || {}
    if(globalToastTimer){
      // 存在 先清除 然后给默认值
      clearTimeout(globalToastTimer)
      globalToastTimer = null
      this.tip_show_state = {
        isShow: false,
        text: defaultGlobalToastTxt
      };
    }
    // 设置打开toast
    this.tip_show_state = {
      isShow: bool,
      text: text
    };
    this.set_global_data_version()
    // 设置倒计时关闭
    globalToastTimer = setTimeout(() => {
      this.tip_show_state = {
        isShow: false,
        text: defaultGlobalToastTxt
      };
      this.set_global_data_version()
    }, timer);
  }

  // 设置全局开关版本变更
  set_global_data_version = lodash.debounce(()=>{
    this.global_switch_version.value = Date.now()
    // console.error('set_global_data_version')
  },10)
  
  // 获取当前排序
  get_match_sort() {
    return this.match_sort
  }

  //获取 滚球 全部
  get_play_all_show() {
    return this.play_all_show
  }
  /**
   * @description: 设置catch错误数据
   * @param {*} data
   * @return {*}
   */
  set_error_data(data){
    if (data == "delete") {
    this.error_data = "";
    } else {
      data.error = data.error || "";
      let error = data.error.toString();
      if (error == "[object Object]") {
        error = JSON.stringify(data.error);
      }
    this.error_data += "\n" + data.site + "\n" + error;
    }
    this.set_global_data_version()
  }
  /**
  * @description: 设置视频是否展开状态
  * @param {*} status
  * @return {*}
  */
   set_is_fold_status( status) {
     this.is_fold_status = status;
     this.set_global_data_version()  
   }
   /**
    * @description: 获取视频是否展开状态
    * @param {*} state
    * @return {*}
    */
   get_is_fold_status(state) {
    return this.is_fold_status;
  }
    //设置即将开赛时间
    set_kick_off_time(val) {
      this.kick_off_time = val;
      this.set_global_data_version()  
    }
    //设置附加盘开关
    set_show_additional_disk(val) {
      this.show_additional_disk = val;
      this.set_global_data_version()  
    }
    //设置附加玩法开关
    set_show_additional_plays(val) {
      this.show_additional_plays = val;
      this.set_global_data_version()  
    }
    //设置附加玩法配置展示行数
    set_additional_plays_list_num(val) {
      this.additional_plays_list_num = val;
      this.set_global_data_version()  
    }
  //是否展开多列玩法
  set_unfold_multi_column(status) {
    this.is_unfold_multi_column = status;
    this.set_global_data_version()  
  }
//列表附加玩法是否展开状态
set_show_more_other_list(obj) {
  if (obj.reset) {
    this.show_more_other_list_obj = {}
  }else{
    this.show_more_other_list_obj[obj.mid] = {...this.show_more_other_list_obj[obj.mid],...obj}
  }
  this.set_global_data_version()  
}
}

export default new UseGlobal();
