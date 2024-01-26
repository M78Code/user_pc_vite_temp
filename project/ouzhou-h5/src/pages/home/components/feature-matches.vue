<!--
* @Author: Dolphin
* @Description: 特色比赛
-->

<template>
  <div class="matches_page">
    <div class="item" v-for="item, index in featured_matches" :key="index" :style="{backgroundImage: `url(${get_amtch_bg_image(item.csid)})`}" >
      <!-- 卡片区 -->
      <div class="card" @click="toDetails(item)">
        <!-- 标题 -->
        <div class="title">
          <span class="name">{{ item.tn }}</span>
          
          <!-- 赛事日期标准版 -->
          <div :class="['timer-wrapper-c flex items-center']">

            <!-- 赛事回合数mfo -->
            <!-- <div v-if="item.mfo" class="mfo-title" :class="{ 'is-ms1': item.ms == 1 }">
              {{ item.mfo }}
            </div> -->

            <!--即将开赛 ms = 110-->

            <div class="coming-soon" v-if="item.ms" v-show="item.ms == 110">
              {{ i18n_t(`ms[${item.ms}]`) }}
            </div>

            <!--开赛日期 ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
            <div class="date-time" v-show="item.ms != 110 && !show_start_counting_down(item) && !show_counting_down(item)">
              {{ format_time_zone(+item.mgt).Format(i18n_t('time4')) }}
            </div>
            <!--一小时内开赛 -->
            <div class="start-counting-down" v-show="item.ms != 110 && show_start_counting_down(item)">
              <CountingDownStart :match="item" :index="index" :mgt_time="item.mgt"></CountingDownStart>
            </div>
            <!--倒计时或正计时-->
            <div v-if="item.ms != 110 && show_counting_down(item)"
              :class="['counting-down-up-container relative-position', { 'special-match-container': item.mfo || [0, 31].includes(+item.mmp) }]">
              <!--足球csid:1 冰球csid:4 橄榄球csid:14 DotaCsid:101 累加 排球csid:9 倒计时-->
              <CountingDownSecond ref="counting-down-second" :title="get_mmp_map_title(item)" :mmp="item.mmp"
                :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+item.csid)" :m_id="item.mid" :second="item.mst" :match="item">
              </CountingDownSecond>
            </div>
          </div>
        </div>
        <!-- 赛事名称 -->
        <div class="game-name">
          <div> 
            <span :class="{'is-handicap': item.handicap_index == 1}">{{ item.mhn }}</span> 
            <span class="span">{{ item.home_score }}</span> 
          </div>
          <div> 
            <span :class="{'is-handicap': item.handicap_index == 2}">{{ item.man }}</span> 
            <span class="span">{{ item.away_score }}</span> 
          </div>
        </div>
      </div>
      <template v-if="item">
        <ScoreList :match_info="item" height="39px" :show_hpn="true" :is_change="false" :hps="get_item_hps(item)" custom_type="hots" />
      </template>
    </div>
  </div>
</template>
 
<script setup>
import lodash from 'lodash'
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { format_time_zone } from "src/output/index.js"
import PageSourceData from "src/core/page-source/page-source.js";
import MatchListClass from 'src/core/match-list-h5/match-class/match-list.js'
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import ScoreList from 'src/base-h5/components/match-container/template/ouzhou/components/score-list.vue';
import { football_bg, basketball_bg, volleyball_bg, tennis_bg, table_tennis_bg, badminton_bg, baseball_bg } from 'src/base-h5/core/utils/local-image.js'

/** @type { { featured_matches:Array<TYPES.MatchDetail> } } */
const props = defineProps({
  featured_matches: {
    type: Array,
    default: () => []
  }
})

const matchBgImage = [{
  value: '1',
  image: football_bg,
}, {
  value: '5',
  image: tennis_bg,
}, {
  value: '2',
  image: basketball_bg,
}, {
  value: '9',
  image: volleyball_bg,
}, {
  value: '10',
  image: badminton_bg,
}, {
  value: '3',
  image: baseball_bg,
}, {
  value: '8',
  image: table_tennis_bg,
}, {
  value: '6',
  image: football_bg,
}]

/**
 * @description 赛事信息
 */
const get_item_hps = (item) => {
  console.log("//////",item)
  const hpsData = lodash.get(item, 'hpsData', [])
  const length = lodash.get(hpsData, 'length', 0)
  if (length < 1) return []
  const hps = lodash.get(hpsData, '[0].hps', [])
  return hps
}

const get_amtch_bg_image = (csid) => {
  const item = matchBgImage.find(t => t.value == csid)
  return item?.image
}

const get_mmp_map_title = (item) => {
  return MatchListClass.match_period_map(item);
}

  /**
   * @description: 多少分钟后开赛显示
   * @param {Object} item 赛事对象
   * @return {String}
   */
  const show_start_counting_down = (item) => {
    if (typeof item.mcg == 'undefined') {
      return false;
    }
    let r = false;
    // 滚球中不需要显示多少分钟后开赛
    if (item && item.ms == 1) {
      return r;
    }
    let start_time = item.mgt * 1;
    let init_server = PageSourceData.init_time.server_time * 1;
    let init_local = PageSourceData.init_time.local_time;
    let now_local = new Date().getTime();
    let sub_local_time = now_local - init_local;
    let now_server_time = init_server + sub_local_time;
    let sub_time = start_time - now_server_time;

    // mcg 1:滚球 2:即将开赛 3:今日赛事 4:早盘
    r = item.mcg != 1 && 0 < sub_time && sub_time < 60 * 60 * 1000;
    return r;
  }
  // 赛事状态  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断
  /**
   * @description: 进行中(但不是收藏页)的赛事显示累加计时|倒计时
   * @param {Object} item 赛事对象
   * @return {Boolean}
   */
  const show_counting_down = (item) => {
    return [1, 2, 10].includes(item.ms * 1);
  }

const router = useRouter()
/** 跳转赛事详情 @param {TYPES.MatchDetail} item */
function toDetails(item){
  router.push({
    name:'category',
    params:{
      mid: item.mid,
      tid: item.tid,
      csid: item.csid
    }
  })
}

</script>
 
<style scoped lang="scss">
.matches_page{
  height: 120px;
  overflow: hidden;
  display: flex;
  overflow-x: auto;
  padding: 0 10px 0 15px;
  background: #E2E2E2;
  touch-action: pan-x;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;/*解决移动端滑动卡顿问题*/
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .item{
    width: 240px;
    overflow: hidden;
    flex-shrink: 0;
    padding-top: 3px;
    background-color: var(--q-gb-bg-c-2);
    margin-right: 10px;
    border-radius: 3px;
    background-repeat: no-repeat;
    background-size: 75px;
    background-position: top right; 
    content-visibility: auto;
    .title{
      display: flex;
      padding: 3px 10px 0;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: var(--q-gb-t-c-3);
      .name{
        width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .time{
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .timer-wrapper-c{
        flex: 1;
        flex-wrap: nowrap;
        flex-direction: row-reverse;
        .counting-down-wrap{
          flex: 1;
          flex-wrap: nowrap;
          flex-direction: row-reverse;
          position: static;
          :deep(.counting){
            font-size: 12px;
            color: var(--q-gb-t-c-3);
          }
        }
      }
      > span {
        > span {
          color: var(--q-gb-t-c-4);
          font-weight: 500;
        }
      }
      :deep(.counting-down-start){
        white-space: nowrap;
      }
    }
    .game-name{
      height: 48px;
      padding: 0 10px;
      color: var(--q-gb-t-c-4);
      margin-bottom: 4px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      > div {
        display: flex;
        font-size: 14px;
        font-weight: 400;
        justify-content: space-between;
        > span:first-child{
          width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .is-handicap{
          color: #7A0F25 !important;
        }
        .span{
          font-weight: 500;
        }
      }
    }
    .score{
      position: relative;
      top: 4px;
      font-size: 15px;
      display: flex;
      padding: 0px 5px 0;
      justify-content: space-between;
      > span.active{
        //color: #fff;
        color: var(--q-gb-t-c-2);
        border-radius: 2px;
        //background: #FF7000;
        background-color: var(--q-gb-bg-c-1);
        > span > span {
          //color: #fff;
          color: var(--q-gb-t-c-2);
        }
      }
      > span {
        padding: 7px 3px;
        flex: 1;
        flex-shrink: 0;
        text-align: center;
        color: var(--q-gb-t-c-3);
        border-radius: 3px;
        > span {
          > span {
            //color: #FF7000;
            color: var(--q-gb-t-c-1);
            font-weight: 500;
          }
        }
      }
      .lock{
        width: 16px;
        height: 16px;
        position: relative;
        top: 2px;
      }
    }
  }
  > .item:last-child{
    margin-right: 0;
  }
}
</style>