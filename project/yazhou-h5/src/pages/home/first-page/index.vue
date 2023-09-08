<!--
 * @Author:
 * @Date:
 * @Description: 包网3首页下边（轮播 + 跑马灯 + 赛事框）
-->
<template>
  <div class="home-wrap">
    <!-- 轮播 -->
    <div class="slide">
      <!-- 猜你喜欢赛事轮播 -->
      <q-carousel
        animated
        swipeable
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        infinite
        v-if="lodash.get(carousel_data, 'list.length')"
        :autoplay="7000"
      >
        <q-carousel-slide
          :name="index"
          v-for="(item, index) in carousel_data.list"
          :key="index"
          @click="to_details(item)"
          :class="{ 'act-banner': !item.mhn }"
        >
          <!-- 是赛事数据的轮播 -->
          <div class="info" v-if="item.mhn">
            <!-- 赛种图标和联赛名称 -->
            <div class="row info-wrap">
              <span class="sport-icon-wrap" :class="`s${item.csid}`"></span>
              <div class="info-title ellipsis">{{ item.tn }}</div>
            </div>

            <div class="info-more">
              <!-- 左 -->
              <div class="home">
                <div class="wrap-logo">
                  <img
                    v-img="[
                      lodash.get(item, 'mhlu[0]'),
                      lodash.get(item, 'frmhn[0]'),
                      lodash.get(item, 'csid'),
                      { data: item, name: '_t11_img' },
                    ]"
                    alt
                  />
                  <img
                    v-if="lodash.get(item, 'mhlu').length > 1"
                    v-img="[
                      lodash.get(item, 'mhlu[1]'),
                      lodash.get(item, 'frmhn[1]'),
                      lodash.get(item, 'csid'),
                      { data: item, name: '_t12_img' },
                    ]"
                    alt
                    class="logo-double"
                  />
                </div>
                <div class="both-item">{{ item.mhn }}</div>
              </div>
              <!-- 中 -->
              <div class="socre">
                <div
                  class="vs-wrap"
                  v-if="item.ms != 110 && show_counting_down(item)"
                >
                  <div class="score-wrap">
                    <span class="both-score">{{
                      format_total_score(
                        lodash.get(carousel_data, `obj[${item.mid}]`),
                        0
                      )
                    }}</span>
                    <span class="crossing"></span>
                    <span class="both-score">{{
                      format_total_score(
                        lodash.get(carousel_data, `obj[${item.mid}]`),
                        1
                      )
                    }}</span>
                  </div>
                </div>
                <div
                  class="both-timer relative-position"
                  :style="{
                    height:
                      item.ms != 110 && show_counting_down(item)
                        ? 'auto'
                        : '100%',
                  }"
                >
                  <!--即将开赛 ms = 110-->
                  <template v-if="item.ms == 110">
                    <div>{{ t(`ms[${item.ms}]`) }}</div>
                  </template>

                  <!--一小时内开赛 -->
                  <template
                    v-if="item.ms != 110 && show_start_counting_down(item)"
                  >
                    <counting-down-start
                      :match="item"
                      :index="index"
                      :mgt_time="item.mgt"
                    >
                    </counting-down-start>
                  </template>

                  <!--开赛日期(早盘) ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                  <template
                    v-if="
                      item.ms != 110 &&
                      !show_start_counting_down(item) &&
                      !show_counting_down(item)
                    "
                  >
                    <div>{{ t("list.match_no_start") }}</div>
                    <div>
                      <!-- .Format(t('time4')) -->
                      {{ format_time_zone(+item.mgt) }}
                    </div>
                  </template>

                  <!--倒计时或正计时-->
                  <template v-if="item.ms != 110 && show_counting_down(item)">
                    <counting-down-second
                      :title="
                        item.ms == 0
                          ? t('list.match_no_start')
                          : match_period_map(item)
                      "
                      :mmp="item.mmp"
                      :m_id="item.mid"
                      :second="item.mst"
                      :match="item"
                      :is_add="
                        [1, 4, 11, 14, 100, 101, 102, 103].includes(+item.csid)
                      "
                      home
                    />
                  </template>
                </div>
              </div>
              <!-- 右 -->
              <div class="away">
                <div class="wrap-logo">
                  <img
                    v-img="[
                      lodash.get(item, 'malu[0]'),
                      lodash.get(item, 'frman[0]'),
                      lodash.get(item, 'csid'),
                      { data: item, name: '_t21_img' },
                    ]"
                    alt
                  />
                  <img
                    v-if="lodash.get(item, 'malu').length > 1"
                    v-img="
                      (lodash.get(item, 'malu[1]'),
                      lodash.get(item, 'frman[1]'),
                      lodash.get(item, 'csid'),
                      { data: item, name: '_t22_img' })
                    "
                    alt
                    class="logo-double"
                  />
                </div>
                <div class="both-item">{{ item.man }}</div>
              </div>
            </div>
          </div>
          <!-- 是活动或者跳转的轮播 -->
          <div v-else style="height: 100%" @click.stop="confirm(item)">
            <img
              :src="item.imgUrl"
              style="height: 100%; pointer-events: none"
              @error="league_icon_error"
            />
          </div>
        </q-carousel-slide>
        <template v-slot:control v-if="carousel_data.list.length > 1">
          <q-carousel-control position="bottom">
            <div class="control">
              <span
                v-for="(list, i) in carousel_data.list"
                :key="i"
                class="control-item"
                :class="{ active: i == slide }"
                @click="slide = i"
              ></span>
            </div>
          </q-carousel-control>
        </template>
      </q-carousel>
      <!-- 默认背景图 -->
      <img
        v-else
        :src="banner_bg"
        :hidden="!defaultBannerShow"
        @load="showDefaultBanner"
        @error="handleBannerError"
        class="carousel_bg"
      />
    </div>
    <!-- 轮播 -->
    <!-- 跑马灯、余额 -->
    <div class="wrap-notice">
      <div class="money-wrap" @click="get_balance">
        <div class="balance-wrap">
          <i class="icon-balance"></i>
          <span class="balance">{{ t("common.money") }}</span>
        </div>
        <div class="money">
          <span class="int">{{ balance_obj.int || "0" }}</span>
          <span class="dec">{{ balance_obj.dec || ".00" }}</span>
        </div>
      </div>

      <div class="wrap-marquee">
        <div class="marquee-left-wrap">
          <div class="marquee-icon">
            <i class="icon-notice"></i>
          </div>
        </div>
        <marquee></marquee>
      </div>
    </div>
    <!-- 跑马灯、余额 -->

    <home_menu />
  </div>
</template>

<script setup>
import { api_home } from "src/api/index.js";
import { ref, watch, onMounted, computed, onUnmounted, reactive } from "vue";
import {
  format_time_zone_time,
  format_balance,
  DateForMat,
  format_total_score,
} from "src/core/format/index.js";
import home_menu from "./menu.vue";
// TODO:后续修改调整
// import { mapGetters, mapActions, mapMutations } from "vuex";
// bw3版首页websocket逻辑处理
// import skt_home_bw3 from "project_path/src/mixins/websocket/data/skt_home_bw3.js";
// 公告栏跑马灯
// import marquee from 'project_path/src/components/marquee/marquee.vue'
// 无网络展示组件
// import no_data from "project_path/src/components/common/no-data.vue";
// 赛事进行中每秒变化的计时器
// import counting_down from 'project_path/src/components/common/counting-down.vue';
// 一小时以内的开赛计时器（累加计时|倒计时）
// import counting_down_start from 'project_path/src/components/common/counting-down-start.vue';
// 列表数据和对象结合操作类-实现快速检索,修改等功能
import ListMap from "src/core/match-list-h5/match-class/list-map.js";
// 为赛事列表(专业版和新手版)提供逻辑方法，拆分组件复杂度
// import match_list_mixin from "project_path/src/mixins/match_list/match_list_mixin";
import { utils } from "src/core/utils/index.js";
import base_data from "src/core/menu-h5/menu-data-class.js";

//  一二级菜单 本地化假数据
// import { common_menu_list, secondary_menu } from "project_path/src/config/common-menu.js"
//  api1.5 菜单 本地化假数据
import menu_data from "src/core/base-data/config/mew_menu_res";
import uid, { quid } from "src/core/uuid/index.js";
import { axios_loop } from "src/core/http/";
import { db } from "src/core/menu-h5/common/db.js";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import { t } from "src/boot/i18n.js";
import lodash from "lodash";
import UserCtr from "src/core/user-config/user-ctr.js";
import { useRoute, useRouter } from "vue-router";
import store from "src/store-redux/index.js";

const { langReducer, topMenuReducer } = store.getState();

// mixins: [skt_home_bw3, match_list_mixin],

const get_lang = ref(langReducer.lang);
// 路由
const route = useRoute();
const router = useRouter();
//轮播
let slide = ref(0);
//轮播图数据，init是数据加载中的标识
let carousel_data = ref({ list: [], obj: {} });
//余额
let balance_obj = ref({});
// 代表接口加载结束
let loading_done = ref(false);
//左侧菜单选中项
let menu_index = ref(0);
//左侧菜单
let menu = ref([]); //common_menu_list()
//右边内容
let match_list = ref([]); //secondary_menu()
//右侧无数据
let noData = ref(false);
let no_data_txt = ref("moMatch");
//菜单无数据
let noMenu = ref(false);
let no_menu_txt = ref("moMatch");
//滚动中的位置
let clientY = ref(0);
//开始滚动的位置
let start_move_clientY = ref(0);
let thumbStyle = ref({
  background: "transparent",
});
//轮播背景图片,
let banner_bg = ref(
  localStorage.getItem("home_banner_default") ||
    sessionStorage.getItem("banner_bg") ||
    ""
);
//右边内容默认高度
let el_height = ref(window.innerHeight - 2.7 * (window.innerWidth / 3.75));
// 定时器
let home_timer1_ = ref(null);
// 默认banner初始不显示
let defaultBannerShow = ref(false);
// 展示banner loading
let show_banner_loading = ref(true);
let new_menu = ref([]);
const content = ref(null);
const get_home_menu_index = 1;
const computed_store = reactive({
  get_ball_seed_menu: topMenuReducer.ball_seed_menu,
});
const methods_map_store = [
  "SET_HOME_TAB_ITEM",
  "set_current_first_menu",
].reduce((obj, type) => {
  obj[type] = (data) => {
    store.dispatch({ type, data });
  };
  return obj;
}, {});
const get_banner_obj = ref({});
watch(
  () => UserCtr.user_info.balance,
  () => {
    handler = "format_balance";
  }
);
watch(
  () => uid,
  () => {
    handler = "get_list";
  }
);
watch(
  () => get_banner_obj,
  () => {
    handler = "updata_list";
  }
);
// 请求国际化
const get_lang_v3 = () => {
  // base_data.get_load_lang_v3(get_lang.value)
};

/**
 * @description: 多少分钟后开赛显示
 * @param {Object} match 赛事对象
 * @return {String}
 */
const show_start_counting_down = (match) => {
  let r = false;
  let start_time = match.mgt * 1;
  let init_server = get_local_server_time.server_time * 1;
  let init_local = get_local_server_time.local_time_init;
  let now_local = new Date().getTime();
  let sub_local_time = now_local - init_local;
  let now_server_time = init_server + sub_local_time;
  let sub_time = start_time - now_server_time;

  // mcg 1:滚球 2:即将开赛 3:今日赛事 4:早盘
  r = match.mcg != 1 && 0 < sub_time && sub_time < 60 * 60 * 1000;
  return r;
};

// 赛事状态 0、赛事未开始 1、滚球阶段 2、暂停3、结束4、关闭5、取消6、比赛放弃7、延迟8、未知9、延期10、比赛中断
/**
 * @description: 进行中(但不是收藏页)的赛事显示累加计时|倒计时
 * @param {Object} match 赛事对象
 * @return {Boolean}
 */
const show_counting_down = (match) => {
  return [1, 2, 10].includes(+match.ms);
};

/**
 *@description 跳转活动逻辑，首页不用跳场馆
 *@param {Object} val 数据对象
 *@return {Undefined} undefined
 */
const confirm = (val) => {
  if (!val.imgUrl) return;
  if (val.comfirmTxt && UserCtr.user_info.activityList) {
    // 设置跳转活动的确认信息
    set_activity_msg(val);
  } else {
    if (val.hostUrl.startsWith("http") && val.urlType === "2") {
      window.open(val.hostUrl, "_blank");
    } else if (val.urlType === "1") {
      if (/#*\/*details/.test(val.hostUrl) && route.name != "category") {
        const {
          groups: { mid, csid },
        } = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(val.hostUrl) || {
          groups: {},
        };
        if (mid && csid) {
          if ([100, 101, 102, 103].includes(+csid)) {
            // 如果是电竞赛事，需要设置菜单类型
            set_menu_type(3000);
          }
          set_goto_detail_matchid(mid);
          set_details_item(0);
          router.push({ name: "category", params: { mid, csid } });
        }
      } else if (val.hostUrl == "act" && UserCtr.user_info.activityList) {
        router.push({
          name: "activity_task",
          query: { rdm: new Date().getTime() },
        });
      } else if (val.hostUrl.startsWith("hot") && !get_golistpage) {
        let tid = val.hostUrl.split("/")[1];
        let is_existtid =
          get_hot_list_item &&
          get_hot_list_item.subList &&
          get_hot_list_item.subList.find((item) => {
            return item.field2 == tid;
          });
        if (tid && is_existtid) {
          set_home_tab_item({ component: "hot", index: 1, name: "热门" });
          set_hot_tab_item({ field2: tid });
          useMittEmit(MITT_TYPES.EMIT_HOME_TAB);
        }
      }
    }
  }
};
/**
 *@description 活动的banner图片跟新
 *@param {Array} new_ 新值
 *@return {Undefined} undefined
 */
const banner_img_updata = (new_) => {
  if (!new_ || !new_.length) return;
  new_ = lodash.cloneDeep(new_);
  new_.forEach((item) => {
    item.imgUrl = get_file_path(item.imgUrl);
  });

  if (carousel_data.value) {
    let arr = lodash.cloneDeep(lodash.get(carousel_data.value, "list"));
    let arr1 = arr.filter((item) => {
      return !item.imgUrl;
    });
    // 去重轮播赛事mid
    arr1 = lodash.uniqBy(arr1, "mid");
    // 加入banner
    arr1.unshift(...new_);

    // 1. carousel_data不为ListMap实例则进行实例化 2. 否则合并数据
    if (!(carousel_data.value instanceof ListMap)) {
      carousel_data.value = new ListMap("mid", arr1);
    } else {
      // 去重轮播赛事imgUrl
      carousel_data.value.list = arr1;
    }
  }
};

/**
 *@description 合并轮播图list数据
 *@return {Undefined} undefined
 */
const updata_list = () => {
  // 展示banner loading
  show_banner_loading = true;
  get_carousel((data) => {
    carousel_data.merge_list(carousel_data.value, new ListMap("mid", data));
  }).then(() => {
    // 语言切换完成
    set_is_language_changing(false);
    // 关闭banner loading展示
    show_banner_loading = false;
  });
};
/**
 * @description: 获取轮播数据
 * @return {}
 */
const get_carousel = (callback) => {
  return api_home
    .hot_ulike_recommendation({ isHot: 101 })
    .then((res) => {
      const code = lodash.get(res, "code");
      let data = lodash.get(res, "data");
      if (code == 200 && data.length) {
        if (callback) {
          callback(data);
          // 更新获取轮播数据的时间,用于左右滑动轮播时,保持时间同步
          updateHotReqTime(Date.now());
        }
      }
    })
    .catch((err) => {})
    .finally(() => {
      //添加活动banner图
      if (lodash.get(get_banner_obj, "type1")) {
        banner_img_updata(get_banner_obj.type1);
      }
      //获取无轮播赛事背景图片
      if (!lodash.get(carousel_data.value, "list.length")) {
        get_banner_url();
      }
    });
};
/**
 * @description: 清空轮播图数据
 */
const clear_carousel_data = () => {
  $set(carousel_data.value, "list", []);
};
/**
 * @description: 图标出错时
 * @param {Object} $event 错误事件对象
 */
const league_icon_error = ($event) => {
  $event.target.src = UserCtr.theme.includes("y0")
    ? "image/bw3/png/banner_bg_y0.png"
    : "image/bw3/png/banner_bg.png";
  $event.srcElement.onerror = null;
};
/**
 * @description: 菜单推送
 * @param {Object} skt_data 推送数据
 * @return {}
 */
const ws_change_menu = (skt_data) => {
  upd_home_data((state) => {
    skt_data.forEach((list) => {
      menu.forEach((item) => {
        if (item.menuId == list.menuId) {
          item.count = list.count;
        }
        item.subList.forEach((sub) => {
          if (sub.menuId == list.menuId) {
            sub.count = list.count;
          }
        });
      });
    });
  });
  $forceUpdate();
};

const chang_index = (data) => {
  if ([1, 2, 3].includes(get_home_menu_index)) {
    data.forEach((item, index) => {
      if (item.mi == get_home_menu_index) {
        menu_index.value = index;
        change_menu(index);
      }
    });
  }
};
//处理menu
const menu_data_config = (data) => {
  new_menu.value = data;
  chang_index(data);

  // 处理无数据的情况
  if (!new_menu.value.length) {
    noMenu.value = true;
    no_menu_txt.value = "noMatch";
  } else {
    noMenu.value = false;
  }

  if (new_menu.value.length && !new_menu.value[menu_index.value].sl.length) {
    noData.value = true;
    no_data_txt = "noMatch";
  } else {
    noData.value = false;
  }
};
// 主内容 菜单数据处理
const menu_data_loaded = (data) => {
  data = lodash.cloneDeep(data);
  let newData = base_data.recombine_menu(data);
  // save_home_data(data)
  menu_data_config(newData);
  return;
};
/**
 * @description: 获取列表数据
 * @return {}
 */
const get_list = async () => {
  loading_done = false;
  //获取indexDB menu数据
  // let menuBuldata = await db.menus_info.bulkGet()
  // if(buldata.length>0){
  //     // res.data = buldata
  //     console.error(menuBuldata,"parammenu_data======")
  // }
  // if (!get_home_data && get_home_data.length) {
  //   console.error(get_home_data,"parammenu_data======333")
  //   menu_data_loaded(get_home_data);  // 先用缓存数据
  // }
  let params = {
    cuid: uid ? uid() : "0", //用户ID/或UUid
    sys: 7, //1 panda 体育 ;3 188体育
  };
  const send_gcuuid = uid();
  params.gcuuid = send_gcuuid;
  let obj_ = {
    // axios api对象
    axios_api: api_home.get_menu_init,
    // axios api对象参数
    params: params,
    // axios中then回调方法
    fun_then: (res) => {
      console.log("test", res);
      if (send_gcuuid != res.gcuuid) return;
      let code = lodash.get(res, "code");
      if (code == 200) {
        let data = lodash.get(res, "data");
        remove_crosstalk(data);
        loading_done = true;
        //DB插入数据 缓存menu数据
        if (!lodash.isEmpty(data)) {
          //mi 作为主键
          db.menus_info.bulkAdd(data, "mi");
          loading_done = true;
        }
        menu_data_loaded(data);
        //URL地址带token认定是首次进入，所以首页列表数据加载完后要删除掉
        if (!location.search.includes("keep_url")) {
          history.replaceState(
            null,
            "",
            `${location.pathname}${location.hash}`
          );
        }
      } else {
        menu_data_loaded(menu_data);
        noMenu.value = true;
        no_menu_txt.value = "noMatch";
      }
    },
    // axios中catch回调方法
    fun_catch: (err) => {
      noMenu.value = true;
      no_menu_txt.value = "noMatch";
      loading_done = false;
    },
    // 最大循环调用次数(异常时会循环调用),默认3次
    max_loop: 2,
    // 异常调用时延时时间,毫秒数,默认1000
    timers: 1000,
  };
  // axios_api轮询调用方法
  const res = await axios_loop(obj_);
};
// 去除串关
const remove_crosstalk = (data) => {
  for (let i = data.length - 1; i >= 0; i--) {
    // 如果是串关去除串关
    if (data[i].menuType == 11) {
      data.splice(i, 1);
    }
  }
};
/**
 * @description: 球种排序
 * @param {Object} data 全部数据
 * @return {Object} data 全部数据
 */
const sort_data = (data) => {
  if (data.length) {
    data.forEach((item) => {
      let arr = [],
        list = item.subList;
      for (var i = 0; i < list.length; i++) {
        if (list[i].count) {
          arr.push(list[i]);
          list.splice(i, 1);
          i--;
        }
      }

      item.subList = [...arr, ...list];
    });
  }
  return data;
};

/**
 * @description 跳转列表页
 * @param {Object} item 列表球种数据
 */
const to_list = (item, index) => {
  if (item.ct) {
    set_new_two_menu(index);
    const euid = base_data.get_euid(item.mi);
    set_current_sub_menuid(euid);
    methods_map_store["set_current_first_menu"](
      new_menu.value[menu_index.value].mi
    );
    router.push({
      name: "matchList",
      query: {
        m: new_menu.value[menu_index.value].mi,
        s: index,
        token: UserCtr.user_token,
      },
    });
  } else {
    $toast(t("home.match_no_has"), 800);
  }
  return;
};

/**
 * @description: 跳转详情页
 * @param {Object} item 轮播赛事数据
 */
const to_details = (item) => {
  set_goto_detail_matchid(item.mid);
  set_details_item(0);
  router.push({ name: "category", params: { mid: item.mid, csid: item.csid } });
};
/**
 * @description: 无轮播赛事背景图片
 * @return {}
 */
const get_banner_url = () => {
  let url = UserCtr.get_banner_url_first_page();
  if (url) {
    banner_bg = get_file_path(url);
  } else {
    banner_bg = `image/bw3/png/home_carousel_bg_${
      UserCtr.theme.includes("y0") ? "y0_" : ""
    }${get_lang}.png`;
  }
  sessionStorage.setItem("banner_bg", banner_bg);
};
// 刷新时banner左上角有短暂破碎小图（加载失败）显现，监听图片load事件做显示处理
const showDefaultBanner = (e) => {
  defaultBannerShow = true;
};
// 若线上图片加载错误，则使用本地默认banner
const handleBannerError = (e) => {
  banner_bg = `image/bw3/png/home_carousel_bg_${
    UserCtr.theme.includes("y0") ? "y0_" : ""
  }${get_lang}.png`;
};
const banner_loading_url = computed(() => {
  if (UserCtr.theme.includes("y0")) {
    return "image/wwwassets/bw3/home/banner_loading_y0.gif";
  } else {
    return "image/wwwassets/bw3/home/banner_loading.gif";
  }
});
const filter_meunu_desc = computed(() => {
  return (mi) => {
    if (computed_store.get_ball_seed_menu.length < 1) return "";
    const type = base_data.recombine_menu_desc(mi);
    return computed_store.get_ball_seed_menu[type];
  };
});
onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_MENU_MATCH_COUNT_CHANGE, ws_change_menu).off;
  // useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on).off;
  useMittOn(MITT_TYPES.EMIT_SHOW_DEFAULT_BANNER_EVENT, clear_carousel_data).off;

  if (home_timer1_) {
    clearTimeout(home_timer1_);
    home_timer1_ = null;
  }

  if (lodash.get(carousel_data.value, "list.length")) {
    carousel_data.value.destroy && carousel_data.destroy();
  }
  //左侧菜单
  menu = [];
  //右边内容
  match_list = [];
});

// 展示banner loading
show_banner_loading = true;
get_carousel((data) => {
  carousel_data.value = new ListMap("mid", data);
}).then(() => {
  show_banner_loading = false;
});

//首页加载时初始化数据
// set_bet_obj({});
// set_bet_list([]);
// set_show_favorite_list(false);
menu_index.value = 0;
useMittOn(MITT_TYPES.EMIT_MENU_MATCH_COUNT_CHANGE, ws_change_menu);
useMittOn(MITT_TYPES.EMIT_SHOW_DEFAULT_BANNER_EVENT, clear_carousel_data);

get_list();
get_lang_v3();
</script>

<style lang="scss" scoped>
// @import "./index.scss";
</style>


<style lang="scss">
.left-menu {
  .scroll {
    width: 0.7rem !important;
  }
}
</style>
