<!--
* @Author: Malick
* @Description: 菜单列表
-->
<template>
  <div class="left_drawer_page">
    <q-list>
      <q-item-label header class="q-list-content">
        <!-- Esports---VR Sports 电竞  VR-->
        <div class="sports-genre">
          <div class="item" :class="[
            item.className,
            // { active: meta_data_store.current_menu.mi == item.mi },
          ]" v-for="(item, index) in sportsGenre" :key="index" @click="set_menu_obj">
            <sport_icon size="20" :sport_id="item.mi" />
            <div>{{ item.name }}</div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="segmentation"></div>
        <!-- POPULAR 热门赛事-->
        <div class="popular">
          <h5>POPULAR</h5>
          <div class="item" :class="[
            item.className,
            // { active: meta_data_store.current_menu.mi == item.mi },
          ]" v-for="(item, index) in popular" :key="item.mi" @click="change_current_menu(item)">
            <sport_icon size="18" :sport_id="item.mi" />
            <div>{{ item.name }}</div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="segmentation"></div>
        <!-- 赛事球类 -->
        <div class="menu_container">
          <h5>ALL SPORTS</h5>
          <div class="menu_item" :class="[
            'menu_item_' + item.mi,
            // { active: meta_data_store.current_menu.mi == item.mi },
          ]" v-for="item in BaseData.mew_menu_list_res" :key="item.mi" @click="change_current_menu(item)"
            :data-id="item.mi">
            <sport_icon size="18" :sport_id="item.mi" />
            <!-- 有电竟体育时展示电竞体育2000  Esports  -->
            <div>
              {{
                item.mi == "2000"
                ? "Esports"
                : BaseData.menus_i18n_map[item.mi]
              }}
            </div>
          </div>
        </div>
      </q-item-label>
    </q-list>
  </div>
</template>
<script setup>
import { defineComponent, reactive, defineEmits, onMounted } from "vue";
import sport_icon from "./sport_icon.vue";
import BaseData from "src/core/base-data/base-data.js";

const sportsGenre = reactive([
  { name: "Esports", className: "esports", mi: "2000" },
  { name: "VR Sports", className: "vr-sports", mi: "300" },
])
const popular = reactive([
  { name: "Football", className: "football", mi: "101" },
  { name: "Basketball", className: "basketball", mi: "102" },
  { name: "Tennis", className: "tennis", mi: "105" },
])
const set_menu_obj = (data) => {
}
const change_current_menu = (m_data) => {

}
</script>
<style lang="scss" scoped>
.menu_container {
  h5 {
    color: var(--q-gb-bd-c-8);
  }

  .menu_item {
    line-height: 30px;

    &.active {
      color: var(--q-gb-bd-c-8);
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
          font-family: 'Roboto';
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
