
<template>
  <!-- 规则 / 公告 头部 -->
  <template v-if="is_rule_page">
    <div class="top_header_rule" :class="['rules'].includes(route.name) ? 'rules-page' : ''" @click="go_back">
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/menu/top-menu/back.png`" alt="" />
      <span>{{ i18n_t("ouzhou.setting_menu.personal") }}</span>
      <span class="line"></span>
      <!-- <span class="f_weight">Announcement</span> -->
      <span class="f_weight">{{ i18n_t(personal_name[get_route_name]) }}</span>
    </div>
  </template>
  <template v-else>
    <div class="top_header" id="top-header-oz" @click.stop>
      <div class="top_info">
        <template v-if="get_route_name == 'category' || get_route_name == 'result'">
          <detail-top-info />
        </template>

        <!-- 个人中心 电竞 头部 -->
        <template v-else-if="is_personal_page">
          <div class="back" @click="go_back">
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/menu/top-menu/back.png`" alt="" />
            {{ i18n_t("ouzhou.setting_menu.back") }}
          </div>
        </template>
         <!-- vr 头部 -->
        <template v-else-if="is_vr_page">
            <vrTop :is_vr_page="is_vr_page" @toggle_drawer="toggleLeftDrawer" />
        </template>
        <!-- home 头部 -->
        <template v-else>
          <!--左侧菜单 -->
          <div class="navigation" @click="toggleLeftDrawer" >
            <!-- <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" /> -->
            <img  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/menu/top-menu/navigation.png`" alt="">
          </div>

          <!-- 搜索 -->
          <div class="top_info_search">
            <input type="search" maxlength="15" :placeholder="`${i18n_t('search.search_title')}`" @input="search_match" @focus="to_search_page" />
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/menu/top-menu/top_seach.png`" alt="" />
          </div>
          <!-- 头像 -->
          <div class="top_info_right">
            <span class="top_avatar" @click="jump_personal">
              <!-- <span class="badge"></span> -->
              <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/menu/top-menu/top_avatar.png`" alt="" />
            </span>
            <span class="info_amount" v-if="UserCtr.show_balance">{{ format_balance(amount) }}</span>
            <span class="info_amount" v-else>{{ format_balance(amount).replace(/[\d.,]/g, '*') }}</span>
          </div>
        </template>
    </div>
    </div>

  </template>
  <!-- 菜单抽屉 -->
  <q-drawer v-model="leftDrawerOpen" show-if-above bordered >
    <leftMenu @isLeftDrawer="toggleLeftDrawer"/>
  </q-drawer>
</template>

  <script setup>

import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { format_balance,UserCtr } from "src/output/index.js";
import vrTop from "./components/vr-top/vr-top.vue";
import leftMenu from "./components/left-menu/left-menu.vue";
import detailTopInfo from "./detail-top/detail-top.vue";
import { useMittOn,MITT_TYPES } from "src/core/mitt/index.js" 
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
const router = useRouter();
const route = useRoute()
const amount = ref(UserCtr.balance)
const hisLen = ref(history.length)

const leftDrawerOpen = ref(false)
const emit = defineEmits(["change"]);
/**
 * 规则公告
 */
const personal_name = reactive({
  'announcement':"common.notice",
  'rules':"setting_menu.rule_description"
})
/**
 * 路由名称
 */
const get_route_name = computed(() => {
  return  router.currentRoute.value.name;
})
/**
 * 个人中心 电竞
 */
const is_personal_page = computed(() => {
  // ,'/esports'
  return ['/personal'].includes(router.currentRoute.value.path)
})
/**
 * vr 头部
 */
const is_vr_page = computed(() => {
  return ['/virtual', '/virtual/', '/virtual_sports_details', '/virtual_sports_details/'].includes(router.currentRoute.value.path)
})
/**
 * 公告  规则
 */
const is_rule_page = computed(() => {
  return ['/rules','/announcement'].includes(router.currentRoute.value.path)
})
/**
 * 主页的路由
 */
// const is_home_page = computed(() => {
//   return ['/','/home','/home/', '/betting_history', '/matchResults', '/inPlay', '/collect'].includes(router.currentRoute.value.path)
// })


const search_match = (item) => {
  console.error(item);
};

const to_search_page = () => {
  router.push('/search')
}

const jump_personal = () => {
    router.push('/personal')
}

// 回到上一页
const go_back = () => {
  if(is_rule_page.value){
    router.go(hisLen.value - history.length - 1)
    return ;
  }
  if (route.path == '/coming_soon' && getSessionItem('routePath')) {
    router.push('/')
  } else {
    router.go(-1)
  }
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
/**
 * 监听用户信息版本号
*/
const changebalance = (val) =>{
  amount.value = val;
}
watch(() => route.path, (val) => {
  hisLen.value = history.length
})
onMounted(() => {
  useMittOn(MITT_TYPES.EMIT_USER_AMOUNT_CHAUNGE, changebalance)
})
onUnmounted(()=>{
  useMittOn(MITT_TYPES.EMIT_USER_AMOUNT_CHAUNGE).off
})
</script>

<style lang="scss" scoped>
.top_info {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 14px;
  width: 100%;
  // padding: 0 15px 0 15px;
  justify-content: space-between;
  //color: rgba(255, 255, 255, 1);
  color: var(--q-gb-t-c-2);
  background: url($SCSSPROJECTPATH+'/image/menu/top-menu/top_bg.png') no-repeat;
  background-size: cover;
  .navigation{
    width: 18px;
    height: 18px;
    margin-left: 6px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .top_info_search {
    position: relative;
    margin-left: 30px;
    img {
      position: absolute;
      left: 13px;
      top: 9px;
      width: 12px;
      height: 12px;
    }
    input {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      width: 132px;
      height: 30px;
      padding-left: 30px;
      outline: none;
      color: var(--q-gb-t-c-2);
      border: none;
      box-shadow: 0 0 0 .5px #ffffff;
    }
    ::-webkit-input-placeholder {
      color: #ffffff;
      font-size: 14px;
      padding-left: 5px;
    }
  }

  .top_info_right {
    display: flex;
    align-items: center;
    padding: 2px 2px 0 12px;
    font-size: 14px;
    flex-direction: row-reverse;
    .info_amount {
      display: inline-block;
      margin-right: 10px;
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: right;
      font-family: 'DIN';
      mix-blend-mode: normal;
    }
    .top_avatar {
      display: inline-block;
      width: 26px;
      height: 26px;
      position: relative;
      img {
        width: 26px;
        height: 26px;
      }
      .badge {
        position: absolute;
        right: -1px;
        top: -1px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: linear-gradient(180deg, #ff2b2b 0%, #ff7000 100%),
          linear-gradient(0deg, #ffffff, #ffffff);
      }
    }
  }
  .back{
    font-size: 14px;
    font-weight: 500;
    img {
      width: 5px;
      height: 8px;
      margin-right: 5px;
    }
  }

}
.top_header,.top_header_rule{
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 15px;
  font-size: 12px;
  color:var(--q-gb-t-c-3);
  background: url($SCSSPROJECTPATH+'/image/menu/top-menu/top_bg.png') no-repeat;
  background-size: cover;
  height:.5rem;
  > img {
    width: 5px;
    height: 8px;
    margin-right: 15px;
  }
  .line{
    width: 1px;
    height: 11px;
    margin: 0 10px;
    background: #767676;
  }
  .f_weight{
    color: #fff;
  }
}
.top_header_rule{
  background: url($SCSSPROJECTPATH+'/image/menu/top-menu/top_bg_rule.jpg') no-repeat;
  background-size: cover;
}
// 欧洲版体育规则头部样式调整
.rules-page.top_header_rule{
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
}
:deep(.fullscreen) {
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
}
</style>