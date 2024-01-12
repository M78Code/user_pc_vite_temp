<template>
  <div class="c-match-list-filter">
    <drag-scroll class="item-wrap filter-sports competition" :show_right_btn="true" :show_left_btn="true" ref="drag_scroll">
      <!-- :class="current_menu == item.mi ? 'active' : 'no-active' -->
      <template v-for="item in mi_500_obj['sl']">
        <div
          :key="`vr_menu_obj_sl${item.mi}`"
          v-if="item.ct && BaseData.menus_i18n_map[item.mi]"
          @click="handle_click_menu_mi_500(item.mi)"
          class="item yb-flex-center hot-item"
          :class="current_menu == item.mi ? 'active' : 'no-active'"
        >
          <div class="icon-wrap list-filter menu-inline">
            <span v-if="item.tid !== '0'" class="sport-icon-wrap"
                      :style="compute_css_obj({key:current_menu == item.mi? 'league-sport-active-image' : 'league-sport-icon-image', position:format_type(item)})"></span>
                    {{ item.name }}
            <!-- 热门赛事列表菜单icon 本地精灵图     hot-img-no-active-->
          </div>
          <!-- 球种名称 -->
          <div
            class="name menu-inline name-margin-left"
            v-tooltip="{
              content:
                (item.mi == '50199'
                  ? i18n_t('common.all')
                  : BaseData.menus_i18n_map[item.mi] + ' ' + item.ct) || '',
              overflow: 1,
            }"
          >
            <span>{{
              (item.mi == "50199"
                ? i18n_t("common.all")
                : BaseData.menus_i18n_map[item.mi]) || ""
            }}</span>
            <span class="count-text">{{ item.ct }}</span>
          </div>
        </div>
      </template>
    </drag-scroll>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { is_eports_csid ,compute_css_obj } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import BaseData from "src/core/base-data/base-data.js";
import DragScroll from "src/base-pc/components/cus-scroll/drag_scroll.vue";
const root=500//常量 500
const props = defineProps({
  match: {
    type: Object,
    default: () => {},
  },
});
const current_menu = ref("");
const mi_500_obj = ref([]);
// let top_logos = [
//   "50199", //赛事
//   "50101", //竞足
//   "180", //英超
//   "320", //西甲
//   "276", //德甲
//   "79", //法甲
//   "6408", // 欧冠
//   "146", //CBA
//   "208", // 韩篮甲
//   "239", // 意甲
//   "132", //NBA
//   "262", //欧足联
//   "39", // j2
//   "90", //j1
//   "95",
//   "103",
//   "130",
//   "137",
//   "150",
//   "160",
//   "185",
//   "224",
//   "244",
//   "265",
//   "295",
//   "333",
//   "340",
//   "359",
//   "427",
//   "563",
//   "1524",
//   "1555",
//   "1607",
//   "2066",
//   "2177",
//   "2332",
//   "3123",
//   "3230",
//   "6343",
//   "6344",
//   "6371",
//   "8120",
//   "17706",
//   "20746",
//   "21202",
//   "24313",
//   "24613",
//   "26992",
//   "28009",
//   "28190",
//   "28592",
//   "64",
// ];
let top_logos = [
  "50199", //赛事
  "50101", //竞足
  "502180", //英超
  "502320", //西甲
  "502276", //德甲
  "50279", //法甲
  "5026408", // 欧冠
  "502146", //CBA
  "502208", // 韩篮甲
  "502239", // 意甲
  "502132", //NBA
  "502262", //欧足联
  "50239", // j2
  "50290", //j1
  "50295",
  "502103",
  "502130",
  "502137",
  "502150",
  "502160",
  "502185",
  "502224",
  "502244",
  "502265",
  "502295",
  "502333",
  "502340",
  "502359",
  "502427",
  "502563",
  "5021524",
  "5021555",
  "5021607",
  "5022066",
  "5022177",
  "5022332",
  "5023123",
  "5023230",
  "5026343",
  "5026344",
  "5026371",
  "5028120",
  "50217706",
  "50220746",
  "50221202",
  "50224313",
  "50224613",
  "50226992",
  "50228009",
  "50228190",
  "50228592",
  "50264",
];
/**
 * @description: 联赛转化背景
 * @param {String} id 球类id
 * @return {}
 */
 const format_type = ( item = {} ) => {
    let index = top_logos.findIndex(n=>{return item.mi == n});
    index = index == -1?0:index;
    return index;
}
onMounted(() => {
  const hot_menu= BaseData.mew_menu_list_res.find((x) => x.mi == root)
  if(hot_menu){
    let mid_b = hot_menu.sl?.find((item) => item.ct > 0) || {};
    // 刷新后 根据中间件 重新输出
    const { mi = mid_b.mi } = menu_config.mid_menu_result;
    current_menu.value = mi;
    mi&&handle_click_menu_mi_500(mi);
    mi_500_obj.value=hot_menu;
  }else{
    mi_500_obj.value={sl:[]}
  } 
});
/**
 * @Description:计算精灵图联赛logo的偏移位置
 * @param {string|number} id  联赛id
 * @return {undefined} undefined
 */
function icon_styles(mi) {
  let mi1 = mi;
  if (("" + mi).startsWith("502")) {
    mi1 = mi.substring(3);
  }
  let number = top_logos.indexOf(mi1);
  if (number == -1) {
    return -1;
  }
  // let size = 10 / 28
  let size = 20 / 48;
  return parseInt(number * 68 * size * 100) / 100;
}
/**
 * 计算是否有本地图标
 */
function compute_if_has_local_icon(mi) {
  // 热门除了50199-30199  赛事、50101-30101 竞足外，
  // 常规联赛原菜单ID：301+联赛ID、新菜单：502+菜单ID；
  //电竞联赛原菜单：30+联赛ID、新菜单ID：联赛ID
  // 5010
  let mi1 = mi;
  if (("" + mi).startsWith("502")) {
    mi1 = mi.substring(3);
  }
  return top_logos.includes(mi1);
}
/**
 * 热门 赛事点击  热门的
 */
function handle_click_menu_mi_500(mi) {
  // this.handle_click_menu_mi_pre_process( )
  current_menu.value = mi;
  let guanjun = "";
  let sports = "";
  let route = "list";
  let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
  let params = {
    ...mi_info,
    mi,
  };
  // 是否收藏
  let is_collect = false; // this.get_layout_list_type == "collect";
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
    // selectionHour: this.$store.state.filter.open_select_time,
    sort:UserCtr.sort_type, //this.vx_match_sort,
    apiType: 1,
    orpt: -1,
  };
  if (mi == 50101) {
    //hot-jingzu  热门 竟足 50101
    sports = "hot-jingzu";
    match_list = {
      api_name: "post_fetch_match_list",
      params: {
        ...base_params,
        euid: "30101",
        pids: -999,
        orpt: 12,
      },
    };
  } else if (mi == 50199) {
    //  hot-saishi 热门   赛事 50199
    sports = "hot-saishi";
    match_list = {
      api_name: "post_fetch_match_list",
      params: {
        ...base_params,
        euid: "30199",
        orpt: -1,
      },
    };
  } else {
    //hot-liansai  热门 联赛
    sports = "hot-liansai";
    let c_euid = "";
    let api_name = "post_fetch_match_list";
    if (mi.length > 10) {
      // mi大于10为 是电竞
      api_name = "post_fetch_esports_matchs";
      match_list = {
        api_name,
        params: {
          ...base_params,
        },
      };
    } else {
      //常规联赛原菜单ID：301+联赛ID、新菜单：502+菜单ID；电竞联赛原菜单：30+联赛ID、新菜单ID：联赛ID
      if (mi.startsWith("502")) {
        // 旧菜单ID还有有个规则：301+联赛ID 如果长度是10位，则菜单ID为101+联赛ID 后端逻辑
        let prefix = mi.length == 10 ? "101" : "301";
        c_euid = prefix + mi.substring(3);
      } else {
        c_euid = "30" + mi;
      }
      params.euid = c_euid;
      match_list = {
        api_name,
        params: {
          ...base_params,
          euid: c_euid,
          tid: "",
          // orpt: '0',
        },
      };
    }
  }
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
  console.info(params,"params")
  // 设置      中间 菜单输出
  menu_config.set_mid_menu_result(params);
  // 设置   请求  列表结构  API 参数的  值
  menu_config.set_match_list_api_config(config);
}
</script>
<style lang="scss" scoped>
.c-match-list-filter {
  width: 100%;
  height: 48px;
  padding-bottom: 1px;
  .filter-sports {
    overflow: hidden;
    .item {
      max-width: 140px;
      min-width: 80px;
      height: 30px;
      padding: 5px;
      flex-shrink: 0;
      cursor: pointer;
      margin: 10px 3px;
      &.active .l-icon {
        opacity: 0.6 !important;
        filter: grayscale(100%);
        /*  球种logo */
      }
      .icon-wrap {
        .l-icon {
          width: 20px;
          height: 20px;
        }
        /*  球种名称样式 */
      }
      .menu-inline {
        display: inline-block;
      }
      .sport-icon-wrap {
          --per: -30.55px;
          display: inline-block;
          height: 18px;
          width: 18px;
          vertical-align: middle;
          margin-top: -2px;
          background-position: 0 0;
          background-size: 100% auto;
      }
      .count-text {
        padding-left: 2px;
        padding-right: 3px;
      }
      .text-active {
        color: var(--q-gb-t-c-1);
      }
      .name-margin-left {
        margin-left: 5px;
      }
      .name {
        margin-top: 1px;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 13px;
        /* 球种数量 */
        .count {
          display: inline-block;
        }
      }
    }
  }
  .competition {
    /* 选中的背景图 */
    .hot-item {
      .hot-img {
        width: 20px;
        height: 20px;
        background-size: 100% auto;
      }
      .hot-img-active {
        width: 20px;
        height: 20px;
        background-size: 100% auto;
      }
    }
  }
}
</style>