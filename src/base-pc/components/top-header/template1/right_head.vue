

<!--
 * @Description: 顶部 搜索+ 个人头像组件
-->
<template>
  <div class="h-right">
    <div v-show="false">{{ SearchPCClass.update_time }}{{UserCtr.user_version}}</div>
    <div :class="[is_search ? 'search-click' : 'search']">
      <div class="s-input s-input-click">
        <q-input borderless rounded @focus="show_search" v-model.lazy="text" label-color="primary"
          placeholder="Enter league or team" :class="is_focus ? 'change_width' : ''"
				  @keyup.enter="get_search_data(text)">
          <template v-slot:prepend>
            <i class="icon-search q-icon c-icon" size="10px"></i>
          </template>
          <template v-slot:append>
            <i class="icon-close" size="10px" style="margin-right:10px" v-if="text.length" @click="text = ''"></i>
          </template>
        </q-input>
        <searchCom v-if="SearchPCClass.search_isShow" />
      </div>
    </div>
    <!-- <div class="s-input-active">
      <q-input borderless rounded readonly @click="change_input" v-model="text" label-color="primary" placeholder="Enter league or team">
        <template v-slot:prepend>
          <i class="icon-search q-icon c-icon" size="10px"></i>
        </template>
      </q-input>
    </div> -->
    <div class="h-right">
      <div class="user-info">
        <span class="user-balance">  {{ format_balance(UserCtr.balance) }} </span>
        <span class="user-name">{{ UserCtr.user_info.nickName }}</span>
      </div>
      <q-avatar size="40px"  @click="change_input">
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/avator.png`" alt="" srcset="" />
      </q-avatar>
      <q-menu style="background:#fff;border-radius:2px;box-shadow:0 0 4px 2px rgb(0 0 0 / 10%)">
          <q-list style="min-width: 280px;">
            <q-item clickable @click="goto_secondary_module('announcement')">
              <q-item-section>
                <div class="flex title">
                  <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/notice.png`" alt="" />
                  <div>Announcement</div>
                </div>
              </q-item-section>
            </q-item>
            <q-item clickable @click="goto_secondary_module('results')">
              <q-item-section>
                <div class="flex title">
                  <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/results.png`" alt="" />
                  <div>Results</div>
                </div>
              </q-item-section>
            </q-item>
            <q-item clickable @click="goto_secondary_module('sportsrules')">
              <q-item-section>
                <div class="flex title">
                  <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/rule.png`" alt="" />
                  <div>Sport Rules</div>
              </div>
              </q-item-section>
            </q-item>
            <!--国际化语言   暂时隐藏-->
            <!-- <q-item clickable  @click="onExpend">
              <q-item-section class="personal-content">
                <div class="flex title">
                  <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/language.png`" alt="" />
                  <div>language</div>
                </div>
                <img :class="['arrow', { expend: visible }]" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/arrow.png`" alt="" />
              </q-item-section>
            </q-item> -->
            <!-- <q-separator /> -->
            <!-- <q-item  v-show="visible">
              <q-slide-transition >
                <q-item-section>
                  <div :class="['language_item', {active: lang === key}]" v-for="{ key, language } in languages" :key="key" @click="on_change_lang(key)">
                    <span> <span class="lang-icon" :class="`lang-${key}`"></span> {{ language }} </span>
                    <img class="lang" v-if="lang === key" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/vector.png`" alt="">
                  </div>
                </q-item-section>
              </q-slide-transition>
            </q-item> -->
            <!--国际化语言结束-->
            <!-- <q-item>
              <q-item-section>
                <div class="setting_item" v-for="setting in settingData" :key="setting.title">
                <span class="title">{{ setting.title }}</span>
                <div class="switch"> 
                  <span class="bg" :style="{left: setting.index === setting.params[0] ? 0 : '50px'}"></span>
                  <span v-for="s in setting.params" :key="s" @click="setting.index = s" :class="{active: setting.index === s}">{{ s }}</span>
                </div>  
              </div> 
              </q-item-section>
            </q-item> -->
          </q-list>
      </q-menu>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref,watch, onUnmounted } from "vue";
import { format_balance,UserCtr,LOCAL_PROJECT_FILE_PREFIX } from "src/core/";
import { useRouter, useRoute } from 'vue-router';
import store from "src/store-redux/index.js";
import globalAccessConfig from "src/core/access-config/access-config.js";
import SearchHotPush from "src/core/search-class/search_hot_push.js";
import { api_account } from 'src/api/index';
import { loadLanguageAsync } from "src/core/index.js";
import { useMittOn, MITT_TYPES, useMittEmit } from 'src/core/mitt';
import SearchPCClass from 'src/core/search-class/seach-pc-ouzhou-calss.js';
import searchCom from 'src/components/search/search-2/index.vue';
import BetData from 'src/core/bet/class/bet-data-class.js';
import {  LayOutMain_pc } from 'src/core/index.js'

export default defineComponent({
  name: "RightHead",
  components: {
    searchCom
  },
  setup() {
    const text = ref('')
    const route=useRoute()
    const userRouter=useRouter()
    const is_search = ref(false)
    const visible = ref(false)
    const is_focus = ref(false);
    //语言设置
    const lang = ref(UserCtr.lang)
    const languages = [{
          key: 'zh',
          language: '简体中文',
        }, {
          key: 'en',
          language: 'English',
        }, {
          key: 'tw',
          language: '繁體中文',
        }, {
          key: 'vi',
          language: 'Tiếng Việt',
        }, {
          key: 'th',
          language: 'ไทย',
        }, {
          key: 'ms',
          language: 'Melayu',
        }, {
          key: 'ad',
          language: 'Indonesia',
        }, {
          key: 'md',
          language: 'Burmese',
        }, {
          key: 'ry',
          language: 'Japanese',
        }, {
          key: 'pty',
          language: 'Portuguese',
        }, {
          key: 'hy',
          language: 'Korean',
        }]
    const settingData = ref([{
          title: 'Odds Display',
          index: 'DEC',
          params: ['DEC', 'HK']
        }, {
          title: 'Bet Slip',
          index: 'ANY',
          params: ['ANY', 'HIG']
        }, {
          title: 'Version',
          index: 'EURO',
          params: ['EURO', 'ASIA']
        }])
    //监听输入框内容改变，并搜索
    watch(
      () => text.value,
      (val) => {
        let trimVal = val.trim();
        get_search_data(trimVal);
      }
    )
    
    // 传递搜索状态
    const get_search_data = (val) => {
      useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE, {
        type: 'result',
        text: val || text.value
      })
    }
    /**
     * 是否显示搜索组件 default: false
     * 路径: project_path\src\store\module\search.js
    */
    const search_isShow = ref(SearchPCClass.search_isShow)
    const compute_userInfo = () => {};
    // 搜索
    const change_input = () => {}
    //赛果 || 公告 || 体育规则
    const goto_secondary_module = (value) => {
      LayOutMain_pc.set_layout_secondary_dialog(value)
      BetData.set_bet_box_draggable({show:false})
      // userRouter.push("/match_results")
    }
    const onExpend = () => {
      visible.value = !visible.value
    }

    // 切换语言
    const on_change_lang = (key) => {
      lang.value = key
      api_account.set_user_lang({ token: UserCtr.get_user_token(), languageName: lang.value }).then(res => {
          let code = lodash.get(res, 'code');
          if (code == 200) {
              // 设置国际化语言
              loadLanguageAsync(lang.value).then().finally(() => {
                UserCtr.set_lang(lang.value) 
              })
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
      if(!SearchPCClass.search_isShow) {
        SearchPCClass.set_search_isShow(true);
      }
    }
    function hide_search(e) {
      const target_class_list = ['q-field__native q-placeholder', 'serach-wrap column', 'sports-tab', 'tab', 'tab active', 'q-scrollarea__bar q-scrollarea__bar--v absolute-right', 'q-scrollarea__bar q-scrollarea__bar--v absolute-right q-scrollarea__bar--invisible', 'windows desktop landscape', 'icon-close'];
      if(is_focus.value && SearchPCClass.search_isShow) {
        if(!target_class_list.includes(e.target.className)) {
          SearchPCClass.set_search_isShow(false);
          is_focus.value = false;
          text.value = ''
        } 
      }
    }
    const get_props = (props) => {
      text.value = props.text
    }
    const get_width = (props) => {
      is_focus.value = props.focus
    }
    
    onMounted(() => {
      compute_userInfo();
      document.addEventListener('click', (e) => hide_search(e))
      useMittOn(MITT_TYPES.EMIT_SET_SEARCH_CHANGE, get_props)
      useMittOn(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, get_width)
    });
    onUnmounted(() => {
      document.removeEventListener('click', hide_search)
      useMittOn(MITT_TYPES.EMIT_SET_SEARCH_CHANGE, get_props).off()
      useMittOn(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, get_width).off()
    })

    return {
      text, 
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
      visible,
      is_search,
      goto_secondary_module,
      format_balance,
      UserCtr,
      LOCAL_PROJECT_FILE_PREFIX,
      is_focus,
      get_search_data
    };
  
  }
});
</script>
<style lang="scss" scoped>
.h-right {
  float: right;
  display: flex;
  margin-left: 40px;
  // margin-right: 100px;
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 10px;
    color: var(--q-gb-t-c-1);
    padding-top: 2px;
    .user-balance{
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0px;
      text-align: right;
    }
    .user-name{
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0px;
      text-align: right;
    }
  }
}
.q-item{
  padding: 8px 0 !important;
  .title{
    padding: 0 16px;
  }
}
.icon{
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.personal-content{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}
.language_item{
  display: flex;
  height: 50px;
  align-items: center;
  padding: 0 18px 0 16px;
  transition: all 0.25s;
  justify-content: space-between;
  &.active{
    color: var(--q-gb-t-c-2);
    background:var(--q-gb-bg-c-5);
  }
  > span {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
  }
  .lang{
    width: 12px;
    height: 9px;
  }
}
.language_item:hover{
  color: var(--q-gb-t-c-2);
  background:var(--q-gb-bg-c-5);
}
.arrow{
  width: 18px;
  height: 18px;
  margin-right: 18px;
  transition: transform 0.3s ease;
  &.expend{
    transform: rotate(90deg)
  }
}
.lang-icon{
  width: 17px;
  height: 13px;
  margin-right: 10px;
  background: url($SCSSPROJECTPATH + '/image/personal/lang.png') no-repeat;
  background-size: calc(3.2px * 5) calc(36.4px * 5);
  
}
/*语言国旗图标*/
@each $code, $index in (zh: 0, en: 1, tw: 2, vi: 3, th: 4, ms: 5, ad: 6, md: 7, ry: 8, pty: 9, hy: 10) {
  .lang-#{$code} {
    $position:-17px * $index;
    background-position: 0 calc(#{$position});
  }
}
/* ************** 切换语言前面的图标 ************** -E */
.setting_item{
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  > span {
    height: 26px;
  }
  .switch{
    position: relative;
    height: 30px;
    display: flex;
    align-items: center;
    background: var(--q-gb-bg-c-6);
    border-radius: 20px;
    justify-content: space-between;
    margin-right: 16px;
    cursor: pointer;
    > span {
      width: 50px;
      height: 100%;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s;
      color: var(--q-gb-t-c-8);
      &.active{
        color: #000;
        background: var(--q-gb-bg-c-4);
        border-radius: 20px;
      }
    }
    .bg{
      position: absolute;
      top: 0;
      border-radius: 20px;
      border: 1px solid var(--q-gb-bd-c-1);
      transition: all 0.25s;
    }
  }
}
.s-input {
  width: 200px;
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
    color:var(--q-gb-t-c-1)
  }
}
.change_width {
  width: 500px;
  transform: translateX(-300px);
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
.dialog_box{
  height: 100%;
  width: 100%;
}
</style>
