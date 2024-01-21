import { ref } from 'vue';
import { api_details } from "src/api/index";
import lodash from 'lodash'
import { MITT_TYPES, useMittEmit } from "../../mitt";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { DOMAIN_RESULT, BUILD_VERSION } = BUILDIN_CONFIG;
  // 是否已加载视频动画资源
let is_load_video_resources = ref(false)
let timer_load_video = null

let pre_load_video = {
  // 是否加载播放器js
  is_load_player_js: false,
  /**
   * @Description 加载视频播放器js
   * @param {undefined} undefined
   */
  load_player_js(is_old) {
    if (this.is_load_player_js) return;
    this.is_load_player_js = true;
    let dplayer_el = document.createElement("script");
    let hls_el = document.createElement("script");
    dplayer_el.src = `${
      BUILD_VERSION ? "/" + BUILD_VERSION : ""
    }/other-assets/lib/js/${is_old ? 'DPlayer2' : 'DPlayer'}.min.js`;
    hls_el.src = `${BUILD_VERSION ? "/" + BUILD_VERSION : ""}/other-assets/lib/js/${is_old ? 'hls2': 'hls'}.js`;
    document.head.appendChild(dplayer_el);
    document.head.appendChild(hls_el);
  },
  /**
   * @Description 加载视频动画资源
   * @param {object} aa
   * @param {undefined} undefined
   */
  load_video_resources() {
    console.log('DOMAIN_RESULT', window.BUILDIN_CONFIG.DOMAIN_RESULT, DOMAIN_RESULT);
    if (is_load_video_resources.value) return;
    is_load_video_resources.value = true;
    if (timer_load_video) {
      clearTimeout(timer_load_video);
      timer_load_video = null;
    }
    timer_load_video = setTimeout(() => {
      api_details.post_video_refer().then((res) => {
        // 获取视频动画域名
        let video_src =
        window.BUILDIN_CONFIG.DOMAIN_RESULT.live_domains[0] || lodash.get(res, "data.data.referUrl", "");
        video_src = video_src.replace(/https?:/, "") + "?is_preload=1";
        let animation_src = lodash.get(res, "data.data.aniUrl", "");
        let obj = {
          video_src,
          animation_src,
        };
        useMittEmit(MITT_TYPES.EMIT_SET_PRE_VIDEO_SRC, obj);
      });
    }, 10000);
  },
};

export { pre_load_video};
