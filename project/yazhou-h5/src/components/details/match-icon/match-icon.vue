<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 赛事icon操作
-->
<template>
  <div class='match-icon'>
    <!-- 动画或视频按钮 由父组件的传值：icon_class控制 -->
    <div class="row mx-8 items-center" @click.stop="icon_click($event)">
      <!-- 动画或视频icon -->
      <template v-if="icon_class == 'donghua'">
        <img  src="image/wwwassets/bw3/svg/donghua.svg" alt="" class="icon-style">
      </template>
      <template v-if="icon_class == 'shipin'">
        <img  src="image/wwwassets/bw3/svg/shipin.svg" alt="" class="icon-style">
      </template>
      <template v-if="icon_class == 'lvs'">
        <img :src="lvs_state_obj.icon_path" alt="" class="icon-style">
      </template>
      <!-- 对应显示国际化文字(视频/动画) -->
      <div class="col text-left">
        <span class="tx-style">{{ text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import {mapGetters, mapMutations} from "vuex"
import {api_common} from 'src/api/index.js';
import video  from "src/core/video/video.js"   // 视频相关公共方法
import uid from "src/core/uuid/index.js"
import { i18n_t } from "src/boot/i18n.js";;
//国际化


export default {
  name: 'match_icon',
  props: {
    // 按钮：视频/动画 get_mvs：动画 get_mms:视频
    status: Number | String,
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
  },
  data() {
    return {
      // 正在直播的
      lvs_icon_ing :  "image/wwwassets/bw3/common/zhibo-l.png",
      // 赛前直播的
      lvs_icon_pre : "image/wwwassets/bw3/common/zhibo-before.svg",
      //演播厅的图标
      lvs_state_obj:{lvs:'',icon_path:''}
    }
  },
  created() {
    // 延时器
    timer1_ = null;
    if(icon_class == 'lvs'){
      media_button_button_type_check()
    }
  },
  computed: {
    // ...mapGetters([
    //   'get_show_video',
    //   'get_goto_detail_matchid',
    //   'get_detail_data',
    //   'get_play_video',
    //   // 列表跳详情是播放视频或者动画
    //   'get_is_in_play',
    //   // 标清0 高清1
    //   "get_hd_sd",
    //   'get_lang',
    // ]),
    // 赛事id
    match_id() {
      return $route.params.mid || get_detail_data.mid
    },
  },
  watch: {
    // 监听点击直播事件,触发详情页视频直接播放
    get_play_video: {
      handler(new_) {
        if (new_ && (which == 'muUrl' || get_is_in_play == 'muUrl')) {
          icon_click_muUrl()
        } else if (get_is_in_play == 'animationUrl') {
          icon_click_animationUrl()
        } else if (get_is_in_play == 'lvs') {
          icon_click_lvs('lvs')
        }
      },
      immediate: true
    }
  },
  /**
   * @description: 销毁前回调函数
   */
  beforeUnmount() {
    clearTimeout(timer1_)
    timer1_ = null
  },
  methods: {
    // ...mapMutations(['set_video_url', 'set_show_video', 'set_toast', 'set_iframe_onload']),

    /**
     * 计算真正回落的点击按钮   直播 视频  动画
     * @param {*} button_type
     */
    media_button_button_type_check(button_type='lvs') {
      let state_obj = {
        lvs: _.get(get_detail_data,'lvs') != -1,
        icon_path:'',
      }
      // 赛前图标
      if(_.get(get_detail_data,'lss') == 0){
        state_obj.icon_path = lvs_icon_pre
      }else if(_.get(get_detail_data,'lss') == 1){
        // 正在直播的图标
        state_obj.icon_path = lvs_icon_ing
      }
      Object.assign(lvs_state_obj, state_obj)
    },
    check_url(url, which) {
      // 本地代码连接 调试 时，打开此注释即可播放视频------勿删除此注释

      // let data = {
      //   media_src:url,
      //   active:'muUrl',
      // };
      //   set_video_url(data);
      //   set_show_video(true);
      //   set_iframe_onload(false);
      //   setTimeout(()=>{
      //   set_iframe_onload(true);
      // },2000)
      // return
      api_common.get_full_url(url).then((v) => {
        if (v) {
          let data = {
            media_src: url,
            active: which ? which :'muUrl',
          };
          set_video_url(data);
          set_show_video(true);
          set_iframe_onload(false);
          timer1_ = setTimeout(() => {
            set_iframe_onload(true);
          }, 2000)
        } else {
          set_toast({
            txt: i18n_t('video.sorry'),
          });
        }
      }).catch((v) => {
        set_toast({
          txt: i18n_t('video.sorry'),
        });
      })
    },
    icon_click(e) {
      console.log(e,"whichwhichwhichwhich");
      e.stopPropagation()
      switch (which) {
        case 'lvs':
          icon_click_lvs(which)
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
    },
    /**
     * 点击直播
     */
    icon_click_lvs(which) {
      let params = {
        mid: match_id,
        device: 'H5'
      };
      api_common.getliveVideoUrl(params).then((res) => {
        let {code, data} = res
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
          let media_src = video.get_video_url(res, params.mid, 3, get_hd_sd);
          check_url(media_src,which);
        }
      })
    },
    /**
     * 点击视频
     */
    icon_click_muUrl() {
      let check = get_detail_data.mms >= 2 || get_detail_data.mvs > -1

      if (!check) {
        return false
      }

      let params = {
        mid: match_id,
        type: 'Video'
      };

      api_common.getMatchUserIsLogin().then(res => {
        // 判断用户是否登录
        if (res && res.code == 200 && res.data.isLogin) {
          let referUrl = window.BUILDIN_CONFIG.live_domains[0];
          let media_src

          if (referUrl) {
            media_src = video.get_video_url({data: {referUrl}}, params.mid, 1);
            check_url(media_src);
          } else {
            let param = {}
            send_gcuuid = uid();
            param.gcuuid = send_gcuuid;
            api_common.getVideoReferurl(param).then(res => {
              if(send_gcuuid != res.gcuuid) return;
              media_src = video.get_video_url(res, params.mid, 1);
              check_url(media_src);
            });
          }
          ;
        } else {
          if(_.get(res,'code')=='0401038'){
            set_toast({
              txt: i18n_t('msg.msg_nodata_22'),
            });
            return;
          }
          let data = {};
          data.active = 'muUrl';
          set_video_url(data);
          set_show_video(true);
          let video_sorry_temp="";
          if(get_lang=='zh')
          {
            video_sorry_temp="!";
          }
          set_toast({
            txt: i18n_t('video.sorry')+video_sorry_temp,
          });
        }
      }).catch((v) => {
        let video_sorry_temp="";
        if(get_lang=='zh')
        {
          video_sorry_temp="!";
        }

        set_toast({
          txt: i18n_t('video.sorry')+video_sorry_temp,
        });
      })


    },
    /**
     * 点击动画
     */
    icon_click_animationUrl() {
      let check = get_detail_data.mms >= 2 || get_detail_data.mvs > -1

      if (!check) {
        return false
      }

      let params = {
        mid: match_id,
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
        if(send_gcuuid != res.gcuuid) return;
        let animationUrl = ''
        //足篮棒网使用3.0动画  其他使用2.0
        if ([1, 2, 3, 5].includes(_.get(get_detail_data,'csid') * 1)) {
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
        set_video_url(data);
        set_show_video(true);
      })


    },

  },
}
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
