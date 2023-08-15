<template>
  <div class="tab-wrap fit relative-position" ref="wrap" @mousedown="mousedown" :data-version="date_menu_version">
    <div class="item-wrap relative-position" ref="item_wrap" :style="{ left: item_wrap_left + 'px' }" :key="key">
      <!-- {{ list }} -->
      <!-- 所有日期  -->

      <template>
        <div v-for="(item, index) in list" class="tab-item yb-flex-center" :class="[{ active: final_index == index }]"
          :key="item.menuName + '_' + index" @click.stop="handle_click_menu_mi_3_date({ ...item, index })"
          @mouseenter="tabs_enter(index)" @mouseleave="tabs_leave(index)">
          <!-- <img v-if="item.img_src" v-check-img="{src: val.img_src, default: `${$g_image_preffix}/image/common/activity_banner/gift_package.png`}" /> -->

          <!--   电竞 不显示赛事数量  早盘常规体育显示-->
          <span class="match-count">{{
            item.menuName
          }}</span>
          <span class="match-count">({{ item.count }})</span>
          <!-- <template v-if="item.tab_name2">
          <br/>{{item.menuName}}
        </template > -->
        </div>
      </template>

      <template v-if="final_index !== -1 && width > 0">
        <div :class="['line-wrap', { pseudo: line_width }]">
          <div class="line" :style="{
            transform: 'translateX(' + left + 'px)',
            width: width + 'px',
          }">
          </div>
        </div>
      </template>
    </div>
    <!-- 左右按钮 -->
    <template>
      <div class="left-btn btn" v-show="left_btn_show && !is_drag" @click="item_wrap_left += 100">
        <div class="yb-icon-arrow"></div>
      </div>
      <div class="right-btn btn" v-show="right_btn_show && !is_drag" @click="item_wrap_left -= 100">
        <div class="yb-icon-arrow"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
// import {mapGetters,mapActions} from 'vuex'
// ...mapGetters([
//   'get_layout_list_size',
// ]),
// ...mapGetters({
//   // 赛事列表排序 1:按联赛排序 2:按时间排序
//   vx_match_sort: "get_match_sort",
//   // 获取用户 Id
//   vx_get_uid: "get_uid",
//   vx_cur_menu_type: "get_cur_menu_type", //选中菜单类型
//   get_layout_list_type: "get_layout_list_type",
//   //获取当前主题
//   get_theme: "get_theme",
//   // 列表显示内容  match:赛事 collect:收藏 search:搜索
//   vx_layout_list_type: "get_layout_list_type",
//   get_layout_list_size: "get_layout_list_size",
// }),


import { defineComponent, nextTick, ref, computed, defineEmits, watch, onMounted, onBeforeUnmount } from "vue";
import lodash from "lodash";
import menu_config from "src/core/menu-pc/menu-data-class.js";

//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper, useProps, useComputed } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({ ...useProps })
const tableClass_computed = useComputed.tableClass_computed(props)
const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

const list = ref([]) //tab模板文件key
const final_index = ref(0) //下划线left
const key = ref(0) //tab模板文件key
const left = ref(0) //下划线left
const width = ref(0) //下划线宽度
const date_menu_version = ref(1) //日期菜单数据版本
const final_date_menu = ref({}) //最终的选中的菜单数据
const sizes = ref([]) //下划线初始大小
const item_wrap_left = ref(0) //item包裹left
const item_wrap_width = ref(0) //item包裹宽度
const item_total_width = ref(0) //所有item的宽度
const timer = ref(null) //定时器
const quanbu_item = ref({ count: "0", md: "", menuName: "" })
const wrap = ref(null) //获取组件实例
const item_wrap = ref(null) //获取组件实例
const emit = defineEmits(['onclick'])
//获取 日期 菜单
get_date_menu_list();
// 显示部分dom ID
this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
// 鼠标是否按下
this.is_mousedown = false;
// 鼠标事件监听
if (props.is_drag) {
  document.addEventListener("mousemove", this.mousemove);
  document.addEventListener("mouseup", this.mouseup);
}

/**
 * @Description:左边按钮是否显示
 * @return {boolean}
 */
const left_btn_show = computed(() => {
  return item_wrap_left.value < 0;
})

/**
 * @Description:右边按钮是否显示
 * @return {boolean}
 */
const right_btn_show = computed(() => {
  let total_up = item_total_width.value > item_wrap_width.value
  let wrap_left_up = item_wrap_left.value > (item_wrap_width.value - item_total_width.value - 50)
  return total_up && wrap_left_up;
})

onMounted(() => {
  // 给 tabs 加上防抖
  tabs_hover = this.debounce(tabs_hover, 100)
  nextTick(() => {
    init()
  })
})

/**
* 获取 日期 菜单
* nu/getDateMenuList
*/
const get_date_menu_list = async () => {
  let params = compute_get_date_menu_list_params();
  let api_fn_name = ''
  if (menu_config.menu_root == 2000) {
    //电竞
    api_fn_name = "get_esports_date_menu"

  } else {
    api_fn_name = "post_date_menu"
  }
  let res = await api_common[api_fn_name](params);
  let { data = [] } = res.data;
  let arr = [];
  if (Array.isArray(data)) {
    data.map((x) => {
      arr.push({
        count: x.count,
        md: x.field1,
        menuName: x.menuName,
      });
    });
  }
  list.value = arr;
  date_menu_version.value = Date.now()

  let index_info = 0, md_info = ''
  const { left_menu_result, match_list_api_config = {} } = menu_config

  // 收藏返回还是当前数据
  if (left_menu_result.root == 3 && this.vx_layout_list_type == 'collect') {
    // 早盘获取选中的时间
    const { match_list = {} } = match_list_api_config
    md_info = (match_list.params || {}).md || ''
    index_info = (match_list.params || {}).index || 0
    final_index.value = index_info
  }
  handle_click_menu_mi_3_date({ md: md_info, index: index_info })
}

/**
 * 计算 日期 接口 请求参数
 */
const compute_get_date_menu_list_params = () => {
  let params = {};
  let left_menu_result = menu_config.left_menu_result;
  let {
    lv1_mi,
    lv2_mi,
    euid,
    tid = "",
  } = left_menu_result;
  if (lv1_mi == 2000) {
    //  早盘 或者 今日的  电竞
    let csid = parseInt(lv2_mi) - 2000;
    params = {
      csid,
      device: "PC_PRO",
    };
  } else {
    // 早盘 的 请求 euid 是 赛种  +3 对应的 euid 不是 玩法对应的
    let mi_euid = BaseData.mi_info_map[`mi_${lv1_mi}3`] || {};
    // orpt // pis
    let mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`] || {};
    if (lv1_mi == 118) {
      euid = '3020212'
    }
    // 早盘的 其他 常规赛种
    params = {
      apiType: 1,
      cuid: this.vx_get_uid, //用户 id
      device: "PC",
      ...mi_info,
      euid: mi_euid.euid || euid, // lv2_mi 找到 euid
      md: final_date_menu.value.field1,
      selectionHour: this.$store.state.filter.open_select_time,
      sort: this.vx_match_sort,
      tid,
    };
  }
  return params;
}

/**
 *  早盘 的 日期 菜单点击
 */
const handle_click_menu_mi_3_date = (detail = {}) => {
  let { md, index } = detail;
  final_index.value = index;
  let root = menu_config.menu_root;
  let guanjun = "";
  let sports = "common-date";
  let route = "list";
  let { lv2_mi, lv1_mi } = menu_config.left_menu_result
  // 当前 pid 和 orpt
  let lv2_mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`];
  // 父级euid
  let euid;
  if (root != 2000) {
    // 娱乐
    if (lv1_mi == 118) {
      euid = '3020212' || BaseData.mi_info_map[`mi_${lv2_mi}`].euid;
    } else {
      euid = BaseData.mi_info_map[`mi_${lv1_mi}${root}`].euid
    }
  }
  let params = { ...lv2_mi_info, lv2_mi, md, euid };
  // 是否收藏
  let is_collect = false;
  // 列表队列 接口
  let match_list = {
    api_name: "api 方法名字   api_match 的 子方法名字",
    params: {},
  };
  // bymids 接口  基本参数
  let bymids = {
    api_name: "api 方法名字   api_match 的 子方法名字",
    params: {},
  };

  let base_params = {
    cuid: this.vx_get_uid,
    selectionHour: this.$store.state.filter.open_select_time,
    sort: this.vx_match_sort,
  }

  //设置当前的root
  // root = menu_config.menu_root
  // euid  早盘今日  玩法级别 传参 传 euid 为 父级的
  // 今日 早盘
  let api_name = 'post_league_list'
  if ([1, 2, 3].includes(Number(root))) {
    if (lv1_mi == 118) {
      euid = '3020212'
    }
    base_params = {
      apiType: 1,
      orpt: -1,
      ...base_params,
      ...params,
      md,
    }
  }
  if (root == 2000) {
    api_name = 'post_fetch_esports_matchs'
    base_params = {
      tid: "",
      ...base_params,
      ...params,
      category: 1,
      csid: ('' + lv2_mi).substring(1),
      md
    }
    // 电竞 日期冠军 
    if (md == 100) {
      base_params.category = 1
      base_params.md = ''
    }
  }
  match_list = {
    api_name,
    params: {
      ...base_params,
      index: final_index.value, // 当前选中的时间 接口用不上 只是存储下一使用
    },
  };
  let config = {
    begin_request: true,
    is_collect,
    route,
    root,
    sports,
    guanjun,
    match_list,
    bymids,
  };
  // 设置      中间 菜单输出
  menu_config.set_mid_menu_result(params);
  // 设置   请求  列表结构  API 参数的  值
  menu_config.set_match_list_api_config(config);
}

/**
 * @Description:切换选项
 * @param {number} index 切换选项的索引
 * @return {undefined} undefined
 */
const onclick = (index, item) => {
  let num = index - final_index.value;
  if (!num) return;
  if (final_index.value > index) {
    if (left_btn_show.value) {
      hand_cilck_move(80 + item_wrap_left.value);
    }
  } else {
    if (right_btn_show.value) {
      hand_cilck_move(-50 + item_wrap_left.value);
    }
  }

  final_date_menu.value = item;
  set_mid_menu_result();
}

/**
 * 设置 中间菜单的输出
 */
const set_mid_menu_result = () => {
  //     请求  列表结构  API 参数的   模板
  let { config, description } =
    menu_config.get_match_list_api_config_tepmlate_and_description();
  let params = {};
  let left_menu_result = menu_config.left_menu_result;
  let { lv1_mi, lv2_mi, euid } = left_menu_result;
  if (lv1_mi == 2000) {
    //  早盘 或者 今日的  电竞
    let csid = parseInt(lv2_mi) - 2000;
    //电竞
    params = {
      mi: lv2_mi,
      csid,
    };
  } else {
    // 早盘的 其他 常规赛种
    params = {
      mi: lv2_mi,
      euid: euid, // lv2_mi 找到 euid
      md: this.final_date_menu.field1,
      index: final_index.value, // 当前选中的时间 接口用不上 只是存储下一使用
    };
  }
  // 设置      中间 菜单输出
  menu_config.set_mid_menu_result(params);
  // 设置   请求  列表结构  API 参数的  值
  menu_config.get_match_list_api_config_tepmlate_and_description(config);
}

const hand_cilck_move = (left) => {
  if (!props.is_drag) return;
  let max_left = 0 - (item_total_width.value - item_wrap_width.value + 50);
  if (left >= 0) {
    left = 0;
  } else if (left < max_left) {
    left = max_left;
  }
  item_wrap_left.value = left;
}

/**
 * @Description:鼠标移入选项
 * @param {number} index 移入选项的索引
 * @return {undefined} undefined
 */
const tabs_enter = (index) => {
  tabs_hover(index, "in");
}

/**
 * @Description:鼠标移出选项
 * @param {number} index 移出选项的索引
 * @return {undefined} undefined
 */
const tabs_leave = (index) => {
  tabs_hover(index, "out");
}
/**
 * @Description:鼠标移入移出操作
 * @param {number} index 选项的索引
 * @param {string} type  类型 in 移入  out 移出
 * @return {undefined} undefined
 */
const tabs_hover = (index, type) => {
  // 顶部导航栏的任务中心不展示下划线
  let _index;
  let last_tabitem = list.value[index];
  let activity = props.hasActivity;
  // 如果当前有活动并且当前 index 是最后一个并且当前对象有 path 属性以及 path 值是活动路径，就不展示下划线
  if (
    activity &&
    index == sizes.value.length - 1 &&
    last_tabitem.path &&
    last_tabitem.path.indexOf("/activity") != -1
  ) {
    _index = final_index.value;
  } else {
    _index = index;
  }
  if (type == "in") {
    if (_.get(sizes.value, `[${_index}]`)) {
      left.value = _.get(sizes.value, `${_index}.left`);
      width.value = _.get(sizes.value, `${_index}.width`);
    }
  }
  if (type == "out") {
    if (_.get(sizes.value, `[${final_index.value}]`)) {
      left.value = _.get(sizes.value, `${final_index.value}.left`);
      width.value = _.get(sizes.value, `${final_index.value}.width`);
    }
  }
  // 固定下划线宽度
  if (this.line_width) {
    left.value = left.value + (width.value - this.line_width) / 2;
    width.value = this.line_width;
  }
}
const init = () => {
  if (this.init_timer) {
    clearTimeout(this.init_timer);
  }
  this.init_timer = setTimeout(this.init_func, 300);
}
/**
 * @Description:初始化  设置选项初始宽高
 * @return {undefined} undefined
 */
const init_func = () => {
  let _wrap = _wrap.value;
  let dom = _.get(item_wrap.value, "children", []);
  sizes.value = [];
  for (let i = 0; i < dom.length; i++) {
    let { offsetLeft = 0, clientWidth = 0 } = dom[i];
    sizes.value.push({
      left: offsetLeft + this.padding,
      width: clientWidth - this.padding * 2,
    });
  }
  if (sizes.value.length > 0) {
    let current_index = final_index.value == -1 ? 0 : final_index.value;
    left.value = _.get(sizes.value, `${current_index}.left`, 0);
    width.value = _.get(sizes.value, `${current_index}.width`, 0);
    item_wrap_width.value = _wrap.clientWidth;
    item_total_width.value =
      sizes.value[sizes.value.length - 1].left +
      sizes.value[sizes.value.length - 1].width;
  } else {
    width.value = 0;
  }
  // 固定下划线宽度
  if (this.line_width) {
    left.value = left.value + (width.value - this.line_width) / 2;
    width.value = this.line_width;
  }
}

/**
 * @Description:更新dom数据 解决选项数组改变  dom不更新
 * @return {undefined} undefined
 */
const update_tab_key = () => {
  key.value = key.value++;
  nextTick(() => {
    init();
  });
}
/**
 * @Description 鼠标按下
 * @param {object} e 鼠标事件
 * @param {undefined} undefined
 */
const mousedown = (e) => {
  this.clientX = e.clientX;
  this.last_left = item_wrap_left.value;
  this.is_mousedown = true;
}
/**
 * @Description 鼠标弹起
 * @param {undefined} undefined
 */
const mouseup = () => {
  this.is_mousedown = false;
}
/**
 * @Description 鼠标移动事件
 * @param {object} e 鼠标事件
 * @param {undefined} undefined
 */
const mousemove = (e) => {
  if (!this.is_mousedown || item_wrap_width.value > item_total_width.value) {
    return;
  }
  let left = this.last_left + (e.clientX - this.clientX);
  if (left > 0) {
    left = 0;
  }
  // 最大偏移量
  let max_left = 0 - (item_total_width.value - item_wrap_width.value + 50);
  if (left < max_left) {
    left = max_left;
  }
  item_wrap_left.value = left;
}

watch(BaseData.left_menu_result.version, () => {
  init_process(1);
})

//监听屏幕宽度改变  设置是否显示按钮
watch(get_layout_list_size.width, () => {
  item_wrap_width.value = this.yabo_common.get_refs_info(
    "wrap",
    null,
    this
  ).clientWidth;
})

//监听list长度发生改变
watch(list.length, () => {
  // 做异步处理防止data数据发生改变
  nextTick(() => {
    init()
  })
})

//监听list长度发生改变
watch(list[0], () => {
  // 做异步处理防止data数据发生改变
  nextTick(() => {
    init()
  })
})

//监听选中改变
watch(currentIndex, () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  };
  timer.value = setTimeout(() => {
    if (!sizes.value[this.currentIndex]) return
    left.value = _.get(sizes.value, `${this.currentIndex}.left`)
    width.value = _.get(sizes.value, `${this.currentIndex}.width`)
    // 固定下划线宽度
    if (this.line_width) {
      left.value = left.value + (width.value - this.line_width) / 2
      width.value = this.line_width
    }
  })
}, { immediate: true })

onBeforeUnmount(() => {
  this.debounce_throttle_cancel(tabs_hover);
  if (timer.value) {
    clearTimeout(timer.value);
  }
  if (this.init_timer) {
    clearTimeout(this.init_timer)
  }
  // 鼠标事件取消监听
  if (this.is_drag) {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
  }
})

</script>

<style lang="scss" scoped>
.tab-wrap {
  overflow: hidden;

  .item-wrap {
    position: absolute;
    top: 0;
    width: 1000px;
    display: flex;
    height: 100%;
    z-index: 99;
    align-items: center;

    .tab-item {
      cursor: pointer;
      padding: 0 15px;
      text-align: center;
      flex-shrink: 0;
      height: 24px;
      line-height: 24px;
      border-radius: 15px;

      &.active {
        font-weight: 600;
        line-height: 24px;
        border: none !important;
      }

      .match-count {
        opacity: 0.7;
      }
    }

    .line-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 3px;

      .line {
        position: relative;
        width: 30px;
        height: 100%;
        transition: all 0.3s;
        z-index: 10;
      }

      &.pseudo {
        .line {

          &::before,
          &::after {
            display: none;
          }
        }
      }

    }


  }

  /** 左右切换按钮 -S*/
  .btn {
    height: 100%;
    position: absolute;
    top: 0;
    width: 38px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .left-btn {
    left: 0;
    transform: rotate(180deg);
  }

  .right-btn {
    right: 0;
  }

  /** 左右切换按钮 -E*/
}

.leagues-bg {
  .tab-wrap {
    .item-wrap {
      .line-wrap {
        bottom: 4px !important;
      }
    }
  }
}
</style>
