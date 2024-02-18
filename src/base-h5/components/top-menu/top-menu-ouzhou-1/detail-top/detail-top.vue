<template>
  <div class="component detail-top-info detail-top">
    <div class="sport-info" @click="toHome">
      <span>{{ getCsna }}</span>
      <img class="bakc-icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/menu/top-menu/back.png`" alt="" />
    </div>
    <div class="detail-select" v-if="drop_down_list.length||true">
      <div class="detail-select-nav">
        <q-btn class="label">
          <span class="btn-label">{{ leagueName||refLeagueName }}</span>
          <img v-if="drop_down_list.length" class="down-icon" :class="[{ 'up-icon': show_list }]" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/menu/top-menu/top-down.png`" alt="" />
          <q-menu class="detail-top-pop">
            <div class="detail-top-pop-content" ref="detail_top_pop">
              <div class="match_detail_top_list">
                <DetailTopMsOptions v-for="(item, index) in drop_down_list" 
                  :key="index" :detail_data="item" 
                  :active="active == index"
                  :index="index"
                  @ChangeActive="change_active(item, index)"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </div>

    </div>
    <div class="refresh" @click.capture>
      <img ref="refresh_icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/menu/top-menu/refresh.png`" alt="" srcset=""  @touchend="refreshAll"
       :class="[{ 'refresh-active': refresh_is_active }, 'refresh-icon']" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch,computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useMittEmit, MITT_TYPES,
  MatchDataWarehouse_H5_Detail_Common,
  MatchDataWarehouse_H5_List_Common,
  LocalStorage,
} from "src/output/index.js";
import { api_common } from "src/api/index";
import BaseData from "src/core/base-data/base-data.js";
import { MenuData } from "src/output/index.js";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import DetailTopMsOptions from "./detail-top-ms-options.vue";
import NavbarSubscribe from "./nav-bar-subscribe";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";

const route = useRoute()
const router = useRouter();
const refresh_is_active = ref(false);
const active = ref(0);
const show_list = ref(false);
const detail_top_pop = ref(null);
const isMatchResultRoute = route.name == 'result'
const refLeagueName = ref('')

const mid = computed(()=>{
  return route.params.mid
})
const getCsna = computed(()=>{
  return MatchDataWarehouse_H5_Detail_Common.get_quick_mid_obj(route?.params?.mid)?.csna
})
const leagueName = computed(()=>{
  return MatchDataWarehouse_H5_Detail_Common.get_quick_mid_obj(route?.params?.mid)?.tn
})
/** @type {Ref<Array<TYPES.MatchDetail>>} 下拉列表 */
const drop_down_list = ref([]);
if(route.params.tid){
  getDropDownList(route.params.tid);
} else {
  watch(() => MatchDataWarehouse_H5_Detail_Common.get_quick_mid_obj(route?.params?.mid)?.tid,
    (tid) => {
      tid && getDropDownList(tid);
    }
  );
}
/** 获取下拉列表 */
function getDropDownList(tid='') {
  const matchDetail = LocalStorage.get("YUAN_MATCH_DETAIL_DATA")
  let time_ = null
  if(matchDetail&&matchDetail.mgt){
    let mgt = Number(matchDetail.mgt);
    let date_ = new Date(mgt).toLocaleDateString()
    time_ = new Date(date_).getTime()
  }
  let params = {
    tId: tid,
    type: isMatchResultRoute? 1 : (void 0),
    dateTime: time_,
  }

  // if(this.get_menu_type == 3000 || this.get_filter_electronic_show){
  //   params.isESpor = 1
  // }
  if(MenuData.is_esports()){
    params.isESport = 1
  }
  tid && api_common.get_matchDetail_getMatchDetailByTournamentId(params).then(res => {
    if(res.code == '200'){
      return drop_down_list.value = res.data
    }else {
      console.error(res)
    }
  }).then((data)=>{
    if( !data.length ) return
    refLeagueName.value = data[0].tn
    active.value = data.findIndex((x)=> x.mid == mid.value )
  })
  .catch(err => {
    console.error(err)
  })
}

/** 返回上一页 */
const toHome = async() => {
  // 设置 元数据计算 流程
  // 先通知观察者返回
  NavbarSubscribe.instance.back();
  // 异步获取状态
  const res = await NavbarSubscribe.instance.get_status();
  // 状态为真，可以返回
  if (res) {
    BaseData.set_is_emit(true)
    // MatchMeta.clear_match_info()
    MatchResponsive.set_is_compute_origin(true)
    router.back()
  } else {
    // 状态为false，执行其他操作
  }
  
};
watch(() => detail_top_pop.value,
  (newPath, oldPath) => {
    show_list.value = newPath ? true : false;
  })
/**
 * @description: 点击切换
 * @param {TYPES.MatchDetail} item 循环参数
 * @param {number} index
 * @return {*}
 */
function change_active(item, index) {
  if (active.value === index) {
    return;
  }
  active.value = index;
  /*
  if (this.$route.name == "category") {
    this.$router.push({ name: 'category_loading', params: { mid: item.mid } }); //缺失category_loading路由
  }
  else {
  */
  const params = { mid: item.mid, csid: item.csid, tid:item.tid }

  let name = 'category'
  if(isMatchResultRoute){
    name = 'result'
  }
  router.replace({ name, params});
  refreshAll(params)
}
/**
 * @description: 刷新
 * @param {{ mid: string, csid: string, tid: string }} params
 * @return {*}
 */
const refreshAll = (params) => {
  if(params instanceof Event){
    params = route.params
  }
  if(route.params.tid){
    getDropDownList(route.params.tid);
  }
  refresh_is_active.value = true;
  useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS,params)
  refresh_is_active.value = false;
}
</script>

<style lang="scss" scoped>
.detail-top-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  :deep(.q-btn) {
    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: inherit;
      box-shadow: none;
    }
  }

  .sport-info {
    color: #ffd5b2;
    width: 18%;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 80%;
      display: inline-block;
      height: 100%;
      line-height: 100%;
      vertical-align: middle;
      margin-top: -2px;
    }

    .bakc-icon {
      width: 5px;
      height: 8px;
      vertical-align: middle;
      margin-left: 6px;
      margin-top: -2px;
    }
  }

  .detail-select {
    padding-left: 6px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    flex: 1;
    width: 0;
    // flex: 1;
    .detail-select-nav {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      margin: 0 auto;
      flex: 1;
      width: 0;
      justify-content: center;
      .btn-label {
        // height: 45px;
        // line-height: 45px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
      }

      .label {
        position: relative;
        padding: 0;
        color: #fff;
        // display: inline-block; //杜绝 inline-block
        height: 45px;
        line-height: 45px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        :deep(.q-btn__content){
          flex-wrap: nowrap;
        }
      }

      .down-icon {
        position: sticky;
        right: 0;
        width: 10px;
        height: 6px;
        vertical-align: middle;
        margin-left: 5px;
      }

      .up-icon {
        transform: rotate(180deg);
      }
    }
  }

  .refresh {
    // position: absolute;
    // right: 15px;
    height: 14px;
    width: 18%;
    text-align: right;

    .refresh-icon {
      width: 14px;
      height: 14px;
    }
  }

  .refresh-active {
    animation: line-scale 1s infinite linear;
  }

  /*
  * Animation
  */
  @keyframes line-scale {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }

    25% {
      transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
    }

    50% {
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
    }

    75% {
      transform: rotate(270deg);
      -webkit-transform: rotate(270deg);
    }

    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }
}
</style>
<style lang="scss">
.detail-top-pop {
  backdrop-filter: none;
  width: 100vw;
  left: 0 !important;
  max-width: 100vw !important;

  .q-dialog__backdrop {
    background: rgba(0, 0, 0, 0);
  }

  .detail-top-pop-content {
    .match_detail_top_list {

      // margin-top: 50px;
      .match_detail_top_list_item {
        font-size: 14px;
        color: #fff;
        height: 45px;
        line-height: 45px;
        display: flex;
        justify-content: center;
        background: var(--q-gb-bg-c-16);
        width: 100vw;

        .item_team_name {
          padding: 0 5px;
          max-width: 50%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }

      .active {
        color: #ff7000;
      }
    }
  }
}</style>
