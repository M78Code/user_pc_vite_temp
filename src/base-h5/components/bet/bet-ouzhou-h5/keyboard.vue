<!--
 * @Author: darwin
 * @Description: 虚拟小键盘
-->
<template>
  <div class="keyboard" @click.stop="_handleKeyPress($event)" style="opacity: 1;" @touchmove.prevent>
    <div class="key-row row">
      <div class="key-cell" data-num="qon">
        <span>+</span>10
      </div>
      <div class="key-cell" data-num="1">1</div>
      <div class="key-cell" data-num="2">2</div>
      <div class="key-cell" data-num="3">3</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" data-num="qtw">
        <span>+</span>50
      </div>
      <div class="key-cell" data-num="4">4</div>
      <div class="key-cell" data-num="5">5</div>
      <div class="key-cell" data-num="6">6</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" data-num="qth">
        <span>+</span>100
      </div>
      <div class="key-cell" data-num="7">7</div>
      <div class="key-cell" data-num="8">8</div>
      <div class="key-cell" data-num="9">9</div>
    </div>
    <div class="key-row row">
      <div class="key-cell" data-num="max">
        MAX
      </div>
      <div class="key-cell" data-num=".">.</div>
      <div class="key-cell" data-num="0">0</div>
      <div class="key-cell del-key" data-num="x">删</div>
    </div>
  </div>
</template>

<script setup>


</script>

<style lang="scss" scoped>
.key-row{
  border-bottom: 1px solid var(--q-gb-t-c-5);
}
.key-cell{
  border-right: 1px solid var(--q-gb-t-c-5);
}
.keyboard {
  height: 185px;
  -webkit-overflow-scrolling: touch;
  font-size: 0.18rem;
  font-weight: 600;
  color: var(--q-gb-bg-c-3);
  font-family: "DIN";
  border-top: 1px solid var(--q-gb-t-c-5)
}
.key-cell {
  flex: 1;
  box-sizing: border-box;
  line-height: 46px;
  text-align: center;
  background: var(--q-gb-t-c-14);
}
.key-cell {
  &:first-child { // 左侧第一排MAX的样式
    background: var(--q-gb-t-c-6);
  }
  &:last-child {
    margin-right: 0;
  }
  &.del-key {
    background: cadetblue #ffffff0D no-repeat center center;
    opacity: 0.9;
    color: #B8B8B8;
  }
  &.shadow-show {
    color: #595959!important;
  }
}
</style>
