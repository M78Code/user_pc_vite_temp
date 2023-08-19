import { api_details } from "src/api/index";
import lodash from 'lodash'
import { MITT_TYPES, useMittEmit } from "../../mitt";
const { DOMAIN_RESULT, BUILD_VERSION } = window.BUILDIN_CONFIG;
let pre_load_video = {
  // 是否加载播放器js
  is_load_player_js: false,
  // 是否已加载视频动画资源
  is_load_video_resources: false,
  /**
   * @Description 加载视频播放器js
   * @param {undefined} undefined
   */
  load_player_js() {
    if (this.is_load_player_js) return;
    this.is_load_player_js = true;
    let dplayer_el = document.createElement("script");
    let hls_el = document.createElement("script");
    dplayer_el.src = `${
      BUILD_VERSION ? "/" + BUILD_VERSION : ""
    }/lib/video/DPlayer.min.js`;
    hls_el.src = `${BUILD_VERSION ? "/" + BUILD_VERSION : ""}/lib/video/hls.js`;
    document.head.appendChild(dplayer_el);
    document.head.appendChild(hls_el);
  },
  /**
   * @Description 加载视频动画资源
   * @param {object} aa
   * @param {undefined} undefined
   */
  load_video_resources() {
    if (this.is_load_video_resources) return;
    this.is_load_video_resources = true;
    if (this.timer_load_video) {
      clearTimeout(this.timer_load_video);
      this.timer_load_video = null;
    }
    this.timer_load_video = setTimeout(() => {
      api_details.post_video_refer().then((res) => {
        // 获取视频动画域名
        let video_src =
          DOMAIN_RESULT.live_domains[0] || lodash.get(res, "data.data.referUrl", "");
        video_src = video_src.replace(/https?:/, "") + "?is_preload=1";
        let animation_src = lodash.get(res, "data.data.aniUrl", "");
        let obj = {
          video_src,
          animation_src,
        };
        useMittEmit(MITT_TYPES["set_pre_video_src"], obj);
      });
    }, 10000);
  },
};

export { pre_load_video };
