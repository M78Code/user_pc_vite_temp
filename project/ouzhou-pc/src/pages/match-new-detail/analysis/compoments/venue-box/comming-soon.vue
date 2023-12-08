<!--
 * @Author: cooper
 * @Date: 
 * @Description: 右侧赛事分析 即将开赛，中场组件
-->
<template>
  <div
    class="main"
    :style="{
      backgroundImage: `url(${backgroundImg})`
    }"
  >
    <div class="content">
        <div class="content-item">
            <span>{{ detail_info.mhn }}</span>
        </div>
        <div class="content-time">
           {{i18n_t("common.match_soon")}}
        </div>
        <div class="content-item">
            <span>{{ detail_info.man }}</span>
        </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import lodash_ from "lodash";

const animal = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`;
const football = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/football.png`;//足球
const basketball = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/basketball.png`;//篮球
const baseball = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/baseball.png`; //棒球
const ice_hockey = `${LOCAL_PROJECT_FILE_PREFIX}/image/jpg/ice_hockey.jpg`; //冰球
const tennis = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/tennis.png`; //网球
const usa_football = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/usa_football.png`;// 美足
const snooker = `${LOCAL_PROJECT_FILE_PREFIX}/image/jpg/snooker.jpg`; //斯诺克
const ping_pong = `${LOCAL_PROJECT_FILE_PREFIX}/image/jpg/ping_pong.jpg`; //乒乓球
const volleyball = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/volleyball.png`;// 排球
const badminton = `${LOCAL_PROJECT_FILE_PREFIX}/image/jpg/badminton.jpg`; //羽毛球
const handball = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/handball.png`; //手球
const boxing = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/boxing.png`; //拳击
const beach_volleyball = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/beach_volleyball.png`; //沙滩排球
const rugby = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/rugby.png`; //橄榄球
const hockey = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/hockey.png`; //曲棍球
const polo = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/polo.png`; //水球
const virtual_dog = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/virtual_dog.png`;//赛狗
const virtual_racing = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/virtual_racing.png`; //赛马
const motorcycle = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/motorcycle.png`; // 虚拟摩托车
const virtual_dirt_bike_details = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/virtual_dirt_bike_details.png`;// 虚拟泥地摩托车

const props = defineProps({
  detail_info: {
    // 赛事详情
    type: Object,
    default: () => {},
  },
});
const backgroundImg = computed(() => {
  const csid = props.detail_info.csid + ''
  let background_img = ""
  // 3棒、4冰、5网、7斯诺克、8乒乓、10羽毛球 1001虚拟足球、1002赛狗、1011赛马
  switch (csid) {
    case "1": // 足球
    case "1001": // 虚拟足球
      background_img = football;
      break;
    case "2": // 篮球
    case "1004": // 虚拟篮球
      background_img = basketball;
      break;
    case "3": // 棒球
      background_img = baseball;
      break;
    case "4": // 冰球
      background_img = ice_hockey;
      break;
    case "5": // 网球
      background_img = tennis;
      break;
    case "6": // 美足
      background_img = usa_football;
      break;
    case "7": // 斯诺克
      background_img = snooker;
      break;
    case "8": // 乒乓
      background_img = ping_pong;
      break;
    case "9": // 排球
      background_img = volleyball;
      break;
    case "10": // 羽毛球
      background_img = badminton;
      break;
    case "11"://手球
      background_img = handball;
      break;
    case "12"://拳击
      background_img = boxing;
      break;
    case "13"://沙滩排球
      background_img = beach_volleyball;
      break;
    case "14"://橄榄球
      background_img = rugby;
      break;
    case "15"://曲棍球
      background_img = hockey;
      break;
    case "16"://水球
      background_img = polo;
      break;
    case "1002": // 虚拟赛狗
      background_img = virtual_dog;
      break;
    case "1011": // 虚拟赛马
      background_img = virtual_racing;
      break;
    case "1010": // 虚拟摩托
      background_img = motorcycle;
      break;
    case "1009": // 虚拟泥地摩托车
      background_img = virtual_dirt_bike_details;
      break;
  }
  return background_img
})
watch(
  () => props.detail_info,
  (val) => {
  }
);
</script>

<style lang="scss" scoped>
.main {
  height: 190px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    padding: 0 16px;
    max-width: 700px;
    width: 85%;
    min-width: 330px;
    height: 130px;
    border-radius: 4px;
    background-color: rgba(38, 41, 49, 0.8);
    box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.3);
    font-size: 14px;
    display: flex;
  
  align-items: center;
//   justify-content: space-between;
  color:var(--q-gb-t-c-1);
  .content-item{
    width: 40%;
    max-height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
    &:nth-child(3){
       text-align: right;

    }
  }
  .content-time{
    width: 20%;
  }
  }
}
</style>