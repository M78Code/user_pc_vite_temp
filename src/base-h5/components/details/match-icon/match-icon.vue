<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 赛事icon操作
-->
<template>
  <div class='match-icon'>
    <!-- 动画或视频按钮 由父组件的传值：icon_class控制 -->
    <div
      class="row mx-8 items-center"
      @click.stop="icon_click($event)"
    >
      <!-- 动画或视频icon -->
      <template v-if="icon_class == 'donghua'">
        <img
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/donghua.svg`"
          alt=""
          class="icon-style"
        >
      </template>
      <template v-if="icon_class == 'shipin'">
        <img
          :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/shipin.svg`"
          alt=""
          class="icon-style"
        >
      </template>
      <template v-if="icon_class == 'lvs'">
        <img
          :src="lvs_state_obj.icon_path"
          alt=""
          class="icon-style"
        >
      </template>
      <!-- 对应显示国际化文字(视频/动画) -->
      <div class="col text-left">
        <span class="tx-style">{{ text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import lodash from 'lodash';
import { useRoute } from 'vue-router';
import { project_name } from "src/output/index.js";
import { api_common } from 'src/api/index.js';
import video from "src/core/video/video.js"   // 视频相关公共方法
import uid from "src/core/uuid/index.js"
import { i18n_t } from "src/boot/i18n.js";
import store from "src/store-redux/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { MatchDetailCalss, useMittEmit, MITT_TYPES,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"

const props = defineProps({
  // 按钮：视频/动画 get_mvs：动画 get_mms:视频
  status: {
    type: [Number, String],
    default: ''
  },
  // 按钮icon：视频/动画
  icon_class: {
    type: String,
    default: ''
  },
  // 国际化文字(视频/动画)
  text: {
    type: String,
    default: ''
  },
  // 按钮是视频/动画 muUrl:视频 animationUrl:动画
  which: {
    type: String,
    default: ''
  },
  // 详情数据
  detail_data: {
    type: Object,
    default: {},
  },
})

const { detailsReducer } = store.getState()
const hd_sd = ref(detailsReducer.hd_sd)
const is_in_play = ref(detailsReducer.is_in_play)

let send_gcuuid = ''
// 正在直播的
const lvs_icon_ing = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/zhibo-l.png`
// 赛前直播的
const lvs_icon_pre = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/zhibo-before.svg`
// 演播厅的图标
const lvs_state_obj = reactive({ lvs: '', icon_path: '' })
const get_detail_data = reactive(props.detail_data)
const timer1_ = ref(null)
const clear_timer1_ = () => {
  if (timer1_.value) {
    clearTimeout(timer1_.value)
    timer1_.value = null
  }
}
onUnmounted(clear_timer1_)

/**
 * 计算真正回落的点击按钮   直播 视频  动画
 * @param {*} button_type
 */
const media_button_button_type_check = (button_type = 'lvs') => {
  if (props.icon_class != 'lvs') return
  let state_obj = {
    lvs: lodash.get(get_detail_data, 'lvs') != -1,
    icon_path: '',
  }
  // 赛前图标
  if (lodash.get(get_detail_data, 'lss') == 0) {
    state_obj.icon_path = lvs_icon_pre
  } else if (lodash.get(get_detail_data, 'lss') == 1) {
    // 正在直播的图标
    state_obj.icon_path = lvs_icon_ing
  }
  Object.assign(lvs_state_obj, state_obj)
}
onMounted(media_button_button_type_check)

const route = useRoute()
// 赛事id
const match_id = computed(() => route.params.mid || get_detail_data.mid)

const check_url = (url, which) => {
  // 本地代码连接 调试 时，打开此注释即可播放视频------勿删除此注释
  // let data = {
  //   media_src:url,
  //   active:'muUrl',
  // };
  //   MatchDetailCalss.set_video_url(data);
  //   useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true);
  //   MatchDetailCalss.set_iframe_onload(false);
  //   setTimeout(()=>{
  //   MatchDetailCalss.set_iframe_onload(true);
  // },2000)
  // return
  api_common.get_full_url(url).then((v) => {
    if (v) {
      let data = {
        media_src: url,
        active: which ? which : 'muUrl',
      };
      console.error(data);
      MatchDetailCalss.set_video_url(data);
      // 开启视频
      useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true),
      // iframe标签
      useMittEmit(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, false),
      timer1_.value = setTimeout(() => {
        // iframe 标签
        useMittEmit(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, true);
      }, 2000)
    } else {
      //   set_toast({
      //     txt: i18n_t('video.sorry'),
      //   });
    }
  }).catch((v) => {
    // set_toast({
    //   txt: i18n_t('video.sorry'),
    // });
  })
}
const icon_click = (e) => {
  console.log(e, "whichwhichwhichwhich", props.which);
  e.stopPropagation()
  switch (props.which) {
    case 'lvs':
      icon_click_lvs(props.which)
      break;
    case 'muUrl':
      icon_click_muUrl()
      break;
    case 'animationUrl':
      icon_click_animationUrl()
      break;

    default:
      break;
  }
}
/**
 * 点击直播
 */
const icon_click_lvs = (which) => {
  let params = {
    mid: match_id.value,
    device: 'H5'
  };
  api_common.getliveVideoUrl(params).then((res) => {
    let { code, data } = res
    console.log('点击直播---------', code, data);
    if (code == 200) {
      // "chatRoomId": "1001",//聊天室ID
      // "crs": 1,  //聊天室开关 0 ：关闭  1：开启
      // hdUrl : "rtmp://test-pull-live.wafqa2.com/live/123456"  //直播视频高清播放地址
      // liveState : 1
      // programPath : ""  //赛前节目播放地址
      // referUrl : "http://testliveh5.sportxxx13ky.com"//域名
      // sdUrl : "rtmp://test-pull-live.wafqa2.com/live/654321"  //直播视频标清地址
      // serverTime : "1663733773446"
      let media_src = video.get_video_url_h5(res, params.mid, 3, hd_sd.value);
      check_url(media_src, which);
    }
  })
}
/**
 * 点击视频
 */
const icon_click_muUrl = () => {
  let check = get_detail_data.mms >= 2 || get_detail_data.mvs > -1

  if (!check) {
    return false
  }
  let params = {
    mid: match_id.value,
    type: 'Video'
  };
  api_common.getMatchUserIsLogin().then(res => {
    console.error(res);
    // 判断用户是否登录
    if (res && res.code == 200 && res.data.isLogin) {
      let referUrl = lodash.get(window.BUILDIN_CONFIG,"DOMAIN_RESULT.live_domains[0]");
      let media_src
      if (referUrl) {
        media_src = video.get_video_url_h5({ data: { referUrl } }, params.mid, 1);
        check_url(media_src);
      } else {
        let param = {}
        send_gcuuid = uid();
        param.gcuuid = send_gcuuid;
        api_common.getVideoReferurl(param).then(res => {
          if (send_gcuuid != res.gcuuid) return;
          media_src = video.get_video_url_h5(res, params.mid, 1);
          check_url(media_src);
        });
      }
      ;
    } else {
      if (lodash.get(res, 'code') == '0401038') {
        // set_toast({
        //   txt: i18n_t('msg.msg_nodata_22'),
        // });
        return;
      }
      let data = {};
      data.active = 'muUrl';
      MatchDetailCalss.set_video_url(data);
       // 开启视频
      useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true)
      let video_sorry_temp = "";
      if (['zh', 'hk'].includes(UserCtr.lang)) {
        video_sorry_temp = "!";
      }
      // set_toast({
      //   txt: i18n_t('video.sorry') + video_sorry_temp,
      // });
    }
  }).catch((v) => {
    let video_sorry_temp = "";
    if (['zh', 'hk'].includes(UserCtr.lang)) {
      video_sorry_temp = "!";
    }
    // set_toast({
    //   txt: i18n_t('video.sorry') + video_sorry_temp,
    // });
  })
}
/**
 * 点击动画
 */
const icon_click_animationUrl = () => {
  let check = get_detail_data.mms >= 2 || get_detail_data.mvs > -1

  if (!check) {
    return false
  }

  let params = {
    mid: match_id.value,
    type: 'Animation'
  };
  send_gcuuid = uid();
  params.gcuuid = send_gcuuid;

  api_common.videoAnimationUrl(params).then((result) => {
    let res = {}
    if (result.status) {
      res = result.data
    } else {
      res = result
    }
    const { data } = res
    if (send_gcuuid != res.gcuuid) return;
    let animationUrl = ''
    //足篮棒网使用3.0动画  其他使用2.0
    console.error(res);
    if ([1, 2, 3, 5].includes(lodash.get(get_detail_data, 'csid') * 1)) {
      let animation3Url = data.animation3Url || []
      animation3Url.forEach(item => {
        if (item.styleName.indexOf('day') >= 0) {
          animationUrl = item.path
        }
      })
    }
    animationUrl = animationUrl || data.animationUrl
    data.animationUrl = animationUrl.replace(/https?:/, "") // 动画
    data.referUrl = data.referUrl && (data.referUrl.replace(/http:|https:/, '')) // 视频
    data.active = 'animationUrl';
    data.referUrl = `${location.protocol}${data.referUrl}`;
    let CTime = get_detail_data.mgt;
    let STime = data.serverTime;
    MatchDetailCalss.set_video_url(data);
     // 开启视频
    useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true);
  })
}
// 监听点击直播事件,触发详情页视频直接播放
// watch(
//   () => get_play_video,
//   (new_) => {
//     if (new_ && (props.which == 'muUrl' || is_in_play.value == 'muUrl')) {
//           (props.icon_class== 'shipin') && icon_click_muUrl()
//         } else if (is_in_play.value == 'animationUrl') {
//           (props.icon_class== 'donghua') icon_click_animationUrl()
//         } else if (is_in_play.value == 'lvs') {
//           (props.icon_class== 'lvs') icon_click_lvs('lvs')
//         }
//   },
//   {
//     immediate: true
//   }
// )
</script>

<script>

export default defineComponent({
  name: 'match_icon',
})
</script>

<style lang="scss" scoped>
.tx-style {
  font-size: 0.12rem;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: 0.26rem;
}

.icon-style {
  width: 0.16rem;
  height: 0.16rem;
  margin-right: 0.04rem;
}
</style>