<!--
 * @Author:
 * @Date:
 * @Description: 设置菜单
-->
<template>
  <div class="set-menu yb_fontsize12" @click.stop="change_show_status">
    <div class="filter-icon-wrapper yb-flex-center">
      <div class="img" v-if="!is_esports" :style="compute_css_obj('menu-icon')"></div>
      <div class="img esports" v-else></div>
      <!-- //电竞的时候 底色黑色 所以图标换了 -->
    </div>
    <!--
      移除原有quasar侧边栏组件,因为quasar会强制将body改为绝对定位,影响赛事列表滚动数据
      @click.stop=""内部div阻止冒泡到容器div ,因为外部容器div被点击时会隐藏设置菜单
    -->
    <div class="filter-css-5" v-show="is_show_menu"></div>
    <div class="c-set-menu" @click.stop="is_show_menu = false" v-show="is_show_menu"
      :class="{ show: is_show_menu, effect: wrapper_effect }" :style="{ right: `-3.77rem` }">
      <div class="menu-inner" @click.stop="" :style="{ width: `${calc_width}px`, }">
        <!-- 关闭按钮 -->
        <div class="close-wrap">
          <div :style="compute_css_obj('icon-close')" class="img" @click="is_show_menu = false"></div>
        </div>
        <!-- 用户信息 -->
        <div class="user-info border-bottom">
          <div class="user-name">Hi,{{ user_info.userName }}</div>
          <div class="balance-wrap">
            <div class="balance yb_mr4" @click="get_balance">
              {{ format_money2(user_info.balance) }}
            </div>
            <div class="refesh" :style="compute_css_obj('menu-refesh')" :class="{ rotate: is_loading_balance }"
              @click="get_balance"></div>
          </div>
        </div>
        <!-- 排序 -->
        <div class="set-item" v-if="GlobalAccessConfig.get_sortCut() &&
          route.name != 'virtual_sports' &&
          route.name != 'virtual_sports_details' &&
          menu_type !== 3000
          ">
          <div class="icon set-icon-1" :style="compute_css_obj('menu-left-menu-image', 1)"></div>
          <div class="name">{{ i18n_t("setting_menu.footer_t_sort") }}</div>
          <div class="option" @click="sort_type_changed">
            <div class="op-item active">
              {{
                sort_type == 2 ? i18n_t("footer_menu.time2") : i18n_t("footer_menu.hot2")
              }}
            </div>
            <div class="op-icon" :style="compute_css_obj({key:'menu-set-switch'})"></div>
            <div class="op-item">
              {{
                sort_type == 2 ? i18n_t("footer_menu.hot2") : i18n_t("footer_menu.time2")
              }}
            </div>
          </div>
        </div>
        <!-- 盘口 -->
        <div class="set-item">
          <div class="icon set-icon-2" :style="compute_css_obj('menu-left-menu-image', 2)"></div>
          <div class="name">{{ i18n_t("setting_menu.handicap") }}</div>
          <div class="option" @click="change_odd">
            <div class="op-item active">
              {{
                cur_odd == "EU"
                ? i18n_t("setting_menu.odd_europe2")
                : i18n_t("setting_menu.odd_hong_kong2")
              }}
            </div>
            <div class="op-icon" :style="compute_css_obj({key:'menu-set-switch'})"></div>
            <div class="op-item">
              {{
                cur_odd == "EU"
                ? i18n_t("setting_menu.odd_hong_kong2")
                : i18n_t("setting_menu.odd_europe2")
              }}
            </div>
          </div>
        </div>
        <!-- 赔率 -->
        <div class="set-item no-border">
          <div class="icon set-icon-4" :style="compute_css_obj('menu-left-menu-image', 4)"></div>
          <div class="name">{{ i18n_t("setting_menu.footer_t_odds") }}</div>
          <div class="option" @click="BetData.set_bet_is_accept">
            <div class="op-item active">
              {{
                bet_is_accept
                ? i18n_t("setting_menu.odd_any2")
                : i18n_t("setting_menu.odd_optimal2")
              }}
            </div>
            <div class="op-icon" :style="compute_css_obj({key:'menu-set-switch'})"></div>
            <div class="op-item">
              {{
                bet_is_accept
                ? i18n_t("setting_menu.odd_optimal2")
                : i18n_t("setting_menu.odd_any2")
              }}
            </div>
          </div>
        </div>
        <div class="line"></div>
        <!-- 版本 -->
        <div class="set-item">
          <div class="icon set-icon-3" :style="compute_css_obj('menu-left-menu-image', 3)"></div>
          <div class="name">{{ i18n_t("setting_menu.version") }}</div>
          <div class="option" @click="UserCtr.set_standard_edition">
            <div class="op-item active">
              {{
                standard_edition == 2
                ? i18n_t("setting_menu.standard")
                : i18n_t("setting_menu.concise")
              }}
            </div>
            <div class="op-icon" :style="compute_css_obj({key:'menu-set-switch'})"></div>
            <div class="op-item">
              {{
                standard_edition == 2
                ? i18n_t("setting_menu.concise")
                : i18n_t("setting_menu.standard")
              }}
            </div>
          </div>
        </div>
        <!-- 语言 -->
        <div class="set-item no-border">
          <div class="icon set-icon-5" :style="compute_css_obj('menu-left-menu-image', 5)"></div>
          <div class="name">{{ i18n_t("setting_menu.chan_lan") }}</div>

          <div class="option option3" @click="is_show_lang = !is_show_lang">
            <i class="lang-icon yb_mr4" :style="compute_css_obj('menu-lang')" :class="`lang-${lang}`"></i>
            <div class="op-icon op-icon2" :style="compute_css_obj('menu-set-sort')"></div>
            <div class="op-item active" style="font-size: 0.14rem">
              <!-- {{ i18n_t("setting_menu.lang") }} -->
              {{ lang_obj[lang] }}
            </div>
          </div>
        </div>
        <div class="lang-wrap" :class="{ active: is_show_lang }">
          <template v-for="(   item, index   ) in    lang_obj   " :key="index">
            <div class="lang-item" :class="{ active: lang == index }" @click="setting_language_handle(index)">
              <i class="lang-icon yb_mr4" :style="compute_css_obj('menu-lang')" :class="`lang-${index}`"></i>
              <div class="col">{{ item }}</div>
              <div class="icon"></div>
            </div>
          </template>
        </div>
        <div class="line"></div>
        <!-- 规则说明 -->
        <div class="set-item no-border" @click="go_description">
          <div class="icon set-icon-6" :style="compute_css_obj('menu-left-menu-image', 6)"></div>
          <div class="name">{{ i18n_t("setting_menu.rule_description") }}</div>
          <div class="option option2">
            <div class="yb-icon-arrow right"></div>
          </div>
        </div>
        <div class="line"></div>
        <!-- 换肤 -->
        <div class="set-item">
          <div class="icon set-icon-7" :style="compute_css_obj('menu-left-menu-image', 7)"></div>
          <div class="name">{{ i18n_t("setting_menu.skin") }}</div>
          {{
            lodash.get(theme_map[theme], `i18n.${lang}`, '-')
          }}
          <div class="skin-wrap">
            <div class="skin-icon skin-icon1" v-for="(item, i) in theme_list" @click="UserCtr.set_theme(item.key)"
              :key="item.key" :style="compute_css_obj(i == 0 ? 'menu-theme-night' : 'menu-theme-day')">
              {{ item.i18n[lang] || item.key }}
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from "vue";
import { theme_list, theme_map } from "src/core/theme/"
import { api_account } from 'src/api/index';
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import { api_betting } from "src/api/index";
import { format_money2 } from "src/output/index.js";
import { debounce } from "lodash";
import BetData from "src/core/bet/class/bet-data-class.js";
import { loadLanguageAsync, compute_css_obj, useMitt, useMittEmit, MITT_TYPES, MenuData, UserCtr } from "src/output/index.js";
import { useRoute, useRouter } from "vue-router";
import { lang, sort_type, theme, standard_edition, user_info } from "src/base-h5/mixin/userctr";
import {is_esports } from "src/base-h5/mixin/menu";


let route = useRoute();
let router = useRouter();



// 是否显示设置菜单
let is_show_menu = ref(false);
// 是否显示设置语言
let is_show_lang = ref(false);
// 余额是否加载中
let is_loading_balance = ref(false);

//弹出菜单宽度
let calc_width = ref(260);
let wrapper_effect = ref(true);


const bet_is_accept = ref(BetData.bet_is_accept)// 赔率
const cur_odd = ref(BetData.cur_odd)// 盘口
const lang_obj = ref(get_lang_list())//语言列表
const { menu_type } = MenuData; //菜单选中项
const is_champion = ref(BetData.get_is_champion())//是否冠军玩法

/**
 * 监听用户信息改变
*/
watch(()=>UserCtr.user_version, () => {
  lang_obj.value = get_lang_list() //获取语言列联表
})
/**
 * 监听投注信息改变
*/
watch(BetData.bet_data_class_version, () => {
  bet_is_accept.value = BetData.bet_is_accept//是否介绍任何赔率
  is_champion.value = BetData.get_is_champion()//是否冠军玩法
  cur_odd.value = BetData.cur_odd//盘口
})

// 语言选项
function get_lang_list() {
  let obj = {
    zh: "简体中文",
    tw: "繁體中文",
    en: "English",
    vi: "Tiếng Việt",
    th: "ไทย",
    ms: "Melayu",
    ad: "Indonesia",
    pt: "Português",
    ko: "한국어",
    es: "Español",
    mya: "မြန်မာ",
    ry: "Japanese",
  };
  let obj2 = {};
  try {
    let lang_str = user_info.languageList;
    if (lang_str) {
      let lang_arr = lang_str.split(",");
      Object.keys(obj).forEach((item) => {
        if (lang_arr.includes(item)) {
          obj2[item] = obj[item];
        }
      });
    } else {
      return obj;
    }
  } catch (error) {
    // 若网络错误则默认展示所有可切换语种
    return obj;
  }
  return obj2;
};
/**
 * @Description 取消余额loading
 * @param {undefined} undefined
 */
let cancel_loading_balance = () => {
  is_loading_balance.value = false;
};
/**
 *@description 窗口宽度改变事件处理
 */
const window_resize_handle = () => {
  calc_width = (2.6 * window.innerWidth) / 3.75;
};
//刷新金额loading时钟
let balance_timer = 0;
cancel_loading_balance = debounce(cancel_loading_balance, 200);
calc_width = (window.innerWidth * 100 * 2.6) / 375;
useMitt(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_handle);
onUnmounted(() => {
  clearTimeout(balance_timer);
  balance_timer = null;
  // debounce_throttle_cancel(cancel_loading_balance);
});

// 冠军玩法只支持欧洲盘
watch(is_champion,
  (split_new, old) => {
    // 冠军玩法只支持欧洲盘
    let old_odd = "";
    if (split_new) {
      old_odd = cur_odd;
      BetData.set_cur_odd("EU"); //bet有一个
      UserCtr.set_cur_odds("EU");//userctr也有一个
    }
    // 从冠军切到其他
    if (old && old_odd) {
      BetData.set_cur_odd(old_odd); //bet有一个
      UserCtr.set_cur_odds(old_odd);//userctr也有一个
    }
  }
);

const go_description = () => {
  const query = route.query;
  router.push({ path: `/rule_description/${route.name}`, query });
};
//设置语言
const setting_language_handle = (key) => {
  if (["ry"].includes(key)) {
    // 这几个语言还没有做
    return;
  }
  // document.getElementById("loading-root-ele").style.visibility = "initial";
  api_account.set_user_lang({ token: UserCtr.get_user_token(), languageName: key }).then(res => {
      let code = lodash.get(res, 'code');
      if (code == 200) {
          // 设置国际化语言
          loadLanguageAsync(key).then().finally(() => {
            // 会设置{ languageName: key }
            UserCtr.set_lang(key);
            // $i18n.local = key;
            is_show_lang.value = false;
            // 更新网站title
            document.title = UserCtr.get_web_title(key);
          })
      } else if (code == '0401038') {
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("common.code_empty"))
      }
  })
};
/**
 * 改变显示状态
 */
const change_show_status = () => {
  // if (get_virtual_data_loading) return;
  is_show_menu.value = !is_show_menu.value;
};
/**
 * @Description 排序类型改变
 * @param {Number} status 2时间排序 1热门排序
 */
const sort_type_changed = () => {
  if (!GlobalAccessConfig.get_sortCut()) {
    $toast(i18n_t(`common.temporarily_unavailable`), 2000);
    return;
  }
  let status = sort_type.value == 1 ? 2 : 1;
  sort_type.value = status
  // 排序类型改变前需清空赛事一键折叠map折叠状态
  // set_collapse_csid_map({});
  // set_collapse_map_match({});
  //TODO 等列表变化
  UserCtr.set_sort_type(status);
};
/**
 * @Description 切换盘口
 * @param {undefined} undefined
 */
const change_odd = () => {
  if (is_champion.value) return; //冠军玩法点不动
  let odd = cur_odd.value == "EU" ? "HK" : "EU";
  BetData.set_cur_odd(odd); //bet有一个
  UserCtr.set_cur_odds(odd);//userctr也有一个
  UserCtr.set_user_base_info({ userMarketPrefer: odd });
  // 将盘口偏好记录到服务端
  api_betting
    .record_user_preference({ userMarketPrefer: odd })
    .then()
    .catch((err) => console.error(err));
};
/**
 * @description 获取用户余额
 * @return {undefined} undefined
 */
const get_balance = () => {
  is_loading_balance.value = true;
  clearTimeout(balance_timer);
  balance_timer = setTimeout(() => {
    cancel_loading_balance();
  }, 500);
  UserCtr.get_balance();
};
</script>

<style lang="scss" scoped>
@import url("src/base-h5/css/pages/set-menu.scss");

.set-menu {
  .filter-icon-wrapper {
    width: 0.18rem;
    margin-right: 0.14rem;

    .img {
      width: 0.18rem;
      height: 0.18rem;
      // background-image: url('/image/wwwassets/bw3/menu/setting-menu-icon.svg');
      background-size: 100%;
      background-repeat: no-repeat;

      // &.theme2 {
      //   background-image: url('/image/wwwassets/bw3/menu/setting-menu-icon-theme02.svg');
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
      background-size: 0.1rem !important;
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
    @keyframes loading-ring-animate {
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
      background-size: 0.18rem 3.04rem !important;
      margin-right: 0.1rem;
      --per: -0.28rem;
    }

    @for $item from 1 through 7 {
      @if $item < 5 {
        .set-icon-#{$item} {
          background-position-y: calc(var(--per) * #{$item}) !important;
        }
      }

      @else if $item >5 {
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

    .option3 {
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
.lang-icon {
  width: 0.16rem;
  height: 0.125rem;
  --per: -0.154rem;
  transform: translateY(-1px);
  background-repeat: no-repeat;
  background-size: 0.16rem 1.82rem;
}

/*语言国旗图标*/
@each $code,
$index in (en: 1,
  tw: 2,
  vi: 3,
  th: 5,
  ms: 4,
  ad: 6,
  mya: 7,
  ry: 8,
  pt: 9,
  ko: 10,
  es: 11) {
  .lang-#{$code} {
    background-position-y: calc(var(--per) * #{$index});
  }
}

/* ************** 切换语言前面的图标 ************** -E */
</style>