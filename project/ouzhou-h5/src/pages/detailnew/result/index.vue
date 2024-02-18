<template>
  <div class="page detail-result detail-result-index">
    <loading_page v-show="loading" />
    <div class="mini-header-container">
      <div class="header-fix" ref="header_fix">
        <!-- v-if="!changeHeader" -->
        <div ref="scroll_video_height" class="relative-position scroll_video_h">
          <detail_header_tem1 :get_match_detail="matchDetail" :show_collect="false"/>
        </div>
      </div>
      <div class="separate"></div>
      <q-separator color="orange"/>
    </div>
    <div class="detail-container-position">
      <OddsListContrainer :match_odds_info="matchResults" :match_detail="matchDetail" :loading="loading"/>
    </div>
  </div>
</template>

<script setup>
import {
  MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,
  useMitt,
  MITT_TYPES,
  useMittEmit,
  is_eports_csid
} from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { ref, toRaw } from "vue";
import { useRoute } from "vue-router";
import detail_header_tem1 from "../detail_header/detail_header_tem1.vue";
// import odds_info from "./components/odds_info.vue";
import odds_info from "../components/odds_info.vue";
import OddsListContrainer from "../components/OddsListContrainer.vue";
import loading_page from 'src/components/details/loading/index.vue'
import { api_common, api_analysis } from "src/api/index.js";

import './index.scss'
const route = useRoute()
const { mid, csid } = useRoute().params, cuid = UserCtr.get_uid()
const loading = ref(true)
/** @type {Ref<TYPES.MatchDetail>} */
const matchDetail = ref({})
const matchResults = ref([])

//#region 初始化
initial({mid,csid})
useMitt(MITT_TYPES.EMIT_REFRESH_DETAILS,initial)
//#endregion

function initial({mid, csid}){
  loading.value = true
  const params = {mid,cuid}
  if(is_eports_csid(csid)){
    params.isESport = 1
  }
  getMatchDetail(params)
  api_analysis.get_match_result(params).then(res=>{
    if(res.code == '200'){
      matchResults.value = res.data
    }else {
      useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, res.message)
    }
    loading.value = false
  })
}
/** 请求赛事详情 @param {{mid,cuid}} params 请求参数*/
function getMatchDetail(params) {
  api_common.get_matchResultDetail_MatchInfo(params).then(
    (res) =>{
      // 补偿赛事状态110情况下mmp不是999
      if(!(['90','80','61'].includes(res.data.mmp+''))){
        res.data.mmp = '999'
      }
      if(['result_details', 'match_result'].includes(route.name) && res.data.mo == 1){
        // 61-比赛延迟,80-比赛中断,90-比赛放弃
        if(!(['90','80','61'].includes(res.data.mmp+''))){
          res.data.mmp = '999'
        }
      }
      MatchDataWarehouseInstance.set_match_details(toRaw(matchDetail.value = res.data), [])    
    } 
  );
}

</script>

<style lang="scss" scoped>
.page.detail-result-index{
  width: 100%;
  height: 100%;
  background: #F1F1F1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  .mini-header-container {
    position: sticky;
    top: 0;
    z-index: 80;
    width: 100%;
  }
}
.separate{
  height: 10px;
  background: #F1F1F1;
}
  .change-header-fix {
    width: 100vw;
    position: fixed;
    top: 49px;
    z-index: 91;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .detail-container-position {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .match-detail-line {
    height: 10px;
    background: #F1F1F1;
  }

  .match-detail-tabs-header {
    position: sticky;
    width: 100vw;
    top: 43px;
    z-index: 81;
    width: 100%;
  }

  .match-detail-tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    color: var(--q-gb-t-c-4);
    background-color: var(--q-gb-bg-c-2);

    .tab-active {
      color: var(--q-gb-t-c-1);

      .tab-text {
        display: inline-block;
        font-weight: 500;
        border-bottom: 3px solid var(--q-gb-bd-c-1);
      }
    }

    .tabs-item {
      width: 50%;
      text-align: center;
    }
  }

  .q-tab-panel {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
  }

  .match-detail-tab {
    height: 50px;
    background-color: var(--q-gb-bg-c-2);
  }

  .match-detail-odds-scroll {
    width: 100vw;
    background: #F1F1F1;

    // padding: 14px 0;
    // min-height: calc(100vh - 50px);
    &::-webkit-scrollbar {
      display: none;
      /* Chrome Safari */
    }
  }

  // .match-detail-odds-height1 {
  //   height: calc(100vh - 210px);
  // }
  /** 处理兼容性问题 */
  .match-detail-odds-height2 {
    overflow-y: scroll;
    height: calc(100vh - 325px);
  }

  // .match-detail-odds-height3 {
  //   height: calc(100vh - 275px);
  // }
  // .match-detail-odds-bottom {
  //   width: 100%;
  //   background: #C4C4C4;
  //   height: 30px;
  //   position: fixed;
  //   bottom: 0;
  // }

.bg_fff {
  background-color: var(--q-gb-bg-c-2);
}
</style>
./result.jssrc/output/index