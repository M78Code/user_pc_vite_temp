<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事详情
-->
<template>
  <div ref="wrap_info">
    <div class="wrap-info relative-position">
      <!-- 右侧 窄版start ----------->
      <match-video  :background_img="background_img" :mid="mid" :refresh_time="refresh_time" />
      <!-- 右侧 窄版 end   ----------->
    </div>
  </div>
</template> 

<script>
import match_video from "src/base-pc/components/match-detail/match_info/match_video.vue";
import info from "src/base-pc/components/match-detail/match_info/info.vue";
import {
  MatchDataWarehouse_PC_Detail_Common as MatchDetailsData,
  MatchDetailCalss,
  UserCtr,
  MenuData
} from "src/output/index.js";
import {LayOutMain_pc} from "src/output/project/index.js";
export default {
  components: {
    "match-video": match_video,
    info,
  },
  props: {
    screen: String,
    match_info: Object,
    background_img: String,
    refresh_time: Number,
    mid:String || Number
  },
  data() {
    return {
      // 菜单数据
      menu_data: MenuData,
      // 赛事列表
      match_list:[],
      match_ctr: MatchDetailsData,
      skt_mid: {}, // 需要订阅的赛事id
      skt_hpid: "", // 需要订阅的玩法
      socket_name: "esports_score_list",
      vx_play_media:MatchDetailCalss.play_media, //播放详情类型参数
      details_data_version:MatchDetailCalss.details_data_version, //详情类版本号
      vx_detail_params:MatchDetailCalss.params, //详情参数
      vx_is_invalid:UserCtr.is_invalid, //登录是否失效   
      user_version:UserCtr.user_version, //用户类版本号
    }
  },
  watch:{
  /*
  ** 监听MatchDetailCalss的版本号  获取最新的mid
  */
  'details_data_version.version':{
      handler(val){
        if (val) {
        this.vx_detail_params = MatchDetailCalss.params
        this.vx_play_media = MatchDetailCalss.play_media
       }
      },
      immediate: true
  },
 //监听user类的版本号
 "user_version.version": {
    handler(res) {
      this.vx_is_invalid = UserCtr.is_invalid
      }
 }
},
  computed: {
    media_useful() {
      let { media_type } = this.vx_play_media;
      let { mms, mvs } = this.match_info;

      return (
        (media_type == "animation" && mvs == 1) ||
        (media_type == "video" && mms == 2)
      );
    },

    reset_content() {
      let { time, mid } = this.vx_play_media;
      return `${mid}_${time}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-info {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>/index