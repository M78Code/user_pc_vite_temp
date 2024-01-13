<template>
  <div class="component detail_header_tem2">
    <div class="detail-header-video"
      :class="[right_actions_label == 'score'?'detail-header-156':'']"
    >
      <div class="iframe-wrap" v-if="animation_src && right_actions_label == 'animation'">
        <iframe class="animation"
          id="replayIframe"
          :src="animation_src+'&rdm='+iframe_rdm"
          style="width:100%;height:100%;"
          allow="autoplay"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </div>
      <custom_video class="custom-video" :status="status" v-if="right_actions_label == 'video'" :get_detail_data="detail"/>
      <!-- {{ detail }} -->
      <score_component :get_match_detail="detail" 
            v-show="right_actions_label == 'score'" :key="right_actions_label" @handle-change="handle_change"/>    
    </div>
    <!-- <SwitchButtons></SwitchButtons> -->
    <!-- 比分版 -->
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
    </div>
     -->
     {{right_actions_label}}
    <right_actions @handle-type="handle_type" v-show="right_actions_label != 'score'" :detail="props.get_match_detail"
                  :status="status" :right-actions-label="right_actions_label" :is-collect="is_collect" />
  </div>
</template>
  
<script setup>
import { onMounted, ref, toRef, watch,onUnmounted, computed } from "vue";
import lodash from "lodash";
import { api_common, api_match,api_match_list } from "src/api/index.js";
import { get_animation_mock } from "../mock.js";
import { useMittOn, useMitt,MITT_TYPES } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import SwitchButtons from "./components/SwitchButtons.vue"
import right_actions from "./components/right_actions.vue"
import custom_video from "./detail_header_video.vue";
import matchCollect from "src/core/match-collect";
import { debounce } from "quasar";
import score_component from "./detail_header_tem1.vue";
import NavbarSubscribe from "src/base-h5/components/top-menu/top-menu-ouzhou-1/detail-top/nav-bar-subscribe";
// import { Promise } from "licia-es";
const props = defineProps({
  get_match_detail: {
    type: Object,
    default: () => ({}),
  },
  label: {
    type: String,
    default: ""
  }
});

// watch(()=>props.label, (value) => {
//   right_actions_label.value = value;
// })
// 点击返回的时候会触发此函数
const listener = (status) => {
  if (!status) {
    right_actions_label.value = 'score';
  }
}
const nav_bar_subscribe = NavbarSubscribe.instance;
// 注册事件
nav_bar_subscribe.listener(listener);
// 测试数据
// nav_bar_subscribe.change_status(false);

const detail = computed(() => props.get_match_detail)

  // 赛事收藏状态
const  is_collect = computed(()=>{
  if(lodash.isEmpty(props.get_match_detail)) return
  return matchCollect.get_match_collect_state(props.get_match_detail)
}) 
const scoew_icon_list = ref({});
const iframe_rdm = ref("")
iframe_rdm.value = new Date().getTime();
// 状态，是视频还是动画
/** @type {import('vue').Ref<'animation'|'video'>} */
const right_actions_label = ref('')
const animation_src = ref("");
/** @type {import('vue').ComputedRef<number>} 1: 动画视频可以切换 2: 只显示动画 3：只显示视频 4：都不显示 */
const status = computed(() => {
  // 动画>源视频>比分板  
  const get_detail_data = props.get_match_detail;
  
  // 优先判断label
  if (props.label) {
    console.log(props.label, "props.label");
    if (props.label == 'animation') {
      return 2;
    }

    if (props.label == 'video') {
      return 3;
    }
  }
  // <!-- mvs动画状态：-1：没有配置动画源 | 0 ：已配置，但是不可用 | 1：已配置，可用，播放中 | 2：已配置，可用，播放中 -->

  //  如果有动画且后台动画开关 关闭后强制修改 
  
  if (get_detail_data.mvs > -1 || (get_detail_data.mms > 1 && [1,2,7,10,110].includes(get_detail_data.ms*1))) {
    
    if (get_detail_data.mvs > -1 && get_detail_data.mms > 1 && lodash.get(UserCtr, 'user_info.ommv')) {
      return 1;
    }
    // 动画状态大于-1时，显示动画按钮 
    if (get_detail_data.mvs > -1 && lodash.get(UserCtr, 'user_info.ommv')) {
      return 2;
    }
    //  视频状态大于1时，显示视频按钮 i18n_t('match_info.video')是国际化取值 --
    if (get_detail_data.mms > 1) {
      return 3;
    }
    
  }

  return 4;
 
});
// 默认为animation，所以设置为false
nav_bar_subscribe.change_status(false);
watch(status, (value) => {
  console.log(status, "status====");
    
    // 1: 动画视频可以切换 2: 只显示动画 3：只显示视频 4：都不显示
    if ([1,2].includes(+value)) {
      right_actions_label.value = 'animation';
    }
    if (value == 3) {
      right_actions_label.value = 'video';
    }
    if (status == 4) {
      nav_bar_subscribe.change_status(true);
    }
}, {
  immediate: true
})

watch(right_actions_label, (value) => {
  console.log(right_actions_label, "right_actions_label");
  if (['animation', 'video'].includes(value)) {
    nav_bar_subscribe.change_status(false);
  }else {
    // 异步操作，避免执行到队列时导致数据更新问题
    Promise.resolve().then(() => {
      nav_bar_subscribe.change_status(true);
    })
  }
})

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

const handle_change = (value) => {
  right_actions_label.value = value;
}

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
/**
 * 切换类型回调
 * @param {'animation' | 'video' | 'score' | 'collect'} label 
 */
const handle_type = (label) => {
  switch (label) {
    case 'animation':
    case 'video':
    case 'score':
      right_actions_label.value = label;
      break;
    case 'collect':
      // 点击收藏，通知父组件更新收藏状态
      // emit('change')
      collect_click();
      break;
    default:
      break;
  }
}

/**
 *@description // 收藏
 *@param {*}
 *@return {*}
 */
 const collect_click = debounce(() => {
  matchCollect.set_match_collect_state(props.get_match_detail, !is_collect.value)
    api_common.add_or_cancel_match({
        mid: props.get_match_detail.mid,
        cf: !is_collect.value ? 0 : 1,
        cuid: UserCtr.get_uid()
    }).then(res => {
        if (res.code != 200) return
    })
 
}, 300)
const img_url_host = "http://image-new.sportxxxifbdxm2.com/";
  /**
  * @Description:获取动画播放地址
  * @Author Cable
  * @param {{mid:string,type:"Animation"}} params  赛事信息 type的其他可选值暂不清楚
  * @param {function} callback  回调函数
  */
  const get_animation_url = (params)=>{
    
    const match = props.get_match_detail
      const tempUrl = JSON.parse(JSON.stringify(animation_src.value))
      animation_src.value = ''
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
    api_common.videoAnimationUrl(params).then( res => {

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
      console.log(animationUrl, "ssssssssss");
    }
  }).catch( err => {
    console.error(err, "ssssssssss");
        animation_src.value = tempUrl
  })
}
get_animation_url({
  mid: props.get_match_detail.mid,
  type: "Animation",
});
useMitt(MITT_TYPES.EMIT_REFRESH_DETAILS,(param)=>{
  get_animation_url({
    mid:param.mid,
    type: "Animation"
  })
})
onMounted(() => {
  // setTimeout(() => {
    set_scoew_icon_list(props.get_match_detail);
    // EMITTER.on("detail_refresh", () => {
    //   get_animation_url({
    //     mid: props.get_match_detail.mid,
    //     type: "Animation",
    //   });
    // });
  // }, 10);
});
</script>
  
<style lang="scss" scoped>
.detail_header_tem2 {
  position: relative;
  /**.change-header-fix z-index:91; 需大于其 */
  z-index: 102;
  .detail-header-221 {
    height: 221px;
  }
  .detail-header-156 {
    // height: 156px;
  }
  .detail-header-134 {
    height: 134px;
  }
  .detail-header-video {
    // height: auto;
    width: 100vw;
    background: #e2e2e2;
    .video {
      width: 100vw;
      height: 140px;
    }
    .iframe-wrap{
      position: relative;
      width: 100%;
      padding-bottom: 55%;
      .animation{
        position: absolute;
      }
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

.custom-video {
  width: 100%;
}

.mt-30 {
  padding-top: 30px;
}
.mt-10 {
  padding-top: 10px;
}
</style>