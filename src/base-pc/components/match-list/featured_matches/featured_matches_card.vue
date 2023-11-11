<!--
 * @Author: lockie
 * @Date: 2023-07-01 15:24:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-17 14:45:09
 * @FilePath: \user-pc-vue3\src\components\match_list\featured_matches\featured_matches_card.vue
-->
<template>
  <div class="featured-matched-card-wrap">
    <!-- 当热门赛事超过四条 展示右侧滚动按钮 -->
    <template2 :is_show_btn="matches_featured_list.length >= 4">
      <div 
        class="featured-matched-card" 
        v-for="(item, index) in matches_featured_list" 
        :key="item.tid"
        :class="{ 'margin-box': index != matches_featured_list.length - 1 }"
      >
        <div class="right-top-img" :style="`background-position:0 -${current_ball_type(item.csid)}px`"></div>
        <div class="matches_description">
          <div class="matches_type">{{ item.tn }}</div>
          <div class="matches_time din_font">
            <span>{{ item.course }}</span>
            <span v-show="Number(item.mmp)">{{ item.mstValue }}</span>
          </div>
        </div>
        <div class="club-name">
          <span>{{ item.mhn }}</span><span class="din_font">{{ _.get(item.msc, 'S1', {}).home || 0 }}</span>
        </div>
        <div class="union-name">
          <span>{{ item.man }}</span><span class="din_font">{{ _.get(item.msc, 'S1', {}).away || 0 }}</span>
        </div>
        <div class="odds_box">
          <div class="top-line"></div>
          <div 
            class="odds_item" 
            v-for="option in item.current_ol[0]?.ol" 
            @click="checked_current_td({ payload: item, hps: item.current_ol[0], ol: option })"
            :class="{checked: option.oid == current_check_betId }"
            :key="option.oid"
          >
          <!-- 赔率返回的是十万位的 因此需要除算 -->
            <span>{{ option.ot }}</span><span>{{ Math.floor(option.ov / 1000) / 100 }}</span>
          </div>
        </div>
      </div>
    </template2>
  </div>
</template>

<script setup>

  import { ref, watch } from 'vue';
  import _ from 'lodash';
  import { storage_bet_info, storage_bet_id } from 'src/core/bet/module/bet_info.js'
  import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'

  import template2 from './template2.vue';

  const props = defineProps({
    matches_featured_list: {
      type: [ Array ],
      default: () => [],
    }
  })

  // 获取当前header展示背景图
  // const current_ball_type = ref(630)
  // key值为赛种id value值为对应的背景图y轴坐标
  const sport_ball = {
    1:0,
    2:1,
    3:5,
    4:10,
    5:6,
    6:8,
    7:13,
    8:2,
    9:3,
    10:4,
    11:12,
    12:9,
    13:14,
    14:15,
    15:16,
    16:12,
    17:20,
    18:'',
    19:12,
    20:25,
    21:13,
    22:1,
    23:1,
    24:1,
    25:1,
    26:1,
    27:1,
    28:1,
    29:1,
    30:1,
    31:1,
    32:1,
    37:1,
    38:1,
    100:1,
    101:1,
    102:1,
    103:1,
  }

  //const current_ball_type = computed((csid = 0) => {
  //  console.error("sssssssssss",csid)
  //  return sport_ball[csid] || 0
  //})
  
  // 每个banner在精灵图中的高度为70
  const current_ball_type = csid => {
    return sport_ball[csid] * 70 
  }


  const current_check_betId = ref(MatchListOuzhouClass.current_check_betId.value)

  // 监听 当前投注项ID的变化
  watch(
      MatchListOuzhouClass.current_check_betId,
      () => {
        current_check_betId.value= MatchListOuzhouClass.current_check_betId.value
      },
    )

  // // 选中当前td 使td高亮 且将投注信息存储到数据仓库中
  const checked_current_td = payload => {
    // 锁盘状态不高亮
    if (payload.hps.hs) {
      return;
    }
    if (payload.ol.oid !== current_check_betId.value) {
      storage_bet_info(payload);
    }
    storage_bet_id(payload.ol.oid);
  }

</script>

<style lang="scss" scoped>
  .featured-matched-card-wrap {
    height: 140px;
    width: 100%;
    .featured-matched-card {
      flex-shrink: 0;
      width: 300px;
      height: 140px;
      display: inline-block;
      background: #FFFFFF;
      padding-top: 8px;
      box-sizing: border-box;
      position: relative;
      .right-top-img {
        position: absolute;
        right: 0;
        top: 0;
        width: 80px;
        height: 60px;
        background-image:url('src/assets/images/icon_sport_top.png');
		    background-size: 80px ;
      }
      .matches_description {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        height: 14px;
        padding: 0 14px;
        .matches_type {
          font-family: "Roboto";
          font-size: 12px;
          font-weight: 400;
          line-height: 14px;
          letter-spacing: 0px;
          color: #8A8986;
        }
        .matches_time {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: flex-end;
          font-weight: 500;
          span {
            &:first-child {
              color: #8A8986;
              margin-right: 4px;
              font-family: DIN;
              font-size: 12px;
              line-height: 14px;
              letter-spacing: 0px;
              text-align: left;
            }
            &:last-child {
              color: #3D3B37;
              font-family: DIN;
              font-size: 12px;
              line-height: 12px;
              letter-spacing: 0px;
              text-align: right;
            }
          } 
        }
      }
      .club-name, .union-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #3D3B37;
        height: 16px;
        font-size: 14px;
        font-family: "Roboto";
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0px;
        text-align: left;
        padding: 0 14px;
        span {
          &:last-child {
            font-family: DIN;
            font-size: 14px;
            font-weight: 500;
            line-height: 17px;
            letter-spacing: 0px;
            text-align: left;
          }
        }
      }
      .club-name {
        margin-bottom: 8px;
      }
      .union-name {
        margin-bottom: 14px;
      }
      .odds_box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        height: 53px;
        padding: 0 14px;
        cursor: pointer;
        .top-line {
          position: absolute;
          top: 0;
          left: 0;
          height: 0.5px;
          background: #000000;
          width: 300px;
          opacity: 0.05;
        }
        .odds_item {
          width: 74px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          border-radius: 2px;
          font-family: DIN;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0px;
          &:hover {
            background: rgba(255, 112, 0, 0.1);
          }
          span {
            &:first-child {
              color: #8A8986;
              margin-right: 8px;
            }
            &:last-child {
              color: #FF7000;
            }
          }
        }
        .checked {
          background: #FF7000;
          color: #FFFFFF;
          span {
            color: #FFFFFF !important;
          }
          &:hover {
            background: #FF7000;
          }
        }
      }
    }
    .margin-box {
      margin-right: 10px;
    }
  }
</style>
