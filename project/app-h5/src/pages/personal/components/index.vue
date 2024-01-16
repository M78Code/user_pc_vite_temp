<template>
  <div class="personal_page">
    <q-scroll-area ref="scrollAreaRef" :visible="false" style="height: 100%;">
      <!-- 用户名称 -->
      <header>
        <img src="~assets/images/menu/avatar.png" alt="" />  Hi, Dafsghtyuh
      </header>
      <!-- 用户信息 -->
      <div class="info">
        <div class="name">
          <span>Money</span>
          <img @click="on_show_money(false)" src="~assets/images/menu/hide.png" alt="" />
          <img @click="on_show_money(true)" src="~assets/images/menu/show.png" alt="" />
        </div>
        <div class="amount">{{ showMount }}</div>
      </div>
      <div class="bg_line">
        <img src="~assets/images/menu/tips.png" alt="" />
      </div>
      <!-- 设置 -->
      <section>
        <!-- Rules -->
        <collapse :disabled="true" title="Rules" @click="jumpRules">
          <!-- 图片 -->
          <template v-slot:title_icon>
            <img class="icon" src="~assets/images/menu/rule.png" alt="" />
          </template>
        </collapse>
        <!-- Language -->
        <collapse v-model="l_visible" title="Language">
          <template v-slot:title_icon>
            <img class="icon" src="~assets/images/menu/language.png" alt="" />
          </template>
          <template v-slot:content>
            <div :class="['language_item', {active: lang === key}]" v-for="{ key, language } in languages" :key="key" @click="on_change_lang(key)">
              <span> <span class="lang-icon" :class="`lang-${key}`"></span> {{ language }} </span>
              <img class="lang" v-if="lang === key" src="~assets/images/personal/vector.png" alt="">
            </div>
          </template>
        </collapse>
        <!-- Odds Settings -->
        <collapse v-model="s_visible" title="Odds Settings">
          <template v-slot:title_icon>
            <img class="icon" src="~assets/images/menu/setting.png" alt="" />
          </template>
          <template v-slot:content>
            <div class="setting_item" v-for="setting in settingData" :key="setting.title">
              <span>{{ setting.title }}</span>
              <div class="switch">
                <span class="bg" :style="{left: setting.index === setting.params[0] ? 0 : '50px'}"></span>
                <span v-for="s in setting.params" :key="s" @click="setting.index = s" :class="{active: setting.index === s}">{{ s }}</span>
              </div>
            </div>
          </template>
        </collapse>
      </section>
    </q-scroll-area>
  </div>
</template>
 
<script setup>
import collapse from "project_path/src/components/collapse/index.vue"
import { ref } from "vue"
import { useRouter } from "vue-router"
const lang = ref('zh')
const router = useRouter();
const mount = '946,568,970.31'
const showMount = ref(mount)
const l_visible = ref(false)
const s_visible = ref(true)
const languages = [{
  key: 'zh',
  language: '简体中文',
}, 
{
  key: 'hk',
  language: '简体中文',
},
{
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
// 金额显示与隐藏
const on_show_money = (flag) => {
  showMount.value = flag ? mount : mount.replace(/[0-9]/g, '*')
}
// 切换语言
const on_change_lang = (key) => {
  lang.value = key
}
// 跳转规则界面
const jumpRules = () => {
  router.push('/rules')
}
</script>
 
<style scoped lang="scss">
.personal_page{
  height: calc(100% - 56px);
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
    background-image: url("src/assets/images/menu/bg.png");
    background-size: cover;
    .name{
      display: flex;
      align-items: center;
      //color: #765A44;
      color: var(--q-gb-t-c-3);
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
      color: var(--q-gb-t-c-14);
    }
  }
  .bg_line{
    height: 87px;
    margin-top: -40px;
    position: relative;
    background-repeat: no-repeat;
    background-image: url("../../../assets/images/menu/bg_line.png");
    background-size: cover;
    > img {
      width: 343px;
      height: 30px;
      position: absolute;
      bottom: 0;
      left: 16px;
    }
  }
  section{
    margin-top: 30px;
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
      .content{
        .language_item{
          display: flex;
          height: 50px;
          align-items: center;
          padding: 0 45px 0 27px;
          transition: all 0.25s;
          background: var(--q-gb-bg-c-11);
          justify-content: space-between;
          &.active{
            color: var(--q-gb-t-c-14);
            background: var(--q-gb-bg-c-20);
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
          background: var(--q-gb-bg-c-11);
          > span {
            height: 26px;
          }
          .switch{
            position: relative;
            height: 30px;
            display: flex;
            align-items: center;
            background: var(--q-gb-bg-c-21);
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
              color: #8A8986 var(--q-gb-t-c-14);
              &.active{
                color: #000 var(--q-gb-t-c-14);
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
}

/* ************** 切换语言前面的图标 ************** -S */
.lang-icon{
  width: 17px;
  height: 13px;
  margin-right: 10px;
  background: url('assets/images/personal/lang.png') no-repeat;
  background-size: calc(3.2px * 5) calc(36.4px * 5);
}

/*语言国旗图标*/
@each $code, $index in (zh: 0, en: 1, tw: 2, vi: 3, th: 4, ms: 5, ad: 6, md: 7, ry: 8, pty: 9, hy: 10) {
  .lang-#{$code} {
    background-position: 0 calc(-17px * $index);
  }
}
/* ************** 切换语言前面的图标 ************** -E */
</style>