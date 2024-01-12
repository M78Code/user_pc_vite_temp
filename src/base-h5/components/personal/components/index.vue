<template>
  
  <div class="personal_page"> 
    <q-scroll-area ref="scrollAreaRef" :visible="false" style="height: 100%;"> 
      <!-- 用户名称 --> 

      <header> 
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/avatar.png`" alt="" />  Hi, {{ lodash.get(UserCtr.get_user(), "nickName") }}
      </header> 
      <!-- 用户信息 -->
      <div class="info"> 
        <div class="name"> 
          <span>{{ i18n_t("ouzhou.setting_menu.money") }}</span> 
          <img v-if="show" @click="on_show_money(false)" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/show.png`" alt="" />
          <img v-else @click="on_show_money(true)" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/hide.png`" alt="" />
        </div> 
        <div class="amount" v-if="show">{{ format_money2(UserCtr.balance) }}</div> 
        <div class="amount"  v-else>{{format_money2(UserCtr.balance).replace(/[\d.,]/g, '*') }} </div> 
      </div> 
      <div class="bg_line tips-content">
        <img class="tips-icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/tips-icon.png`" alt="" @click="goto_announcement" /> 
        <div class="tips-bg">
          <v-marquee ref="marqueeRef" />
        </div>
      </div>
      <!-- 设置 -->
      <section> 
        <!-- Rules -->
        <collapse :disabled="true" :title="`${i18n_t('setting_menu.rule_description')}`" @click="jumpRules"> 
          <!-- 图片 -->
          <template v-slot:title_icon>
            <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/rule.png`" alt="" />
          </template>
        </collapse>
        <!-- Language -->
        <collapse v-model="l_visible" :title="`${i18n_t('ouzhou.setting_menu.language')}`">  
          <template v-slot:title_icon>
            <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/language.png`" alt="" />
          </template>
          <template v-slot:content>
            <div :class="['language_item', {active: UserCtr.lang === key}]" v-for="{ key, language } in languages" :key="key" @click="on_change_lang(key)">
              <span> <span class="lang-icon" :class="`lang-${key}`"></span> {{ language }} </span>
              <img class="lang" v-if="UserCtr.lang === key" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/vector.png`" alt="">
            </div>
          </template>
        </collapse>
        <div v-show="false">{{UserCtr.user_version}}</div>
        <!-- Odds Settings -->
        <collapse v-model="s_visible" :title="`${i18n_t('ouzhou.setting_menu.odds_setting')}`">
          <template v-slot:title_icon>
            <img class="icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/personal/setting.png`" alt="" />
          </template>
          <template v-slot:content>
            <div class="setting_item" v-for="(setting,idx) in settingData" :key="setting.title">
              <span>{{ i18n_t(setting.title) }}</span>
              <div class="switch"> 
                <span class="bg" :style="{left: UserCtr.odds.cur_odds == setting.options[0] ? 0 : '50px'}"></span>
                <span v-for="s in setting.options" :key="s" @click="handel_change(s,idx)" :class="{active: UserCtr.odds.cur_odds == s}">{{ i18n_t(`odds.${s}`) }}</span>
              </div>  
            </div> 
          </template> 
        </collapse> 
      </section> 
    </q-scroll-area> 
  </div>
</template>
 
<script setup>
import collapse from "src/base-h5/components/personal/components/collapse.vue"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import UserCtr from "src/core/user-config/user-ctr.js";
import { api_account,api_betting } from 'src/api/index';
import { loadLanguageAsync, useMittEmit, MITT_TYPES} from "src/output/index.js";
import {LOCAL_PROJECT_FILE_PREFIX,format_money2 } from "src/output/index.js";
import VMarquee from 'src/base-h5/components/marquee/marquee.vue'
import BaseData from "src/core/base-data/base-data.js";

//语言设置
const lang = ref(UserCtr.lang)
const router = useRouter();
//金额
const mount = ref(UserCtr.balance)
const showMount = ref(mount)
const l_visible = ref(false)
const s_visible = ref(true)
const show = ref()
const marqueeRef = ref(null)
// 用户信息
const user_info = ref(UserCtr.user_info)
const languages = [{
  key: 'zh',
  language: '简体中文',
}, {
  key: 'en',
  language: 'English',
},
//  {
//   key: 'tw',
//   language: '繁體中文',
// }, {
//   key: 'vi',
//   language: 'Tiếng Việt',
// }, {
//   key: 'th',
//   language: 'ไทย',
// }, {
//   key: 'ms',
//   language: 'Melayu',
// }, {
//   key: 'ad',
//   language: 'Indonesia',
// }, {
//   key: 'md',
//   language: 'Burmese',
// }, {
//   key: 'ry',
//   language: 'Japanese',
// }, {
//   key: 'pty',
//   language: 'Portuguese',
// }, {
//   key: 'hy',
//   language: 'Korean',
// }
]
const settingData = ref([{
  title:"ouzhou.setting_menu.odds_display",
  index: UserCtr.odds.cur_odds, //用户已选中值
  options:["EU","HK"], //盘口
  params: [i18n_t("ouzhou.setting_menu.dec"), i18n_t("ouzhou.setting_menu.hk")]
},
//  {
//   title: i18n_t("pre_record.odds"),
//   index: true, //用户已选中值
//   options:[true,false], //接受更好赔率
//   params: [i18n_t("ouzhou.setting_menu.any"), i18n_t("ouzhou.setting_menu.hig")]
// }, {
//   title: i18n_t("ouzhou.setting_menu.version"),
//   index: 'EU',  //用户已选中值
//   options:["EU","ASIXA"], //版本需 欧洲/亚洲  需要修改值0 
//   params: [i18n_t("ouzhou.setting_menu.euro"), i18n_t("ouzhou.setting_menu.asia")]
// }
])
function handel_change(s,idx){
  let params = {
    userMarketPrefer: s
  }
  api_betting.record_user_preference(params).then((res ={}) =>{
    if(res.code == 200){
      if(idx==0){
        UserCtr.set_cur_odds(s) //HK/EU
      }
    }else{
      useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, '请稍后再试！')
    }
  })
}
onMounted(() => {
  //初始化金额隐藏
  on_show_money(UserCtr.show_balance)

})


// 金额显示与隐藏
const on_show_money = (flag) => {
  show.value = flag
}
// 切换语言
const on_change_lang = (key) => {
  lang.value = key
  // 设置国际化语言
  UserCtr.set_lang(lang.value) 
  BaseData.set_base_data_menu_i18n()
  api_account.set_user_lang({ token: UserCtr.get_user_token(), languageName: lang.value }).then(res => {
    let code = lodash.get(res, 'code');
    if (code == 200) {
        // 设置国际化语言
        loadLanguageAsync(lang.value).then().finally(() => {
          marqueeRef.value.get_marquee_data()
        })
    } else if (code == '0401038') {
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_nodata_22"))
    }
  })
}
// 跳转规则界面
const jumpRules = () => {
  router.push('/rules')
}

const goto_announcement = () => {
  router.push('/announcement')
}
</script>
 
<style lang="scss" scoped>
.personal_page{
  // height: calc(100% - 56px);
  height:100vh;
  :deep(.q-scrollarea__thumb){
    display: none;
  }
  header{
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 18px;
    padding: 20px 13px;
    > img {
      width: 39px;
      height: 39px;
      margin-right: 10px;
    }
  }
  .info{
    width: 350px;
    height: 107px;
    margin: 0 auto;
    position: relative;
    border-radius: 8px 8px 0 0;
    background-repeat: no-repeat;
    background-image: url($SCSSPROJECTPATH + '/image/personal/bg.png');
    background-size: cover;
    .name{
      display: flex;
      align-items: center;
      color: #765A44;
      padding: 15px 0 5px 20px;
      font-size: 14px;
      > img {
        width: 20px;
        height: 20px;
        margin-left: 5px;
      }
    }
    .amount{
      padding-left: 20px;
      font-size: 20px;
      font-weight: 500;
      color: #fff;
    }
  }
  // .bg_line{
  //   height: 87px;
  //   margin-top: -40px;
  //   position: relative;
  //   background-repeat: no-repeat;
  //   background-image: url($SCSSPROJECTPATH + "/image/personal/bg_line.png");
  //   background-size: cover;
  //   > img {
  //     width: 343px;
  //     height: 30px;
  //     position: absolute;
  //     bottom: 0;
  //     left: 16px;
  //   }
  // }

  .tips-content {
    display: flex;
    width: 3.43rem;
    height: .3rem;
    margin: 0 auto;
    margin-top: .26rem;
    align-items: center;
    .tips-icon {
      z-index: 101;
    }
    .tips-bg {
      width: 100%;
      // padding: .1rem;
      border-radius: .28rem;
      height: .28rem;
      background-color: rgb(242, 206, 165, .4);
      margin-left: -.2rem;
      .lucky-user {
        margin-top: .046rem;
      }
    }
  }

  section{
    margin-top: 30px;
    margin-bottom: 60px;
    :deep(.collapse_page) {
      .title{
        height: 60px;
        font-size: 16px;
        font-weight: 400;
        padding: 0 26px;
        .line{
          display: block;
        }
        .icon{
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
        .arrow{
          width: 18px;
          height: 18px;
          transition: transform 0.3s ease;
          &.expend{
            transform: rotate(90deg)
          }
        }
      }
      
        .language_item{
          display: flex;
          height: 50px;
          align-items: center;
          padding: 0 45px 0 27px;
          transition: all 0.25s;
          background: #F5F5F5;
          justify-content: space-between;
          &.active{
            color: #FF7000;
            background: #FFF1E6;
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
        .setting_item{
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px 0 30px;
          font-size: 14px;
          font-weight: 400;
          background: #F5F5F5;
          > span {
            height: 26px;
          }
          .switch{
            position: relative;
            height: 30px;
            display: flex;
            align-items: center;
            background: #E2E2E2;
            border-radius: 20px;
            justify-content: space-between;
            > span {
              width: 50px;
              height: 100%;
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.25s;
              color: #8A8986;
              &.active{
                color: #000;
                background: #fff;
                border-radius: 20px;
              }
            }
            .bg{
              position: absolute;
              top: 0;
              border-radius: 20px;
              border: 1px solid #FF7000;
              transition: all 0.25s;
            }
          }
        }
      
    }
  }
}
/* ************** 切换语言前面的图标 ************** -S */
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
</style>