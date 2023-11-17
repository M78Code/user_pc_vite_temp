
<template>
  <div class="header-main">
    <div class="header-content">
      <div class="logo">
        <img :src="logo" alt="" srcset="" class="" />
      </div>
      <div class="header-right">
        <!-- 头部菜单 -->
        <div class="header-nav">
          <div v-for="item in navList" :key="item.id" @click="nav_click(item)"
            :class="{ 'active-nav': route.name == item.name }">
            <span class="header-nav-title"> {{ item.label }}</span>
          </div>
        </div>
        <!-- 右侧 -->
        <div>
          <right_head />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, nextTick } from "vue";
import _ from "lodash"
import right_head from "./right_head.vue";
import logo from "src/assets/images/logo.png";
import { useRouter, useRoute } from 'vue-router'
import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'
import {MenuData, useMittEmit,MITT_TYPES } from "src/core/"

// import store from "src/store-redux-vuex/redux_menu";

export default defineComponent({
  name: "TopHeaderTemplate1",
  components: {
    right_head,
  },
  props: {},
  setup(props, context) {
    const userRouter = useRouter()
    const route = useRoute()
    const navList = ref([
      { label: i18n_t("ouzhou.match.home"), id:0, name: 'home' },
      { label: i18n_t("menu.match_playing"), id:1, name: 'in_play' },
      { label: i18n_t("common.betting_record"), id: 102, name: 'bet_record' },
    ]);
    const nav_click = (item = {}) => {
    
     
      // 默认设置 fetured
      if(item.id == 0){
        let obj = {
          root: 0,
          filter_tab: 1001, //
        }
        MenuData.set_mid_menu_result(obj)
      }

      MenuData.set_menu_root(item.id); 

      //页面中间头部导航显示处理
      userRouter.push({name: item.name})
      // 触发设置matches头部信息
      nextTick(()=>{
        useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE, item.id)
      })
    };

    return {
      logo,
      navList,
      nav_click,route
    };
  },
});
</script>
<style lang="scss" scoped>
.header-main {
  width: 100%;
  height: 68px;


  background-color: #FF7000;

  .header-content {
    display: flex;
    align-items: center;
    max-width: 1440px;
    padding-right: 10px;
    margin: 0 auto;

    .logo {
      margin-right: 110px;
      margin-left: 18px;
      img {
        height: 44px;
      }
    }
  }

  .header-nav {
    display: flex;

    div {
      width: 100px;
      height: 68px;
      text-align: center;
      font-weight: 500;
      font-size: 16px;
      line-height: 68px;
      cursor: pointer;

      &:hover {
        // background-color: #d45d00;

        .header-nav-title {
          border-bottom: 2px solid #ffffff;
          color:#ffffff;
        }
      }
    }

    .active-nav {
      background-color: #d45d00;

      .header-nav-title {
        border-bottom: 2px solid #ffffff;
        color:#ffffff;
      }
    }
  }

  .header-right {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

}

@media (max-width: 1450px) { 
  .header-main .header-content .logo {
    margin-right: 84px;
    margin-left: 10px;
  }
}
</style>
