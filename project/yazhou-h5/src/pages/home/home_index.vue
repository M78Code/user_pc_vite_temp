<!--
 * @Date: 2020-12-13 11:34:53
 * @Description: 首页入口文件
-->
<template>
  <div class="home home-page" :class="[home_class && `${home_class} white-font`,
  GlobalAccessConfig.get_hotMatchNum()&& tabIndex == 1 && 'white-background hot-bg', tabIndex == 2 && 'live-bg']" v-if="!tianzhuan">
    <!-- 头部tab 选项卡 -->
    <div class="flex justify-between align_items home-tab">
      <ul>
        <li v-for="(item,i) in tabList" :key="i" :class="[tabIndex == i ? 'is-active' : '']">
          <div class="tabs-label" ref="label" @click="tab_click(item, true,true)"> {{ item.name }} </div>
        </li>
        <!-- 下划线 -->
        <div class="tabs-active-bar" ref="tabs_active_bar" :class="{'add-animation': add_animation}"></div>
      </ul>

      <!-- 右边设置菜单 -->
      <set-menu style="margin-right:-0.2rem" />

    </div>

    <!-- 顶部切换 下边的内容组件 -->
    <component :is='currentContent' @hook:mounted="get_hot_tab_item_handle"></component>
  </div>
</template>

<script setup>
import {mapActions, mapGetters,mapMutations} from "vuex";
import home from "src/project/pages/home/first_page/index.vue";  // 包网3首页下边（轮播 + 跑马灯 + 赛事框）
import setMenu from "src/project/components/common/set_menu"; // 设置
import hot from "src/project/pages/home/hot/index";    // 热门页入口主页面
import live_video from "src/project/pages/home/live_video/index.vue";
import { loadLanguageAsync } from "boot/i18n";
import router_mixins from "src/project/mixins/router_mixins.js";
import utils from "src/core/utils/utils.js";
import { onUnmounted, watch } from "vue";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
  // mixins: [router_mixins],

  // 首页头部 tab 选项卡内容
  // 选项卡选择中的下标
  const tabIndex = ref(0)
  // 当前选中的组件
  const currentContent = ref('')
  // 热门页面的背景图样式
  const home_class = ref('')
  //是否要跳转到列表或者详情页
  const tianzhuan = ref(false)
  // 下划线是否 要动画
  const add_animation = ref(true)
  // components: {
  //   "home": home, // 内嵌版菜单
  //   "hot": hot,
  //   "live_video": live_video,
  //   'set-menu': setMenu,
  // },
  const tabList = computed(() => {
      let res = [];
        let tabList_ = [{
            index: 0,
            name: i18n.t('home.home'),
            component: 'home'
          },
          {
            index: 1,
            name: i18n.t('home.hot'),
            component: 'hot'
          },
          {
            index: 2,
            name: i18n.t('home.live_video'),
            component: 'live_video'
          }
        ];
        // 如果在后台系统 关闭 热门赛事，则前端手动 删掉 热门赛事
          if(!GlobalAccessConfig.get_hotMatchNum()){
          tabList_ = [
            {
              index: 0,
              name: i18n.t('home.home'),
              component: 'home'
            },
            {
              index: 1,
              name: i18n.t('home.live_video'),
              component: 'live_video'
            }
          ]
        }
        res = tabList_
      return res;
    })


  watch(() => tabIndex, (n) => {
    // 首页、视频直播以及热门下精选不显示背景
      if (get_hot_tab_item.index === 0 || get_home_tab_item.index !== 1) {
        home_class = ''
      }
  })
 // 监听 热门的tab 变化 home_class 名称作背景图
  watch(() => get_hot_tab_item, () => {
    handler = 'get_hot_tab_item_handle'
  })
    /**
     * 动态组件在创建时指定，不能在data中默认为'home'，
     * 否则每次进入到首页路由（home/hot/live_video）都会先创建'home'组件，
     * 从而发起不必要的http请求
     */
    currentContent = _.get(get_home_tab_item, 'component', 'home')

    set_menu_type('');
    //地址栏带有菜单和赛事id参数的话，跳转到对应的列表或者赛事详情页
    // to_corresponding_route()
    // 从列表页或者详情页返回首页时, 下划线判断是否要动画
    if(Object.keys(get_home_tab_item).length > 0){
      $nextTick(() => {
        // 如果本地有记录，则跳转到本地记录的原来的位置
        tab_click(get_home_tab_item, false,false)
      })
    }
    useMittOn(MITT_TYPES.EMIT_HOME_TAB, home_tab_change)
  onBeforeRouteEnter((to,from,next) => {
    // 在渲染该组件的对应路由被 confirm 前调用，也就是进入新的组件时不能获取组件实例 `this`，因为当守卫执行前，组件实例还没被创建
    next(() => {
      // 通过 `_this` 访问组件实例
      // beforeRouteEnter 是支持给 next 传递回调的唯一守卫。对于 beforeRouteUpdate 和 beforeRouteLeave 来说，this 已经可用了，所以不支持传递回调，因为没有必要了。
      _set_main_menu_dom_i(0);
      _set_current_sub_menuid('');
      _set_curr_sub_menu_type('');
      _set_current_esport_csid('');
      _set_current_menu(null);
    });
  })
    // ...mapMutations([
    //   // 赛事id
    //   'set_goto_detail_matchid',
    //   // 玩法tab 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
    //   'set_details_item',
    //   // 商户是否需要直接跳到列表页（url地址有label参数）
    //   'set_golistpage',
    //   // 当前选中的二级菜单id
    //   'set_current_sub_menuid',
    //   // 当前选中的二级菜单menu_type
    //   'set_curr_sub_menu_type',
    //   // 设置当前菜单类型，收藏菜单为6
    //   'set_menu_type',
    //   // 电竞游戏csid
    //   'set_current_esport_csid',
    //   // 当前选中的菜单
    //   'set_current_menu',
    //   // 主菜单选中项下标 (非展开的)
    //   'set_main_menu_dom_i',
    //   // 折叠展开与赛事对应
    //   'set_collapse_map_match',
    //   // 商户是否直接跳到的赛事详情页
    //   'set_godetailpage',
    //   // 全局路由菜单参数
    //   'set_global_route_menu_param',
    //   // 是否切换语言中
    //   'set_is_language_changing',
    //   // 设置用户信息
    //   'set_user',
    //   // 设置语言
    //   'set_lang',
    //   'set_last_home_tab_item',
    // ]),
    // ...mapActions({
    //   // 首页选中的下标
    //   set_home_tab_item: "set_home_tab_item",
    //   // 首页 热门当前选中的菜单
    //   set_hot_tab_item: "set_hot_tab_item",
    // }),
    const home_tab_change = () => {
      tab_click(get_home_tab_item, false,false)
    }
    /**
     *@description 监听器处理函数 热门菜单下顶部背景图切换
     *@param {Object} newVal 新值
     */
    const get_hot_tab_item_handle = (newVal) => {
      newVal = newVal || get_hot_tab_item
      if(!Object.keys(newVal).length) return

      // home_class = ''
      let calculation_category =[]
      const current_env = window.BUILDIN_CONFIG.current_env;
      // 开发环境 'local_dev' 压力测试环境 "local_ylcs"; 测试环境 "local_test"; 预发布 "idc_pre";
      //  试玩环境  "idc_sandbox"; 隔离预发布 "idc_lspre"; 生产环境  'idc_online'
      // 热门菜单背景图类名数组列表
      if(['idc_online', 'idc_lspre', 'idc_ylcs'].includes(current_env)){
        calculation_category = [
          {filed2:'180',value: `home_page_yc_${get_theme}`},
          {filed2:'320',value: `home_page_xj_${get_theme}`},
          {filed2:'239',value: `home_page_yj_${get_theme}`},
          {filed2:'276',value: `home_page_dj_${get_theme}`},
          {filed2:'122',value: `home_page_og_${get_theme}`},
          {filed2:'132',value: `home_page_NBA_${get_theme}`},
          {filed2:'208',value: `home_page_hll_${get_theme}`},
          {filed2:'146',value: `home_page_CBA_${get_theme}`},
          {filed2:'79',value: `home_page_fj_${get_theme}`},
          {filed2:'3169',value: `home_page_world_cup`},
          {filed2:'error',value: 'ball_error'},
        ]
      }else if(current_env === 'local_test'){
        calculation_category = [
          {filed2:'821797',value: `home_page_yc_${get_theme}`},
          {filed2:'821912',value: `home_page_xj_${get_theme}`},
          {filed2:'821361',value: `home_page_yj_${get_theme}`},
          {filed2:'821395',value: `home_page_dj_${get_theme}`},
          {filed2:'821866',value: `home_page_og_${get_theme}`},
          {filed2:'821596',value: `home_page_NBA_${get_theme}`},
          {filed2:'208',value: `home_page_hll_${get_theme}`},
          {filed2:'821549',value: `home_page_CBA_${get_theme}`},
          {filed2:'821866',value: `home_page_fj_${get_theme}`},
          {filed2:'822548',value: `home_page_world_cup`},
          {filed2:'error',value: 'ball_error'},
        ]
      }else if(current_env === 'idc_sandbox'){
        // todo...
      }

      // for(let i=0,len = calculation_category.length; i<len; i++) {
      //   // 加个jz_666 是用作首页 竞彩足球 背景墙用的
      //   if(newVal.chinaBetting && newVal.jz_666){
      //     return home_class = `home_page_jz_${get_theme}`
      //   }
      //   // 对应calculation_category 映射 关系，赋值给 home_class 名称作背景图显示用
      //   if(newVal.field2 == calculation_category[i].filed2){
      //     return home_class = calculation_category[i].value
      //   }
      // }

      // if(newVal.index != 0) {
      //   // 如果是电子
      //   if(['100','101','102','103'].includes(newVal.field1)){
      //     home_class = 'home_page_esport_'+newVal.field1;
      //     return ;
      //   }


        // if (!home_page_random) {
        //   home_page_random = 1
        // } else {
        //   home_page_random++

        //   if (home_page_random > 4) {
        //     home_page_random = 1
        //   }
        // }

        // home_page_random_obj为需要匹配背景图的映射对象
        // if (!home_page_random_obj) {
        //   home_page_random_obj = {}
        // }

        // 按赛种菜单顺序循环分配背景图
        // if (!home_page_random_obj[newVal.index]) {
        //   home_page_random_obj[newVal.index] = 'home_page_random_0' + home_page_random
        // }

        // home_class = home_page_random_obj[newVal.index]
      // }
    }
    /**
     *@description 点击一级tab 菜单切换
     *@param {Object} tab 数据对象
     *@param {Boolean} need_animation 是否需要动画
     *@param {Boolean} hand 是否手动点击触发
     */
    const tab_click = (tab, need_animation,hand) => {
      if(tab.index == tabIndex  || utils.is_time_limit(800)) {
        // 切换多语言需处理选中效果 样式
        if(tab.index == 0){
          calc_tab_select(tab)
        }
        return
      }
      set_collapse_map_match({});
      // need_animation 是否需要下划线的动画
      add_animation = !!need_animation
      tabIndex = tab.index

      // 更新last_home_tab_item
      set_last_home_tab_item(get_home_tab_item)

      set_home_tab_item(tab)
      hand && set_hot_tab_item({index:0})
      currentContent = tab.component

      calc_tab_select(tab)
      // 埋点采集热门赛事点击
      if (tab.index === 1) {
        $utils.zhuge_event_send('H5_热门赛事', vx_get_user);
      }
    }
    //计算选中居中偏移值
    const calc_tab_select = (tab) => {
      let dom_ = $refs
      let doc = dom_.tabs_active_bar;
      let dom_lable = dom_.label[tab.index]
      let width = (dom_lable.clientWidth * 0.7) + "px"; //	在页面上返回内容的可视宽度（不包括边框，边距或滚动条）
      doc.style.width = `${width}`;
      if (tabIndex == 0) {
        doc.style.left = dom_.label[0].clientWidth *0.15 + "px";
      }else {
        let left = (dom_lable.offsetLeft) + dom_lable.clientWidth *0.15 + "px"; // 返回当前元素的相对水平偏移位置的偏移容器
        doc.style.left = `${left}`;
      }
    }
    onUnmounted(() => {
      clearTimeout(lang_timer)
      lang_timer = null
       // 遍历vm.$data,清空组件data()内所有对象
      for (const key in $data) {
        $data[key] = null
      }
      useMittOn(MITT_TYPES.EMIT_HOME_TAB, home_tab_change).off
    })
</script>

<style lang="scss" scoped>
.home {
  padding: 0.12rem 0 0;
  position: fixed;
  width: 100%;
  max-width:3.78rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  /**** 预加载 赛种菜单背景图 ****/
  &.hot-bg::before {
    content: '';
    background-image:
         var(--q-color-com-img-bg-102),
         var(--q-color-com-img-bg-103),
         var(--q-color-com-img-bg-104),
         var(--q-color-com-img-bg-105),
         var(--q-color-com-img-bg-106);
  }

  &.ball_error {
    background-image:  var(--q-color-com-img-bg-107);
  }

  /*热门页面顶部背景图*/
  //  使用css变量统一管理，所以废弃这里代码，转为不遍历
  // @each $ball in CBA, dj, hll, jz, NBA, og, xj, yc, yj, fj {
  //   &[class*=home_page_#{$ball}_theme01] {
  //     background-image:  url("~public/image/bw3/png/home_page/home_page_#{$ball}.png");
  //   }
  //   &[class*=home_page_#{$ball}_theme02] {
  //     background-image:  url("~public/image/bw3/png/home_page/black_img/home_page_#{$ball}_theme02.png");
  //   }
  // }
    &[class*=home_page_CBA_theme01] {
      background-image: var(--q-color-com-img-bg-177);
    }

    &[class*=home_page_CBA_theme02] {
      background-image: var(--q-color-com-img-bg-187);
    }

    &[class*=home_page_dj_theme01] {
      background-image: var(--q-color-com-img-bg-178);
    }

    &[class*=home_page_dj_theme02] {
      background-image: var(--q-color-com-img-bg-188);
    }

    &[class*=home_page_hll_theme01] {
      background-image: var(--q-color-com-img-bg-179);
    }

    &[class*=home_page_hll_theme02] {
      background-image: var(--q-color-com-img-bg-189);
    }

    &[class*=home_page_jz_theme01] {
      background-image: var(--q-color-com-img-bg-180);
    }

    &[class*=home_page_jz_theme02] {
      background-image: var(--q-color-com-img-bg-190);
    }

    &[class*=home_page_NBA_theme01] {
      background-image: var(--q-color-com-img-bg-181);
    }

    &[class*=home_page_NBA_theme02] {
      background-image: var(--q-color-com-img-bg-191);
    }

    &[class*=home_page_og_theme01] {
      background-image: var(--q-color-com-img-bg-182);
    }

    &[class*=home_page_og_theme02] {
      background-image: var(--q-color-com-img-bg-192);
    }

    &[class*=home_page_xj_theme01] {
      background-image: var(--q-color-com-img-bg-183);
    }

    &[class*=home_page_xj_theme02] {
      background-image: var(--q-color-com-img-bg-193);
    }

    &[class*=home_page_yc_theme01] {
      background-image: var(--q-color-com-img-bg-184);
    }

    &[class*=home_page_yc_theme02] {
      background-image: var(--q-color-com-img-bg-194);
    }

    &[class*=home_page_yj_theme01] {
      background-image: var(--q-color-com-img-bg-185);
    }

    &[class*=home_page_yj_theme02] {
      background-image: var(--q-color-com-img-bg-195);
    }

    &[class*=home_page_fj_theme01] {
      background-image: var(--q-color-com-img-bg-186);
    }

    &[class*=home_page_fj_theme02] {
      background-image: var(--q-color-com-img-bg-196);
    }

  // 使用css变量统一管理，所以废弃这里代码，转为不遍历
  /*热门页面顶部背景图  电竞*/
  // @each $balles in 100,101,102,103 {
  //   &[class*=home_page_esport_#{$balles}] {
  //     background-image:  url("~public/image/bw3/png/home_page/home_page_esport_#{$balles}.png");
  //   }
  // }
    &[class*=home_page_esport_100] {
      background-image: var(--q-color-com-img-bg-197);
    }

    &[class*=home_page_esport_101] {
      background-image: var(--q-color-com-img-bg-198);
    }

    &[class*=home_page_esport_102] {
      background-image: var(--q-color-com-img-bg-199);
    }

    &[class*=home_page_esport_103] {
      background-image: var(--q-color-com-img-bg-200);
    }


  &.home_page_world_cup {
    background:  var(--q-color-com-img-bg-102) no-repeat center / cover;
  }
  // 使用css变量统一管理，所以废弃这里代码，转为不遍历
  // @for $random from 1 through 4 {
  //   &.home_page_random_0#{$random} {
  //     background:  url("~public/image/bw3/png/home_page/home_page_random_0#{$random}.png") no-repeat center / cover;
  //   }
  // }
  &.home_page_random_01 {
    background: var(--q-color-com-img-bg-201) no-repeat center/cover;
  }

  &.home_page_random_02 {
    background: var(--q-color-com-img-bg-202) no-repeat center/cover;
  }

  &.home_page_random_03 {
    background: var(--q-color-com-img-bg-203) no-repeat center/cover;
  }

  &.home_page_random_04 {
    background: var(--q-color-com-img-bg-204) no-repeat center/cover;
  }


  .home-tab {
    position: relative;
    padding: 0 0.23rem;
    /* 兼容 IOS<11.2 */
    padding-top: calc(0 + constant(safe-area-inset-top));
    /* 兼容 IOS>11.2 */
    padding-top: calc(0 + env(safe-area-inset-top));
  }

  ul {
    list-style: none;
    display: flex;
    position: relative;

    li {
      &.is-active {
        .tabs-label {
          font-weight: 700;
        }
      }

      .tabs-label {
        margin-right: 0.175rem;
        font-size: 0.16rem;
        border-width: 20px;
        position: relative;
      }
    }

    .tabs-active-bar {
      position: absolute;
      left: 0.0475rem;
      bottom: -0.04rem;
      width: 0.2rem;
      border-radius: 0.08rem;
      height: 0.03rem;
      box-sizing: border-box;
      z-index: 1;

      &.add-animation {
        transition: all 0.3s;
      }
    }
  }
}
</style>
