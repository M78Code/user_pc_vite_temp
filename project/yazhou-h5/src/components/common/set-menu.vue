<!--
 * @Author:
 * @Date:
 * @Description: 设置菜单
-->

<template>
  <div class="set-menu yb_fontsize12" @click.stop="change_show_status">
    <div class="filter-icon-wrapper yb-flex-center">
      <div class="img" v-if="get_theme.includes('theme01') && 3000 != menu_type"></div>
      <div class="img theme2" v-if="get_theme.includes('theme02') && 3000 != menu_type"></div>
      <div class="img esports" v-if="3000 == menu_type"></div>
    </div>
    <!--
      移除原有quasar侧边栏组件,因为quasar会强制将body改为绝对定位,影响赛事列表滚动数据
      @click.stop=""内部div阻止冒泡到容器div ,因为外部容器div被点击时会隐藏设置菜单
    -->
    <div class="filter-css-5" v-show="is_show_menu"></div>
    <div class="c-set-menu" @click.stop="is_show_menu = false" v-show="is_show_menu"
      :class="{show:is_show_menu,effect:wrapper_effect}" :style="{right:`-3.77rem`}">
      <div class="menu-inner" @click.stop="" :style="{width:`${calc_width}px`}">
        <!-- 关闭按钮 -->
        <div class="close-wrap">
          <div class="img" @click="is_show_menu = false"></div>
        </div>
        <!-- 用户信息 -->
        <div class="user-info border-bottom">
          <div class="user-name">Hi,{{user_info.userName}}</div>
          <div class="balance-wrap">
            <div class="balance yb_mr4" @click="get_balance">{{ format_money2(user_info.balance) }}</div>
            <div class="refesh" :class="{rotate:is_loading_balance}" @click="get_balance"></div>
          </div>
        </div>
        <!-- 排序 -->
        <div class="set-item" v-if="lodash.get(get_access_config, 'sortCut') &&route.name != 'virtual_sports' && route.name != 'virtual_sports_details' && menu_type !== 3000">
          <div class="icon set-icon-1"></div>
          <div class="name">{{t("setting_menu.footer_t_sort")}}</div>
          <div class="option" @click="sort_type_changed">
            <div class="op-item active">
              {{sort_type == 2?t("footer_menu.time2"):t("footer_menu.hot2")}}
            </div>
            <div class="op-icon"></div>
            <div class="op-item">
              {{sort_type == 2?t("footer_menu.hot2"):t("footer_menu.time2")}}
            </div>
          </div>
        </div>
        <!-- 盘口 -->
        <div class="set-item">
          <div class="icon set-icon-2"></div>
          <div class="name">{{t("setting_menu.handicap")}}</div>
          <div class="option" @click="change_odd">
            <div class="op-item active">{{get_cur_odd == 'EU'?t("setting_menu.odd_europe2"):t("setting_menu.odd_hong_kong2")}}</div>
            <div class="op-icon"></div>
            <div class="op-item">{{get_cur_odd == 'EU'?t("setting_menu.odd_hong_kong2"):t("setting_menu.odd_europe2")}}</div>
          </div>
        </div>
        <!-- 赔率 -->
        <div class="set-item no-border">
          <div class="icon set-icon-4"></div>
          <div class="name">{{t("setting_menu.footer_t_odds")}}</div>
          <div class="option" @click="set_is_accept">
            <div class="op-item active">{{get_is_accept == 2?t("setting_menu.odd_any2"):t("setting_menu.odd_optimal2")}}</div>
            <div class="op-icon"></div>
            <div class="op-item">{{get_is_accept == 2?t("setting_menu.odd_optimal2"):t("setting_menu.odd_any2")}}</div>
          </div>
        </div>
        <div class="line"></div>
        <!-- 版本 -->
        <div class="set-item">
          <div class="icon set-icon-3"></div>
          <div class="name">{{t("setting_menu.version")}}</div>
          <div class="option" @click="change_edition">
            <div class="op-item active">{{get_newer_standard_edition == 2?t("setting_menu.standard"):t("setting_menu.concise")}}</div>
            <div class="op-icon"></div>
            <div class="op-item">{{get_newer_standard_edition == 2?t("setting_menu.concise"):t("setting_menu.standard")}}</div>
          </div>
        </div>
        <!-- 语言 -->
        <div class="set-item no-border">
          <div class="icon set-icon-5"></div>
          <div class="name">{{t("setting_menu.chan_lan")}}</div>
          <div class="option option3" @click="is_show_lang = !is_show_lang">
            <i class="lang-icon yb_mr4" :class="`lang-${get_lang}`"></i>
            <div class="op-icon op-icon2"></div>
            <div class="op-item active" style="font-size: 0.14rem">{{t('setting_menu.lang')}}</div>
          </div>
        </div>
        <div class="lang-wrap" :class="{active:is_show_lang}">
          <template v-for="(item,index) in lang_obj">
            <div class="lang-item" :class="{active:get_lang == index}" :key="index" @click="setting_language_handle(index)">
              <i class="lang-icon yb_mr4" :class="`lang-${index}`"></i>
              <div class="col">{{item}}</div>
              <div class="icon"></div>
            </div>
          </template>
        </div>
        <div class="line"></div>
        <!-- 规则说明 -->
        <div class="set-item no-border" @click="go_description">
          <div class="icon set-icon-6"></div>
          <div class="name">{{t('setting_menu.rule_description')}}</div>
          <div class="option option2">
            <div class="yb-icon-arrow right"></div>
          </div>
        </div>
        <div class="line"></div>
        <!-- 换肤 -->
        <div class="set-item">
          <div class="icon set-icon-7"></div>
          <div class="name">{{t('setting_menu.skin')}}</div>
          <div class="skin-wrap">
            <div class="skin-icon skin-icon1" @click="handle_set_theme('theme01')"></div>
            <div class="skin-icon skin-icon2" @click="handle_set_theme('theme02')"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import {mapGetters, mapMutations, mapActions} from "vuex";
import { api_betting } from "src/project/api/index";
import userCtr from "src/core/user-config/user-ctr.js"
import { format_money2 } from "src/core/formart/index.js"
import lodash from 'lodash'


import { i18n, loadLanguageAsync } from 'src/boot/i18n'
import { computed, onUnmounted, watch } from "vue";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { useRoute, useRouter } from "vue-router"

  let route = useRoute()
  let router = useRouter()
  // 是否显示设置菜单
  let is_show_menu = ref(false)
  // 是否显示设置语言
  let is_show_lang = ref(false)
  // 余额是否加载中
  let is_loading_balance = ref(false)
  //弹出菜单宽度
  let calc_width = ref(260)
  let wrapper_effect = ref(true)

    // ...mapGetters({
    //   menu_type: "get_menu_type",           // 获取当前主菜单的menu_type
    //   user_info: "get_user",                // 当前登录的用户信息
    //   sort_type: 'get_sort_type',            // 排序 2 时间排序  1  热门排序
    //   get_is_accept:'get_is_accept',         // 1最佳赔率  2任何赔率
    //   get_newer_standard_edition:'get_newer_standard_edition',// 1新手版 2标准版
    //   get_lang:"get_lang",
    //   get_cur_odd:"get_cur_odd",
    //   get_virtual_data_loading:"get_virtual_data_loading",
    //   get_is_show_menu:"get_is_show_menu",
    //   get_theme:'get_theme',
    //   get_is_champion:'get_is_champion',
    //   get_v_pre_menu_type:'get_v_pre_menu_type',
    //   get_secondary_unfold_map:'get_secondary_unfold_map',
    //   get_access_config:'get_access_config',
    // }),
    // 语言选项
  const lang_obj = computed(() => {
      let obj = {
        'zh': '简体中文',
        'tw': '繁體中文',
        'en': 'English',
        'vi': 'Tiếng Việt',
        'th': 'ไทย',
        'ms': 'Melayu',
        'ad': 'Indonesia',
        "pt": "Português",
        "ko": "한국어",
        "es": "Español",
        "mya": "မြန်မာ",
        "ry": "Japanese",
      }
      let obj2 = {}
      try {
        let lang_str = user_info.languageList
        if (lang_str) {
          let lang_arr = lang_str.split(',')
          Object.keys(obj).forEach(item => {
            if (lang_arr.includes(item)) {
              obj2[item] = obj[item]
            }
          })
        }
      } catch (error) {
        // 若网络错误则默认展示所有可切换语种
        return obj
      }
      return obj2
    })
  const get_is_champion2 = computed(() => {
    // TODO: this
      // return get_is_champion()
    })
    //刷新金额loading时钟
    balance_timer = 0;
    cancel_loading_balance = debounce(cancel_loading_balance,200)
    calc_width = window.innerWidth * 100 * 2.6 / 375
    // set_is_show_menu(false)
    $root.$on(MITT_TYPES.EMIT_WINDOW_RESIZE,window_resize_handle);
    onUnmounted(() => {
      clearTimeout(balance_timer);
    balance_timer = null;

    useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE,window_resize_handle).off;
    debounce_throttle_cancel(cancel_loading_balance);
    })
  watch(() => is_show_menu, (newValue) => {
    // 将菜单的显示与隐藏放到全局
    set_is_show_menu(newValue)
  })
  watch(() => get_is_champion2, (split_new,old) => {
    // 冠军玩法只支持欧洲盘
    let old_odd = ''
    if(split_new){
      old_odd = get_cur_odd
        set_cur_odd('EU');
      }
      // 从冠军切到其他
      if(old && old_odd){
        set_cur_odd(old_odd);
      }
  })

    // ...mapActions([
    //   'fetch_balance',
    //   'set_theme',
    // ]),
    // ...mapMutations({
    //   set_cur_odd:"set_cur_odd",
    //   set_sort_type: 'set_sort_type',
    //   set_is_accept:'set_is_accept',
    //   set_newer_standard_edition:'set_newer_standard_edition',
    //   set_secondary_unfold_map:'set_secondary_unfold_map',
    //   set_lang:'set_lang',  //设置语言
    //   set_is_show_menu:'set_is_show_menu',
    //   set_user:'set_user',
    //   set_is_language_changing:'set_is_language_changing',
    //   set_collapse_csid_map:'set_collapse_csid_map',
    //   set_collapse_map_match:'set_collapse_map_match',
    //   set_global_route_menu_param:'set_global_route_menu_param',
    // }),
  const go_description = () => {
      const query = route.query
      router.push({path:`/rule_description/${route.name}`, query})
    }
    //设置语言
  const setting_language_handle = (key) => {
      if (['ry'].includes(key)) { // 这几个语言还没有做
        return
      }
      document.getElementById('loading-root-ele').style.visibility = 'initial';
      // 异步获取国际化数据,并设置
      loadLanguageAsync(key).then((res)=>{
        // 切换语言时，清空赛果接口缓存
        // sessionStorage.result_sub_menu_cache = ''
        // 清除相应对象状态
        set_global_route_menu_param({})
        set_user({languageName:key})
        set_lang(key);
        $i18n.local = key;
        is_show_lang = false;

        // 更新网站title
        const web_site_title = userCtr.get_web_title(key)
        document.title = web_site_title
      }).catch((err)=>{
        $toast(t('pre_record.cancle_fail_tips'), 2000);
      }).finally((res) => {
        document.getElementById('loading-root-ele').style.visibility = 'hidden';
      })
    }
    // 设置主题
  const handle_set_theme = (theme) => {
      const curr_theme = get_theme

      if (curr_theme.includes('y0')) {
        set_theme(theme + '_y0')
      } else {
        set_theme(theme)
      }
    }
    /**
     * 改变显示状态
     */
  const change_show_status = () => {
      if(get_virtual_data_loading) return;
      is_show_menu = !is_show_menu;
    }
    /**
     * @Description 排序类型改变
     * @param {Number} status 2时间排序 1热门排序
    */
  const sort_type_changed = () => {
      if(!lodash.get(get_access_config,'sortCut')){
        $toast(t(`common.temporarily_unavailable`), 2000)
        return
      }
      let status = sort_type == 1 ? 2 : 1

      // 排序类型改变前需清空赛事一键折叠map折叠状态
      set_collapse_csid_map({})
      set_collapse_map_match({})

      set_sort_type(status);
      useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD,{
        text:"sortRules",
      });
    }
    /**
     * @Description 切换盘口
     * @param {undefined} undefined
    */
  const change_odd = () => {
      if(get_is_champion()) return;  //冠军玩法点不动
      let odd = get_cur_odd == 'EU' ? 'HK' : 'EU'
      // 将盘口偏好记录到服务端
      api_betting.record_user_preference({userMarketPrefer:odd}).then().catch(err=>console.error(err))
      set_cur_odd(odd);
      set_user({userMarketPrefer:odd})
    }
    /**
     * @Description 切换版本
     * @param {undefined} undefined
    */
  const change_edition = () => {
      let edition = get_newer_standard_edition == 2 ? 1 : 2;

      set_newer_standard_edition(edition);
      set_secondary_unfold_map({});// 清空次要玩法折叠的记录，收起来
      // 发送埋点
      let zhuge_obj = {
        "版本类型": edition == 1 ? '简易' : '标准',
      }
      $utils.zhuge_event_send('TY_H5_菜单_版本_点击', user_info, zhuge_obj);
    }
    /**
     * @description 获取用户余额
     * @return {undefined} undefined
     */
  const get_balance = () => {
      is_loading_balance = true;
      clearTimeout(balance_timer);
      balance_timer = setTimeout(() => {
        cancel_loading_balance();
      },500);
      fetch_balance()
    }
    /**
     * @Description 取消余额loading
     * @param {undefined} undefined
    */
  const cancel_loading_balance = () => {
      is_loading_balance = false;
    }
    /**
     *@description 窗口宽度改变事件处理
     */
  const window_resize_handle = () => {
      calc_width = 2.6 * window.innerWidth / 3.75
    }
</script>

<style lang="scss" scoped>
.set-menu {
  .filter-icon-wrapper {
    width: 0.18rem;
    margin-right: 0.14rem;

    .img {
      width: 0.18rem;
      height: 0.18rem;
      // background-image: url('~public/image/wwwassets/bw3/menu/setting-menu-icon.svg');
      background-size: 100%;
      background-repeat: no-repeat;

      // &.theme2 {
      //   background-image: url('~public/image/wwwassets/bw3/menu/setting-menu-icon-theme02.svg');
      // }

      &.esports {
        background-image: var(--q-color-com-img-bg-73);
      }
    }
  }

  .filter-css-5 {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 1000;
  }

  .c-set-menu {
    width: 100%;
    height: 100%;
    top: 0;
    position: fixed;
    z-index: 1002;
    display: flex;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0.4);
    // backdrop-filter: blur(5px);

    &.show {
      right: 0 !important;
    }

    &.effect {
      transition: right 0.04s;
    }
  }

  .line {
    height: 0.1rem;
  }

  .menu-inner {
    height: 100%;
    padding-top: 0.1rem;
    overflow: auto;
  }
  // 关闭按钮
  .close-wrap {
    height: 0.3rem;
    position: relative;

    .img {
      position: absolute;
      right: 0.06rem;
      bottom: -10px;
      width: 0.4rem;
      height: 100%;
      background-size: 0.1rem;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  // 用户信息
  .user-info {
    position: relative;
    padding: 0 0.2rem 0.15rem 0.15rem;

    .balance-wrap {
      margin-top: 0.08rem;
      display: flex;
      font-size: 0.18rem;
      align-items: center;
      line-height: 1;
      height: 0.3rem;
    }

    /*  刷新按钮 */
    @include keyframes(loading-ring-animate) {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .refesh {
      width: 0.18rem;
      height: 0.18rem;
      background-repeat: no-repeat;
      background-size: 0.18rem;
      background-position: center;

      &.rotate {
        animation: 0.5s loading-ring-animate linear;
      }
    }

    .lottery-wrap {
      display: flex;
      align-items: center;

      .balance {
        margin-left: 0.05rem;
        flex: 1;
      }

      .prize-record {
        height: 22px;
        line-height: 20px;
        padding: 0 0.08rem;
        border-radius: 0.04rem;
      }
    }
  }

  //设置项
  .set-item {
    display: flex;
    align-items: center;
    height: 0.6rem;
    padding: 0 0.2rem 0 0.15rem;
    line-height: 1;

    .icon {
      width: 0.18rem;
      height: 0.18rem;
      // background: url("~public/image/bw3/menu/left_menubj.png") no-repeat 0 0 / 0.18rem 3.04rem;
      margin-right: 0.1rem;
      --per: -0.28rem;
    }

    @for $item from 1 through 7 {
      @if $item < 5 {
        .set-icon-#{$item} {
          background-position-y: calc(var(--per) * #{$item}) !important;
        }
      } @else if $item > 5 {
        .set-icon-#{$item} {
          background-position-y: calc(var(--per) * #{$item - 1}) !important;
        }
      }
    }

    .name {
      font-size: 0.14rem;
      flex: 1;
    }

    .option {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: right;
      position: relative;
      padding-right: 0.2rem;

      &.option2 {
        padding-right: 0px;
      }

      .op-item {
        font-size: 0.11rem;
        white-space: nowrap;
        line-height: 0.14rem;
        margin: 1px 0;

        &.active {
          font-size: 0.14rem;
        }
      }

      .op-icon {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 0.09rem;
        height: 0.09rem;
        background-size: 100%;
      }

      .op-icon2 {
        right: 0.03rem;
        transform: translateY(-5px);
        width: 0.05rem;
        height: 0.1rem;
      }

      .op-item2 {
        text-align: center;
        min-width: 0.4rem;
      }
    }
    .option3{
      flex-direction: row;
      align-items: center;
    }
    // 换肤
    .skin-wrap {
      display: flex;
      width: 0.7rem;
      height: 0.3rem;
      border-radius: 0.15rem;
      justify-content: space-between;
      align-items: center;

      .skin-icon {
        width: 0.3rem;
        height: 0.3rem;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
  // 语言包
  .lang-wrap {
    max-height: 0px;
    transition: max-height 0.3s;
    overflow: hidden;

    &.active {
      max-height: 5.58rem;
    }

    .lang-item {
      height: 0.44rem;
      font-size: 0.14rem;
      display: flex;
      padding-left: 0.43rem;
      padding-right: 0.2rem;
      align-items: center;

      &:last-child {
        border-bottom: none;
      }

      .icon {
        display: none;
        width: 0.11rem;
        height: 0.07rem;
      }

      &.active {
        .icon {
          display: block;
        }
      }
    }
  }
}
/* ************** 切换语言前面的图标 ************** -S */
.lang-icon{
  width: 0.16rem;
  height: 0.125rem;
  --per: -0.154rem;
  transform: translateY(-1px);
  background: var(--q-color-com-img-bg-136) no-repeat 0 0 / 0.16rem 1.82rem;
}

/*语言国旗图标*/
@each $code, $index in (en: 1, tw: 2, vi: 3, th: 5, ms: 4, ad: 6, mya: 7, ry: 8, pt: 9, ko: 10, es: 11) {
  .lang-#{$code} {
    background-position-y: calc(var(--per) * #{$index});
  }
}
/* ************** 切换语言前面的图标 ************** -E */
</style>
