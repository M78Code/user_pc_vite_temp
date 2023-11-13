<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 返回顶部组件
-->
<template>
  <div class="go-top">
    <!-- 没有更多了 -->
    <!-- <div class="no-more-wrap yb-flex-center">
      <icon name="icon-cry" color="rgba(255, 255, 255, 0.3)" size="18px" />
      <span class="msg">{{$root.$t("common.no_more_data")}}</span>
    </div> -->
    <!-- 返回顶部 -->
    <div class="go-top-btn" @click="on_go_top">
      <icon name="icon-go_top" size="14px"></icon>
      <div class="msg">{{$root.$t("common.back_top") || ""}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoTop",
  methods:{
    /**
    * @Description:返回顶部
    * @Author Cable
    * @param:
    * @return:
    */
    on_go_top(){
      this.$emit('on_go_top')
    }
  }
};
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
