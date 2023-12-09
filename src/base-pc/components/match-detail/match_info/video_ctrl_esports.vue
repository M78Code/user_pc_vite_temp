<!--
 * @Author: Cable
 * @Date: 2020-07-31 16:14:55
 * @Description: 右侧视频控制区域组件---电竞
-->
<template>
  <div class="c-video-ctrl">
    <div class="ctrl-wrap">
      <sport-icon v-if="match_info.mid && match_info.mid != -1" :sport_id="match_info.csid" status="2" size="18px" is_esports :isVideoIcon="true" />
      <div class="name">{{match_info.tn}}</div>
    </div>
  </div>
</template>

<script>
// import sportIcon from "/components/sport_icon/sport-icon.vue"
export default {
  components:{
    sportIcon
  },
  props:{
    // 赛事信息
    match_info:Object
  }
};
</script>

<style lang="scss" scoped>
.ctrl-wrap {
  height: 36px;
  display: flex;
  font-size: 13px;
  align-items: center;
  .sport-img {
    margin: 0 10px 0 15px;
    width: 18px;
  }
}
</style>