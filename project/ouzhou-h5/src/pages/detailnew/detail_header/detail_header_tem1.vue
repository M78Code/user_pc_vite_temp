<template>
  <div class="component detail_header_tem1">
    <div class="match-detail-head">
      <div
        v-show="get_match_detail?.csid"
        :class="['sport_bg', `${get_sports_bg(get_match_detail?.csid)}`]"
      ></div>
     
      <div class="match-detail-time">
        <span class="match-detail-time-label" v-if="!lodash.isEmpty(get_match_detail)">
          
          <match-stage :detail_data="get_match_detail" v-if="start_text == -1"></match-stage>
          <span v-else>
            {{ i18n_tc('list.after_time_start2', [minue]) }}
          </span>
          <q-badge
            v-if="get_match_detail.mng == 1"
            text-color="white"
            label="N"
            style="margin-left:5px"
          />
        </span>
       
        
        <div class="match-detail-time-collect" v-if="show_collect" >
          <!-- 显示视频按钮 -->
          <div v-if="status == 1 || status == 3" @click="handleChange('video')">
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/detail/video_gray.png`" alt="" class="icon-video"/>
          </div>
          <!-- 显示动画按钮 -->
          <div v-if="status == 1 || status == 2" @click="handleChange('animation')">
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/detail/animation_gray.png`" alt="" class="icon-animation"/>
          </div>
          <img
            v-if="is_collect"
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/detail/collected.png`"
            alt=""
            @click="collect_click"
          />
          <img
            v-else
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/detail/collect.png`"
            alt=""
            @click="collect_click"
          />
        </div>
      </div>
      <div class="match-detail-score">
        <div class="match-detail-team-name">
         <span :class="[set_serving_side(props.get_match_detail, 'home') ? 'active-circle':'circle']"></span> 
         <span>{{ get_match_detail.mhn }}</span>
        </div>
        <span v-if="false">{{ detail_count }}</span>
        <div class="match-detail-num" >
          <!-- {{ scoew_icon_list["S1"].home }} -->
          <span class="active-num"> {{ detail_count?.home }}</span>
          <span v-if="get_match_detail.csid == 5 " class="default-num">{{ tennis_point[0] }}</span>
        </div>
      </div>
      <div class="match-detail-score">
        <div class="match-detail-team-name">
         <span :class="[set_serving_side(props.get_match_detail, 'away')? 'active-circle':'circle']"></span> 
          <span>{{ get_match_detail.man }}</span>

          
        </div>
        <div class="match-detail-num" v-if=" get_match_detail.man">
          <!-- {{ scoew_icon_list["S1"].away }} -->
          <span class="active-num"> {{ detail_count?.away }}</span>
          <span v-if="get_match_detail.csid == 5 " class="default-num">{{ tennis_point[1] }}</span>

         
        </div>
      </div>
      <!-- 疑似某些情况下 get_match_detail.ms 不为1导致比分板消失 -->
      <!-- {{get_match_detail.ms }} -->
      <!-- 赛果需要显示比分 添加4 -->
      <template v-if=" [1,4,3].includes(get_match_detail.ms)">
        <div class="match-detail-item-list" v-if="get_match_detail.csid == '1'">
          <div
            class="list"
            v-for="item in football_score_icon_list"
            :key="item.msc_key"
          > 
            <span>{{ scoew_icon_list[item.msc_key] ? scoew_icon_list[item.msc_key]["home"] : "0" }}</span>
            <span :class="[item.bg_url, 'score-icon']">
              <!-- <img class="score-icon" :src="item.url" alt="" /> -->
            </span>
            <span>{{ scoew_icon_list[item.msc_key] ? scoew_icon_list[item.msc_key]["away"] : "0"}}</span>
          </div>
        </div>
        <div
          class="match-detail-item-list baseketball-list"
          :class="{
            'game-on':[1,2].includes(get_match_detail.ms)
          }"
          v-if="['2', '6'].includes(get_match_detail.csid+'')"
        >
          <!-- <div class="line"></div> -->
          <template v-for="item in basketball_score_icon_list" :key="item.msc_key">
            <div class="list-item" v-if="scoew_icon_list[item.msc_key]" >
              <span>{{scoew_icon_list[item.msc_key]["home"]}}</span>
              <span>-</span>
              <span>{{scoew_icon_list[item.msc_key]["away"]}}</span>
            </div>
          </template>
        </div>
      </template>
    </div>
     <!-- 比分组件 目前只写了网球比分组件 -->
     <matchScore v-if="get_match_detail.csid == 5 "  :detail_data="get_match_detail" />
  </div>
</template>

<script setup>
import {onMounted, ref, computed, toRef, watch } from "vue";
import matchStage from "src/base-h5/components/match/match-stage.vue";  // 详情页上推后置顶的赛事具体状态(1.未开赛显示2.开赛时间小于1小时显示分钟)
import countingDown from 'src/base-h5/components/common/counting-down.vue'   // 赛事进行中每秒变化的计时器
import { api_match,api_common } from "src/api/index.js";
import MatchCollect from 'src/core/match-collect'
import { LOCAL_PROJECT_FILE_PREFIX,format_time_zone_time, format_time_zone  } from "src/output/index.js";
import matchScore from "./match-score/index.vue"
import UserCtr from "src/core/user-config/user-ctr.js";
import { i18n_tc } from "src/boot/i18n";
// import UserCtr from 'src/core/user-config/user-ctr.js'
/** @type {{get_match_detail:TYPES.MatchDetail}} */
const props = defineProps({
  get_match_detail: {
    type: Object,
    default: () => ({}),
  },
  show_collect: {
    type:Boolean,
    default : true
  }
});


/**
     * @description: 设置发球方绿点显示
     * @param {Object} item 赛事对象
     * @param {Object} side 'home'主队  'away'客队
     * @return {Boolean} 是否显示发球方
     */
const set_serving_side = (item, side) => {
  return item.ms == 1 && item.mat == side;
}

// 网球当前比分
const tennis_point = ref([0,0])

const emits = defineEmits('handle-change')

const start_text = ref(-1)

// 多少分钟之后开赛
const minue = computed(() => {
  return Math.floor(start_text.value / 1000 /60);
})

// 比赛开始，显示右侧actions状态
const actionsStatus = ref(true);
  // 赛事收藏状态
const  is_collect = computed(()=>{
  if(lodash.isEmpty(props.get_match_detail)) return
  return MatchCollect.get_match_collect_state(props.get_match_detail)
}) 
/** @type {import('vue').ComputedRef<number>} 1: 动画视频可以切换 2: 只显示动画 3：只显示视频 4：都不显示 */
const status = computed(() => {
  // 动画>源视频>比分板  
  const get_detail_data = props.get_match_detail;
  
  // <!-- mvs动画状态：-1：没有配置动画源 | 0 ：已配置，但是不可用 | 1：已配置，可用，播放中 | 2：已配置，可用，播放中 -->
  if (get_detail_data.mvs > -1 || (get_detail_data.mms > 1 && [1,2,7,10,110].includes(get_detail_data.ms*1))) {
    
    if (get_detail_data.mvs > -1 && get_detail_data.mms > 1) {
      return 1;
    }
    // 动画状态大于-1时，显示动画按钮 
    if (get_detail_data.mvs > -1) {
      return 2;
    }
    //  视频状态大于1时，显示视频按钮 i18n_t('match_info.video')是国际化取值 --
    if (get_detail_data.mms > 1) {
      return 3;
    }
    
  }

  return 4;
 
});

watch(() => props.get_match_detail, (value) => {
  if(lodash.isEmpty(value)) return
  console.log(value, "props.get_match_detail");
  // format_time_zone(+item.mgt).Format(i18n_t('time4'))
  const now = Date.now();
  if ((props.get_match_detail.mgt && +props.get_match_detail.mgt - now > 0)) {
    start_text.value = Math.floor((+props.get_match_detail.mgt - now)) 
  }
  
  const s1_data = value.msc.map(e => e.split('|')).reduce((pre, cur) => {
      pre[cur[0]] = cur[1].split(':');
      return pre;
  }, {});
  if (s1_data['S103']) {
    console.log('网球比分', s1_data['S103']);
    tennis_point.value = s1_data['S103'];
  }else {
    tennis_point.value =[0,0]
  }
})

//比分
const detail_count = computed(() => {
  return scoew_icon_list.value['S1'] || [0,0];
})

const show_time_counting = computed(() => {
  let csid = Number(props.get_match_detail.csid);
  let mmp = Number(props.get_match_detail.mmp);
  // 网羽乒斯棒球(3)排球(9)不显示倒计时,只显示状态标题
  if([5, 10, 8, 7, 3, 9, 13].includes(csid)){
    return false;
  }
  // 足球
  else if(csid === 1){
    return ![0,30,31,32,33,34,50,61,80,90,100,110,120,301,302,303,445].includes(mmp);
  }
  // 冰球
  else if(csid == 4){
    // return false;  //临时屏蔽冰球倒计时
    if(!props.get_match_detail.mlet){
      return false;
    }
    // 第一局 第二局 第三局 加时赛 点球大战
    let mmps = [1,2,3,40,50];
    return mmps.includes(mmp);
  }
  // 美式足球
  else if(csid == 6){
    if(!props.get_match_detail.mlet){
      return false;
    }
    if(mmp === 40){  // 2843 【SIT】【H5】列表页，美足加时赛阶段，期望优化时间展示
      if(counting_time.value === '00:00'){
        return false
      }
    }
    // 第一节 第二节 第三节 第四节 加时赛
    let mmps = [13, 14, 15, 16, 40];
    return mmps.includes(mmp);
  }
  // dota
  else if([100,101,102,103].includes(+csid)){
    if(mmp > -1){
      return true;
    }
  }
  else
  {
    return ![0,30,31,32,33,34,50,61,80,90,100,110,120,301,302,303,445].includes(mmp);
  }
})

// 意义不明的两行代码
const current_ball_type = ref(0);
const sport_ball = {
  0: 7,
  1: 0,
  2: 1,
  3: 5,
  4: 10,
  5: 6,
  6: 8,
  7: 13,
  8: 2,
  9: 3,
  10: 4,
  11: 12,
  12: 9,
  13: 14,
  14: 15,
  15: 16,
  16: 21,
  17: 20,
  18: "",
  19: 12,
  20: 25,
  21: 13,
  22: 1,
  23: 1,
  24: 1,
  25: 1,
  26: 1,
  27: 1,
  28: 1,
  29: 1,
  30: 1,
  31: 1,
  32: 1,
  37: 1,
  38: 1,
  100: 1,
  101: 1,
  102: 1,
  103: 1,
};
const cuid = ref("");
const bg_img = ref({})
const detail_store = ref(null);
console.log(is_collect,'is_collect');
const football_score_icon_list = ref([
  {
    bg_url: "shangbanchang",
    msc_key: "S2",
  },
  {
    bg_url: "dianqiu",
    msc_key: "S10",
  },
  {
    bg_url: "huangpai",
    msc_key: "S12",
  },
  {
    bg_url: "hongpai",
    msc_key: "S11",
  },
  {
    bg_url: "jiaoqiu",
    msc_key: "S5",
  },
]);
// 篮球和美足
const basketball_score_icon_list = ref([]);
const get_sports_bg = (csid) => {
  // console.log(csid, "csid");
  let num = csid;
  if (![1, 2, 5].includes(Number(csid))) {
    num = 0;
  }
  return `sports_bg${num}`;
};

const handleChange = (label)  => {
  emits('handle-change', label)
}

const set_basketball_score_icon_list = () => {
  if (lodash.get(props.get_match_detail, "mle") == "17") {
    basketball_score_icon_list.value = [
      {
        msc_key: "S2",
      },
      {
        msc_key: "S3",
      },
    ];
  } else {
    basketball_score_icon_list.value = [
      {
        msc_key: "S19",
      },
      {
        msc_key: "S20",
      },
      {
        msc_key: "S21",
      },
      {
        msc_key: "S22",
      },
    ];
  }
};
const scoew_icon_list = ref({})
/**
 *@description // 比分板数据
 *@param {*}
 *@return {*}
 */
const set_scoew_icon_list = (new_value) => {
  scoew_icon_list.value = {};
  if (new_value && new_value.msc) {
    for (let key in new_value.msc) {
      let score_key_arr = new_value.msc[key].split("|");
      let score_value_arr = score_key_arr[1].split(":");
      scoew_icon_list.value[score_key_arr[0]] = {
        home: score_value_arr[0],
        away: score_value_arr[1],
      };
    }
    
  }
};

/**
 *@description 取出符合网球阶段的比分
  *@param {Undefined}
  *@return {Array} 比分集合
  */
const initEvent = () => {
  // // 第一盘比分，第二盘比分，第三盘比分，第四盘比分，第五盘比分;
  const msc_array = ['S23','S39','S55','S71','S87'];
  let msc = props.get_match_detail.msc;
  // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
  msc = _.sortBy( msc, (item) => {
    return +(item.split("|")[0]).substring(1)
  })
  let score_arr = [];
  // 循环只取出接口返回的比分里面符合网球阶段的比分
  _.forEach(msc, (item)=>{
    // S1 S2 S3 S19 S20 ...
    let num_index = item.split("|")[0];
    if(msc_array.includes(num_index)){
      score_arr.push(item.split("|")[1]);
    }
  })
  return score_arr;
};

/**
 *@description // 收藏
 *@param {*}
 *@return {*}
 */
const collect_click = () => {
  MatchCollect.set_match_collect_state(props.get_match_detail, !is_collect.value)
    api_common.add_or_cancel_match({
        mid: props.get_match_detail.mid,
        cf: !is_collect.value ? 0 : 1,
        cuid: UserCtr.get_uid()
    }).then(res => {
        if (res.code != 200) return
        
    })
 
}
//#TODO: 
// setTimeout(() => {
  // console.log("get_match_detail_MatchInfo", props.get_match_detail);
  // set_scoew_icon_list(props.get_match_detail);
  // set_basketball_score_icon_list();
// }, 200);

onMounted(()=>{
  setTimeout(function (){
    console.log(props.get_match_detail?.ms,"赛果没有比分截图这里")
  },1200)
})

// console.log(scoew_icon_list.value,"-------------------------------------------------",props.get_match_detail.msc_obj)
watch(props.get_match_detail, (new_value, old_value) => {
  scoew_icon_list.value = new_value?.msc_obj||set_scoew_icon_list(new_value)
  // set_scoew_icon_list(new_value);
  // 意义不明
  current_ball_type.value = sport_ball[new_value?.csid] * 100;
  set_basketball_score_icon_list()
},{ immediate: false, deep: true })
watch(
  () => props.get_match_detail?.msc,
  (msc) => {
      set_scoew_icon_list({msc});
      set_basketball_score_icon_list();
    
  },
  { immediate: false, deep: true }
);
watch(()=>props.get_match_detail?.mle,
  set_basketball_score_icon_list,
  {
    immediate:true
  }
)
</script>

<style lang="scss" scoped>
.current-score-color{
  color: var(--q-gb-t-c-1);
}



.detail_header_tem1 {
  .match-detail-head {
    // padding: 12px 20px;
    position: relative;
    width: 100%;
    // height: 245px;
    flex-shrink: 0;
    // line-height: 23px;
    background-color: var(--q-gb-bg-c-2);
    font-weight: 700; //使用设计稿的500不明显，故使用700. 初步判断为苹方字体不包含500字重的缘故
    // background: linear-gradient(
    //   90.05deg,
    //   rgba(255, 255, 255, 0.81) 0.04%,
    //   rgba(204, 204, 204, 0.6) 99.96%
    // );
    // .sports_bg0 {
    //   background:url('src/assets/images/detail/baseball_bg.png') no-repeat;
    // }
    .actions {
      position: absolute;
      right: 0;
    }
    .sports_bg2 {
      background: url($SCSSPROJECTPATH + "/image/detail/basketball_bg.png")
        no-repeat;
    }
    .sports_bg1 {
      background: url($SCSSPROJECTPATH + "/image/detail/football_bg.png")
        no-repeat;
    }
    .sports_bg5 {
      background: url($SCSSPROJECTPATH + "/image/detail/tennis_bg.png")
        no-repeat;
    }
    .sports_bg0 {
      background: url($SCSSPROJECTPATH + "/image/detail/other_bg.png") no-repeat;
    }
    .sport_bg {
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
      position: relative;
      padding: 10px 12px 14px 20px;
      .match-detail-time-label {
        color: var(--q-gb-t-c-3);
        padding-right: 10px;
        font-size: 15px;
        font-weight: 500;
        display:flex;
      }
      .q-badge {
        background: #0cbeb9;
      }
      .match-detail-time-collect {
        // width: 14px;
        // height: 14px;
        // position: absolute;
        // right: 20px;
        display: flex;
        align-items: center;
        z-index: 2;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 16px;
        }
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
      padding: 0px 20px 10px 20px;
      .match-detail-team-name {
        // font-weight: bold;
        font-size: 15px;
        display: flex;
        align-items: center;
      }
      .match-detail-num {
        //color: #ff7000;
        /** 设计图的500无效 */
        font-weight: 700;
        font-size: 15px;
        
      }

      .active-num {
        @extend .current-score-color;
      }
      .default-num {
        color: black;
        margin-left: 14px;
      }
    }
    .match-detail-item-list {
      height: 34px;
      line-height: 34px;
      display: flex;
      border-top: 1px solid #f5f5f5;
      justify-content: space-between;
      .list {
        display: flex;
        align-items: center;
        font-size: 14px;
        &:first-child {
          padding-left: 20px;
        }
        &:last-child {
          padding-right: 20px;
        }
      }
      .baseketball_list {
      }
      .dianqiu {
        background: url($SCSSPROJECTPATH + "/image/detail/dianqiu.png")
          no-repeat;
      }
      .hongpai {
        background: url($SCSSPROJECTPATH + "/image/detail/hongpai.png")
          no-repeat;
      }
      .huangpai {
        background: url($SCSSPROJECTPATH + "/image/detail/huangpai.png")
          no-repeat;
      }
      .jiaoqiu {
        background: url($SCSSPROJECTPATH + "/image/detail/jiaoqiu.png")
          no-repeat;
      }
      .shangbanchang {
        background: url($SCSSPROJECTPATH + "/image/detail/shangbanchang.png")
          no-repeat;
      }
      .score-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin: 0 6px;
        vertical-align: middle;
      }
    }
    .baseketball-list {
      position: relative;
      margin-top: 5px;
      padding-left: 20px;
      justify-content: flex-start;
      .list-item {
        padding: 0 15px 0 0;
        font-weight: 700;
        font-size: 14px;
        // font-weight: 500; //已在父节点设置font-weight
        
      }
      &.game-on{
        .list-item:last-child{
          @extend .current-score-color;
        }
      }
      .line {
        position: absolute;
        top: 0;
        width: 100vw;
        left: -14px;
        height: 1px;
        //background: #F5F5F5;
        background-color: var(--q-gb-bg-c-10);
      }
    }
    .match-detail-bet-or-event {
    }
  }
  :deep(.counting){
     color: var(--q-gb-t-c-3) !important;
  }
}
.active-circle, .circle {
  width: 5px; 
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 7px;
}

.active-circle {
  background-color: #FF7000;
}
.circle {
  background-color: #D9D9D9;
}
.icon-video, .icon-animation {
  width: 14px;
  height: 14px;
}

</style>