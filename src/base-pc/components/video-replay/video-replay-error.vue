<!--
 * @Author: hammar
 * @Date: 2023-04-25 14:47:43
 * @Description: 视频回播异常显示页面
-->
<template>
  <div class="video-zone-layout-err " v-if="show">
    <!-- <img src="~/public/image/common/png/replay_icon.png" class="video-replay-icon" /> -->
    <div class="content">
      <div class="flex1"></div>
      <div class="box">
        <div>
          <img :src="compute_local_project_file_path('/image/svg/replay_video_no_line.svg')" />
        </div>
        <div class="txt">{{ i18n_t('replay_video.iframe_err') }}</div>
      </div>
      <div class="flex1"></div>
    </div>
  </div>
</template>

<script>

import { compute_local_project_file_path } from 'src/output/index.js';

import axios from "axios";
export default {
  props:{
    url: String
  },
  data(){
    return {
      show:false,
    }
  },
  computed: {
    // ...mapGetters({
    //   vx_get_layout_size: "get_layout_size",
    //   vx_get_user: "get_user",
    // }),
  },
  created() {
    // let url = 'http://127.0.0.1:5500/video/pc/final/videoReplay.html?src=https://www.runoob.com/try/demo_source/movie.mp4';
    this.check_url(this.url,(res)=>{
      if(res){
        this.show=false;
        this.$emit('iframe_status',{ok:true})
      } else {
        this.show=true;
        this.$emit('iframe_status',{ok:false})
      }
    });
  },
  beforeDestroy(){
    // 销毁视频
  },
  methods:{
     /**
  * @Description:校验url是否可以打开
  * @Author Cable
  * @param {string} url 链接地址
  * @param {function} callback  回调函数
  */
  check_url(url,callback){
    axios.get(url).then( res => {
        if (res.data) {
          callback(true)
        } else {
          callback(false)
        }
      }).catch( err => {
        console.error(err)
        callback(false)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.video-zone-layout-err{
  background-color: #000;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  .video-replay-icon{
    position: absolute;
    top: 10px;
    left: 10px;
    width: 20%;
    max-width: 100px;
    opacity: 0.7;
  }
  .content{
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:row;
    height: 100%;
    .flex1{
      flex: 1;
    }
    .box{
      text-align: center;
      margin: auto;
      color: var(--q-gb-t-c-1);
      opacity: 0.7;
      .txt{
        margin-top: 10px;
      }
    }
  }
    
}
</style>