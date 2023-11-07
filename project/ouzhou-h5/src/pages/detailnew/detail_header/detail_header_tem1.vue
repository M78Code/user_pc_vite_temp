<template>
  <div class="detail_header_tem1">
    <div class="match-detail-head">
      <div v-show="get_match_detail.csid" :class="['sport_bg', `${ get_sports_bg(get_match_detail.csid) }`]"></div>
      <div class="match-detail-time">
        <div>
          <span class="match-detail-time-label">{{get_match_detail.course}} 

            <span v-if="get_match_detail.ms != 110">{{get_match_detail.mstValue}} {{get_match_detail.mstValueTime}}</span>
          </span>
          <q-badge v-if="get_match_detail.mng == 1" text-color="white" label="N" />
        </div>
        <div class="match-detail-time-collect" @click="collect_click">
          <!-- <img :src="is_collect ? '~assets/images/detail/collected.png' : '~assets/images/detail/collect.png'" alt="" /> -->
          <img v-if="is_collect"  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/detail/collected.png`"   alt="" />
          <img v-else src="/images/detail/collect.png" alt="" />
        </div>
      </div>
      <div class="match-detail-score">
        <div class="match-detail-team-name">{{ get_match_detail.mhn }}</div>
        <div class="match-detail-num" v-if="scoew_icon_list['S1']">{{ scoew_icon_list['S1'].home }}</div>
      </div>
      <div class="match-detail-score">
        <div class="match-detail-team-name">{{ get_match_detail.man }}</div>
        <div class="match-detail-num" v-if="scoew_icon_list['S1']">{{ scoew_icon_list['S1'].away }}</div>
      </div>
      <template v-if="get_match_detail.ms == 1">
        <div class="match-detail-item-list" v-if="get_match_detail.csid == '1'">
          <div class="list" v-for="item in football_score_icon_list" :key="item.msc_key">
            <span>{{ scoew_icon_list[item.msc_key] ? scoew_icon_list[item.msc_key]['home'] : "" }}</span>
            <span :class="[item.bg_url, 'score-icon']">
              <!-- <img class="score-icon" :src="item.url" alt="" /> -->
            </span>
            <span>{{ scoew_icon_list[item.msc_key] ? scoew_icon_list[item.msc_key]['away'] : "" }}</span>
          </div>
        </div>
        <div class="match-detail-item-list baseketball-list" v-if="['2','6'].includes(get_match_detail.csid)">
          <div class="line"></div>
          <div class="list-item" v-for="item in basketball_score_icon_list" :key="item.msc_key">
            <span>{{ scoew_icon_list[item.msc_key] ? scoew_icon_list[item.msc_key]['home'] : "" }}</span>
            <span v-if="scoew_icon_list[item.msc_key]">-</span>
            <span>{{ scoew_icon_list[item.msc_key] ? scoew_icon_list[item.msc_key]['away'] : "" }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, onMounted, ref, computed, toRef, watch } from "vue";
import { api_match } from "src/api/index.js";
// import { detail_module } from "src/project-ouzhou/stores/detail";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/core";
import _ from "lodash";
const props = defineProps({
  get_match_detail: {
    type: Object,
    default: () => {},
  },
});

const current_ball_type = ref(0);
const sport_ball = {
	0:7,
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
	16:21,
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
const cuid = ref("");
const bg_img = ref({

})
const detail_store = ref(null);
let is_collect = ref(false);
const football_score_icon_list = ref([
  {
    bg_url: "shangbanchang",
    msc_key: "S2"
  },
  {
    bg_url: "dianqiu",
    msc_key: "S10"
  },
  {
    bg_url: "huangpai",
    msc_key: "S12"
  },
  {
    bg_url: "hongpai",
    msc_key: "S11"
  },
  {
    bg_url: "jiaoqiu",
    msc_key: "S5"
  },
])
// 篮球和美足
const basketball_score_icon_list = ref([])
const get_sports_bg = (csid) => {
  // console.log(csid, "csid");
  let num = csid;
  if (![1, 2, 5].includes(Number(csid))) {
    num = 0;
  }
  return `sports_bg${ num }`
}
const set_basketball_score_icon_list = () => {
  if (_.get(props.get_match_detail, 'mle') == '17') {
    basketball_score_icon_list.value = [
      {
        msc_key: "S2"
      },
      {
        msc_key: "S3"
      }
    ]
  } else {
    basketball_score_icon_list.value = [
      {
        msc_key: "S19"
      },
      {
        msc_key: "S20"
      },
      {
        msc_key: "S21"
      },
      {
        msc_key: "S22"
      }
    ]
  }
}
const scoew_icon_list = ref({});
const toRef_get_match_detail = toRef(props, "get_match_detail");
watch(toRef_get_match_detail, (new_value, old_value) => {
  scoew_icon_list.value = {};
  set_scoew_icon_list(new_value);
  current_ball_type.value = sport_ball[new_value.csid] * 100;
  set_basketball_score_icon_list();
})
/**
 *@description // 比分板数据
 *@param {*}
 *@return {*}
 */
const set_scoew_icon_list = (new_value) => {
  if (new_value && new_value.msc) {
    for (let key in new_value.msc) {
      let score_key_arr = new_value.msc[key].split("|");
      let score_value_arr = score_key_arr[1].split(":");
      scoew_icon_list.value[score_key_arr[0]] = {
        home: score_value_arr[0],
        away: score_value_arr[1]
      }
    }
    // console.log("scoew_icon_list", scoew_icon_list);
  }
}
/**
 *@description // 收藏
 *@param {*}
 *@return {*}
 */
const collect_click = () => {
  is_collect.value = !is_collect.value
}
setTimeout(() => {
  // console.log("get_match_detail_MatchInfo", props.get_match_detail);
  set_scoew_icon_list(props.get_match_detail);
  set_basketball_score_icon_list();
}, 200);
</script>

<style lang="scss" scoped>
.detail_header_tem1 {
  .match-detail-head {
    position: relative;
    min-height: 100px;
    padding: 15px 14px 0 14px;
    line-height: 23px;
    background-color: #fff;
    // background: linear-gradient(
    //   90.05deg,
    //   rgba(255, 255, 255, 0.81) 0.04%,
    //   rgba(204, 204, 204, 0.6) 99.96%
    // );
    // .sports_bg0 {
    //   background:url('src/assets/images/detail/baseball_bg.png') no-repeat;
    // }
    .sports_bg2 {
      background: url('src/assets/images/detail/basketball_bg.png') no-repeat;
    }
    .sports_bg1 {
      background: url('src/assets/images/detail/football_bg.png') no-repeat;
    }
    .sports_bg5 {
      background: url('src/assets/images/detail/tennis_bg.png') no-repeat;
    }
    .sports_bg0 {
      background: url('src/assets/images/detail/other_bg.png') no-repeat;
    }
    .sport_bg{
      width: 140px;
      height: 90px;
      overflow: hidden;
      background-size: 140px 100px;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
    }
    // padding-bottom: 10px;
    .match-detail-time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-items: center;
      .match-detail-time-label {
        color: #8a8986;
        padding-right: 10px;
        font-size: 15px;
        font-weight: 500;
      }
      .q-badge {
        background: #0CBEB9;
      }
      .match-detail-time-collect {
        width: 14px;
        height: 14px;
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
    .match-detail-score {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .match-detail-team-name {
        // font-weight: bold;
        font-size: 15px;
      }
      .match-detail-num {
        color: #ff7000;
        font-weight: 500;;
        font-size: 15px;
      }
    }
    .match-detail-item-list {
      height: 34px;
      line-height: 34px;
      display: flex;
      justify-content: space-between;
      .list {
      }
      .baseketball_list {

      }
      .dianqiu {
        background: url('src/assets/images/detail/dianqiu.png') no-repeat;
      }
      .hongpai {
        background: url('src/assets/images/detail/hongpai.png') no-repeat;
      }
      .huangpai {
        background: url('src/assets/images/detail/huangpai.png') no-repeat;
      }
      .jiaoqiu {
        background: url('src/assets/images/detail/jiaoqiu.png') no-repeat;
      }
      .shangbanchang {
        background: url('src/assets/images/detail/shangbanchang.png') no-repeat;
      }
      .score-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin: 0 2px;
        vertical-align: middle;
      }
    }
    .baseketball-list {
      position: relative;
      margin-top: 5px;
      justify-content: flex-start;
      .list-item {
        padding: 0 15px 0 0;
        font-weight: 500;
      }
      .line {
        position: absolute;
        top: 0;
        width: 100vw;
        left: -14px;
        height: 1px;
        background: #F5F5F5;
      }
    }
    .match-detail-bet-or-event {
    }
  }
}
</style>
