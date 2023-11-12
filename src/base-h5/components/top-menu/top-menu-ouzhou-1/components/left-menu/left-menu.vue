<!--
 * @Author: rise
 * @Date: 2023-11-02 16:27:18
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 16:24:55
 * @Description:  
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
          ]" v-for="(item, index) in sportsGenre" :key="index" @click="set_menu_obj(item)">
            <sport-icon size="20" :sport_id="item.mi" />
            <div>{{ BaseData.menus_i18n_map[item.mi]}}</div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="segmentation"></div>
        <!-- POPULAR 热门赛事-->
        <div class="popular">
          <h5>POPULAR</h5>
          <div class="item" :class="[
            // { active: meta_data_store.current_menu.mi == item.mi },
          ]" v-for="(item, index) in popularList" :key="item.mi" @click="change_current_menu(item)">
            <sport-icon size="18" :sport_id="item.mi" />
            <div>{{ BaseData.menus_i18n_map[item.mi] }}</div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="segmentation"></div>
        <!-- 赛事球类 -->
        <div class="menu_container">
          <h5>ALL SPORTS</h5>
          <div class="menu_item" :class="[
            // { active: meta_data_store.current_menu.mi == item.mi },
          ]" v-for="item in leftDataList" :key="item.mi" @click="change_current_menu(item)"
            :data-id="item.mi">
            <sport-icon size="18" :sport_id="item.mi" />
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
import {ref ,reactive, defineEmits,onMounted,onUnmounted } from "vue";
import sportIcon from "./sport-icon.vue";
import BaseData from "src/core/base-data/base-data.js";
import { MenuData } from 'src/core/';
import { useRouter,useRoute } from "vue-router";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { LocalStorage } from "src/core/index.js";
import { useMittOn,MITT_TYPES } from "src/core/mitt/index.js" 
const router = useRouter();
const route = useRoute();

const emits = defineEmits(['isLeftDrawer']);
const leftDataList = ref([]);
/**
 * vr 电竞
 */
const sportsGenre = reactive([
  { name: "Esports", className: "esports", mi: "2000",route: '/esports'},
  { name: "VR Sports", className: "vr-sports", mi: "300",route: '/virtual' },
])
/**
 * 默认所有球种
 */
const defaultSports = reactive([
  { name: "Football", mi: "101" },
  { name: "Basketball", mi: "102" },
  { name: "eFootball", mi: "190" },
  { name: "eBasketball", mi: "191" },
  { name: "Tennis", mi: "105" },
  { name: "Snooker", mi: "107" },
  { name: "Badminton", mi: "110" },
  { name: "Table Tennis", mi: "108" },
  { name: "Baseball", mi: "103" },
  { name: "Volleyball", mi: "109" },
  { name: "Handball", mi: "111" },
  { name: "Boxing/Fighting", mi: "112" },
  { name: "Beach Volleyball", mi: "113" },
  { name: "Water Polo", mi: "116" },
  { name: "Hockey", mi: "115" },
  { name: "Rugby Union", mi: "114" },
  { name: "Ice Hockey", mi: "104" },
  { name: "American Football", mi: "106" },
  { name: "Entertainment", mi: "118" },
])
const popularList = ref([]);//点击排序
/**
 * 排序
 * @param {*} arr 
 */
const popularListSort = (arr) =>{
  const tem = new Map();
  arr = arr.sort((n,m)=>{return m.num - n.num});
  arr = [...arr,...leftDataList.value]
  const mergeArr = arr.filter((item) => !tem.has(item.mi) && tem.set(item.mi, 1))
  return mergeArr.slice(0,3);
}
/**
 * 本地存储popular
 * @param {*} mi 
 */
const setPopularSort = (mi) =>{
  const popularSortListH5 = LocalStorage.get("popularSortListH5") ||[];
  const index = popularSortListH5.findIndex((item)=>item.mi === mi);
  if(index !== -1){
    popularSortListH5[index].num += 1;
  }else{
    popularSortListH5.push({
      mi:mi,
      num:1
    })
  }
  popularList.value = popularListSort(popularSortListH5);
  LocalStorage.set("popularSortListH5",popularSortListH5)
}
/**
 * 电竞 vr点击
 * @param {*} data 
 */
const set_menu_obj = (data) => {
  router.push(data.route)
}
/**
 * 球类点击
 * @param {*} m_data 
 */
const change_current_menu = (item) => {
 
  // MenuData.set_menu_mi(item.mi);
  // setPopularSort(item.mi);
  // 设置菜单对应源数据
  // MatchMeta.set_origin_match_data()
  emits('isLeftDrawer');

  MenuData.set_menu_lv2_mi(item.mi+''+2)

  // 当前页面不做跳转
  // MenuData.set_current_lv1_menu(2);
  if(route.name != "matchList"){
    //跳转今日列表
    router.push({name: 'matchList'})
  }
  
}
/**
 * 初始化
 */
const get_init_data = () =>{
  leftDataList.value = MenuData.menu_list && MenuData.menu_list.length?MenuData.menu_list:defaultSports;
  const popularSortListH5 = LocalStorage.get("popularSortListH5") ||[];
  popularList.value = popularListSort(popularSortListH5);
}
onMounted(()=>{
  get_init_data();
  useMittOn(MITT_TYPES.EMIT_UPDATE_INIT_DATA, get_init_data)
})
onUnmounted(()=>{
  useMittOn(MITT_TYPES.EMIT_UPDATE_INIT_DATA).off
})
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
