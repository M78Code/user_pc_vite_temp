<!--
 * @Author: MasterJ
 * @Date: 2022-03-18
 * @Description: 全局横屏说明tip
-->
<template>
  <div class="hengping-tip">
    <div class="img-box">
      <img  src="image/wwwassets/bw3/images/hengpin.svg" alt="">
      <div>{{ $t('common.hengping_tip') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "hengping_tip"
}
</script>

<style lang="scss" scoped>
.hengping-tip {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 0;
  background-color: rgb(102, 102, 102);
  z-index: 9999;
}

.img-box {
  margin: 115px auto;
  font-size: 14px;
  text-align: center;
  color: #ffffff;

  img {
    width: 90px;
    height: 108px;
    margin-bottom: 10px;
  }
}
</style>
