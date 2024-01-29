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
        <template v-if="MenuData.menu_list?.map((n)=>{return +n.mi})?.includes(300)||MenuData.menu_list?.map((n)=>{return +n.mi})?.includes(2000)">
          <div class="sports-genre">
            <template v-for="(item, index) in sportsGenre" :key="index">
              <div v-if="MenuData.menu_list?.map((n)=>{return +n.mi})?.includes(+item.mi)" class="item" :class="[
                item.className,
                // { active: meta_data_store.current_menu.mi == item.mi },
              ]"  @click="set_menu_obj(item)">
                <sport-icon size="20" :sport_id="item.mi" />
                <div>{{ BaseData.menus_i18n_map[item.mi]}}</div>
              </div>
            </template>
          </div>
          <!-- 分割线 -->
          <div class="segmentation"></div>
        </template>
        <!-- POPULAR 热门赛事-->
        <div class="popular">
          <h5>{{ i18n_t("ouzhou.menu.popular") }}</h5>
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
          <h5>{{ i18n_t("ouzhou.menu.all_sports")}}</h5>
          <template  v-for="item in leftDataList" :key="item.mi">
            <div v-if="![2000,300].includes(item.mi) && item.ct>0" class="menu_item" :class="[
              // { active: meta_data_store.current_menu.mi == item.mi },
            ]" @click="change_current_menu(item)"
              :data-id="item.mi">
              <sport-icon size="18" :sport_id="item.mi" />
              <!-- 有电竟体育时展示电竞体育2000  Esports  -->
              <div>
                {{
                  BaseData.menus_i18n_map[item.mi]
                }}
              </div>
            </div>
          </template>
        </div>
      </q-item-label>
    </q-list>
  </div>
</template>
<script setup>
import {ref ,reactive, onMounted,onUnmounted } from "vue";
import sportIcon from "./sport-icon.vue";
import BaseData from "src/core/base-data/base-data.js";
import { MenuData } from "src/output/index.js";
import { useRouter,useRoute } from "vue-router";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import { useMittOn,useMittEmit,MITT_TYPES } from "src/core/mitt/index.js" 
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import BetData from "src/core/bet/class/bet-data-class.js"
const router = useRouter();
const route = useRoute();

const emits = defineEmits(['isLeftDrawer']);
const leftDataList = ref([]);

/**
 * vr 电竞
 */
const sportsGenre = reactive([
  { name: i18n_t("common.e_sports"), className: "esports", mi: "2000",route: '/esports'},
  { name: i18n_t("common.virtual_sports"), className: "vr-sports", mi: "300",route: '/virtual' },
])
/**
 * 默认所有球种
 */
const defaultSports = reactive([
  { name: "Football", mi: "101" },
  { name: "Basketball", mi: "102" },
  // { name: "eFootball", mi: "190" },
  // { name: "eBasketball", mi: "191" },
  // { name: "Tennis", mi: "105" },
  // { name: "Snooker", mi: "107" },
  // { name: "Badminton", mi: "110" },
  // { name: "Table Tennis", mi: "108" },
  // { name: "Baseball", mi: "103" },
  // { name: "Volleyball", mi: "109" },
  // { name: "Handball", mi: "111" },
  // { name: "Boxing/Fighting", mi: "112" },
  // { name: "Beach Volleyball", mi: "113" },
  // { name: "Water Polo", mi: "116" },
  // { name: "Hockey", mi: "115" },
  // { name: "Rugby Union", mi: "114" },
  // { name: "Ice Hockey", mi: "104" },
  // { name: "American Football", mi: "106" },
  // { name: "Entertainment", mi: "118" },
])
const popularList = ref([]);//点击排序

const current_mi = ref('')

const ref_data = reactive({
    emit_lsit:{}
})

/**
 * 排序
 * @param {*} arr 
 */
const popularListSort = (arr) =>{
  const tem = new Map();
  arr = arr.sort((n,m)=>{return m.num - n.num});
  arr = [...arr,...leftDataList.value]
  
  let mergeArr = arr.filter((item) => !tem.has(item.mi) && tem.set(item.mi, 1) && MenuData.menu_list.map((item)=>{return +item.mi}).includes(+item.mi))
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
  if(data.route == '/virtual'){
    MenuData.set_current_lv1_menu(300);
    MenuData.set_vr_menu_csid('1001');
  }
  if(data.route == '/esports'){
    MenuData.set_current_lv1_menu(2000);
    MenuData.set_menu_mi('2100');
  }
  //清除投注项
  BetData.set_clear_bet_info()
  router.push(data.route)
}
/**
 * 球类点击
 * @param {*} m_data 
 */
const change_current_menu = (item) => {
  if (['matchList', 'champion'].includes(route.name) && current_mi.value && current_mi.value === item.mi) return emits('isLeftDrawer');
  //电竞vr切常规  清除投注
  if(MenuData.is_esports() || MenuData.is_vr()){
    //清除投注项
    BetData.set_clear_bet_info()
  }
  useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP)
  current_mi.value = item.mi
  setPopularSort(item.mi);
  // 设置菜单对应源数据
  emits('isLeftDrawer');
  // if (route.name === 'matchList') MatchMeta.set_origin_match_data()

  // MenuData.set_menu_lv2_mi(item.mi+''+2)

  // 当前页面不做跳转
  // MenuData.set_current_lv1_menu(2);
  // 重置所选 球种默认玩法 hpid
  // MatchResponsive.reset_match_hpid_by_csid()
  if(item.mi == 400){
    MenuData.set_current_lv1_menu(400);
    MenuData.set_menu_mi('101');
    return router.push({name: 'champion'})
  }else{
    // MatchMeta.set_origin_match_data()
    BaseData.set_is_emit(false)
    // 重置所选 球种默认玩法 hpid
    MenuData.set_current_lv1_menu('2');
    MenuData.set_menu_mi(item.mi);
    MatchResponsive.reset_match_hpid_by_csid()
    // useMittEmit(MITT_TYPES.EMIT_OUZHOU_LEFT_MENU_CHANGE,item.mi,0);
    //增加早盘今日数量
    useMittEmit(MITT_TYPES.EMIT_OUZHOU_LEFT_MENU_CHANGE,{
      mi:item.mi,
      type:0,
      ct:item.sl?.[2]?.ct || item.sl?.[3]?.ct
    });
  }
  if(route.name != "matchList"){
    //跳转今日列表
    router.push({name: 'matchList'})
  }
}
/**
 * 初始化
 */
const get_init_data = (val) =>{
  const list = val || MenuData.menu_list;
  leftDataList.value = list && list.length?list:defaultSports;
  const popularSortListH5 = LocalStorage.get("popularSortListH5") ||[];
  popularList.value = popularListSort(popularSortListH5);
}
/**
 * ws推送球种数量
 * @param {*} list 
 */
 const get_menu_ws_list = (list) =>{
    list = list.filter((item)=>{return item.mi});
    leftDataList.value = leftDataList.value.map((item)=>{
        item.ct = item.ct || 0;
        list.forEach((n)=>{
            if(item.mi == n.mi.slice(0,3)){
                let index = item.sl?.findIndex((k)=>{return k.mi == n.mi});
                if(index !== -1)item.sl[index].ct = n.count;
            }
        })
        return item;
    })
}
onMounted(()=>{
  get_init_data();
  ref_data.emit_lsit = {
      emitter_1: useMittOn(MITT_TYPES.EMIT_UPDATE_INIT_DATA, get_init_data).off,
      emitter_2: useMittOn(MITT_TYPES.EMIT_SET_BESE_MENU_COUNT_CHANGE, get_menu_ws_list).off,
  }
  // useMittOn(MITT_TYPES.EMIT_UPDATE_INIT_DATA, get_init_data)
})
onUnmounted(()=>{
  // useMittOn(MITT_TYPES.EMIT_UPDATE_INIT_DATA).off
  Object.values(ref_data.emit_lsit).map((x) => x());
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

    .vr-sports {
      margin-top: 20px;
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
      //color: rgba(61, 59, 55, 1);
      color:var(--q-gb-t-c-6)
    }
  }

  .popular .item:last-child {
    margin-bottom: 0 !important;
  }
}
</style>
