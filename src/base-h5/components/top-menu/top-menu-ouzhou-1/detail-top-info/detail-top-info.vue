<template>
  <div class="detail-top-info">
    <div class="sport-info" @click="toHome">
      <span>{{ detail_store.get_detail_params.csna }}</span>
      <img class="bakc-icon" src="~assets/images/detail/back.png" alt="" />
    </div>
    <div class="detail-select">
      <q-btn class="label" >
        <span class="btn-label">{{ detail_store.get_detail_params.tn }}</span>
        <q-menu class="detail-top-pop">
          <div class="detail-top-pop-content" ref="detail_top_pop">
            <div class="match_detail_top_list">
              <div
                v-for="(item, index) in matchDetail_getMatchDetailByTournamentId"
                :class="[
                  { active: active == item.mid },
                  'match_detail_top_list_item',
                ]"
                :key="index"
                @click="change_active(item)"
                v-close-popup
              >
                <div class="item_team_name">{{ item.mhn }}</div>
                <div>v</div>
                <div class="item_team_name">{{ item.man }}</div>
              </div>
            </div>
          </div>
        </q-menu>
      </q-btn>
      <img
        :class="['down-icon', { 'up-icon': show_list }]"
        src="~assets/images/detail/top-down.png"
        alt=""
      />
    </div>
    <div class="refresh" @click="refresh">
      <img
        ref="refresh_icon"
        src="~assets/images/top_events/refresh.png"
        alt=""
        srcset=""
        :class="[{ 'refresh-active': refresh_is_active }, 'refresh-icon']"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { api_match } from "src/api/index.js";
import { Loading } from 'quasar'
import { detail_module } from "src/project-ouzhou/stores/detail";
// import { get_matchDetail_getMatchDetailByTournamentId } from "src/project-ouzhou/pages/detail/mock.js";
import EMITTER from  "src/global/mitt.js"
const model = ref("Australia New South Wales");
const router = useRouter();
const refresh_icon = ref(null);
const refresh_is_active = ref(false);
const is_dialog_details = ref(false);
const active = ref("");
const show_list = ref(false);
const detail_top_pop = ref(null);
const matchDetail_getMatchDetailByTournamentId = ref({});
const detail_store = detail_module();
/**
 * @description: 返回上一页
 * @param {*}
 * @return {*}
 */
const toHome = () => {
  router.go(-1);
};
/**
 * @description: 详情页顶部下数据
 * @param {params} params 接口入参
 * @return {*}
 */
const get_top_data = (params, status) => {
  api_match
    .get_matchDetail_getMatchDetailByTournamentId(params)
    .then((res) => {
      // console.log("get_matchDetail_getMatchDetailByTournamentId", res);
      matchDetail_getMatchDetailByTournamentId.value = res.data.data;
      if (status == "setup") {
        active.value = res.data.data[0].mid;
      }
    });
};
/**
 * @description: 详情页顶部下拉弹框
 * @param {*}
 * @return {*}
 */
const showList = () => {
  get_top_data({
    tId: detail_store.get_detail_params.tid,
  });
  is_dialog_details.value = true;
};
watch(() => detail_top_pop.value,
(newPath, oldPath) => {
  show_list.value = newPath ? true : false;
})
/**
 * @description: 点击切换
 * @param {item} item循环参数
 * @return {*}
 */
const change_active = (item) => {
    // console.log("detail_store.get_detail_params", detail_store.get_detail_params, item);
    if (item.mid != detail_store.get_detail_params.mid) {
      active.value = item.mid;
      detail_store.set_detail_params(item);
      refresh();
    }
    is_dialog_details.value = false;
}
/**
 * @description: 刷新
 * @param {}
 * @return {*}
 */
const refresh = () => {
  EMITTER.emit("detail_refresh", true);
  refresh_is_active.value = true;
  setTimeout(() => {
    refresh_is_active.value = false;
  }, 1000);
}
setTimeout(() => {
  get_top_data({
    tId: detail_store.get_detail_params.tid,
  }, "setup");
}, 100);
onMounted(() => {});
</script>

<style lang="scss" scoped>
.detail-top-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .sport-info {
    color: #ffd5b2;
    .bakc-icon {
      width: 5px;
      height: 8px;
      vertical-align: middle;
      margin-left: 6px;
    }
  }
  .detail-select {
    padding-left: 6px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    .btn-label {
      // height: 45px;
      // line-height: 45px;
      max-width: 200px;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
    }
    .label {
      padding: 0;
      color: #fff;
      display: inline-block;
      height: 45px;
      line-height: 45px;
      max-width: 200px;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
    }
    
    .down-icon {
      width: 10px;
      height: 6px;
      vertical-align: middle;
      margin-left: 5px;
    }
    .up-icon {
      transform: rotate(180deg);
    }
  }
  .refresh {
    position: absolute;
    right: 15px;
    width: 14px;
    height: 14px;
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
    0%{
      transform:rotate(0deg);
      -webkit-transform:rotate(0deg);
    }
    25%{
      transform:rotate(90deg);
      -webkit-transform:rotate(90deg);
    }
    50%{
      transform:rotate(180deg);
      -webkit-transform:rotate(180deg);
    }
    75%{
      transform:rotate(270deg);
      -webkit-transform:rotate(270deg);
    }
    100%{
      transform:rotate(360deg);
      -webkit-transform:rotate(360deg);
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
        background: #626262;
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
}
</style>
