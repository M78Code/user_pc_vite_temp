<!--
* @Author: Tyrone
* @Description: 菜单列表
-->
<template>
  <div class="left_drawer_page">
    <q-list>
      <q-item-label header class="q-list-content">
        <!-- Esports---VR Sports 电竞  VR-->
        <div class="sports-genre">
          <div
            class="item"
            :class="[
              item.className,
              { active: meta_data_store.current_menu.mi == item.mi },
            ]"
            v-for="(item, index) in sportsGenre"
            :key="index"
            @click="set_menu_obj"
          >
            <sport_icon size="20" :sport_id="item.mi" />
            <div>{{ item.name }}</div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="segmentation"></div>
        <!-- POPULAR 热门赛事-->
        <div class="popular">
          <h5>POPULAR</h5>
          <div
            class="item"
            :class="[
              item.className,
              { active: meta_data_store.current_menu.mi == item.mi },
            ]"
            v-for="(item, index) in popular"
            :key="item.mi"
            @click="change_current_menu(item)"
          >
            <sport_icon size="18" :sport_id="item.mi" />
            <div>{{ item.name }}</div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="segmentation"></div>
        <!-- 赛事球类 -->
        <div class="menu_container">
          <h5>ALL SPORTS</h5>
          <div
            class="menu_item"
            :class="[
              'menu_item_' + item.mi,
              { active: meta_data_store.current_menu.mi == item.mi },
            ]"
            v-for="item in meta_data_store.menu_list"
            :key="item.mi"
            @click="change_current_menu(item)"
            :data-id="item.mi"
          >
            <!-- 有电竟体育时展示电竞体育2000  Esports  -->
            <sport_icon size="18" :sport_id="item.mi" />
            <div>
              {{
                item.mi == "2000"
                  ? "Esports"
                  : meta_data_store.menu_name_list[item.mi]
              }}
            </div>
          </div>
        </div>
      </q-item-label>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";
import { useMetaData } from "src/stores/meta_data";
import { useRouter, useRoute } from "vue-router";
import store from "src/store-redux-vuex/index.js";
export default defineComponent({
  name: "leftMenu",
  components: { sport_icon },
  setup(props, event) {
    let menu_obj = reactive({});
    let state = store.getState();
    const router = useRouter();
    const route = useRoute()
    const sportsGenre = reactive([
        { name: "Esports", className: "esports", mi: "2000" },
        { name: "VR Sports", className: "vr-sports", mi: "300" },
      ])
    const popular = reactive( [
        { name: "Football", className: "football", mi: "101" },
        { name: "Basketball", className: "basketball", mi: "102" },
        { name: "Tennis", className: "tennis", mi: "105" },
      ])
    const set_menu_obj = (data) => {
      router.push('/coming_soon')
    }

    const meta_data_store = useMetaData();
    onMounted(() => {
      // TODO  当menu_list没数据时请求下菜单数据接口--临时解决开发时indexPage页面不走<menu_list />组件无法获取菜单列表数据
      if (meta_data_store.menu_list.length < 1) {
        meta_data_store.init_menu_list();
      }
    })

    meta_data_store.init_load_mapping();
    // 点击菜单item触发方法
    const change_current_menu = async (m_data) => {
      meta_data_store.set_current_menu(m_data); //设置选中的menu
      let euid = await original_data.get_euid(m_data.mi);

      // 关闭左侧菜单
      event.emit('isLeftDrawer', false)
      let current_menu = {
        ...m_data,
        euid,
      };
      //存储menu选中数据
      store.dispatch({
        type: "SET_MENU",
        data: current_menu,
      });
      // 跳赛事列表页面
      route.path !== '/menu_list' && router.push("/menu_list");

    };

    return {
      change_current_menu,
      meta_data_store,
      set_menu_obj,
      menu_obj,
      sportsGenre,
      popular,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "src/css/eu.variables.scss";
.menu_container {
  h5 {
    color: $main_color;
  }
  .menu_item {
    line-height: 30px;
    &.active {
      color: $main_color;
    }
  }
}
// 侧边栏样式
.left_drawer_page {
  font-family: "Roboto";
    .q-list-content {
      padding: 0 !important;
      .sports-genre {
        padding: 29px 0 29px 18px;
      }
       .menu_container {
        padding: 20px 0 20px 20px;
      }
      .popular {
        padding: 22px 0 17px 20px;
      }
      .sports-genre {
        .item {
          display: flex;
          align-items: center;
          div {
            font-size: 16px;
            color: #3D3B37;
            font-size: 16px;
            font-weight: 400;
            line-height: 19px;
            letter-spacing: 0px;
            text-align: left;
          }
        }
      }
      .esports {
        margin-bottom: 24px;
      }
      .esports span,
      .vr-sports span {
        // width: 20px;
        // height: 20px;
        display: inline-block;
        margin-right: 11px;
        // background-image: url('src/project-ouzhou/assets/common/icon_sports@3_min.png');
        // background-size: 220px 220px;
      }
    }

    // 分割线
    .segmentation {
      width: 100%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .popular,
    .menu_container {
      h5 {
        font-size: 16px;
        margin: 0;
        height: 19px;
        line-height: 19px;
        font-weight: 600;
        margin-bottom: 20px;
        color: rgba(255, 112, 0, 1);
      }
    }
    .popular .item,
    .menu_container .menu_item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 16px;
      span {
        // width: 18px;
        // height: 18px;
        margin-right: 11px;
        display: inline-block;
        // background-image: url('src/project-ouzhou/assets/common/icon_sports@3_min.png');
        // background-size: 198px 198px;
      }
      div {
        height: 19px;
        line-height: 19px;
        font-weight: 400;
        color: rgba(61, 59, 55, 1);
      }
    }
    .popular .item:last-child {
      margin-bottom: 0 !important;
    }
}
</style>
