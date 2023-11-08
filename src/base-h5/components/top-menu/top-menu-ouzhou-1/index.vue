<!--
 * @Author: rise
 * @Date: 2023-11-02 16:27:18
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 16:29:35
 * @Description:  
-->
<template>
  <!-- 规则 / 公告 头部 -->
  <template v-if="is_rule_page">
    <div class="top_header_rule" @click="go_back">
      <img src="./img/back.png" alt="" />
      <span>Personal</span>
      <span class="line"></span>
      <!-- <span class="f_weight">Announcement</span> -->
      <span class="f_weight">Rules</span>
    </div>
  </template>
  <template v-else>
    <div class="top_header">
      <div class="top_info">
        <template v-if="get_route_name == 'details'">
          <detail-top-info />
        </template>
        
        <!-- 个人中心 vr 电竞 头部 -->
        <template v-else-if="is_personal_page">
          <div class="back" @click="go_back">
            <img src="./img/back.png" alt="" />
            Back</div>
        </template>
        <!-- home 头部 -->
        <template v-else>
          <!--左侧菜单 -->
          <div class="navigation" @click="toggleLeftDrawer" >
            <!-- <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" /> -->
            <img  src="./img/navigation.png" alt="">
          </div>

          <!-- 搜索 -->
          <div class="top_info_search">
            <input type="search" maxlength="15" placeholder="Search" @input="search_match" @focus="to_search_page" />
            <img src="./img/top_seach.png" alt="" />
          </div>
          <!-- 头像 -->
          <div class="top_info_right">
            <span class="top_avatar" @click="jump_personal">
              <!-- <span class="badge"></span> -->
              <img src="./img/top_avatar.png" alt="" />
            </span>
            <span class="info_amount">{{ format_money2(amount) }}</span>
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

import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { format_money2,UserCtr } from "src/core/";
import leftMenu from "./components/left-menu/left-menu.vue";
import detailTopInfo from "./detail-top/detail-top.vue";
import { MenuData } from 'src/core/';
const router = useRouter();
const route = useRoute()
const amount = ref('')

const leftDrawerOpen = ref(false)
const emit = defineEmits(["change"]);
// 事件执行函数

const get_route_name = computed(() => {
  return  router.currentRoute.value.name;
})
/**
 * 个人中心 vr 电竞
 */
const is_personal_page = computed(() => {
  return ['/personal','/esports','/virtual'].includes(router.currentRoute.value.path)
})
/**
 * 公告  规则
 */
const is_rule_page = computed(() => {
  return ['/rules', '/notice','/announcement'].includes(router.currentRoute.value.path)
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
  if (route.path == '/coming_soon' && getSessionItem('routePath')) {
    router.push('/')
  } else {
    router.go(-1)
  }
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

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
  color: rgba(255, 255, 255, 1);
  background: url('./img/top_bg.png') no-repeat;
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
      border: 1px solid #ffffff;
      border-radius: 20px;
      width: 132px;
      height: 30px;
      padding-left: 30px;
      background: #ff8b33;
      outline: none;
      color: #fff;
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
  :deep(.q-drawer-container){
    .q-drawer__backdrop {
      background-color: rgba(56, 55, 50, 0.6) !important;
      filter: blur(5px);
    }
    .q-drawer__opener{
      display: none;
    }
  }
}
.top_header,.top_header_rule{
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 15px;
  font-size: 12px;
  color:#C2C2C2;
  background: url('./img/top_bg.png') no-repeat;
  background-size: cover;
  height: 0.5rem;
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
  background: url('./img/top_bg_rule.jpg') no-repeat;
  background-size: cover;
}
:deep(.fullscreen) {
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
}
</style>
