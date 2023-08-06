<!--
 * @Description: 单独处理二级菜单,全部菜单
-->
<template>
<div class="sport-menu-item flex justify-center"
    ref="scrollItem"
    @click="$emit('click')"
  >
    <div class="inner-w flex justify-between items-center"
      :class="{favorite:show_favorite_list}">
      <div></div>
      <div class="sport-w-icon">
        <slot></slot>
        <div class="sport-match-count" v-show="menu_type != 900">{{show_favorite_list ? '' : count ? count:0 }}</div>
      </div>
      <div class="s-w-i-title">
        {{title}}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// TODO 后续修改调整
// import {mapGetters} from "vuex";
  const props = defineProps({
    count:Number,
    title:String
  })
  computed(() => {
    // TODO 后续修改调整
    // show_favorite_list:'get_show_favorite_list',
    // menu_type:'get_menu_type'
  })
  // computed:{
  //   ...mapGetters({
      
  //   })
  // },
</script>
<style scoped lang="scss">
  .sport-menu-item{
    width:.7rem;
    height:100%;
    flex-shrink:0;
    .inner-w{
      height:.41rem;
      flex-direction:column;
      flex-wrap:nowrap;
      position:relative;
      .sport-w-icon{
        width:auto;
        height:.27rem;
        border-radius:50%;
        position relative
        svg{
          width: .22rem;
          height: .22rem;
        }
        img{
          width:auto;
          height:.22rem;
        }
        .sport-match-count{
          width:1px;
          height:1px;
          line-height:1;
          position:absolute;
          right:-.03rem;
          top: 0;
          font-size:.11rem;
        }
      }
      .s-w-i-title{
        max-width:.8rem;
        font-size: 0.1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        top: -.01rem;
      }
    }
  }
</style>
