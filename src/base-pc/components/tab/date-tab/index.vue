<template>
  <div class="tab-wrap fit relative-position" ref="wrap" @mousedown="mousedown" :data-version="date_menu_version">
    <div class="item-wrap relative-position" ref="item_wrap" :style="{ left: item_wrap_left + 'px' }" :key="key">
      <!-- 所有日期  -->
      <template v-for="(item, index) in list" :key="item.menuName + '_' + index">
        <div class="tab-item yb-flex-center" :class="[{ active: final_index == index }]"
           @click.stop="handle_click_menu_mi_3_date({ ...item, index })"
          @mouseenter="tabs_enter(index)" @mouseleave="tabs_leave(index)">
          <!-- <img v-if="item.img_src" v-check-img="{src: val.img_src, default: `/image/common/activity_banner/gift_package.png`}" /> -->
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
import {   nextTick, ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import lodash from "lodash";
import { api_common } from "src/api/index.js";
import BaseData from "src/core/base-data/base-data.js";
import { UserCtr,MenuData } from 'src/core/index.js'

const props = defineProps({
  //item盒子左右padding
  padding: {
    type: Number,
    default: () => 15,
  },
  hasActivity: {
    type: Boolean,
    default: () => true,
  },
  is_drag: {
    type: Boolean,
    default: () => true,
  },
  line_width: {
    type: Number,
    default: () => null,
  },
})

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
const clientX = ref(null);
const last_left = ref(null)
let timer = null //定时器
let init_timer = null
const quanbu_item = ref({ count: "0", md: "", menuName: "" })
const wrap = ref(null) //获取组件实例
const item_wrap = ref(null) //获取组件实例
const is_mousedown = ref(false) //鼠标是否按下
const emit = defineEmits(['onclick'])
//获取 日期 菜单
get_date_menu_list();
// 显示部分dom ID
// this.DOM_ID_SHOW = window.BUILDIN_CONFIG.DOM_ID_SHOW;
// // 鼠标是否按下
// is_mousedown.value = false;
// 鼠标事件监听
if (props.is_drag) {
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);
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
  nextTick(() => {
    init()
  })
})

/**
* 获取 日期 菜单
* nu/getDateMenuList
*/
async function get_date_menu_list() {
  let params = compute_get_date_menu_list_params();
  let api_fn_name = ''
  if (MenuData.is_export()) {
    //电竞
    api_fn_name = "get_esports_date_menu"

  } else {
    api_fn_name = "post_date_menu"
  }
  let res = await api_common[api_fn_name](params);
  let data = res.data;
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
  const { left_menu_result, match_list_api_config = {} } = MenuData


  // 收藏返回还是当前数据
  if (left_menu_result.root == 3) {
    // 早盘获取选中的时间
    const { match_list = {} } = match_list_api_config
    md_info = (match_list.params || {}).md || ''
    index_info = (match_list.params || {}).index || 0
    final_index.value = index_info
  }
  handle_click_menu_mi_3_date({ md: md_info, index: index_info })
  console.log('match_list_api_config', match_list_api_config);
}
watch(MenuData.menu_data_version,()=>{
  nextTick(()=>{
    get_date_menu_list()
  })
})

/**
 * 计算 日期 接口 请求参数
 */
function compute_get_date_menu_list_params() {
  let params = {};
  let left_menu_result = MenuData.left_menu_result;
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
      cuid: UserCtr.get_uid(), //用户 id
      device: "PC",
      ...mi_info,
      euid: mi_euid.euid || euid, // lv2_mi 找到 euid
      md: final_date_menu.value.field1,
      selectionHour: null,
      sort: 1,
      tid,
    };
  }
  return params;
}

/**
 *  早盘 的 日期 菜单点击
 */
function handle_click_menu_mi_3_date (detail = {}) {
  let { md, index } = detail;
  final_index.value = index;
  let root = MenuData.menu_root;
  let guanjun = "";
  let sports = "common-date";
  let route = "list";
  let { lv2_mi, lv1_mi } = MenuData.left_menu_result
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
    cuid: UserCtr.get_uid(),
    selectionHour: null,
    sort: 1,
  }

  //设置当前的root
  // root = MenuData.menu_root
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
  MenuData.set_mid_menu_result(params);
  // 设置   请求  列表结构  API 参数的  值
  // MenuData.set_match_list_api_config(config);
}

/**
 * @Description:切换选项
 * @param {number} index 切换选项的索引
 * @return {undefined} undefined
 */
function onclick(index, item) {
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
function set_mid_menu_result() {
  //     请求  列表结构  API 参数的   模板
  let { config, description } =
    MenuData.get_match_list_api_config_tepmlate_and_description();
  let params = {};
  let left_menu_result = MenuData.left_menu_result;
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
      md: final_date_menu.value.field1,
      index: final_index.value, // 当前选中的时间 接口用不上 只是存储下一使用
    };
  }
  // 设置      中间 菜单输出
  MenuData.set_mid_menu_result(params);
  // 设置   请求  列表结构  API 参数的  值
  MenuData.get_match_list_api_config_tepmlate_and_description(config);
}

function hand_cilck_move(left) {
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
function tabs_enter (index) {
  tabs_hover(index, "in");
}

/**
 * @Description:鼠标移出选项
 * @param {number} index 移出选项的索引
 * @return {undefined} undefined
 */
function tabs_leave(index) {
  tabs_hover(index, "out");
}
/**
 * @Description:鼠标移入移出操作
 * @param {number} index 选项的索引
 * @param {string} type  类型 in 移入  out 移出
 * @return {undefined} undefined
 */
function tabs_hover(index, type) {
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
    if (lodash.get(sizes.value, `[${_index}]`)) {
      left.value = lodash.get(sizes.value, `${_index}.left`);
      width.value = lodash.get(sizes.value, `${_index}.width`);
    }
  }
  if (type == "out") {
    if (lodash.get(sizes.value, `[${final_index.value}]`)) {
      left.value = lodash.get(sizes.value, `${final_index.value}.left`);
      width.value = lodash.get(sizes.value, `${final_index.value}.width`);
    }
  }
  // 固定下划线宽度
  if (props.line_width) {
    left.value = left.value + (width.value - props.line_width) / 2;
    width.value = props.line_width;
  }
}
function init() {
  if (init_timer) {
    clearTimeout(init_timer);
  }
  init_timer = setTimeout(init_func, 300);
}
/**
 * @Description:初始化  设置选项初始宽高
 * @return {undefined} undefined
 */
function init_func() {
  let _wrap = wrap.value;
  let dom = lodash.get(item_wrap.value, "children", []);
  sizes.value = [];
  for (let i = 0; i < dom.length; i++) {
    let { offsetLeft = 0, clientWidth = 0 } = dom[i];
    sizes.value.push({
      left: offsetLeft + props.padding,
      width: clientWidth - props.padding * 2,
    });
  }
  if (sizes.value.length > 0) {
    let current_index = final_index.value == -1 ? 0 : final_index.value;
    left.value = lodash.get(sizes.value, `${current_index}.left`, 0);
    width.value = lodash.get(sizes.value, `${current_index}.width`, 0);
    item_wrap_width.value = _wrap.clientWidth;
    item_total_width.value =
      sizes.value[sizes.value.length - 1].left +
      sizes.value[sizes.value.length - 1].width;
  } else {
    width.value = 0;
  }
  // 固定下划线宽度
  if (props.line_width) {
    left.value = left.value + (width.value - props.line_width) / 2;
    width.value = props.line_width;
  }
}

/**
 * @Description:更新dom数据 解决选项数组改变  dom不更新
 * @return {undefined} undefined
 */
function update_tab_key() {
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
function mousedown(e) {
  clientX.value = e.clientX;
  last_left.value = item_wrap_left.value;
  is_mousedown.value = true;
}
/**
 * @Description 鼠标弹起
 * @param {undefined} undefined
 */
function mouseup() {
  is_mousedown.value = false;
}
/**
 * @Description 鼠标移动事件
 * @param {object} e 鼠标事件
 * @param {undefined} undefined
 */
function mousemove(e) {
  if (!is_mousedown.value || item_wrap_width.value > item_total_width.value) {
    return;
  }
  let left = last_left.value + (e.clientX - clientX.value);
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

// watch(BaseData.left_menu_result.version, () => {
//   init_process(1);
// })

//监听屏幕宽度改变  设置是否显示按钮
// watch(get_layout_list_size.width, () => {
//   item_wrap_width.value = BetCommonHelper.get_refs_info(
//     "wrap",
//     null,
//     this
//   ).clientWidth;
// })

//监听list长度发生改变
// watch(list.length, () => {
//   // 做异步处理防止data数据发生改变
//   nextTick(() => {
//     init()
//   })
// })

// //监听list长度发生改变
// watch(list[0], () => {
//   // 做异步处理防止data数据发生改变
//   nextTick(() => {
//     init()
//   })
// })

//监听选中改变
watch(final_index, (new_value) => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  };
  timer = setTimeout(() => {
    if (!sizes.value[new_value]) return
    left.value = lodash.get(sizes.value, `${new_value}.left`)
    width.value = lodash.get(sizes.value, `${new_value}.width`)
    // 固定下划线宽度
    if (props.line_width) {
      left.value = left.value + (width.value - props.line_width) / 2
      width.value = props.line_width
    }
  })
}, { immediate: true })

onBeforeUnmount(() => {
  // this.debounce_throttle_cancel(tabs_hover);
  if (timer) {
    clearTimeout(timer);
  }
  if (init_timer) {
    clearTimeout(init_timer)
  }
  // 鼠标事件取消监听
  if (props.is_drag) {
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
