<template>
  <div class="menu  match-main-menu" :style="{ 'z-index': 501 }">
    <div class="menu-inner-wrap">
      <!--  电竞背景图片  -->
      <div class="m-i-background" v-if="is_esports" :style="compute_css_obj('menu-bg-' + dj_back_type)"></div>
      <div class="main-wrap flex" :class="{ is_esports }">
        <!--  返回按鈕  -->
        <slot name="menu-left" >
          <div class="goback-icon-wrapper  column justify-center" @click="handle_go_back">
            <div class="img" :style="compute_css_obj('menu-go-back-icon')"></div>
          </div>
        </slot>
        <div class="main-menu-container" :class="{ is_esports }">
          <template v-for="(item, index) in menu_list" :key="lodash.get(item, 'mi')">
            <div class="m-menu-item" :class="{ current: lodash.get(item, 'mi') == menu_type, esport: is_esports }"
              v-show="show_dianjing(item, index)">
              <span class="i-title" @click="set_menu_lv1(item, index)">
                {{ i18n_t("new_menu." + lodash.get(item, 'mi')) || lodash.get(item, 'mi') }}
              </span>
              <div class="m-menu-count">
                <span class="count" :style="{ visibility: show_favorite_list }"
                  :class="{ is_unit: MenuData.count_menu(item) < 10 && index == 1, esport: is_esports }">
                  <!-- show_favorite_list || main_m.menuId==408 ||
                    3000 == main_m.menuType ? 'hidden' : 'visible'
                     -->
                  {{ MenuData.count_menu(item) }}
                </span><!---->
                <i v-if="index == 1" @click="show_selector_sub = !show_selector_sub" class="dir-triangle"
                  :class="{ open: show_selector_sub, arrow_esport: is_esports || UserCtr.theme == 'night' }">
                </i>
              </div>

            </div>
          </template>
          <!-- 右侧活动和弹出设置 -->

        </div>
        <slot name="menu-right">
        </slot>
      </div>
      <!--二级菜单, 三级菜单，上下滑动 隐藏显示 , 竞彩足球 (get_menu_type:30 不显示二级菜单) -->
      <div class="sub-menu-date-w" v-if="!is_jinzu" :class="{
        simple: menu_wrap_simple && !is_esports,
        zaopan: is_mix || is_kemp || is_results || is_esports,
        esport: is_esports,
      }">
        <!-- 二级菜单, 三级菜单, 四级菜单  -->
        <div class="sport-m-container" :class="{
          simple: sport_container_simple && !is_esports,
          'shadow-down': !is_esports,
        }">
          <div class="s-menu-container flex" ref="sub_menu_scroller">
            <!--二级菜单 除了‘全部’按钮的其他所有 二级菜单  二级菜单 滚球下边的一个按钮   "全部"按钮  -->
            <sub-menu-specially v-show="is_scroll_ball" :title="i18n_t('footer_menu.all')"
              @click="select_all_sub_menu_handle" :count="all_sport_count_calc"
              v-if="GlobalAccessConfig.get_playAllShow()">
              <span class="sport-icon-wrap" :style="compute_css_obj(
                !(current_lv2?.mi) ?
                  'menu-sport-active-image' : 'menu-sport-icon-image'
                , 0
              )
                "></span>
            </sub-menu-specially>
            <template v-for="( item, index ) in  current_menu " :key="lodash.get(item, 'mi')">
              <div class="sport-menu-item flex justify-center" v-show="!is_esports && !is_results ? item.ct > 0 : true"
                @click="set_menu_lv2(item, index)">
                <div class="inner-w flex justify-between items-center" :class="{
                  favorite: show_favorite_list,
                  current: current_lv2?.mi == item.mi
                }
                  ">
                  <div class="sport-w-icon">
                    <span class="sport-icon-wrap"
                      :style="compute_css_obj(current_lv2?.mi == item.mi ? 'menu-sport-active-image' : 'menu-sport-icon-image', format_type(item))"></span>
                    <!-- :data-type="format_menu_type(sub)" -->
                    <!-- :class="[get_sport_icon(selected_sub_menu_i_list.includes(sub_i)), `${'s' + format_type(sub)}`]" -->

                    <div class="sport-match-count" v-show="two_menu_show(item)">
                      {{ show_favorite_list ? '' : item.ct ? item.ct : 0 }}
                    </div>
                  </div>
                  <div class="s-w-i-title" :class="{
                    esport: is_esports,
                    'din-regular': is_esports
                  }
                    ">
                    {{ item.name || MenuData.get_menus_i18n_map(item?.mi) }}
                  </div>
                </div>

              </div>
            </template>
          </div>
          <!-- 三级菜单 日期 (只有 串关，早盘，赛果，电竞，才有) -->
          <div class="d-c-wrapper" :class="{ esport: is_esports }" v-if="is_show_three_menu">
            <div class="date-container" ref="date_menu_container" :class="{ esport: is_esports }">
              <div class="date-menu-item" v-for="( date_menu_item, date_index ) of  date_menu_list " :key="date_index"
                :class="{
                  focus: date_menu_curr_i === date_index,
                  'is-favorite': show_favorite_list,
                  'hidden-champion':
                    show_favorite_list &&
                    is_esports &&
                    date_menu_item.menuId == '-999',
                }
                  " @click="set_menu_lv3(date_menu_item, date_index, 'date_click')">
                <div>
                  <!-- 串关不显示日期菜单后面的数量 -->
                  {{ date_menu_item.menuName }}
                  <span v-if="!show_favorite_list &&
                    date_menu_item.count && !is_kemp && !is_results

                    ">
                    &nbsp;({{ date_menu_item.count }})
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!--四级菜单 虚拟体育赛果才有的 联赛tab-->
          <div class="virtual-sports-results" v-if="is_show_four_menu">
            <div class="tab-item" v-for="( tab_item, i ) of  virtual_sports_results_tab " :key="i"
              @click="set_menu_lv4(tab_item, i)">
              {{ tab_item.name }}
            </div>
          </div>
        </div>
      </div>
      <!--主菜单里边---中间下拉弹框-->
      <div v-show="show_selector_sub" class="main-m-selector-w" @click="show_selector_sub = false" :class="{
        'effct-in': show_selector_sub,
      }
        ">
        <!--  中间下拉弹框内容=》 -->
        <div class="selector-w-inner flex wrap justify-left hairline-border show" :class="{
          favorite: show_favorite_list,
          show: show_selector_sub,
        }">
          <template :key="i_m" v-for="( item, i_m ) in  pop_main_items ">
            <div @click="set_menu_lv1(item, i_m)" class="main-m-select-item flex justify-center items-center"
              v-show="is_menu_show(item, i_m)"
              :class="{ current: menu_type == item?.mi, 'is-favorite': show_favorite_list }">
              <div class="m-menu-name-m">
                {{ i18n_t(`new_menu.${item?.mi}`) }}
              </div>
              <div class="m-count-match" v-if="!show_favorite_list">
                {{ MenuData.count_menu(item) }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import subMenuSpecially from "./sub-menu-specially.vue";
import { ref, watch, nextTick, computed, onBeforeUnmount, onMounted, } from "vue";
import { i18n_t, compute_css_obj, GlobalAccessConfig, useMittOn, MITT_TYPES, UserCtr, MenuData, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5,PROJECT_NAME } from "src/output/index.js";
import base_data from "src/core/base-data/base-data.js";
import { useRoute, useRouter } from "vue-router";
import lodash from "lodash"
import MatchFold from 'src/core/match-fold'
import BaseData from 'src/core/base-data/base-data.js'
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { is_scroll_ball, update_time, is_esports, is_mix,is_results, is_kemp, is_jinzu, menu_type } from 'src/base-h5/mixin/menu.js'
const show_favorite_list = ref(UserCtr.show_favorite_list)//是否收藏
const route = useRoute();
const router = useRouter();
const props = defineProps({
  // 菜单配置
  menu_config: {
    type: Object,
    default: () => { },
  },
});
//菜单容器是否收起
const menu_wrap_simple = ref(false);
//菜单容器二级菜单是否收起
const sport_container_simple = ref(false);
// 是否初次渲染
const is_first = ref(true)
//一级菜单
let menu_list = ref([]);
//二级 菜单 当前菜单
let current_menu = ref({});
//三级菜单 早盘日期菜单项
let date_menu_list = ref([]);
// 如果是赛果，并且是 虚拟体育, 即 是  四级菜单
let virtual_sports_results_tab = ref([]);
const current_lv2 = ref(MenuData.current_lv_2_menu || {})//二级菜单选中
const date_menu_curr_i = ref(0);
const pop_main_items = ref([]); //弹出框数据
const show_selector_sub = ref(false); //展示弹出框
// 切换到电竞时 的菜单 背景图片
const dj_back_type = ref("lol")

//是否显示三级菜单
const is_show_three_menu = computed(() => {
  return date_menu_list.value?.length > 0 && MenuData.get_is_show_three_menu()
});
//是否显示四级菜单
const is_show_four_menu = computed(() => {
  return virtual_sports_results_tab.value.length > 0 && MenuData.is_results_virtual_sports();
});
/**
    * 二级菜单数量 是否展示
    * @param {Number} sub  赛种item
    */
const two_menu_show = (sub) => {
  if (MenuData.is_results()) {
    return false
  }
  // 滚球下足球处理 1011足球
  let mi_list = MenuData.is_scroll_ball() ? [1001, 1002, 1004, 1010] : [1001, 1002, 1004, 1011, 1010]
  return ![is_esports.value, is_results.value, is_esports.value].includes(true) && !mi_list.includes(+sub.mi)
}
// 获取主菜单列表  main_select_items 弹出的一级 菜单数据   main_menu_list_items 一级菜单数据
watch(update_time, (v) => {
  const [menu_lv1, pop_list] = get_sport_menu(MenuData.menu_list)
  menu_list.value = menu_lv1; //一级
  pop_main_items.value = pop_list; //pop级
  current_menu.value = MenuData.menu_lv2; //2级
  date_menu_list.value = MenuData.menu_lv3; //三级
  virtual_sports_results_tab.value = MenuData.menu_lv4; //4级
  current_lv2.value = MenuData.current_lv_2_menu;//二级
  date_menu_curr_i.value = MenuData.current_lv_3_menu_i; //三级index
});

// 返回按钮 点击 
const handle_go_back=()=>{
  if(PROJECT_NAME=='app-h5'){
   // 通知C 端返回上一次页面 ，退出 体育 场馆
  }else{
    router.back()
  }
}

/**
 * 一级菜单事件 还要执行二级菜单事件哦 因为一级菜单只是展示 没有数据 靠二级菜单以下来数据的
 * item [object]当前点击对象
 * index [number]
 * type [string] click | init
 */
function set_menu_lv1(item, index, type = "click") {
  show_selector_sub.value = false;
  current_menu.value = []; //二级菜单先滞空
  MenuData.set_current_lv1_menu(item, index);
  if (MenuData.is_scroll_ball(item.mi)) {
    //滚球第一个是全部
    if (type == "click") {
      //表示点击的是全部
      set_menu_lv2(item.sl, -1, type);
    } else {
      current_menu.value = item.sl;
      set_menu_lv2(item.sl[0], 0, type);
    }
  } else if (MenuData.is_results(item.mi)) {// "赛果",
  } else if (MenuData.is_vr(item.mi)) {// "VR",
    router.push({
      name: "virtual_sports",
      query: {
        from: route.name,
      },
    });
  } else {
    if (item.sl && item.sl[0]) {
      current_menu.value = item.sl;
      set_menu_lv2(item.sl[0], 0, type);
    }
  }
}
/**
 * 计算滚球下的全部数量
 */
const all_sport_count_calc = computed(() => {
  //找到滚球
  let data_list = menu_list.value.find((item) => item.mi == 1);
  //滚球下所有是数量总和 updateime是时间作为计算属性变化
  return MenuData.count_menu(data_list, update_time.value)
});
// 切换到电竞时 的菜单 背景图片
function dj_back_img(item) {
  let value = +item || 2100
  let type = ''
  switch (value) {
    case 2100: type = "lol"; break;
    case 2101: type = "dota"; break;
    case 2102: type = "csgo"; break;
    case 2103: type = "wangzhe"; break;
  }
  dj_back_type.value = type
}
//点击滚球下的全部
function select_all_sub_menu_handle() {
  let data_list = menu_list.value.find((item) => lodash.get(item, 'mi') == 1);
  if (data_list) {
    set_menu_lv2(data_list.sl, -1, "click");
  }
}
/**
 * 二级菜单事件
 */
async function set_menu_lv2(item, index, type = "click") {
  const mi = lodash.get(MenuData.current_lv_2_menu, 'mi', "")
  if (mi === item.mi && !is_first.value) return
  MenuData.set_current_lv2_menu(item, index, type);
  switch (menu_type.value) {
    case 7://电竞需要改变背景图片
      dj_back_img(item.mi)
      break
  }
  handle_match_render_data()
}

/**
 * @description 处理赛事列表渲染数据
 */
const handle_match_render_data = () => {
  is_first.value = false
  // 清除赛事折叠信息
  MatchDataBaseH5.init()
  // MatchFold.clear_fold_info()
  // 冠军拉取旧接口； 待 元数据提供 冠军赛事后 再删除
  if (MenuData.is_kemp()) return MatchMeta.get_champion_match()
  // 赛果不走元数据， 直接拉取接口
  if (MenuData.is_results()) return MatchMeta.get_results_match()
  // 电竞不走元数据， 直接拉取接口
  if (MenuData.is_esports()) return MatchMeta.get_esports_match()

  const mi_tid_mids_res = lodash.get(BaseData, 'mi_tid_mids_res')
  if (lodash.isEmpty(mi_tid_mids_res)) return

  // 设置菜单对应源数据
  MatchMeta.set_origin_match_data()
}
/**
/**
 * 三级菜单事件
 */
function set_menu_lv3(item, index, type = "click") {
  console.log('set_menu_lv3', item)
  //点击当前 就不做什么
  if (MenuData.current_lv_3_menu && MenuData.current_lv_3_menu.menuId == item.menuId) {
    return;
  }
  date_menu_curr_i.value = index;
  //设置三级菜单
  MenuData.set_current_lv3_menu(item, index, type);
  // 早盘 不走接口 自己筛选数据
  if (MenuData.is_zaopan()) return MatchMeta.filter_match_by_time(item?.field1)
  // 赛果 三级菜单 请求接口
  if (MenuData.is_results()) return MatchMeta.get_results_match()
  // 电竞 三级菜单 请求接口
  if (MenuData.is_esports()) return MatchMeta.get_esports_match()
}
/**
 * 四级菜单事件
 */
function set_menu_lv4(item, index, type = "click") {
  MenuData.set_current_lv4_menu(item, index, type);
}
//判断后台是否展示 VR / 电竞
const show_dianjing = (item, index) => {
  // return MenuData.is_vr(item.mi) ? false : true
  if (MenuData.is_esports(item.mi)) return base_data.is_mi_2000_open; // 电竞tob后台关闭隐藏
  if (MenuData.is_vr(item.mi)) return base_data.is_mi_300_open; // VRtob后台关闭隐藏
  return ![2, 3, 6, 7].includes(index);
};
/**
     * @description: 球类id转化背景
     * @param {String} id 球类id
     * @return {}
     */
const format_type = (id) => {
  if (MenuData.is_results()) {
    let type = +id?.menuId
    // 赛果电竞图标
    if ([100, 101, 103, 102].includes(type)) {
      type += 2000
    }
    // 赛果 我的投注
    if (id?.menuType && id.menuType == 29) {
      type = id.menuType
    }
    // 赛果冠军
    if (type == 10000) {
      type = 100
    }
    return type
  }
  //电竞背景处理
  if (base_data.sports_mi.includes(+id?.mi)) return +id?.mi
  return MenuData.recombine_menu_bg(id, true)
}
/**
  * 根据 球类型 获取图标
  * @param {boolean} is_focus 是否选中
  */
function get_sport_icon(is_focus) {
  //TODO 用到了主题判断 暂时没理解 没拿过来
}
//获取match菜单
function get_sport_menu(all_menu) {
  let top_menu = [];
  let pop_main_items = [];
  all_menu.forEach((m_m) => {
    // 滚球 虚拟体育 電競 放入一级菜单
    if (MenuData.is_scroll_ball(m_m.mi) || MenuData.is_vr(m_m.mi) || MenuData.is_esports(m_m.mi)) {
      top_menu.push(lodash.cloneDeep(m_m));
    } else {
      //热门 不放进来
      if (!MenuData.is_hot(m_m.mi)) {
        pop_main_items.push(lodash.cloneDeep(m_m));
      }
    } // 中间的 一级菜单
  });
  //插入中间项 第二项是  弹出框的
  if (menu_type.value) {
    const mid_item = pop_main_items.find((item) => {
      return menu_type.value == item.mi;
    });
    if (mid_item) {
      top_menu.splice(1, 0, mid_item);
    } else if (menu_list.value.length <= 3) {
      //没有初始化 所以只有3个
      top_menu.splice(1, 0, pop_main_items[0]);
    } else {
      top_menu.splice(1, 0, menu_list.value[1]);
    }
  } else {
    top_menu.splice(1, 0, pop_main_items[0]);
    //如果没有设定过1级菜单
    set_menu_lv1(top_menu[0], 0, 'init')
  }
  return [top_menu, pop_main_items]
}
//弹出框 是否展示
function is_menu_show(item) {
  if (lodash.get(item, 'mi') == 28 && show_favorite_list.value) {
    return false;
  }
  let reslut = true;
  if ([2, 3, 4, 30].includes(+lodash.get(item, 'mi'))) {
    if (item.ct <= 0) {
      reslut = false;
    }
  }
  return reslut;
}
const mitt_list = [
  //通知收藏变化了
  useMittOn(MITT_TYPES.EMIT_FAVORITE_CHANGE_CMD, (v) => {
    show_favorite_list.value = v
  }).off
]
onBeforeUnmount(() => {
  mitt_list.forEach(i => i())
})
//初始化菜单
//热门不在这里 在首页
if (MenuData.is_hot()) {
  set_menu_lv1(menu_list.value[0], 0, 'init')
} else {
  //一级菜单
  if (MenuData.current_lv_1_menu) {
    MenuData.set_current_lv1_menu(MenuData.current_lv_1_menu, MenuData.current_lv_2_menu_i, 'init')
  }
  if (MenuData.current_lv_2_menu) {
    //如果二级菜单有数据缓存
    if (MenuData.current_lv_2_menu_i == -1) {
      select_all_sub_menu_handle()
    } else {
      set_menu_lv2(
        MenuData.current_lv_2_menu,
        MenuData.current_lv_2_menu_i,
        "init"
      );
    }
  }
}


</script>

<style scoped lang="scss">
@import url(./menu.scss);

.menu-inner-wrap {
  width: 100%;
  height: 0.44rem;
  position: relative;
  padding-bottom: 0.01rem;

  .m-i-background {
    width: 100%;
    height: 1.35rem;
    background-repeat: no-repeat;
    background-size: cover;

  
    &.dota {
      background-image: var(--q-color-com-img-bg-169);
    }

    &.lol {
      background-image: var(--q-color-com-img-bg-170);
    }

    &.wangzhe {
      background-image: var(--q-color-com-img-bg-171);
    }

    &.csgo {
      background-image: var(--q-color-com-img-bg-172);
    }
  }

  .main-wrap {
    width: 100%;
    height: 0.44rem;
    display: flex;
    align-items: center;
    color: #414655;
    transition: padding-top 0.3s;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    &.esport,
    &.is_esports {
      background-color: transparent;
    }

    .goback-icon-wrapper {
      height: 0.2rem;
      padding-left: 0.15rem;

      .img {
        width: 0.12rem;
        height: 0.2rem;
      }
    }

    .goback-icon-wrapper2 {
      visibility: hidden;
    }

    .main-menu-container {
      flex: 1;
      height: 0.27rem;
      line-height: 1;
      position: relative;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border-radius: 0 0 0.05rem 0.05rem;
      padding-top: 1px;
      padding-right: 0.04rem;
      margin-left: 0.15rem;

      &.esport,
      &.is_esports {
        background-color: transparent;
      }

      .m-menu-item {
        flex: 1;
        max-width: 0.8rem;
        position: relative;
        height: 0.2rem;
        font-size: 0.16rem;
        display: flex;
        justify-content: center;

        &.current {
          .i-title {
            font-weight: bold;

            &:after {
              content: " ";
              position: absolute;
              /* right: 0.03rem; */
              width: 0.22rem;
              height: 0.03rem;
              border-radius: 0.015rem;
              display: block;
              left: 50%;
              transform: translateX(-50%);
              // background-color: #ffb001;
            }
          }

          .m-menu-count {
            font-weight: bold;
          }

          &.esport {

            .i-title,
            .m-menu-count {
              color: #ffffff;
            }
          }
        }

        .i-title {
          text-overflow: ellipsis;
          white-space: nowrap;
          //overflow: hidden;
          line-height: 0.2rem;
          position: relative;
        }

        &.main_menu_407 {
          &.is_favorite {
            visibility: hidden;
          }
        }

        &.main_menu_410 {
          margin-right: 0;
          position: relative;
          left: 0.06rem;
        }

        .m-menu-count {
          width: 0.14rem;
          height: 0.18rem;
          position: relative;
          top: -0.04rem;
          left: 0.01rem;
          padding-left: 0.02rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .count {
            font-size: 0.11rem;

            &.is_unit {
              min-width: 15px;
              text-align: center;
            }
          }
        }

        &.current {

          .i-title,
          .m-menu-count {
            font-weight: bold;
          }

          &.esport {

            .i-title,
            .m-menu-count {
              color: #ffffff;
            }
          }
        }

        .dir-triangle {
          width: 0;
          height: 0;
          border-left: 0.04rem solid transparent;
          border-right: 0.04rem solid transparent;
          margin-top: 0.03rem;
          transition: transform 0.3s;
          position: absolute;
          top: 0.1rem;
          left: 0.03rem;

          &.open {
            transform: rotateZ(180deg);
          }

          &.arrow_esport {
            border-top: 0.04rem solid #fff;
          }
        }
      }
    }

    .activity-logo {
      display: block;
      width: 0.4rem;
      height: 0.3rem;
      margin: 0 0.1rem 0 0;
      border: none;
      position: relative;
      left: -0.05rem;
    }

    .red-dot {
      width: 0.05rem;
      height: 0.05rem;
      border-radius: 50%;
      background: #b11e33;
      position: absolute;
      right: 0.42rem;
      top: 0.06rem;
    }
  }

  .sub-menu-date-w {
    width: 100%;
    max-height: 1.35rem;
    position: absolute;
    left: 0;
    top: 0.44rem;
    transition: transform 0.6s, max-height 0.3s;

    &.esport {
      transition: unset !important;

      .sport-m-container {
        background-color: transparent;
      }
    }

    &.simple {
      transform: translate3d(0, -0.6rem, 0);

      &.zaopan {
        transform: translate3d(0, -0.93rem, 0);
      }
    }

    // 二级菜单
    .sport-m-container {
      width: 100%;
      height: auto;
      max-height: 1.35rem;
      overflow: hidden;
      position: relative;

      .s-menu-container {
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        padding-top: 0.13rem;
        padding-bottom: 0.05rem;
        flex-wrap: nowrap;
        scrollbar-width: none; // 去除滚动条火狐浏览器兼容性问题

        .sport-menu-item {
          width: 0.7rem;
          height: 100%;
          flex-shrink: 0;

          &.champion {
            // width: 0.9rem;
          }

          &.current {
            .inner-w {
              position: relative;
              font-size: 0.1rem;

              &.favorite {
                &:after {
                  background: rgba(255, 145, 36, 0.08);
                }
              }
            }
          }

          .inner-w {
            height: 0.41rem;
            flex-direction: column;
            flex-wrap: nowrap;
            position: relative;

            .sport-w-icon {
              height: 0.27rem;
              position: relative;

              .sport-icon-wrap {
                --per: -0.32rem;
                display: block;
                width: auto;
                height: 0.22rem;
                width: 0.22rem;
                background-position: 0 0;
                background-size: 0.22rem 18.88rem;

             
                &.focus-d {
                  background-image: var(--q-color-com-img-bg-205);
                }

                &.focus-c {
                  background-image: var(--q-color-com-img-bg-206);
                }

                &.focus-a {
                  background-image: var(--q-color-com-img-bg-207);
                }

                &.focus-e {
                  background-image: var(--q-color-com-img-bg-208);
                }

                &.focus-b {
                  background-image: var(--q-color-com-img-bg-209);
                }
              }

              .sport-icon-wrap2 {
                position: absolute;
                bottom: 0;
                right: -0.04rem;
                width: 0.13rem;
                height: 0.14rem;
              }

              .sport-match-count {
                width: 1px;
                height: 1px;
                line-height: 1;
                position: absolute;
                right: -0.03rem;
                top: 0;
                font-size: 0.11rem;
              }
            }

            .s-w-i-title {
              max-width: 0.7rem;
              font-size: 0.1rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              position: relative;
              top: -0.01rem;
            }
          }
        }
      }
    }

    // 三级菜单
    .d-c-wrapper {
      width: 100%;
      height: 0.33rem;
      overflow: hidden;
    }

    .date-container {
      width: 100%;
      height: 0.34rem;
      padding-top: 0.1rem;
      overflow-x: auto;
      overflow-y: hidden;
      display: flex;
      line-height: 1;
      padding-left: 0.2rem;

      &::-webkit-scrollbar {
        display: none;
      }

      &.esport {
        background-color: initial !important;
      }

      &:after {
        content: " ";
        display: block;
        width: 0.01rem;
        height: 0.02rem;
        flex-shrink: 0;
      }

      /*****   日期菜单  ******* -S*/
      .date-menu-item {
        height: 0.2rem;
        font-size: 0.12rem;
        line-height: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex-shrink: 0;
        align-items: center;
        margin-right: 0.19rem;
        position: relative;

        &:last-child {
          width: auto;
          margin-right: 0.1rem;
        }

        &.focus {
          font-size: 0.12rem;

          &:after {
            content: " ";
            width: 0.14rem;
            height: 0.02rem;
            display: block;
            border-radius: 0.08rem;
          }
        }

        &.hidden-champion {
          display: none;
        }
      }
    }

    /*  联赛菜单 */
    .virtual-sports-results {
      height: 0.42rem;
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      align-items: center;
      padding-left: 0.15rem;

      .tab-item {
        height: 0.26rem;
        line-height: 0.26rem;
        border-radius: 0.04rem;
        margin-right: 0.06rem;
        padding: 0 0.1rem;
        flex-shrink: 0;
      }
    }
  }



  /* **************主菜单容器********************************** -End*/
}

/* **************主菜单中间的下拉弹框  容器********************************** -Star*/
.main-m-selector-w {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0.44rem;
  left: 0;
  opacity: 0;
  transition: opacity 0.7s;
  overflow: hidden;

  &.effct-in {
    opacity: 1;
  }

  .selector-w-inner {
    padding: 0.2rem 0 0.09rem 0.17rem;
    transform: translate3d(0, -2.2rem, 0);
    transition: transform 0.35s;

    &.show {
      transform: translate3d(0, 0, 0);
    }

    .main-m-select-item {
      width: 1.6rem;
      height: 0.48rem;
      border-radius: 0.04rem;
      margin-bottom: 0.15rem;

      &:nth-child(odd) {
        margin-right: 0.2rem;
      }

      &>div {
        height: 0.24rem;

        &.m-menu-name-m {
          font-size: 0.16rem;
        }

        &.m-count-match {
          line-height: 0.24rem;
          font-size: 0.14rem;
          margin-left: 0.09rem;
        }
      }

      &.current {
        &.is-favorite {
          //background-color:#ff9124;
        }

        &>div {
          &:first-child {
            color: #ffffff;
          }

          &:last-child {
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>