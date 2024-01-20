
<template>
  <div v-show="false">{{BetData.bet_data_class_version}}{{UserCtr.user_version}}</div>
  <div class="header-main">
    <div class="header-content">
      <div class="logo">
        <!-- <div class="box-line"></div> -->
        <img :src="compute_img_url(logo)" alt="" srcset="" class=""  v-if="UserCtr.user_info.mId != '1704044740812607488'" />
      </div>
      <div class="header-right">
        <!-- 头部菜单 -->
        <div class="header-nav">
          <div v-for="item in navList" :key="item.id" @click="nav_click(item)"
            :class="{ 'active-nav': route.name == item.name }">
            <span class="header-nav-title"> {{ i18n_t(item.label) }}
              <!-- <span class="bet_record" v-if="item.name == 'bet_record'">{{ BetData.bet_record_count }}</span> -->
            </span>
          </div>
        </div>
        <div v-show="false">{{UserCtr.user_version}}</div>
        <!-- 右侧 -->
        <div>
          <right_head />
        </div>
        <!-- 弹窗 -->
      
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onUnmounted, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'

import BetData from 'src/core/bet/class/bet-data-class.js'
import { MenuData,useMittEmit,MITT_TYPES, i18n, useMittOn  } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import right_head from "./right_head.vue";
import { compute_img_url } from 'src/core/server-img/index.js'

export default defineComponent({
  name: "TopHeaderTemplate1",
  components: {
    right_head,
  },
  props: {},
  setup(props, context) {
    const userRouter = useRouter()
    const route = useRoute()
    const logo = ref('pc-home-logo-en')
    const navList = ref([
      { label: "ouzhou.match.home", id:0, name: 'home' },
      { label: "menu.match_playing", id:1, name: 'in_play' },
      { label: "common.betting_record", id: 102, name: 'bet_record' },
    ]);
    const nav_click = (item = {}) => {
      // 清空数据 
      MenuData.set_mid_menu_result({})
      MenuData.set_menu_root(item.id); 
      MenuData.set_is_collect(false)
      
      // 首页点击 首页需要 重新显示首页内容 
      if(route.name == 'home'){
        useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE,item.id)
        // useMittEmit(MITT_TYPES.EMIT_SET_HOME_MATCHES,item.id)
      }
      // 默认设置 fetured
      if(item.id == 0){
        let obj = {
          root: 0,
          filter_tab: 1001, //
        }
        MenuData.set_left_menu_result({})
        MenuData.set_mid_menu_result(obj)
        MenuData.set_current_ball_type(0)
      }
      
      if(item.id == 1){
        MenuData.set_current_ball_type(1)
      }

      //页面中间头部导航显示处理
      userRouter.push({name: item.name})
      // // 触发设置matches头部信息
      // nextTick(()=>{
      //   useMittEmit(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE, item.id)
      // })
    };
    const off= useMittOn(MITT_TYPES.EMIT_LANG_CHANGE,()=>get_logo()).off

    const get_logo = () => {
      if (i18n.global.locale == 'zh') {
        logo.value = 'pc-home-logo-zh'
      } else {
        logo.value = 'pc-home-logo-en'
      }
    }
    onMounted(() => {
      get_logo()
    })
    onUnmounted(()=>{
      off()
    })

    return {
      logo,
      navList,
      nav_click,route,
      BetData,
      UserCtr,
      compute_img_url
    };
  },
});
</script>
<style lang="scss" scoped>
.header-main {
  width: 100%;
  height: 68px;
  // background-color: #FF7000;
  background-color: var(--q-gb-bg-c-1);
  .header-content {
    display: flex;
    justify-content: flex-start;
    max-width: 1440px;
    padding-right: 10px;
    margin: 0 auto;

    .logo {
      margin-right: 47px;
      margin-left: 18px;
      width: 185px;
      height: 68px;
      display: flex;
      align-items: center;
      img {
        width: 185px;
        height: 44px;
      }
      .box-line{
        width: 185px;
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
      color: var(--q-gb-t-c-4);
      font-weight: 500;
      cursor: pointer;

      &:hover {
        // background-color: #d45d00;

        .header-nav-title {
          // border-bottom: 2px solid #ffffff;
          // color:#ffffff;
          border-bottom: 2px solid var(--q-gb-bd-c-13);
          color:var(--q-gb-t-c-18);
        }
      }
    }

    .active-nav {
      background-color: var(--q-gb-bg-c-3);

      .header-nav-title {
        // border-bottom: 2px solid #ffffff;
        // color:#ffffff;
        border-bottom: 2px solid var(--q-gb-bd-c-13);
        color:var(--q-gb-t-c-18);
        font-weight: 500;
        position: relative;
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

.bet_record{
  height: 20px;
  min-width: 20px;
  text-align: center;
  display: inline-block;
  line-height: 20px;
  border-radius: 20px;
  color: var(--q-gb-t-c-2);
  font-size: 12px;
  font-weight: 500;
  background: var(--q-gb-t-c-4); // 没有这个背景色
  position: relative;
  top: -3px;

}

@media (max-width: 1450px) { 
  .header-main .header-content .logo {
    margin-right: 84px;
    margin-left: 10px;
  }
}
</style>