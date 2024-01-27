import {ref,onUnmounted} from 'vue'
import { api_common } from "src/api/index.js";
import video from "src/core/video/video.js"; // 视频相关公共方法
import { MatchDetailCalss, useMittEmit, MITT_TYPES,LOCAL_PROJECT_FILE_PREFIX ,into_video_anima_event } from "src/output/index.js"
import uid from "src/core/uuid/index.js"
import BUILDIN_CONFIG from "app/job/output/env/index.js";

export function useIconInfo(get_detail_data, match_id) {

const timer1_ = ref(null)

let send_gcuuid = ''

const clear_timer1_ = () => {
  if (timer1_.value) {
    clearTimeout(timer1_.value)
    timer1_.value = null
  }
}

onUnmounted(clear_timer1_)

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
    api_common
      .get_full_url(url)
      .then((v) => {
        if (v) {
          let data = {
            media_src: url,
            active: which ? which : "muUrl",
          };
          console.error(data);
          MatchDetailCalss.set_video_url(data);
          // 开启视频
          useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true),
            // iframe标签
            useMittEmit(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, false),
            (timer1_.value = setTimeout(() => {
              // iframe 标签
              useMittEmit(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, true);
            }, 2000));
        } else {
          //   set_toast({
          //     txt: i18n_t('video.sorry'),
          //   });
        }
      })
      .catch((v) => {
        // set_toast({
        //   txt: i18n_t('video.sorry'),
        // });
      });
  };

  /**
   * 点击视频
   */
  const icon_click_muUrl = (obj) => {
    let check = get_detail_data.mms >= 2 || get_detail_data.mvs > -1;

    if (!check) {
      return false;
    }
    let params = {
      mid: match_id.value,
      type: "Video",
    };
    api_common
      .getMatchUserIsLogin()
      .then((res) => {
        console.error(res);
        // 判断用户是否登录
        if (res && res.code == 200 && res.data.isLogin) {
          let referUrl = lodash.get(
            BUILDIN_CONFIG,
            "DOMAIN_RESULT.live_domains[0]"
          );
          let media_src;
          if (referUrl) {
            media_src = video.get_video_url_h5(
              { data: { referUrl } },
              params.mid,
              1
            );
            check_url(media_src);
          } else {
            let param = {};
            send_gcuuid = uid();
            param.gcuuid = send_gcuuid;
            api_common.getVideoReferurl(param).then((res) => {
              if (send_gcuuid != res.gcuuid) return;
              media_src = video.get_video_url_h5(res, params.mid, 1);
              check_url(media_src);
            });
          }
          // 发送进入动画和视频的埋点
          into_video_anima_event('muUrl',obj);
        } else {
          if (lodash.get(res, "code") == "0401038") {
            // set_toast({
            //   txt: i18n_t('msg.msg_nodata_22'),
            // });
            return;
          }
          let data = {};
          data.active = "muUrl";
          MatchDetailCalss.set_video_url(data);
          // 开启视频
          useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true);
          let video_sorry_temp = "";
          if (UserCtr.lang == "zh") {
            video_sorry_temp = "!";
          }
          // set_toast({
          //   txt: i18n_t('video.sorry') + video_sorry_temp,
          // });
        }
      })
      .catch((v) => {
        let video_sorry_temp = "";
        if (UserCtr.lang == "zh") {
          video_sorry_temp = "!";
        }
        // set_toast({
        //   txt: i18n_t('video.sorry') + video_sorry_temp,
        // });
      });
  };
  /**
   * 点击动画
   */
  const icon_click_animationUrl = (obj) => {
    let check = get_detail_data.mms >= 2 || get_detail_data.mvs > -1;

    if (!check) {
      return false;
    }

    let params = {
      mid: match_id.value,
      type: "Animation",
    };
    send_gcuuid = uid();
    params.gcuuid = send_gcuuid;

    api_common.videoAnimationUrl(params).then((result) => {
      let res = {};
      if (result.status) {
        res = result.data;
      } else {
        res = result;
      }
      const { data } = res;
      if (send_gcuuid != res.gcuuid) return;
      let animationUrl = "";
      //足篮棒网使用3.0动画  其他使用2.0
      console.error(res);
      if ([1, 2, 3, 5].includes(lodash.get(get_detail_data, "csid") * 1)) {
        let animation3Url = data.animation3Url || [];
        animation3Url.forEach((item) => {
          if (item.styleName.indexOf("day") >= 0) {
            animationUrl = item.path;
          }
        });
      }
      animationUrl = animationUrl || data.animationUrl;
      data.animationUrl = animationUrl.replace(/https?:/, ""); // 动画
      data.referUrl =
        data.referUrl && data.referUrl.replace(/http:|https:/, ""); // 视频
      data.active = "animationUrl";
      data.referUrl = `${location.protocol}${data.referUrl}`;
      let CTime = get_detail_data.mgt;
      let STime = data.serverTime;
      MatchDetailCalss.set_video_url(data);
      // 开启视频
      useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true);
      // 发送进入动画和视频的埋点
      into_video_anima_event('animationUrl',obj);
    });
  };

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

  return {
    icon_click_animationUrl,
    icon_click_muUrl,
    icon_click_lvs
  };
}
