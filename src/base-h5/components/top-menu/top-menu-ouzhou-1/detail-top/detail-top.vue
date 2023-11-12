<!--
 * @Author: rise
 * @Date: 2023-11-02 16:27:18
 * @LastEditors: lowen pmtylowen@itcom888.com
 * @LastEditTime: 2023-11-07 21:15:43
 * @Description:  
-->
<template>
  <div class="detail-top-info">
    <div class="sport-info" @click="toHome">
      <span>{{BaseData.menus_i18n_map[MenuData.menu_mi.value]}}</span>
      <img class="bakc-icon" src="../img/back.png" alt="" />
    </div>
    <div class="detail-select" v-if="drop_down_list.length">
      <div class="detail-select-nav" >
        <q-btn class="label" >
        <span class="btn-label">{{ drop_down_list[active].name }}</span>
        <q-menu class="detail-top-pop">
          <div class="detail-top-pop-content" ref="detail_top_pop">
            <div class="match_detail_top_list">
              <div
                v-for="(item, index) in drop_down_list"
                :class="[
                  { active: active == index },
                  'match_detail_top_list_item',
                ]"
                :key="index"
                @click="change_active(item,index)"
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
        src="../img/top-down.png"
        alt=""
      />
      </div>
      
    </div>
    <div class="refresh" @click="refresh">
      <img
        ref="refresh_icon"
        src="../img/refresh.png"
        alt=""
        srcset=""
        :class="[{ 'refresh-active': refresh_is_active }, 'refresh-icon']"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useMittEmit, MITT_TYPES } from "src/core";
import BaseData from "src/core/base-data/base-data.js";
import { MenuData } from 'src/core/';
const router = useRouter();
const refresh_is_active = ref(false);
const active = ref(0);
const show_list = ref(false);
const detail_top_pop = ref(null);
/**
 * 联赛数据
 */
const drop_down_list = ref([
  // {
  //   mid:1,
  //   name:"联赛联赛11111",
  //   mhn:"美国",
  //   man:"日本"
  // },
  // {
  //   mid:2,
  //   name:"联赛联赛22222",
  //   mhn:"美国",
  //   man:"日本"
  // },
  // {
  //   mid:3,
  //   name:"联赛联赛33333",
  //   mhn:"美国",
  //   man:"日本"
  // },
  // {
  //   mid:4,
  //   name:"联赛联赛44444",
  //   mhn:"美国",
  //   man:"日本"
  // }
]);
// /**
//  * @description: 返回上一页
//  * @param {*}
//  * @return {*}
//  */
const toHome = () => {
  router.go(-1);
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
const change_active = (item,index) => {
  if(active.value === index)return;
    active.value = index;
}
/**
 * @description: 刷新
 * @param {}
 * @return {*}
 */
const refresh = () => {
  refresh_is_active.value = true;
  useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS)
  setTimeout(() => {
    refresh_is_active.value = false;
  }, 1000);
}
</script>

<style lang="scss" scoped>
.detail-top-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  :deep(.q-btn){
      &::before{
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
    span{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 80%;
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
    // flex: 1;
    .detail-selec-nav{
      margin: 0 auto;
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
