<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:50
 * @Description: 
-->
<template>
  <div class="wrap" :class="type_name" :style="{marginBottom:`${marginBottom}`}">
    <div class="img" :class="color" :style="{width: width,height:height}"></div>
    <div class="text-center"  :style="{color: textColor}">{{msg?msg:i18n_t('nodata_msg.no_data_msg_1')}}</div>
    <div class="nodata-text2" v-if="msg2">{{msg2}}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "no_data",

  props: {
    marginBottom: {
      type: String,
      default: "60px"
    },
    msg: {
      type: String,
      default: "" //未找到相应赛事
    },
    msg2: {
      type: String,
      default: ""
    },
    textColor: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "auto"
    },
    color: {
      type: String,
      default: "dark"
    },
    type_name:{
      type: String,
      default: ""
    }
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  text-align: center;
  font-size: 14px;
  .img {
    margin-bottom: 10px;
    width: 130px;
    height: 0px;
    background-size: 100%;
    background-repeat:no-repeat
  }
  &.esports-size {
    .img {
      margin: 0 auto;
      padding-bottom: 0;
    }
    .text-center {
      font-size: 12px;
    }
  }
}
</style>