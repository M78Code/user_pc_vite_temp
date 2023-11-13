<!--
 * @Author:
 * @Date: 2021-04-19 16:38:50
 * @Description:
-->
<template>
  <div class="wrap virtual_statu">
    <img :src="statu_dict[status].src" alt="" class="statu_img">

    <div class="content" :class="statu_dict[status].class">
      <div>{{$root.$t(`match_info.${statu_dict[status].label}`)}}</div>
      <div class="countdown" v-if="status == 'stopBet'">00:{{timestamp}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: "stopBet",
      statu_dict:{
        stopBet: {label: "stop_bet", src: require('public/image/common/virtual/stop_bet.svg'), class: "stop_bet"},
        underway: {label: "underway", src:  require('public/image/common/virtual/match_underway.svg'), class: "underway"},
        matchOver: {label: "match_over", src: require('public/image/common/virtual/match_over.svg') , class: "match_over"},
      }
    };
  },
  props:{
    statu: String,
    timestamp: [Number,String]
  },
  watch:{
    statu:{
      handler(res){
        this.status = res
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.virtual_statu {
    border-radius: 0 0 6px 6px;
  }
  .statu_img {
    width: 44px;
    height: 42px;
    margin-bottom: 24px;
  }
  .content {
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    .countdown {
      line-height: 22px;
      font-size: 18px;
    }
    &.stop_bet {
      color: #ff2a2a;
    }
    &.underway {
      color: #6dd400;
    }
    &.match_over {
      color: #6d7278;
    }
  }
}
</style>
