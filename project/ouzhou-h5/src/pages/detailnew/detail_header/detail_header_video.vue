<template>
    <div :class="[
      get_show_video?'':'container'
     ]">
        <!-- /video.html?random=0.01897129618346205&controls=1&dplayer-volume=1&url=https%3A%2F%2Fsrv185-52.beterstream.xyz%2Flive%2FSetka-Cup-FIFA-2%2Fmulty.m3u8%3Fmatch_id%3D10913285%26s_id%3D1%26t_id%3D4503%26stats%3Dstatsbeter.co%26timestamp%3D1701748089%26key%3DVTJGc2RHVmtYMS9LcUw3RlNFMVd6SDBnOXpkOWlDUGJVNFNGTU8wVGp5NENKSFhsQzJTTU55cUM5RCtvWHpsTndzS0dRVGhVdWRnOVE5Y0x3SlNMd2ovOXZWS05uQi9NS1U3eW5qN0RYc1RkM3pKQWJxbGVPRVpRMXNpRFpFZDFvVE5hRk45aTdiMjZxR0svdFBRdHFXa1kycUdUU1hCeFJPZXZoeWxLa3Q0PQ%3D%3D&is_client=1 -->
        <custom_video :show_bet_full_screen="false" :show_exit_btn="true" :live_src="props.get_detail_data.varl" :key="route.params.mid" v-if="get_show_video"  :detail_data="detail_data" :tips.sync="tips" :is_show_text="is_show_text"  
                      :show_go_back="show_go_back" :show_icon_status="false" />
    </div>
</template>

<script setup>
import lodash from 'lodash'
import custom_video from "src/base-h5/components/details/components/videos2.vue";
import { MITT_TYPES, MatchDataWarehouse_H5_Detail_Common, MatchDetailCalss, useMittEmit } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import video from "src/core/video/video.js"   // 视频相关公共方法
import { useRoute } from 'vue-router';
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { api_common } from 'src/api';
import OrientationSubscribe from 'src/base-h5/components/common/orientation/orientation-subscribe';
import { uid } from "quasar";
const props = defineProps({
    get_detail_data: {
        type: Object,
        default: () => ({})
    },

})


const route = useRoute();
let detail_data = lodash.get(MatchDataWarehouse_H5_Detail_Common,`list_to_obj.mid_obj[${route.params.mid}_]`, {});
// /视频说明是否展示
const tips = ref(false);
// 随机数props传参是否显示视频对阵信息，还可以控制动画显示返回按钮
const is_show_text = ref('')
const show_go_back = ref(false);
const get_show_video = ref(false);
console.log(route.params, "params");
watch(() => route.params.mid, (value) => {
  detail_data = lodash.get(MatchDataWarehouse_H5_Detail_Common,`list_to_obj.mid_obj[${route.params.mid}_]`, {});
  icon_click_muUrl();
})

const get_media_detail = async() => {
    const params = {
        mid: route.params.mid,
        device: 'H5'
    }
    api_common.getliveVideoUrl(params).then(res => {
        console.log("点击直播");
        // let media_src = video.get_video_url_h5(res, params.mid, 3, hd_sd.value);
        check_url(media_src, 'muUrl')
    })
}

const check_url = (url, which) => {
  // TODO: 视频源切换先设置fasle，强制重新加载iframe
  get_show_video.value = false;
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
      console.error(data, 'media_data');
      MatchDetailCalss.set_video_url(data);
      // 开启视频
      useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true),
      // iframe标签
      useMittEmit(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, false),
      console.log(1111);
      setTimeout(() => {
          get_show_video.value = true;
      }, 500)
      setTimeout(() => {
        // iframe 标签
        useMittEmit(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, true);
      }, 2000)
    } else {
      //   set_toast({
      //     txt: i18n_t('video.sorry'),
      //   });
    }
  }).catch((v) => {
    console.log(v, "error");
    // set_toast({
    //   txt: i18n_t('video.sorry'),
    // });
  })
}


/**
 * 点击视频
 */
 const icon_click_muUrl = () => {
  let check = props.get_detail_data.mms >= 2 || props.get_detail_data.mvs > -1
    console.log(props.get_detail_data, "props.get_detail_data");
  if (!check) {
    return false
  }
  let params = {
    mid: route.params.mid,
    type: 'Video'
  };
  api_common.getMatchUserIsLogin().then(res => {
    console.error(res, "res");
    // 判断用户是否登录
    if (res && res.code == 200 && res.data.isLogin) {
      let referUrl = lodash.get(window.BUILDIN_CONFIG,"DOMAIN_RESULT.live_domains[0]");
      let media_src
      if (referUrl) {
        media_src = video.get_video_url_h5({ data: { referUrl } }, params.mid, 1);
        check_url(media_src);
      } else {
        let param = {}
        // send_gcuuid = uid();
        // param.gcuuid = send_gcuuid;
        api_common.getVideoReferurl(param).then(res => {
          // if (send_gcuuid != res.gcuuid) return;
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
    //   get_show_video.value  = true;
      let video_sorry_temp = "";
      if (UserCtr.lang == 'zh') {
        video_sorry_temp = "!";
      }
      // set_toast({
      //   txt: i18n_t('video.sorry') + video_sorry_temp,
      // });
    }
  }).catch((v) => {
    console.log(v, 'error1111');
    let video_sorry_temp = "";
    if (UserCtr.lang == 'zh') {
      video_sorry_temp = "!";
    }
    // set_toast({
    //   txt: i18n_t('video.sorry') + video_sorry_temp,
    // });
  })
}

onMounted(() => {
    // get_media_detail();
    icon_click_muUrl();
})

onUnmounted(() => {
  OrientationSubscribe.instance.destory_notify();
})
// setTimeout(() => {
//     get_show_video.value = true;
//     console.log(detail_data, "detail_data==");
// }, 5000)
</script>

<style scoped lang="scss">
.container {
    height: 230px;
}

</style>