<!--
 * @Author:
 * @Date:
 * @Description: 包网3首页下边（轮播 + 跑马灯 + 赛事框）
-->
<template>
  <div class="home-wrap">
    <!-- 轮播 -->
    <div class="slide">
      <!-- Banner Loading -->
      <!--      <img-->
      <!--          v-if="get_is_language_changing || show_banner_loading"-->
      <!--          :src="banner_loading_url"-->
      <!--          class="banner-loading"-->
      <!--      >-->
      <!-- 猜你喜欢赛事轮播 -->
      <q-carousel animated swipeable v-model="slide" transition-prev="slide-right" transition-next="slide-left" infinite
        v-if="_.get(carousel_data, 'list.length')" :autoplay="7000">
        <q-carousel-slide :name="index" v-for="(item, index) in carousel_data.list" :key="index" @click="to_details(item)"
          :class="{ 'act-banner': !item.mhn }">
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
                  <img v-img="([lodash.get(item, 'mhlu[0]'), lodash.get(item, 'frmhn[0]'), lodash.get(item, 'csid'),{data:item,name:'_t11_img'}])" alt />
                  <img v-if="lodash.get(item, 'mhlu').length > 1"
                    v-img="([lodash.get(item, 'mhlu[1]'), lodash.get(item, 'frmhn[1]'), lodash.get(item, 'csid'),{data:item,name:'_t12_img'}])" alt
                    class="logo-double" />
                </div>
                <div class="both-item">{{ item.mhn }}</div>
              </div>
              <!-- 中 -->
              <div class="socre">
                <div class="vs-wrap" v-if="item.ms != 110 && show_counting_down(item)">
                  <div class="score-wrap">
                    <span class="both-score">{{ format_total_score(lodash.get(carousel_data, `obj[${item.mid}]`), 0) }}</span>
                    <span class="crossing"></span>
                    <span class="both-score">{{ format_total_score(lodash.get(carousel_data, `obj[${item.mid}]`), 1) }}</span>
                  </div>
                </div>
                <div class="both-timer relative-position"
                  :style="{ 'height': item.ms != 110 && show_counting_down(item) ? 'auto' : '100%' }">
                  <!--即将开赛 ms = 110-->
                  <template v-if="item.ms == 110">
                    <div>{{ t(`ms[${item.ms}]`) }}</div>
                  </template>

                  <!--一小时内开赛 -->
                  <template v-if="item.ms != 110 && show_start_counting_down(item)">
                    <counting-down-start :match="item" :index="index" :mgt_time="item.mgt">
                    </counting-down-start>
                  </template>

                  <!--开赛日期(早盘) ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                  <template v-if="item.ms != 110 && !show_start_counting_down(item) && !show_counting_down(item)">
                    <div>{{ t('list.match_no_start') }}</div>
                    <div>
                      <!-- .Format(t('time4')) -->
                      {{ format_time_zone(+item.mgt) }}
                      </div>
                  </template>

                  <!--倒计时或正计时-->
                  <template v-if="item.ms != 110 && show_counting_down(item)">
                    <counting-down-second :title="item.ms == 0 ? t('list.match_no_start') : match_period_map(item)"
                      :mmp="item.mmp" :m_id="item.mid" :second="item.mst" :match="item"
                      :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+item.csid)" home />
                  </template>
                </div>
              </div>
              <!-- 右 -->
              <div class="away">
                <div class="wrap-logo">
                  <img v-img="([lodash.get(item, 'malu[0]'), lodash.get(item, 'frman[0]'), lodash.get(item, 'csid'),{data:item,name:'_t21_img'}])" alt />
                  <img v-if="lodash.get(item, 'malu').length > 1"
                    v-img="(lodash.get(item, 'malu[1]'), lodash.get(item, 'frman[1]'), lodash.get(item, 'csid'),{data:item,name:'_t22_img'})" alt
                    class="logo-double" />
                </div>
                <div class="both-item">{{ item.man }}</div>
              </div>
            </div>
          </div>
          <!-- 是活动或者跳转的轮播 -->
          <div v-else style="height:100%" @click.stop="confirm(item)">
            <img :src="item.imgUrl" style="height:100%;pointer-events:none;" @error="league_icon_error" />
          </div>
        </q-carousel-slide>
        <template v-slot:control v-if="carousel_data.list.length > 1">
          <q-carousel-control position="bottom">
            <div class="control">
              <span v-for="(list, i) in carousel_data.list" :key="i" class="control-item"
                :class="{ 'active': i == slide }" @click="slide = i"></span>
            </div>
          </q-carousel-control>
        </template>
      </q-carousel>
      <!-- 默认背景图 -->
      <img v-else :src="banner_bg" :hidden="!defaultBannerShow" @load="showDefaultBanner" @error="handleBannerError"
        class="carousel_bg" />
    </div>
    <!-- 轮播 -->

    <!-- 跑马灯、余额 -->
    <div class="wrap-notice">
      <div class="money-wrap" @click="get_balance">
        <div class="balance-wrap">
          <i class="icon-balance"></i>
          <span class="balance">{{ t('common.money') }}</span>
        </div>
        <div class="money">
          <span class="int">{{ balance_obj.int || '0' }}</span>
          <span class="dec">{{ balance_obj.dec || '.00' }}</span>
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

    <!-- 赛事框 -->
    <div class="main-content-match" :style="`height:${el_height}px`" ref="content">
      <div class="match-warp" v-if="new_menu.length">
        <div class="left-menu valid">
          <q-scroll-area :style="`height:${el_height}px`" :thumb-style="thumbStyle">
            <div class="item" :class="{ 'active': index == menu_index }" v-for="(item, index) in new_menu"
              :key="`menu-${index}`" @click="change_menu(index)"  v-show="calc_show2(item)">
              <span class="label" :class="{ is_chinise: ['zh', 'tw'].includes(get_lang) }">{{
                t(`new_menu.${item.mi}`) }}</span>
              <span class="num" v-if="![407, 408, 410].includes(item.mi * 1)">{{ count_menu(item.sl)||'' }}</span>
            </div>
          </q-scroll-area>
        </div>
        <div class="match-content" :class="{ 'fadeInUp': animation }" v-if="!_.isEmpty(new_menu[menu_index])">
          <q-scroll-area ref="list_area" :style="`height:${el_height}px`" :thumb-style="thumbStyle">
            <div class="item" :style="{ 'z-index': item.field1 * 3, position: 'relative' }"
              v-for="(item, index) in new_menu[menu_index].sl||[]" :key="index" @click="to_list(item,index)"
              v-show="!loading_done || item.ct >= 0 || (_.get(menu, '[menu_index].count') <= 0 && [5, 7].includes(+item.menuType))">
              <div class="item-bg" :class="format_type(item)"></div>
              <div class="item-info" :class="{ 'is-english': get_lang == 'en' }">
                <div class="column items-center">
                  <!-- <span class="match-type">{{t(`new_menu.${filter_meunu_desc(item.mi)}`) }}</span> -->
                  <span class="match-type">{{ filter_meunu_desc(item.mi)}}</span>
                  <span class="match-num ellipsis">{{ item.ct || 0 }}</span>
                  <span class="match-label ellipsis-2-lines">{{ t('home.can_bet') }}</span>
                </div>
              </div>
            </div>
            <no-data v-if="noData" :which='no_data_txt' height='500'></no-data>
          </q-scroll-area>

        </div>
      </div>
      <no-data :which='no_menu_txt' height='500' style="padding-top:0.6rem" v-if="noMenu"></no-data>
    </div>
  </div>
</template>

<script setup>
import { api_home } from "src/project/api/index";
import { format_time_zone_time, format_balance, format_total_score } from "src/core/format/index.js"
// TODO:后续修改调整
// import { mapGetters, mapActions, mapMutations } from "vuex";
// bw3版首页websocket逻辑处理
// import skt_home_bw3 from "project_path/src/mixins/websocket/data/skt_home_bw3.js";
// 公告栏跑马灯
// import marquee from 'project_path/src/components/marquee/marquee.vue'
// 无网络展示组件
import no_data from "project_path/src/components/common/no_data.vue";
// 赛事进行中每秒变化的计时器
import counting_down from 'project_path/src/components/common/counting-down.vue';
// 一小时以内的开赛计时器（累加计时|倒计时）
import counting_down_start from 'project_path/src/components/common/counting_down_start.vue';
// 列表数据和对象结合操作类-实现快速检索,修改等功能
import ListMap from "project_path/src/utils/list_map";
// 为赛事列表(专业版和新手版)提供逻辑方法，拆分组件复杂度
// import match_list_mixin from "project_path/src/mixins/match_list/match_list_mixin";
import {utils } from 'src/core/index.js';
import base_data from "project_path/src/utils/base_data.js";
//  一二级菜单 本地化假数据
import { common_menu_list, secondary_menu } from "project_path/src/config/common_menu.js"
//  api1.5 菜单 本地化假数据
import menu_data  from "project_path/src/config/menu_new_data.js"
import uid from "src/core/uuid/index.js"
import { db } from "project_path/src/utils/db/index.js";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { t } from "src/boot/i18n"
import lodash from "lodash"
import userCtr from "src/core/user-config/user-ctr.js";
  // mixins: [skt_home_bw3, match_list_mixin],
  //轮播
  const slide = ref(0)
  //轮播图数据，init是数据加载中的标识
  const carousel_data = ref({ list: [], obj: {} })
  //余额
  const balance_obj = ref({})
   // 代表接口加载结束
  const loading_done =ref(false)
  //左侧菜单选中项
  const menu_index = ref(0)
  //左侧菜单
  const menu = ref(common_menu_list())
  //右边内容
  const match_list = ref(secondary_menu())
  //右侧无数据
  const noData = ref(false)
  const no_data_txt = ref("moMatch")
  //菜单无数据
  const noMenu = ref(false)
  const no_menu_txt = ref("moMatch")
  //点击动画
  const animation = ref(false)
  //滚动中的位置
  const clientY = ref(0)
  //开始滚动的位置
  const start_move_clientY = ref(0)
  const thumbStyle = ref({
    background: "transparent"
  })
  //轮播背景图片,
  const banner_bg = ref(localStorage.getItem('home_banner_default') || sessionStorage.getItem('banner_bg') || '')
  //右边内容默认高度
  const el_height = ref(window.innerHeight - 2.7 * (window.innerWidth / 3.75))
  const utils = ref('')
  // 定时器
  const home_timer1_ = ref(null)
  // 默认banner初始不显示
  const defaultBannerShow = ref(false)
  // 定时器变量
  const timer_1 = ref(null)
  // 展示banner loading
  const show_banner_loading = ref(true)
  const new_menu = ref([])
    // 展示banner loading
    show_banner_loading = true
    get_carousel((data) => {
      carousel_data = new ListMap("mid", data)
    }).then(() => {
      show_banner_loading = false
    });

    //首页加载时初始化数据
    set_bet_obj({});
    set_bet_list([]);
    set_show_favorite_list(false);
    menu_index = 0;
    useMittOn(MITT_TYPES.EMIT_MENU_MATCH_COUNT_CHANGE, ws_change_menu);
    useMittOn(MITT_TYPES.EMIT_SHOW_DEFAULT_BANNER_EVENT, clear_carousel_data)

    get_list();
    get_lang_v3()

  watch(() => userCtr.user_info.balance, () => {
    handler= 'format_balance'
  })
  watch(() => uid, () => {
    handler= 'get_list'
  })
  watch(() => get_banner_obj, () => {
    handler= 'updata_list'
  })
  const count_menu = (list) => {
    return base_data.count_menu(list)
  }
  // 请求国际化
  const get_lang_v3 = () => {
    base_data.get_load_lang_v3(get_lang)
  }
  // ...mapActions([
  //   // 设置左边菜单选中下标
  //   "set_home_menu_index",
  //   // 设置首页菜单数据
  //   "save_home_data",
  //   "get_balance",
  // ])
  // ...mapMutations([
  //   // 设置当前选中日期菜单索引
  //   'set_date_menu_curr_i',
  //   // 设置主菜单下拉选择器选中的赛事下标
  //   'set_selector_w_m_i',
  //   // 押注信息对象
  //   'set_bet_obj',
  //   // 投注项id集合
  //   'set_bet_list',
  //   // 显示收藏列表
  //   'set_show_favorite_list',
  //   // 赛事id
  //   'set_goto_detail_matchid',
  //   // 玩法tab 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
  //   'set_details_item',
  //   // 当前选中的二级菜单id
  //   'set_current_sub_menuid',
  //   // 当前选中的二级菜单type
  //   'set_curr_sub_menu_type',
  //   // 更新菜单
  //   'upd_home_data',
  //   // 设置跳转活动的确认信息
  //   'set_activity_msg',
  //   // ---未使用
  //   'get_local_server_time',
  //   // 轮播请求的更新时间
  //   'updateHotReqTime',
  //   // 是否正在切换语言
  //   'set_is_language_changing',
  //   'set_menu_type',
  //   'set_hot_tab_item',
  //   'set_home_tab_item',
  //   'set_current_first_menu', //设置默认菜单
  //   'set_new_two_menu'  // 右侧球种下标
  // ])

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
  }

  // 赛事状态 0、赛事未开始 1、滚球阶段 2、暂停3、结束4、关闭5、取消6、比赛放弃7、延迟8、未知9、延期10、比赛中断
  /**
   * @description: 进行中(但不是收藏页)的赛事显示累加计时|倒计时
   * @param {Object} match 赛事对象
   * @return {Boolean}
   */
  const show_counting_down = (match) => {
    return [1, 2, 10].includes(+match.ms);
  }

  /**
   *@description 跳转活动逻辑，首页不用跳场馆
    *@param {Object} val 数据对象
    *@return {Undefined} undefined
    */
  const confirm = (val) => {
    if (!val.imgUrl) return
    if (val.comfirmTxt && userCtr.user_info.activityList) {
      // 设置跳转活动的确认信息
      set_activity_msg(val)
    } else {
      if (val.hostUrl.startsWith('http') && val.urlType === '2') {
        window.open(val.hostUrl, '_blank')
      } else if (val.urlType === '1') {
        if (/#*\/*details/.test(val.hostUrl) && $route.name != 'category') {
          const { groups: { mid, csid } } = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(val.hostUrl) || { groups: {} }
          if (mid && csid) {
            if ([100, 101, 102, 103].includes(+csid)) {  // 如果是电竞赛事，需要设置菜单类型
              set_menu_type(3000)
            }
            set_goto_detail_matchid(mid);
            set_details_item(0);
            $router.push({ name: 'category', params: { mid, csid } });
          }
        } else if (val.hostUrl == 'act' && userCtr.user_info.activityList) {
          $router.push({ name: 'activity_task', query: { rdm: new Date().getTime() } })
        } else if (val.hostUrl.startsWith('hot') && !get_golistpage) {
          let tid = val.hostUrl.split('/')[1]
          let is_existtid = get_hot_list_item && get_hot_list_item.subList && get_hot_list_item.subList.find(item => {
            return item.field2 == tid
          })
          if (tid && is_existtid) {
            set_home_tab_item({ component: 'hot', index: 1, name: '热门' })
            set_hot_tab_item({ field2: tid })
            useMittEmit(MITT_TYPES.EMIT_HOME_TAB)
          }
        }
      }
    }
  }
  /**
   *@description 活动的banner图片跟新
    *@param {Array} new_ 新值
    *@return {Undefined} undefined
    */
  const banner_img_updata = (new_) => {
    if (!new_ || !new_.length) return
    new_ = lodash.cloneDeep(new_)
    new_.forEach(item => {
      item.imgUrl = get_file_path(item.imgUrl)
    })

    if (carousel_data) {
      let arr = lodash.cloneDeep(_.get(carousel_data, 'list'))
      let arr1 = arr.filter(item => {
        return !item.imgUrl
      })
      // 去重轮播赛事mid
      arr1 = lodash.uniqBy(arr1, 'mid')
      // 加入banner
      arr1.unshift(...new_)

      // 1. carousel_data不为ListMap实例则进行实例化 2. 否则合并数据
      if (!(carousel_data instanceof ListMap)) {
        carousel_data = new ListMap("mid", arr1)
      } else {
        // 去重轮播赛事imgUrl
        carousel_data.list = arr1
      }
    }
  }
  /**
   *@description 页面尺寸变化处理
    *@return {Undefined} undefined
    */
  const window_resize_on = () => {
    clearTimeout(timer_1)
    timer_1 = setTimeout(() => {
      el_height = window.innerHeight - $refs.content.getBoundingClientRect().top
    }, 1000);
  }
  /**
   *@description 合并轮播图list数据
    *@return {Undefined} undefined
    */
  const updata_list = () => {
    // 展示banner loading
    show_banner_loading = true
    get_carousel((data) => {
      carousel_data.merge_list(carousel_data, new ListMap("mid", data))
    }).then(() => {
      // 语言切换完成
      set_is_language_changing(false)
      // 关闭banner loading展示
      show_banner_loading = false
    });
  }
  /**
   * @description: 获取轮播数据
   * @return {}
   */
  const get_carousel = (callback) => {
    return api_home.hot_ulike_recommendation({ isHot: 101 }).then(res => {
      const code = lodash.get(res, "code");
      let data = lodash.get(res, "data");
      if (code == 200 && data.length) {
        if (callback) {
          callback(data);
          // 更新获取轮播数据的时间,用于左右滑动轮播时,保持时间同步
          updateHotReqTime(Date.now())
        }
      }
    }).catch(err => {
    }).finally(() => {
      //添加活动banner图
      if (_.get(get_banner_obj, 'type1')) {
        banner_img_updata(get_banner_obj.type1)
      }
      //获取无轮播赛事背景图片
      if (!(_.get(carousel_data, 'list.length'))) {
        get_banner_url()
      }
    })
  }
  /**
   * @description: 清空轮播图数据
   */
  const clear_carousel_data = () => {
    $set(carousel_data, 'list', [])
  }
  /**
   * @description: 图标出错时
   * @param {Object} $event 错误事件对象
   */
  const league_icon_error = ($event) => {
    $event.target.src = UserCtr.theme.includes('y0') ? "image/bw3/png/banner_bg_y0.png" : "image/bw3/png/banner_bg.png";
    $event.srcElement.onerror = null
  }
  /**
   * @description: 菜单推送
   * @param {Object} skt_data 推送数据
   * @return {}
   */
  const ws_change_menu = (skt_data) => {

    upd_home_data((state) => {
      skt_data.forEach(list => {
        menu.forEach(item => {
          if (item.menuId == list.menuId) {
            item.count = list.count
          }
          item.subList.forEach(sub => {
            if (sub.menuId == list.menuId) {
              sub.count = list.count
            }
          })
        })
      })
    })
    $forceUpdate()
  }

  // /**
  //  * @description: 余额换算
  //  * @return {String} 转化后的金额 比如 '64,464.95'
  //  */
  // const format_balance = () => {
  //   let num = userCtr.user_info.balance
  //   if (!num || num < 0) {
  //     num = 0
  //   }
  //   let balance = (num).toString();
  //   let result = '';
  //   let [num1, num2 = '00'] = balance.split('.');
  //   num2 = num2.padEnd(2, '0')
  //   while (num1.length > 3) {
  //     result = ',' + num1.slice(-3) + result;
  //     num1 = num1.slice(0, num1.length - 3);
  //   }
  //   if (num1) { num1 = num1 + result; }
  //   balance_obj = {
  //     int: num1,
  //     dec: '.' + num2
  //   }
  // }
  const chang_index = (data) => {
    if([1,2,3].includes(get_home_menu_index)){
      data.forEach((item,index) =>{
        if(item.mi == get_home_menu_index){
          menu_index = index
          change_menu(index)
        }
      })
    }
  }
  //处理menu
  const menu_data_config = (data) => {
    new_menu = data
    chang_index(data)

    // 处理无数据的情况
    if (!new_menu.length) {
      noMenu = true
      no_menu_txt = "noMatch"
    } else {
      noMenu = false
    }

    if(new_menu.length && !new_menu[menu_index].sl.length){
      noData = true
      no_data_txt = "noMatch"
    }else{
      noData = false
    }
  }
  // 主内容 菜单数据处理
  const menu_data_loaded = (data) => {
    data = lodash.cloneDeep(data)
    let newData =  base_data.recombine_menu(data);
    save_home_data(data)
    menu_data_config(newData);
    return;
    // 今日和 滚球 位置互换
    let menu_index1 = -1, menu_index2 = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      // 如果是串关去除串关
      if (data[i].menuType == 11) {
        data.splice(i, 1)
      }
      if (data[i].menuType == 1) { menu_index1 = i }
      if (data[i].menuType == 3) { menu_index2 = i }
      // 解构赋值数组内元素交换
      if (menu_index1 >= 0 && menu_index2 >= 0 && menu_index1 < menu_index2) { // 滚球放到后面去
        [data[menu_index1], data[menu_index2]] = [data[menu_index2], data[menu_index1]];
      }
    }
    save_home_data(data)

    let subList = [], save_index = get_home_menu_index;
    //如果选中的menu存在，则对save_index进行处理
    let firstMenu = get_current_first_menu
    let extraMenuIds = ['407', '410'] //排除VR和电竞
    if (firstMenu && firstMenu.menuId && !extraMenuIds.includes(firstMenu.menuId)) {
      save_index = data.findIndex(item => item.menuId == firstMenu.menuId)
      set_current_first_menu(null)
    }
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[save_index] && data[save_index].count) {
        subList = data[save_index].subList
        menu_index = save_index
      } else {
        if (data[i] && data[i].count) {
          subList = data[i].subList
          menu_index = i
        }
      }
    }
    menu = data
    match_list = subList
    // 设置左边菜单选中下标
    set_home_menu_index(menu_index)

    if (!menu.length) {
      noMenu = true
      no_menu_txt = "noMatch"
    } else {
      noMenu = false
    }

    if (!match_list.length) {
      noData = true
      no_data_txt = "noMatch"
    } else {
      noData = false
    }
  }
  /**
   * @description: 获取列表数据
   * @return {}
   */
  const get_list = async () => {
    loading_done = false
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
      cuid: uid ? uid : '0', //用户ID/或UUid
      sys: 7 //1 panda 体育 ;3 188体育
    };
    send_gcuuid = uid();
    params.gcuuid = send_gcuuid;
    let obj_ = {
      // axios api对象
      axios_api: api_home.get_menu_init,
      // axios api对象参数
      params: params,
      // axios中then回调方法
      fun_then: res => {
        if (send_gcuuid != res.gcuuid) return;
        let code = lodash.get(res, "code");
        if (code == 200) {
          let data = lodash.get(res, "data");
          remove_crosstalk(data)
          loading_done = true
          //DB插入数据 缓存menu数据
          if (!_.isEmpty(data)) {
            //mi 作为主键
            db.menus_info.bulkAdd(data, 'mi')
            loading_done = true
          }
          menu_data_loaded(data);
          //URL地址带token认定是首次进入，所以首页列表数据加载完后要删除掉
          if (!location.search.includes('keep_url')) {
            history.replaceState(null, '', `${location.pathname}${location.hash}`)
          }
        } else {
          menu_data_loaded(menu_data);
          noMenu = true
          no_menu_txt = "noMatch"
        }
      },
      // axios中catch回调方法
      fun_catch: err => {
        noMenu = true
        no_menu_txt = "noMatch"
        loading_done = false
      },
      // 最大循环调用次数(异常时会循环调用),默认3次
      max_loop: 2,
      // 异常调用时延时时间,毫秒数,默认1000
      timers: 1000
    }
    // axios_api轮询调用方法
    const res = await $utils.axios_api_loop(obj_);
  }
  // 去除串关
  const remove_crosstalk = (data) => {
    for (let i = data.length - 1; i >= 0; i--) {
      // 如果是串关去除串关
      if (data[i].menuType == 11) {
        data.splice(i, 1)
      }
    }
  }
  /**
   * @description: 球种排序
   * @param {Object} data 全部数据
   * @return {Object} data 全部数据
   */
  const sort_data = (data) => {
    if (data.length) {
      data.forEach(item => {
        let arr = [],
          list = item.subList
        for (var i = 0; i < list.length; i++) {
          if (list[i].count) {
            arr.push(list[i])
            list.splice(i, 1)
            i--
          }
        }

        item.subList = [...arr, ...list]
      })
    }
    return data
  }
  /**
   * @description: 切换左侧菜单
   * @param {String} index 选中下标
   * @return {}
   */
  const change_menu = (index) => {
    // 埋点
    let objKey = {
      clickTime: "点击时间",
      userName: "用户名",
      userId: "用户ID",
      merchantId: "商户ID",
      languageVersion: "语言版本",
      terminal: "访问终端",
      eventLabel: "事件标签",
    }
    let _obj = {
      [objKey.eventLabel]: "",
      [objKey.clickTime]: new Date().Format('yyyy-MM-dd hh:mm:ss'),
      [objKey.userName]: lodash.get(userCtr, 'user_info.userName'),
      [objKey.userId]: lodash.get(userCtr, 'user_info.userId'),
      [objKey.merchantId]: lodash.get(userCtr, 'user_info.mId'),
      [objKey.languageVersion]: lodash.get(userCtr, 'user_info.languageName'),
      [objKey.terminal]: "H5",
    };
    //====================menu router
    if(menu_index == index) return
    let mi = new_menu[index].mi;
    menu_index = index
    set_home_menu_index(menu_index)
    $refs.list_area.setScrollPosition(0)
    animation = false
    // 动画效果
    if (home_timer1_) clearTimeout(home_timer1_)
      home_timer1_ = setTimeout(() => {
      animation = true
    }, 50)
    // console.error(new_menu[index],"mi====")
    // 电竞，vr一级菜单存储处理
    if(mi == 7){
      set_current_first_menu(mi)
    }else if(mi == 8){
      set_current_first_menu(0)
    }
    let newMeuRouter = {
      //H5_首页_虚拟体育
      8:{ name: 'virtual_sports', query: { home: 'home' } },
      '408':{
        name: 'matchList',
        query: {
          m: mi,
          token: userCtr.user_token
        }
      },
      7:{//H5_首页_电子竞技
        name: 'matchList',
        query: {
          m: mi,
          token: userCtr.user_token
        }
      }
    }
    $router.push(newMeuRouter[mi])
    return;
    if (407 == menu[index].menuId) {
      $utils.zhuge_event_send("H5_首页_虚拟体育", userCtr.user_info);
      $router.push({ name: 'virtual_sports', query: { home: 'home' } })
      return;
    }
    if (408 == menu[index].menuId) {
      $router.push({
        name: 'matchList',
        query: {
          m: menu[index].menuId,
          token: userCtr.user_token
        }
      });
    } else if (410 == menu[index].menuId) {
      _obj[objKey.eventLabel] = "H5_首页_电子竞技";
      $utils.zhuge_event_send("H5_首页_电子竞技", userCtr.user_info);
      let s = lodash.get(menu[index], 'subList[0].menuId').slice(-2)
      $router.push({
        name: 'matchList',
        query: {
          m: '410',
          // s,
          token: userCtr.user_token
        }
      });
    } else {
      if (menu[index].count >= 0) {
        if (menu_index == index) return false

        $refs.list_area.setScrollPosition(0)
        animation = false
        if (home_timer1_) clearTimeout(home_timer1_)
        home_timer1_ = setTimeout(() => {
          animation = true
          menu_index = index
          match_list = menu[index].subList
        }, 50)
        // 设置左边菜单选中下标
        set_home_menu_index(index)
      } else {
        $toast(t('home.match_no_has'), 800)
      }
    }
  }
  // /**
  //  * @description: 球类id转化背景
  //  * @param {String} id 球类id
  //  * @return {}
  //  */
  // const format_type = (id) => {
  //   return base_data.recombine_menu_bg(id)
  // }

  /**
   * @description 跳转列表页
   * @param {Object} item 列表球种数据
   */
  const to_list = (item,index) => {
    if (item.ct) {
      set_new_two_menu(index)
      const euid = base_data.get_euid(item.mi)
      set_current_sub_menuid(euid);
      set_current_first_menu(new_menu[menu_index].mi)
      $router.push({
        name: 'matchList',
        query: {
          m: new_menu[menu_index].mi,
          s: index,
          token: userCtr.user_token
        }
      });
    }else{
      $toast(t('home.match_no_has'), 800)
    }
    return;
    if (item.count) {
      let menuId = String(menu[menu_index].menuId),
        subId = String(item.menuId).replace(menuId, '');
      // 首页今日足篮
      if (item.parentId == '402') { // 今日
        if (item.menuType == 5) { // 足球
          $utils.zhuge_event_send('H5_首页_今日_足球_点击', userCtr.user_info);
        } else if (item.menuType == 7) { // 篮球
          $utils.zhuge_event_send('H5_首页_今日_篮球_点击', userCtr.user_info);
        }
      }

      $router.push({
        name: 'matchList',
        query: {
          m: menuId,
          s: subId,
          token: userCtr.user_token
        }
      });
    } else {
      // 如果菜单 没有加载成功，则点击也可以跳转到列表
      if (!loading_done) {
        let menuId = String(menu[menu_index].menuId),
          subId = String(item.menuId).replace(menuId, '');
        $router.push({
          name: 'matchList',
          query: {
            m: menuId,
            s: subId,
            token: userCtr.user_token
          }
        });
      } else {
        $toast(t('home.match_no_has'), 800)
      }
    }
  }

  /**
   * @description: 跳转详情页
   * @param {Object} item 轮播赛事数据
   */
  const to_details = (item) => {
    set_goto_detail_matchid(item.mid);
    set_details_item(0);
    $router.push({ name: 'category', params: { mid: item.mid, csid: item.csid } });
  }
    // 计算左边菜单按钮是否展示
  const calc_show2 = (item) => {
    if(item?.mi){
      if( item.mi == 7) return lodash.get(userCtr, 'user_info.openEsport') && lodash.get(item, 'sl').length > 0 // 电竞tob后台关闭隐藏
      if( item.mi == 8) return lodash.get(userCtr, 'user_info.openVrSport') // VRtob后台关闭隐藏
      return true
    }
  }
  /**
   * @description: 无轮播赛事背景图片
   * @return {}
   */
  const get_banner_url = () => {
    let url = userCtr.get_banner_url_first_page()
    if (url) {
      banner_bg = get_file_path(url)
    } else {
      banner_bg = `image/bw3/png/home_carousel_bg_${UserCtr.theme.includes('y0') ? 'y0_' : ''}${get_lang}.png`
    }
    sessionStorage.setItem('banner_bg', banner_bg)
  }
  // 刷新时banner左上角有短暂破碎小图（加载失败）显现，监听图片load事件做显示处理
  const showDefaultBanner = (e) => {
    defaultBannerShow = true
  }
  // 若线上图片加载错误，则使用本地默认banner
  const handleBannerError = (e) => {
    banner_bg = `image/bw3/png/home_carousel_bg_${UserCtr.theme.includes('y0') ? 'y0_' : ''}${get_lang}.png`
  }
  onMounted(() => {
    // 初始化菜单状态
    set_selector_w_m_i(0);
    set_date_menu_curr_i(0);
    set_current_sub_menuid('');
    set_curr_sub_menu_type('');
    // 浏览器窗口变化事件监听
    useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on);
    // 保证赛事框初始高度正确
    window_resize_on()
  })
    // ...mapGetters({
    //   get_ball_seed_menu: 'get_ball_seed_menu',
    //   // 用户信息,用户金额,userId 需要监听变化
    //   // 当前语言
    //   get_lang: 'get_lang',
    //   // 当用户未登录时返回uuid, 当用户登录时返回userId
    //   uid: "get_uid",
    //   // 用户令牌信息
    //   userCtr.user_token: "userCtr.user_token",
    //   // 左边菜单选中下标
    //   get_home_menu_index: "get_home_menu_index",
    //   // 首页菜单数据
    //   get_home_data: "get_home_data",
    //   // 当前主题
    //   UserCtr.theme: "UserCtr.theme",
    //   // 商户配置的图片地址和弹框信息
    //   get_banner_obj: "get_banner_obj",
    //   get_is_language_changing: "get_is_language_changing",
    //   get_last_home_tab_item: "get_last_home_tab_item",
    //   get_golistpage: 'get_golistpage',
    //   get_hot_list_item: 'get_hot_list_item',
    //   get_current_first_menu: 'get_current_first_menu' //用于获取选中的
    // }),

    const banner_loading_url = computed(() => {
      if (UserCtr.theme.includes('y0')) {
        return "image/wwwassets/bw3/home/banner_loading_y0.gif"
      } else {
        return "image/wwwassets/bw3/home/banner_loading.gif"
      }
    })
    const filter_meunu_desc = computed(() => {
      return (mi) => {
        if (get_ball_seed_menu.length < 1) return ''
        const type = base_data.recombine_menu_desc(mi)
        return get_ball_seed_menu[type]
      }
    })
  onUnmounted(() => {
    useMittOn(MITT_TYPES.EMIT_MENU_MATCH_COUNT_CHANGE, ws_change_menu).off;
    useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on).off;
    useMittOn(MITT_TYPES.EMIT_SHOW_DEFAULT_BANNER_EVENT, clear_carousel_data).off

    if (home_timer1_) {
      clearTimeout(home_timer1_)
      home_timer1_ = null
    }

    if (_.get(carousel_data, 'list.length')) {
      carousel_data.destroy && carousel_data.destroy()
    }
    //左侧菜单
    menu = []
    //右边内容
    match_list = []
    clearTimeout(timer_1)
    timer_1 = null

    // for (const key in $data) {
    //   $data[key] = null
    // }
  })

</script>

<style lang="scss" scoped>
.home-wrap {
  padding: 0 0.1rem;

  /*  轮播 */
  .slide {
    margin-top: 0.11rem;
    border-radius: 0.16rem;
    -webkit-appearance: none;
    overflow: hidden;
    height: 1.6rem;

    .banner-loading {
      display: block;
      width: .5rem;
      margin: .55rem auto;
    }

    ::v-deep.q-carousel {
      height: 100%;
      background: transparent;

      &.q-panel-parent {
        border-radius: .16rem;
        z-index: 9;
      }

      .q-carousel__slide {
        background: var(--q-color-img-bg-11) no-repeat center / cover;
        padding: 0;
      }

      .q-carousel__control {
        bottom: 0.08rem;
        margin: 0 !important;
      }
    }

    .act-banner.q-carousel__slide {
      background: none;
    }

    .info {

      height: 1.6rem;
      text-align: center;
      border-radius: 0.16rem 0.16rem 0 0;
      overflow: hidden;

      .info-wrap {
        font-size: 0.16rem;
        color: var(--q-color-com-fs-color-24);
        line-height: 0.2rem;
        padding: 0 0.2rem;
        align-items: center;
        justify-content: center;
        height: 0.56rem;
        flex-wrap: nowrap;
      }

      .sport-icon-wrap {
        --per: -0.24rem;
        width: auto;
        height: 0.16rem;
        width: 0.16rem;
        margin-right: 0.04rem;
        background: var(--q-color-com-img-bg-209) no-repeat 0 0 / 0.16rem 14.16rem;
      }

      .info-title {
        max-width: 2.9rem;
      }

      // 16个常规赛种和4个电竞赛种
      @each $csid,
      $y in (s1, 1),
      (s2, 3),
      (s3, 28),
      (s4, 2),
      (s5, 19),
      (s6, 4),
      (s7, 15),
      (s8, 7),
      (s9, 6),
      (s10, 22),
      (s11, 13),
      (s12, 10),
      (s13, 12),
      (s14, 20),
      (s15, 8),
      (s16, 14),
      (s101, 39),
      (s103, 40),
      (s102, 41),
      (s100, 42) {
        .#{$csid} {
          background-position-y: calc(var(--per) * #{$y});
        }
      }

      .info-more {
        display: flex;
        justify-content: center;
        padding: 0 0.08rem;

        /*  .home */
        .wrap-logo {
          height: 0.46rem;
          margin-bottom: 0.1rem;
          pointer-events: none;

          img {
            /* iPhone 11下需去掉宽高 */
            //width: 0.46rem;
            //height: 0.46rem;
            min-width: 0.46rem;
            min-height: 0.46rem;
            max-width: 0.46rem;
            max-height: 0.46rem;
          }

          .logo-double {
            margin-left: -0.14rem;
          }
        }

        .both-item {
          color: var(--q-color-com-fs-color-8);
          font-size: 0.14rem;
          /*line-height: 1;*/
          width: 1.1rem;
          text-align: center;
          padding-top: 1px;

          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .socre {
          min-width: 1rem;
          flex: 1;
        }

        .vs-wrap {
          .score-wrap {
            font-size: 0.36rem;
            color: var(--q-color-com-fs-color-8);
            display: flex;
            align-items: center;
            justify-content: center;

            .both-score {
              flex: 1;
              text-align: left;

              &:first-child {
                text-align: right;
              }
            }

            .crossing {
              flex: 0 0 0.1rem;
              height: 0.04rem;
              background: var(--q-color-com-fs-color-8);
              margin: 0 0.06rem;
            }
          }
        }

        .both-timer {
          flex: 1;
          height: 100%;
          color: var(--q-color-com-fs-color-8);
          display: flex;
          flex-direction: column;
          justify-content: center;

          ::v-deep.counting-down-wrap {
            left: 50%;
            transform: translate3d(-50%, 0, 0);
            max-width: 1rem;
            width: 1rem !important;
            height: 0.32rem;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            line-height: 1;
            font-size: 0.12rem;
            color: var(--q-color-com-fs-color-8);

            .title-space-1 {
              margin: 0;
            }

            .counting,
            .special {
              font-size: 0.12rem;
              line-height: 0.16rem;
              color: var(--q-color-com-fs-color-8);
            }
          }

          ::v-deep.counting-down-start {
            color: var(--q-color-com-fs-color-8);
          }
        }
      }
    }

    /* ************** 轮播icon *************** -S */
    .control {
      display: flex;
      justify-content: center;

      .control-item {
        margin-right: 0.06rem;
        width: 0.04rem;
        height: 0.01rem;
        border-radius: 0.03rem;
        background: var(--q-color-com-bg-color-27);
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }
      }

      .active {
        width: 0.1rem;
        background: var(--q-color-com-bg-color-12);
      }
    }

    .carousel_bg {
      width: 100%;
      height: 1.6rem;
    }
  }

  /* ************** 轮播icon *************** -E */
  /* 跑马灯、余额 */
  .wrap-notice {
    display: flex;
    align-items: center;
    margin: 0.14rem 0 0.1rem 0;

    .money-wrap {
      margin-right: 0.2rem;

      .balance-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 0.04rem;

        .icon-balance {
          width: 0.14rem;
          height: 0.14rem;
        }

        .balance {
          font-size: 0.12rem;

          margin: 0.03rem 0 0 0.05rem;
          line-height: 0.17rem;
        }
      }

      .money {

        line-height: 0.12rem;

        .int {
          font-size: 0.14rem;
        }

        .dec {
          font-size: 0.12rem;
        }
      }
    }

    .wrap-marquee {
      flex: 1;
      height: 0.3rem;
      border-radius: 0.15rem;

      display: flex;
      align-items: center;
      padding: 0 0.13rem 0 0.04rem;
      overflow: hidden;
      position: relative;

      .marquee-left-wrap {
        border-right-radius: 50%;
      }

      .marquee-icon {
        width: 0.24rem;
        height: 0.24rem;

        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.24rem;
        margin-right: 0.04rem;

        .icon-notice {
          width: 0.14rem;
          height: 0.14rem;
        }
      }

      .marquee {
        flex: 1;
        height: 0.3rem;
        overflow: hidden;
      }
    }
  }

  /*  赛事框 */
  .main-content-match {
    .match-warp {
      display: flex;
      height: 100%;
      margin: 0 0.1rem;

      ::v-deep.q-scrollarea {
        height: 100%;
      }
    }

    .left-menu {
      padding-top: 0.08rem;
      width: 0.55rem;
      margin-right: 0.13rem;
      overflow-x: hidden;
      /* 兼容火狐 */
      scrollbar-width: none;
      /* 兼容IE10+ */
      -ms-overflow-style: none;

      /* 使用伪类选择器 ::-webkit-scrollbar ,兼容chrome和safari浏览器 */
      &::-webkit-scrollbar {
        display: none;
      }

      .item {
        width: 0.53rem;
        height: 0.63rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        margin-bottom: 0.05rem;
        position: relative;

        .label {
          width: 100%;
          font-size: 0.11rem;
          line-height: 0.16rem;
          text-align: center;
          font-weight: bold;

          &.is_chinise {
            font-size: 0.14rem;
            width: 0.36rem;
          }
        }

        .num {
          font-size: 0.16rem;
          line-height: 0.19rem;
        }
      }
    }

    .match-content {

      flex: 1;

      .item {
        width: 100%;
        height: 1.22rem;
        padding-left: 0.2rem;
        background-repeat: no-repeat;
        margin-bottom: -0.03rem;
        display: flex;
        position: relative;

        .item-bg {
          width: 2.67rem;
          height: 1.028rem;
          position: absolute;
          left: 0;
          top: 0.11rem;
          z-index: -1;
          overflow: hidden;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 1rem;
          height: 100%;
          text-align: center;

          &.is-english {
            width: auto;
            align-items: flex-start;
          }

          .match-type {
            font-size: 0.18rem;
            width: 1rem;
            font-weight: bold;
            white-space: nowrap;
          }

          .match-num {
            width: 1rem;
            font-size: 0.4rem;
            height: 0.44rem;
            line-height: 0.44rem;
          }

          .match-label {

            font-size: 0.12rem;

            display: flex;
            align-items: center;
            line-height: 1;
            min-height: 0.15rem;

            &:before,
            &:after {
              content: "";
              width: 0.15rem;
              height: 0.01rem;

              position: relative;
            }

            &:before {
              margin-right: 0.04rem;
            }

            &:after {
              margin-left: 0.04rem;
            }
          }
        }
      }
    }
  }

  ::v-deep.q-scrollarea__thumb {
    opacity: 0 !important;
  }

  .fadeInUp {
    -webkit-animation: fadeInUp 1s;
    animation: fadeInUp 1s;
    animation-fill-mode: both;
  }

  @include keyframes(fadeInUp) {
    0% {
      -webkit-transform: translate3d(0, 5%, 0);
      transform: translate3d(0, 5%, 0);
    }

    10% {
      -webkit-transform: translate3d(0, 10%, 0);
      transform: translate3d(0, 10%, 0);
    }

    30% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }

    100% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }

  .wrap-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100);
  }
}
</style>


<style lang="scss">
.left-menu {
  .scroll {
    width: 0.7rem !important;
  }
}
</style>
