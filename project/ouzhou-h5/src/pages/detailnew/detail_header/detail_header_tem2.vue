<template>
  <div class="detail_header_tem2">
    <div class="detail-header-video">
      <iframe v-if="animation_src"
        id="replayIframe"
        :src="animation_src+'&rdm='+iframe_rdm"
        style="width:100%;height:100%;"
        allow="autoplay"
        frameborder="0"
        scrolling="no"
      ></iframe>
    </div>
    <!-- <div class="detail-header-score row">
      <div class="detail-home col-5">
        <div class="detail-home-info">
          <img class="team_img" :src="`${img_url_host}${get_match_detail.mhlu}`" alt="" />
          <span class="detail-home-info-text">{{ get_match_detail.mhn }}</span>
        </div>
        <div class="detail-home-icon-type" v-if="get_match_detail.csid == '1'">
          <div
            v-for="(item, index) in football_score_icon_list"
            :key="item"
            class="detail-home-icon-item"
          >
            <div v-if="index <= 2">
              <span :class="[item.bg_url, 'score-icon']"></span>
              <span>{{ scoew_icon_list[item.msc_key] ? scoew_icon_list[item.msc_key]['home'] : "" }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-score col-2">
        <div class="detail-score-time">{{get_match_detail.course}} {{get_match_detail.mstValue}}</div>
        <div class="detail-rate-score">
          <span>{{ scoew_icon_list['S1'] ? scoew_icon_list['S1']['home'] : "" }}</span>
          :
          <span>{{ scoew_icon_list['S1'] ? scoew_icon_list['S1']['away'] : "" }}</span>
        </div>
      </div>
      <div class="detail-away col-5">
        <div class="detail-away-info">
          <span class="detail-away-info-text">{{ get_match_detail.man }}</span>
          <img class="team_img" :src="`${img_url_host}${get_match_detail.malu}`" alt="" />
        </div>
        <div class="detail-away-icon-type" v-if="get_match_detail.csid == '1'">
          <div
            v-for="(item, index) in football_score_icon_list"
            :key="item"
            class="detail-away-icon-item"
          >
            <div v-if="index > 1">
              <span :class="[item.bg_url, 'score-icon']"></span>
              <span>{{ scoew_icon_list[item.msc_key] ? scoew_icon_list[item.msc_key]['away'] : "" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
  
<script setup>
import { onMounted, ref, toRef, watch } from "vue";
import lodash from "lodash";
import { api_match,api_match_list } from "src/api/index.js";
import { get_animation_mock } from "../mock.js";
// import EMITTER from  "src/global/mitt.js" // import {mitt*} from "src/core/index.js"
const props = defineProps({
  get_match_detail: {
    type: Object,
    default: () => {},
  },
});
const scoew_icon_list = ref({});
const iframe_rdm = ref("")
iframe_rdm.value = new Date().getTime();
const animation_src = ref("");
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
const toRef_get_match_detail = toRef(props, "get_match_detail");
watch(toRef_get_match_detail, (new_value, old_value) => {
  scoew_icon_list.value = {};
  set_scoew_icon_list(new_value);
})
const img_url_host = "http://image-new.sportxxxifbdxm2.com/";
  /**
  * @Description:获取动画播放地址
  * @Author Cable
  * @param {object} match  赛事信息
  * @param {function} callback  回调函数
  */
  const get_animation_url = (params)=>{
    const match = props.get_match_detail

    // mock start
    // animation_src.value = get_animation_mock.data.animationUrl;
    // let style = 'day' 
    // let animation3Url = lodash.get(get_animation_mock, "data.animation3Url") || []
    // animation3Url.forEach( item =>{
    //   if(item.styleName.indexOf(style) >= 0){
    //     animation_src.value = item.path
    //   }
    // })
    // mock end


    //获取动画播放地址
    api_match_list.post_video_url(params).then( res => {
    let animationUrl = ''
    // 足篮棒网使用3.0动画  其他使用2.0
    if([1,2,3,5].includes(match.csid*1)){
      let style = 'day' 
      let animation3Url = lodash.get(res, "data.animation3Url") || []
      animation3Url.forEach( item =>{
        if(item.styleName.indexOf(style) >= 0){
          animationUrl = item.path
        }
      })
    }
    animationUrl = animationUrl || lodash.get(res, "data.animationUrl")
    if (animationUrl) {
      // 移除 http(s)
      animationUrl = animationUrl.replace(/https?:/, "")
      // 如果地址不是//开头  加上//
      if(animationUrl.substr(0,2) != '//'){
        animationUrl = '//'+animationUrl
      }
      animationUrl = animationUrl + `&rdm=${new Date().getTime()}`
      animation_src.value = animationUrl
    }
  }).catch( err => {
    console.error(err);
    
  })
}
onMounted(() => {
  setTimeout(() => {
    get_animation_url({
      mid: props.get_match_detail.mid,
      type: "Animation",
    });
    set_scoew_icon_list(props.get_match_detail);
    // EMITTER.on("detail_refresh", () => {
    //   get_animation_url({
    //     mid: props.get_match_detail.mid,
    //     type: "Animation",
    //   });
    // });
  }, 10);
});
</script>
  
<style lang="scss" scoped>
.detail_header_tem2 {
  .detail-header-video {
    height: 210px;
    width: 100vw;
    background: #e2e2e2;
    .video {
      width: 100vw;
      height: 140px;
    }
  }
  .detail-header-score {
    display: flex;
    padding: 0 8px;
    justify-content: space-between;
    .detail-home {
      line-height: 20px;
      .detail-home-info {
        line-height: 25px;
        font-size: 13px;
        font-weight: bold;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .detail-home-info-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: calc(100% - 25px);
        }
        .team_img {
          width: 17px;
          height: 17px;
          vertical-align: middle;
        }
      }
    }
    .detail-score {
      text-align: center;
      .detail-score-time {
        color: green;
        font-weight: 500;
      }
      .detail-rate-score {
        font-size: 23px;
        white-space: nowrap;
        font-weight: bold;
      }
    }
    .detail-away {
      line-height: 20px;
      text-align: right;
      .detail-away-info {
        line-height: 25px;
        font-size: 13px;
        font-weight: bold;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .detail-away-info-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: calc(100% - 25px);
        }
        .team_img {
          width: 17px;
          height: 17px;
        }
      }
      .detail-away-icon-type {
        justify-content: flex-end;
      }
    }
    .detail-home-icon-type,
    .detail-away-icon-type {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .detail-home-icon-item,
      .detail-away-icon-item {
        margin: 0 5px;
      }
      .item-icon {
        width: 14px;
        height: 14px;
        vertical-align: middle;
      }
    }
    .dianqiu {
      background: url($SCSSPROJECTPATH+"/image/detail/dianqiu.png");
    }
    .hongpai {
      background: url($SCSSPROJECTPATH+"/image/detail/hongpai.png");
    }
    .huangpai {
      background: url($SCSSPROJECTPATH+"/image/detail/huangpai.png");
    }
    .jiaoqiu {
      background:url($SCSSPROJECTPATH+"/image/detail/jiaoqiu.png");
    }
    .shangbanchang {
      background:  url($SCSSPROJECTPATH+"/image/detail/shangbanchang.png");
    }
    .score-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin: 0 2px;
      vertical-align: middle;
    }
  }
}
</style>