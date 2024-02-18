
import { ref } from "vue";
import lodash_ from "lodash";

class FilterHeader {
  constructor() {
    this.init_core();
  }
  init_core() {
    //即将开赛筛选时间
    this.open_select_time = null;
    // 显隐联赛筛选弹层
    this.show_filter_popup = false;
    // 选择的筛选数据
    this.filter_select_obj = [];
    // 上次筛选信息
    this.pre_filter_select_obj = [];
    //联赛筛选是否全选
    this.filter_checked_all = true;
    this.pre_filter_checked_all = true;
    // 获取选中的赛事数量(列表右上角赛选功能)
    this.checked_count = 0;
    this.collect_count = 0; //收藏数量
    // 投注记录版本变更
    this.filter_header_version = ref("1111");
  }

  //保存显示搜索组件状态
  set_show_filter_popup(data) {
    console.log('datadata',data)
    this.show_filter_popup = data;
    this.set_filter_header_version();
  }

  //保存选择的筛选数据
  set_filter_select_obj(list) {
    this.checked_count = list.length;
    // 保存上一次的值
    this.pre_filter_select_obj = lodash_.cloneDeep(this.filter_select_obj);
    // 设置新值
    this.filter_select_obj = lodash_.cloneDeep(list);
    this.set_filter_header_version();
  }

  //清空筛选数据 设置全选
  set_remove_filter_condition() {
    this.filter_select_obj = [];
    this.filter_checked_all = true;
    this.pre_filter_checked_all = true;
    this.checked_count = 0;
    this.set_filter_header_version();
  }

  //设置联赛筛选全选状态
  set_filter_checked_all(state) {
    this.pre_filter_checked_all = this.filter_checked_all;
    this.filter_checked_all = state;
    this.set_filter_header_version();
  }

  // 清空上次筛选数据
  remove_pre_filter_select_obj() {
    this.pre_filter_select_obj = [];
    this.set_filter_header_version();
  }

  //保存赛事选中数量
  set_checked_count(count) {
    this.checked_count = count;
    this.set_filter_header_version();
  }

  //最近开赛
  set_checked_count(time) {
    this.set_open_select_time = time;
    this.set_filter_header_version();
  }

  // 更新投注记录版本
  set_filter_header_version() {
    this.filter_header_version.value = Date.now();
  }
}

export default new FilterHeader();
