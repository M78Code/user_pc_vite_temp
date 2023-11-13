
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
            :class="{ 'active-nav': current_id == item.id }">
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
import { defineComponent, onMounted, ref, watch } from "vue";
import _ from "lodash"
import right_head from "./right_head.vue";
import logo from "src/assets/images/logo.png";
import { useRouter, useRoute } from 'vue-router'
import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'
import { LayOutMain_pc,MenuData } from "src/core/"

// import store from "src/store-redux-vuex/redux_menu";

export default defineComponent({
  name: "TopHeaderTemplate1",
  components: {
    right_head,
  },
  props: {},
  setup(props, context) {
    const userRouter = useRouter()

    const current_id = ref(1);
    const navList = ref([
      { label: i18n_t("ouzhou.match.home"), id: 1, path: '/home' },
      { label: i18n_t("menu.match_playing"), id: 2, path: '/in_play' },
      { label: i18n_t("common.betting_record"), id: 3, path: '/bet_record' },
    ]);

    const nav_click = (item = {}) => {
      //页面中间头部导航显示处理
      MenuData.set_router_root_lv_1(item.id)

      current_id.value = item.id;

      switch (item.id) {
        case 1:
          LayOutMain_pc.set_oz_show_right(false)
          LayOutMain_pc.set_oz_show_left(true)
          // 默认设置 fetured
          MenuData.set_router_root_lv_2(1001)
          userRouter.push({name: 'home'})

          break;
        case 2:
          LayOutMain_pc.set_oz_show_right(true)
          LayOutMain_pc.set_oz_show_left(false)

          // 设置滚球
          MenuData.set_menu_root(1)
         
          userRouter.push({name: 'in_play'})
         
          break;
        case 3:
          LayOutMain_pc.set_oz_show_right(false)
          LayOutMain_pc.set_oz_show_left(false)
          
          userRouter.push({name: 'bet_record'})
          break;

        default:
          break;
      }

      // let state = store.getState()
      // // 获取最新的 数据
      // let redux_menu = _.cloneDeep(state.menusReducer.redux_menu)
      // // 修改菜单数据
      // redux_menu.menu_root = item.id

      // // in play 默认足球
      // if (item.id == 2) {
      //   redux_menu.mid_tab_menu_type = 101
      // }
      // // 存储
      // store.dispatch({
      //   type: 'SETREDUXMENU',
      //   data: redux_menu
      // })

    };
    return {
      logo,
      current_id,
      navList,
      nav_click,
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
