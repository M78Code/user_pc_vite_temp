<template>
    <div class="top-header">
        <div v-if="props.isBack" class="top-header-left">
            <div class="top-header-left-img" @click="goBack()">
                <!-- <div class="img" :style="compute_css_obj('menu-go-back-icon')"></div> -->
                <img class="img" :src="back" />
            </div>
        </div>
        <div class="top-header-content">
            {{props.title}}
        </div>
        <div class="top-header-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script setup>
import back from "./img/back.svg";
import {compute_css_obj, MenuData } from "src/core/index.js";
  const props = defineProps({
    isBack: {
        type: Boolean,
        default: true
    },
    title:{
        type: String,
        default: ""
    }
  });
  /**
   * 初始化数据
   */
  const goBack = () =>{
    MenuData?.set_init_menu_list()
  }
</script>
<style lang="scss" scoped>
    .top-header{
        width: 100%;
        height: 0.44rem;
        line-height: 0.44rem;
        align-items: center;
        display: flex;
        white-space: nowrap;
        padding: 0 0.14rem;
        .top-header-left{
            height: 0.14rem;
            padding-left: 0.09em;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex: 1 1;
            .top-header-left-img{
                width: 0.2rem;
                height: 0.36rem;
                .img {
                    width: 0.08rem;
                    height: 0.14rem;
                    background-size: cover;
                    opacity: .6;
                }
            }
        }
        .top-header-content{
            font-weight: 400;
            font-size: 18px;
            flex: auto;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .top-header-right{
            text-align: right;
            flex: 1 1;
        }
    }
</style>