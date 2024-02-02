

<!--
 * @Description: 顶部 搜索+ 个人头像组件
-->
<template>
  <div class="h-right">
    <div v-show="false">{{ SearchPCClass.update_time }}{{ UserCtr.user_version }}</div>
    <div :class="[is_search ? 'search-click' : 'search']">
      <div class="s-input s-input-click">
        <div style="display: flex; position: relative;">
          <input class="search-input" :class="is_focus ? 'change_width' : ''" @focus="show_search" :value="keyword"
            :placeholder="`${i18n_t('ouzhou.search.placeholder')}`" @input="e=>change_txt(e.target.value)" @keyup.enter="e=>get_search_data(e.target.value)" />
          <img class="icon-search" :src="compute_local_project_file_path('image/svg/search_white.svg')" alt="">
          <img v-show="keyword" @click="clear_keyword" class="icon-close"
            :src="compute_local_project_file_path('image/svg/close.svg')" alt="">
          <span v-show="is_focus" class="btn" @click="close">{{ i18n_t('ouzhou.search.close') }}</span>
        </div>
        <searchCom v-if="SearchPCClass.search_isShow" />
      </div>
    </div>
    <!-- <div class="s-input-active">
      <q-input borderless rounded readonly @click="change_input" v-model="keyword" label-color="primary" placeholder="Enter league or team">
        <template v-slot:prepend>
          <i class="icon-search q-icon c-icon" size="10px"></i>
        </template>
      </q-input>
    </div> -->
    <div class="h-right">
      <div class="user-info">
        <span class="user-balance"> {{ format_balance(UserCtr.balance) }}</span>
        <span class="user-name">{{ lodash.get(UserCtr.get_user(), "nickName") || lodash.get(UserCtr.get_user(), "userName") }}</span>
      </div>
      <q-avatar size="40px" @click="change_input">
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/avator.png`" alt="" srcset="" />
      </q-avatar>
      <q-menu style="background:#fff;
        border-radius:2px;
        box-shadow:0 0 4px 2px rgb(0 0 0 / 10%);
        margin-top:15px !important;
        top: 52px;" anchor="bottom left" self="top middle">
        <q-list style="min-width: 280px; ">
          <q-item clickable @click="goto_secondary_module('announcement')">
            <q-item-section>
              <div class="flex title">
                <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/notice.png`" alt="" />
                <div>{{ i18n_t('ouzhou.set.announcement') }}</div>
              </div>
            </q-item-section>
          </q-item>
          <q-item clickable @click="goto_secondary_module('results')">
            <q-item-section>
              <div class="flex title">
                <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/results.png`" alt="" />
                <div>{{ i18n_t('ouzhou.set.results') }}</div>
              </div>
            </q-item-section>
          </q-item>
          <q-item clickable @click="goto_secondary_module('sportsrules')">
            <q-item-section>
              <div class="flex title">
                <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/rule.png`" alt="" />
                <div>{{ i18n_t('ouzhou.set.sport_rules') }}</div>
              </div>
            </q-item-section>
          </q-item>
          <!--国际化语言   暂时隐藏-->
          <q-item clickable @click="onExpend">
            <q-item-section class="personal-content">
              <div class="flex title">
                <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/language.png`" alt="" />
                <div>{{ i18n_t('ouzhou.setting_menu.language') }}</div>
              </div>
              <img :class="['arrow', { expend: visible }]" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/arrow.png`"
                alt="" />
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item v-show="visible" class="language_li">
            <q-slide-transition>
              <q-item-section>
                <div v-show="false">{{ UserCtr.user_version }}</div>
                <div :class="['language_item', { active: UserCtr.lang === key }]" v-for="{ key, language } in languages"
                  :key="key" @click="on_change_lang(key)">
                  <span> <span class="lang-icon" :class="`lang-${key}`"></span> {{ language }} </span>
                  <img class="lang" v-if="UserCtr.lang === key"
                    :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/vector.png`" alt="">
                </div>
              </q-item-section>
            </q-slide-transition>
          </q-item>
          <!--国际化语言结束-->
          <q-item>
            <q-item-section>
              <div v-show="false">{{ UserCtr.user_version }}</div>
              <div class="setting_item" v-for="setting in settingData" :key="setting.title">
                <span class="title">{{ i18n_t(setting.title) }}</span>
                <div class="switch">
                  <span class="bg" :style="{ left: UserCtr.odds.cur_odds === setting.params[0] ? 0 : '50px' }"></span>
                  <span v-for="s in setting.params" :key="s" @click="settingclick(s, setting.index)"
                    :class="{ active: UserCtr.odds.cur_odds == s }">{{ i18n_t(`odds.${s}`) }}</span>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from 'vue-router';

import { format_balance, LOCAL_PROJECT_FILE_PREFIX, MenuData, loadLanguageAsync, compute_local_project_file_path } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import SearchHotPush from "src/core/search-class/search_hot_push.js";
import { api_account, api_betting } from 'src/api/index';
import { useMittOn, MITT_TYPES, useMittEmit } from 'src/core/mitt';
import SearchPCClass from 'src/core/search-class/seach-pc-ouzhou-calss.js';
import searchCom from 'src/components/search/search-2/index.vue';
import { compute_css_obj } from 'src/core/server-img/index.js'
import BaseData from 'src/core/base-data/base-data.js'

import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { PROJECT_NAME,IS_FOR_NEIBU_TEST } = BUILDIN_CONFIG;

export default defineComponent({
  name: "RightHead",
  components: {
    searchCom
  },
  setup() {
    const keyword = ref('')
    const route = useRoute()
    const userRouter = useRouter()
    const is_search = ref(false)
    const visible = ref(false)
    const is_focus = ref(false);
    //语言设置
    const lang = ref(UserCtr.lang)
    let languages = [{
      key: 'zh',
      language: '简体中文',
    }, {
      key: 'en',
      language: 'English',
    },
     
    ]

    // const languages_ = [ {
    //     key: 'tw',
    //     language: '繁體中文',
    //   }, {
    //     key: 'vi',
    //     language: 'Tiếng Việt',
    //   }, {
    //     key: 'th',
    //     language: 'ไทย',
    //   }, {
    //     key: 'ms',
    //     language: 'Melayu',
    //   }, {
    //     key: 'ad',
    //     language: 'Indonesia',
    //   }, {
    //     key: 'md',
    //     language: 'Burmese',
    //   }, {
    //     key: 'ry',
    //     language: 'Japanese',
    //   }, {
    //     key: 'pty',
    //     language: 'Portuguese',
    //   }, {
    //     key: 'hy',
    //     language: 'Korean',
    //   }]
      console.error('IS_FOR_NEIBU_TEST',IS_FOR_NEIBU_TEST)
      if(IS_FOR_NEIBU_TEST){
       languages = lodash.concat(languages,[])
      }


    const settingData = ref([{
      title: "ouzhou.setting_menu.odds_display",
      index: 'DEC',
      params: ['EU', 'HK']
    },
      // {
      //   title: 'Bet Slip',
      //   index: 'ANY',
      //   params: ['ANY', 'HIG']
      // }, {
      //   title: 'Version',
      //   index: 'EURO',
      //   params: ['EURO', 'ASIA']
      // }
    ]);
    let is_before_status;
    watch(MenuData.menu_data_version, () => {
      nextTick(() => {
        //冠军不能有HK盘口
        if ((MenuData.is_kemp() || MenuData.is_common_kemp() || MenuData.is_collect_kemp() || MenuData.is_esports_champion())) {
          if ((settingData.value[0].params.includes("HK"))) { //如果有香港盘口
            is_before_status = UserCtr.odds.cur_odds;//保存之前的状态  因为可能冠军相互切
            UserCtr.set_cur_odds("EU")//冠军不能为香港盘 直接切位欧洲盘
            settingData.value[0].params.splice(1, 1) //删掉HK盘口
          }
        } else {
          if (is_before_status) { //如果原来是香港盘口得切回去 切换非冠军菜单了之后 得切回香港盘口
            UserCtr.set_cur_odds(is_before_status)
            is_before_status = undefined;
            settingData.value[0].params.push("HK")
          }
        }
      })
    },{immediate:true})
    

    /**
    * @Description:替换输入框非法字符为空串
    * @return {undefined} undefined
    */
    const change_txt = lodash.debounce((val) => {
      keyword.value = val.replace(/#/g, "");
      if (keyword.value.length > 20) keyword.value = keyword.value.slice(0, 20);
      get_search_data(keyword.value)
    }, 500)
    // 传递搜索状态
    const get_search_data =lodash.throttle( (val) => {
      useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE, {
        type: 'result',
        text:String(val).trim()
      })
    },1000)
    /**
     * 是否显示搜索组件 default: false
     * 路径: project_path\src\store\module\search.js
    */
    const search_isShow = ref(SearchPCClass.search_isShow)
    const compute_userInfo = () => { };
    // 搜索
    const change_input = () => { }
    //赛果 || 公告 || 体育规则
    const goto_secondary_module = (value) => {
      localStorage.setItem("secondary_active", value)
      let _window_width = 1200;
      let _window_height = 850;
      let path = userRouter.resolve({ path: '/secondary' }).href;
      path = path.substr(path.indexOf('#/'))
      let obj = { rdm: (new Date().getTime()) };
      // 设置激活参数
      obj.secondary_active = value;
      let param = UserCtr.get_user_url_parames(obj);
      let url = `${window.location.pathname}${path}?${param}`;
      window.open(
        url,
        "",
        `height=${_window_height}, width=${_window_width}, top=100, left=360, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
      );
    }
    const onExpend = () => {
      visible.value = !visible.value
    }

    const settingclick = (s) => {

      UserCtr.set_cur_odds(s)
    }

    // 切换语言
    const on_change_lang = (key) => {
      lang.value = key
      // 设置国际化语言
      loadLanguageAsync(key).then().finally(() => {
        UserCtr.set_lang(key)
        BaseData.set_base_data_menu_i18n()
      })
      api_account.set_user_lang({ languageName: key }).then(res => {
        let code = lodash.get(res, 'code');
        if (code == 200) {
         
        } else if (code == '0401038') {
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("common.code_empty"))
        }
      })
    }

    /** 搜索热推赛事 */
    const search_hot_push = ref(new SearchHotPush());

    /** 展开搜索 */
    function show_search() {
      is_focus.value = true;
      if (!SearchPCClass.search_isShow) {
        SearchPCClass.set_search_isShow(true);
      }
    }
    // 点击其他位置关闭弹框及初始化状态
    function hide_search(e) {
      const target_class_list = ['search-input change_width', 'icon-close', 'tab', 'tab active', 'windows desktop landscape', 'bet-title', 'f-b-c bet-content', 'middle_info_tab diff', 'middle_info_tab'];
      if (is_focus.value && SearchPCClass.search_isShow) {
        if (e.target.className && !target_class_list.includes(e.target.className)) {
          SearchPCClass.set_search_isShow(false);
          is_focus.value = false;
          keyword.value = ''
        }
      }
    }
    // 清空输入框
    const clear_keyword = () => {
      keyword.value = ''
      get_search_data(keyword.value)
    }
    // 关闭搜索状态清空值
    const close = () => {
      SearchPCClass.set_search_isShow(false);
      is_focus.value = false
      keyword.value = ''
      userRouter.push('/')
    }
    const get_props = (props)=>{
      keyword.value = props.text
    }
    const get_width = (props) => {
      is_focus.value = props.focus
      keyword.value = props.text
    }
    const emit_list=[
      useMittOn(MITT_TYPES.EMIT_SET_SEARCH_CHANGE, get_props).off,
      useMittOn(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, get_width).off
    ]
    onMounted(() => {
      compute_userInfo();
      UserCtr.get_balance();//默认获取一次余额
      document.addEventListener('click', hide_search)
    });
    onUnmounted(() => {
      document.removeEventListener('click', hide_search)
      emit_list.map(i=>i())
    })
    return {
      keyword,
      SearchPCClass,
      show_search,
      search_hot_push,
      search_isShow,
      change_input,
      on_change_lang,
      lang,
      languages,
      onExpend,
      settingData,
      settingclick,
      visible,
      is_search,
      goto_secondary_module,
      format_balance,
      UserCtr,
      LOCAL_PROJECT_FILE_PREFIX,
      is_focus,
      get_search_data,
      close,
      compute_local_project_file_path,
      clear_keyword,
      compute_css_obj,
      change_txt,
    };

  }
});
</script>
<style lang="scss" scoped>
.h-right {
  float: right;
  display: flex;
  margin-left: 40px;
  cursor: pointer;

  // margin-right: 100px;
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 10px;
    color: var(--q-gb-t-c-1);
    padding-top: 2px;

    .user-balance {
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0px;
      keyword-align: right;
    }

    .user-name {
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0px;
      keyword-align: right;
    }
  }

}

.q-item {
  padding: 0px 0 !important;

  :deep(.q-focus-helper) {
    // color: #fff1e6 !important;
    // background: #fff1e6 !important;
    opacity: 0 !important;
    z-index: -1;
    display: none;
  }

  .title {
    padding: 0 16px;
  }
}

.q-item:hover {
  background: #fff1e6 !important;
}
.q-item.language_li:hover {
  background: transparent !important;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.personal-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}

.language_item {
  display: flex;
  height: 50px;
  align-items: center;
  padding: 0 18px 0 16px;
  transition: all 0.25s;
  justify-content: space-between;
  cursor: pointer;

  &.active {
    // color: var(--q-gb-t-c-2);
    // background:var(--q-gb-bg-c-5);
    color: #ff7000;
    background: #fff1e6;
  }

  >span {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
  }

  .lang {
    width: 12px;
    height: 9px;
  }
}

.language_item:hover {
  color: #ff7000;
  background: #fff1e6;
}

.arrow {
  width: 18px;
  height: 18px;
  margin-right: 18px;
  transition: transform 0.3s ease;

  &.expend {
    transform: rotate(90deg)
  }
}

.lang-icon {
  width: 17px;
  height: 13px;
  margin-right: 10px;
  background: url($SCSSPROJECTPATH + '/image/personal/lang.png') no-repeat;
  background-size: calc(3.2px * 5) calc(36.4px * 5);

}

/*语言国旗图标*/
@each $code, $index in (zh: 0, en: 1, tw: 2, vi: 3, th: 4, ms: 5, ad: 6, md: 7, ry: 8, pty: 9, hy: 10) {
  .lang-#{$code} {
    $position: -17px * $index;
    background-position: 0 calc(#{$position});
  }
}

/* ************** 切换语言前面的图标 ************** -E */
.setting_item {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;

  >span {
    height: 26px;
  }

  .switch {
    position: relative;
    height: 30px;
    display: flex;
    align-items: center;
    // background: var(--q-gb-bg-c-6);
    background: #E2E2E2;
    border-radius: 20px;
    justify-content: space-between;
    margin-right: 16px;
    cursor: pointer;

    >span {
      width: 50px;
      height: 100%;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s;
      // color: var(--q-gb-t-c-8);
      color: #8A8986;

      &.active {
        color: #000;
        // background: var(--q-gb-bg-c-4);
        background: #ffffff;
        border-radius: 20px;
      }
    }

    .bg {
      position: absolute;
      top: 0;
      border-radius: 20px;
      // border: 1px solid var(--q-gb-bd-c-1);
      border: 1px solid #ff7000;
      transition: all 0.25s;
    }
  }
}

.s-input {
  transition: all 0.3s linear;

  :deep(.q-field) {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 20px;
    padding-left: 10px;
  }

  :deep(.q-field__control) {
    height: 40px;
  }

  :deep(.q-field__marginal) {
    height: 40px;
  }

  :deep(.q-field__native) {
    color: var(--q-gb-t-c-1)
  }

  .btn {
    display: inline-block;
    color: #fff;
    height: 40px;
    line-height: 40px;
    margin-left: 16px;
    cursor: pointer;
    font-size: 12px;
  }
}

.change_width {
  width: 500px !important;
}

.search-click .s-input {
  width: 500px;

  &:deep(.q-field) {
    background-color: var(--q-gb-bg-c-22) !important;
  }
}

.icon-search,
.icon-close {
  font-size: 14px;
  cursor: pointer;

  &::before {
    color: var(--q-gb-t-c-1);
  }
}

.dialog_box {
  height: 100%;
  width: 100%;
}

.search-input {
  width: 200px;
  height: 40px;
  border-radius: 40px;
  border: none;
  border: 1px solid #ffb275;
  background-color: #ff7e19;
  padding: 14px 30px;
  outline: none;
  color: #fff;
}

.icon-search {
  position: absolute;
  left: 15px;
  top: 14px;
}

.icon-close {
  position: absolute;
  right: 52px;
  top: 13px;
}

.search-input::placeholder {
  color: #ffe5d1;
}
</style>