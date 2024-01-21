<!--
 * @Description 公共设置组件
-->
<template>
  <div class="g-settings" style="max-width: 350px">
    <q-menu
      v-model="show_g_settings"
      self="bottom middle"
      :offset="[0, -32]"
      :content-class="'g-settings-style'"
      class="g-settings-style"
    >
      <q-list  class="rounded-borders list">
        <div v-for="(settings, key) in settings_items_list" :key="settings.id">
          <!-- 全局设置项 -->
          <q-expansion-item
             group="settings"
            :expand-icon-class="
              settings.type === 'switch' ? 'settings-no-expand' : ''
            "
            :header-class="
              settings.type === 'switch' ? 'settings-item-header' : ''
            "
            expand-icon="icon-triangle1"
          >
            <template v-slot:header>
              <!-- 设置项 图标 -->
              <q-item-section side>
                <i
                  class="icon settings-icon"
                  :style="
                    compute_css_obj({ key: 'pc-search-icon' })
                  "
                ></i>
                <!-- <i class="icon settings-icon" :style="compute_css_obj({key:'pc-home-list-score-active'})"></i> -->
                <!-- <i class="icon settings-icon" :style="compute_css_obj({key:'icon-setting'})"></i> -->
              </q-item-section>

              <!-- 设置项 名称 -->
              <q-item-section>
                <div class="settings-label">{{ settings.name }}</div>
              </q-item-section>

              <!-- 设置项 当前状态 -->
              <q-item-section side>
                <div class="row items-center">
                  <!-- 盘口/多语言 -->
                  <div class="curr-item" v-if="settings.id == 1">
                    <template v-if="settings.id === 1">{{
                      i18n_t("odds")[cur_odd]
                    }}</template>
                    <template v-else-if="settings.id === 2">{{
                      i18n_langs[UserCtr.lang]
                    }}</template>
                  </div>

                  <!-- 主题设置 -->
                  <div
                    v-else-if="settings.id == 3"
                    @click="change_theme"
                    class="skin-toggle"
                  >
                    <div class="skin-icon skin-icon-day"></div>
                    <div class="skin-icon skin-icon-night"></div>
                  </div>
                  <!-- 主题设置 -->
                  <div
                    v-else-if="settings.id == 4"
                    @click="change_theme"
                    class="skin-toggle"
                  >
                    全部
                  </div>
                  <!-- 列表附加玩法默认展示 -->
                  <div
                    v-else-if="settings.id == 5"
                    @click="change_setting_additional_plays"
                    class="skin-toggle"
                  >
                    <div
                      class="skin-icon"
                      :class="{ 'skin-icon-off': get_show_additional_plays }"
                    ></div>
                    <div
                      class="skin-icon"
                      :class="{ 'skin-icon-night': !get_show_additional_plays }"
                    ></div>
                  </div>
                  <!-- 附加玩法 -->
                  <div
                    v-else-if="settings.id == 6"
                    @click="change_setting_additional_plays"
                    class="skin-toggle"
                  >
                    全部行
                  </div>
                  <div
                    v-else-if="settings.id == 7"
                    @click="change_setting_additional_plays"
                    class="skin-toggle"
                  >
                    <div
                      class="skin-icon"
                      :class="{ 'skin-icon-off': get_show_additional_plays }"
                    ></div>
                    <div
                      class="skin-icon"
                      :class="{ 'skin-icon-night': !get_show_additional_plays }"
                    ></div>
                  </div>
                </div>
              </q-item-section>
            </template>

            <q-card class="setting-card" v-if="settings.type === 'select'">
              <q-card-section>
                <!-- 盘口选项 -->
                <template v-if="settings.id === 1">
                  <template v-for="(item, index) in settings.value_arr">
                    <div
                      v-if="['EU', 'HK'].includes(item.value)"
                      :key="index"
                      class="child-item item-odds relative-position"
                      :class="cur_odd == item.value && 'active'"
                      @click="on_click_handicap(item)"
                    >
                      {{ item.label }}
                      <i
                        v-if="cur_odd == item.value"
                        class="icon-triangle3 q-icon c-icon arrow-show"
                      ></i>
                    </div>
                  </template>
                </template>

                <!-- 多语言选项 -->
                <template v-else-if="settings.id === 2">
                  <template v-for="(language, index) in settings.value_arr">
                    <div
                      v-if="languageList.includes(language)"
                      :key="index"
                      class="child-item ellipsis relative-position"
                      :class="[{ active: UserCtr.lang == language }]"
                      @click="on_click_lang(language)"
                    >
                      <span
                        :class="['flag', language]"
                        :style="
                          compute_css_obj({
                            key: 'pc-popup-language-icon-image',
                            position: language,
                            theme: 'local',
                          })
                        "
                      ></span
                      >{{ i18n_langs[language] }}
                      <i
                        v-if="UserCtr.lang == language"
                        class="icon-triangle3 q-icon c-icon arrow-show"
                      ></i>
                    </div>
                  </template>
                </template>
                <!-- 近期开赛 -->
                <template v-if="settings.id === 4">
                  <div class="kicfoff_list">
                    <div
                      v-for="(item, i) in settings.value_arr"
                      :key="i"
                      @click="onClick(opt, i)"
                      class="option"
                    >
                      <span class="text">{{ item.label }}</span>
                    </div>
                  </div>
                </template>

                <!-- 列表附加玩法配置 -->
                <template v-else-if="settings.id == 6">
                   <div class="kicfoff_list">
                    <div
                      v-for="(item, i) in settings.value_arr"
                      :key="i"
                      @click="onClick(opt, i)"
                      class="option"
                    >
                      <span class="text">{{ item.label }}</span>
                    </div>
                  </div>
                </template>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import lodash from "lodash";
import { i18n_t } from "src/boot/i18n.js";

import store from "src/store-redux/index.js";
import { api_account, api_betting, api_details } from "src/api";
import i18n_langs from "src/i18n/pc/langs/index.mjs";
import { loadLanguageAsync } from "src/output/index.js";
import { useMittEmit, MITT_TYPES, compute_css_obj } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import { theme_map } from "src/core/theme/";
import MenuData from "src/core/menu-pc/menu-data-class.js";
import comSelect from "src/base-pc/components/match-results/select/select/index.vue";
// import  sprite_img  from   "src/core/server-img/sprite-img/index.js"

// import { update_bet_item_info as virtual_common_update_bet_item_info } from 'src/core/common-helper/virtual_common.js'
// import { update_bet_item_info as yabo_common_update_bet_item_info } from 'src/core/common-helper/common.js'

const props = defineProps({
  el: {
    type: String,
    default: "",
  },
  show_settings: {
    type: Boolean,
    default: false,
  },
  settings_items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["auto_close"]);

const route = useRoute();
const router = useRouter();

const skin = ref(false);

const show_g_settings = ref(props.show_settings);

/** 上次赔率 */
const cur_odd = ref(BetData.cur_odd || "EU");
/** 上次赔率 */
const pre_odds = ref(UserCtr.pre_odds || "EU");
/** true: 单关投注 false: 串关投注 */
const is_bet_single = ref(BetData.is_bet_single);
/** 单关投注对象 */
const bet_single_obj = ref(BetData.bet_single_obj || {});
/** 串关投注对象 */
const bet_obj = ref(BetData.bet_obj || {});
/** 串关投注对象 */
const is_virtual_bet = ref(BetData.is_virtual_bet);
/** 当前菜单类型 play 滚球  hot热门赛事   virtual_sport虚拟体育   winner_top冠军聚合页 today 今日   early早盘 bet串关 */
const left_menu_toggle = ref(BetData.left_menu_toggle);
//获取当前菜单信息
const vx_cur_menu_type = MenuData.cur_menu_type;
/** 虚拟投注列表对象 */
const cur_menu_type = ref({});
// 附加盘配置
const get_show_additional_disk = "get_show_additional_disk";
// 附加玩法
const get_show_additional_plays = "get_show_additional_plays";
// 附加玩法配置
const get_additional_plays_list_num = "get_additional_plays_list_num";
// 附加玩法配置展示更多行数
const show_more_other_list_obj = {};
/** stroe仓库 */
const unsubscribe = store.subscribe(() => {
  cur_menu_type.value = new_state.cur_menu_type;
});
onUnmounted(unsubscribe);

/** 语言列表 */
const languageList = computed(() =>
  lodash.get(UserCtr.get_user(), "languageList", [])
);

// 菜单收起隐藏新版本切换
const settings_items_list = computed(() => {
  let type_name = vx_cur_menu_type.type_name;

  let list = JSON.parse(JSON.stringify(props.settings_items));
  // 今日才显示近期开赛
  //   if(!['today'].includes(type_name)) {
  //     list = list.filter(item=>item.id!==3)
  //   }
  //   if (this.get_version==2) {
  //     list = list.filter(item=>![4,5,6].includes(item.id))    // 新手版不需要显示附加玩法配置
  //   }
  return list;
});
/**
 * @Description:切换盘口
 * @param {object} row 盘口数据
 * @return {undefined} undefined
 */
function on_click_handicap(row) {
  if (cur_odd.value != row.value) {
    set_user_preference(row.value);
  }
  emit("auto_close");
}
/**
 * @Description:设置用户偏好
 * @param {string} curr_odd 目标盘口
 * @return {undefined} undefined
 */
function set_user_preference(curr_odd) {
  if (curr_odd) {
    let old_odd = cur_odd.value;
    let old_pre_odd = pre_odds.value;
    UserCtr.set_pre_odd(curr_odd);
    BetData.set_cur_odd(curr_odd);
    // 设置用户偏好
    api_betting
      .record_user_preference({ userMarketPrefer: curr_odd })
      .then((res) => {
        let code = lodash.get(res, "data.code");
        if (code != 200) {
          UserCtr.set_pre_odd(old_pre_odd);
          BetData.set_cur_odd(old_odd);
        }
      })
      .catch((err) => {
        console.error(err);
        UserCtr.set_pre_odd(old_pre_odd);
        BetData.set_cur_odd(old_odd);
      });
  }
}
/**
 * 近期开赛筛选
 */
function select_time_change(item) {
  this.time_value = item.value;
  //设置session
  sessionStorage.setItem("is_select_time", "1");
  //   this.set_select_time(item.value);
  //清空联赛筛选条件
  //   this.set_filter_select_obj([]);
  //   this.$root.$emit(this.emit_cmd.EMIT_FETCH_MATCH_LIST);
}

/**
 * @Description:切换语言
 * @param {string} lang_ 语言
 * @return {undefined} undefined
 */
function on_click_lang(lang_) {
  if (route.name == "search") {
    router.push("/home");
  }
  // 冠军菜单不支持语言切换投注项名称国际化
  // TODO:
  // let is_winner = $menu.menu_data.match_tpl_number == 18;
  let is_winner = false;
  let fun = () => {
    if (!is_winner && UserCtr.lang != lang_) {
      /* ids:是各种id，格式：赛事id-玩法id-盘口id-投注项id,赛事id-玩法id-盘口id-投注项id,...
            type:0表示普通赛事(默认值)，1虚拟赛事 */
      let type = is_virtual_bet.value ? 1 : 0;
      let ids = [],
        bet_type;
      if (is_virtual_bet.value) {
        bet_type = cur_menu_type.value;
      } else if (is_bet_single.value) {
        bet_type = bet_single_obj.value;
      } else {
        bet_type = bet_obj.value;
      }
      for (let obj of Object.values(bet_type)) {
        let match_id = lodash.get(obj, "cs.match_id", "");
        let handicap_id = lodash.get(obj, "cs.handicap_id", "");
        let play_id = lodash.get(obj, "cs.play_id", "");
        let oid = lodash.get(obj, "cs.oid", "");
        if (
          !lodash.isEmpty(match_id) &&
          !lodash.isEmpty(handicap_id) &&
          !lodash.isEmpty(play_id) &&
          !lodash.isEmpty(oid)
        ) {
          ids.push(`${match_id}-${play_id}-${handicap_id}-${oid}`);
        }
      }
      if (!lodash.isEmpty(ids)) {
        // TODO:
        if ($menu.menu_data.is_esports) {
          type = 2;
        }
        let params = {
          ids: ids.join(","),
          type,
        };
        api_details
          .get_bet_olds(params)
          .then((res) => {
            let data = lodash.get(res, "data.data");
            if (lodash.isArray(data) && data.length > 0) {
              if (is_virtual_bet.value) {
                // TODO: this?
                // virtual_common_update_bet_item_info( data);
              } else {
                // yabo_common_update_bet_item_info( data);
              }
              useMittEmit(MITT_TYPES.EMIT_UPDATE_HOME_AWAY_CMD, {});
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
  if (UserCtr.lang != lang_) {
    let user = UserCtr.get_user();
    api_account
      .set_user_lang({ token: user.token, languageName: lang_ })
      .then((res) => {
        let code = lodash.get(res, "data.code");
        if (code == 200) {
          UserCtr.set_lang(lang_);
          set_lang(lang_);
          // TODO:
          window.reset_lang = lang_;
          // 设置即将开赛筛选默认值为全部
          // TODO:
          // this.$store.state.filter.open_select_time = null;
          // 设置国际化语言
          loadLanguageAsync(lang_)
            .then()
            .finally(() => {
              fun();
              window.reset_lang = "";
            });
        } else if (code == "0401038") {
          useMittEmit(
            MITT_TYPES.EMIT_SHOW_TOAST_CMD,
            i18n_t("common.code_empty")
          );
        }
      });
  }
}

/**
 * @Description:切换主题
 * @return {undefined} undefined
 */
function change_theme() {
  console.log("fsudhfudshgbsdghsdg");
  const theme = UserCtr.theme;
  const ary = Object.keys(theme_map);
  let idx = ary.findIndex((i) => i == theme);
  if (idx == -1) {
    //没有找到当前主题 切回第一个
    idx = 0;
  } else {
    // 取下一个主题  3+1 % 5 =4
    idx = (idx + 1) % ary.length;
  }
  /** 设置主题 */
  UserCtr.set_theme(ary[idx]);
  emit("auto_close");
}
</script>
  
<style  lang="scss">
.list {
  background: #fff;
}
.g-settings-style {
  width: 240px;
  max-height: 700px !important;
  border-radius: 4px !important;
  padding: 5px 0 10px 0;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3));
  overflow: unset;
  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    top: -20px;
    left: 50%;
  }
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    top: -19px;
    left:50%;
  }
}
.skin-icon-off {
  width: 12px;
  height: 12px;
  background: #8a96ba;
  border-radius: 50%;
}
.kicfoff_list {
  //background: var(--qq--popup-wrap-bg-color);
  background: linear-gradient(
    225deg,
    rgba(61, 114, 250, 0) 0%,
    rgba(65, 118, 250, 0.3) 100%
  );
  color: var(--qq--menu-text-color2);
  width: 100%;
  .option {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 16px 0 20px;
    cursor: pointer;
    &:hover {
      color: #179cff;
      background-image: linear-gradient(
        225deg,
        rgba(61, 114, 250, 0) 0%,
        rgba(65, 118, 250, 0.3) 100%
      );
      //color: var(--qq--y0-text-color28);
      //background-image: var(--qq--background-gradient-17);
    }
    .active {
      //,.option:hover
      background: var(--qq--menu-bg-color8) !important;
    }
  }
}
.setting-card {
  .q-card__section--vert {
    padding: 0;
  }
}
  .skin-icon-night {
    width: 12px;
    height: 12px;
    background-color: var(--qq--theme-bg-bet-text-delete);
    border-radius: 50%;
  }
  
</style>
 