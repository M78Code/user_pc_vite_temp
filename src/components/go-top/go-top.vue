<!--
 * @Author: Cooper
 * @Date: 2020-08-14 17:13:55
 * @Description: 返回顶部组件
-->
<template>
  <div class="go-top">

    <!-- 返回顶部 -->
    <div class="go-top-btn" @click="on_go_top">
      <icon-wapper name="icon-go_top" size="14px"></icon-wapper>
      <div class="msg">{{i18n_t("common.back_top") || ""}}</div>
    </div>
  </div>
</template>

<script setup>
import { IconWapper } from 'src/components/icon'
import { i18n_t } from "src/output/index.js"
const emit = defineEmits(['on_go_top'])

    /**
    * @Description:返回顶部
    * @Author Cable
    * @param:
    * @return:
    */
   const on_go_top = ()=>{
    emit('on_go_top')
    }

</script>

<style lang="scss" scoped>
.go-top {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 152px;
  .go-top-btn {
    padding: 0 5px;
    height: 30px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .msg {
      margin-left: 10px;
    }
  }
}
</style>