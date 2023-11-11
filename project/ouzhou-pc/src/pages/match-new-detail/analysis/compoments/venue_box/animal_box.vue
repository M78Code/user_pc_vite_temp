<!--
 * @Author: cooper
 * @Date: 2023-06-013 14:13:55
 * @Description: 赛事分析页动画
-->
<template>
  <div class="box-bc">
   <div class="iframe_box">
    <iframe
        id="video-iframe"
        class="video-iframe fit"  
        :src="media_src"
        frameborder="0"
        marginwidth="0"
        marginheight="0"
        hspace="0"
        vspace="0"
        scrolling="no"
        allowfullscreen='true' allow="autoplay"
      ></iframe>

      <div class="detail-loading" v-if="iframe_loading" >
      <loading></loading>
    </div>
    
   </div>
  </div>
</template>

<script setup>
import { onMounted, ref,watch ,nextTick} from "vue";
import { api_match_list } from "src/api";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/core/index.js";
import video  from "src/core/video/video.js"
import loading from '../../../components/loading/index.vue'
import _ from 'lodash'
const props = defineProps({
    detail_info: {  // 赛事详情
        type: Object,
        default: () => { }
    },
    show_type: {  // 播放类型，视频|动画
        type: String,
        default: ''
    },
   
})
const iframe_loading = ref(false)

const { post_video_url } = api_match_list; // 接口
watch(()=>props.detail_info,val=>{
  // console.log(1111111111111,val)
},

)
onMounted(()=>{
  console.log(111111111,props.show_type)
  if (props.show_type=='video') {
    get_video_url()
  }else{
    get_animation_url()
  }
  iframe_loading.value = true
  // nextTick(()=>{
    const iframe = document.querySelector('#video-iframe')
    // 处理兼容行问题
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', () => {
       
      })
    } else {
      iframe.onload = () => {
        iframe_loading.value = false
      }
    }
  })
// })
const url =
  "http://bokong3-imgs.oss-cn-hongkong.aliyuncs.com/lmt_img/1679405069349_97_9.png";
  const media_src = ref('')

  /**
  * @Description:获取视频播放地址
  * @Author Cable
  * @param {object} match  赛事信息
  * @param {function} callback  回调函数
  */
  const get_video_url = ()=>{
    // play_type  数据源类型 1 ：源视频 2：动画 3 ：演播室 4 ：主播 5：专题

      // 目标赛事视频url相关信息获取
      video.get_video_url(props.detail_info,{params:{play_type:1}}, (show_type,media_src) => {
         // 未登录
         if(media_src === true && show_type === 'no-login'){
              // this.is_limited = true
              // this.show_type = show_type
              return
            }
       console.log(111111111,show_type)
       console.log(111111111,media_src)
      })

  }



  /**
  * @Description:获取动画播放地址
  * @Author Cable
  * @param {object} match  赛事信息
  * @param {function} callback  回调函数
  */
  const get_animation_url = ()=>{
    const match = props.detail_info
    // 动画状态等于-1
    // if(match.mvs < 0){
     
    //   return
    // }
    //获取动画播放地址
    let params = {
      mid:match.mid,
      type: "Animation",
      device: "PC"
    }
      post_video_url(params).then( res => {
      let animationUrl = ''
      console.log(111111111111,res)
      // 足篮棒网使用3.0动画  其他使用2.0
      if([1,2,3,5].includes(match.csid*1)){
        let style = 'day' 
        let animation3Url = _.get(res, "data.animation3Url") || []
        animation3Url.forEach( item =>{
          if(item.styleName.indexOf(style) >= 0){
            animationUrl = item.path
          }
        })
       }
      animationUrl = animationUrl || _.get(res, "data.animationUrl")
      if (animationUrl) {
        // 移除 http(s)
        animationUrl = animationUrl.replace(/https?:/, "")
        // 如果地址不是//开头  加上//
        if(animationUrl.substr(0,2) != '//'){
          animationUrl = '//'+animationUrl
        }
        animationUrl = animationUrl + `&rdm=${new Date().getTime()}`
        media_src.value = animationUrl
      } else {
       
       
      }
    }).catch( err => {
      console.error(err);
     
    })
  }



</script>

<style lang="scss" scoped>
.box-bc{
  background: #ffffff;
}
.iframe_box{
  width:100%;
  height: 243px;
  overflow: hidden;
  position: relative;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.detail-loading{
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translate(-50%,-30%);

}
  .video-iframe {
   
  }
</style>
