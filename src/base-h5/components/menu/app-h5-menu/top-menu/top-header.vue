<template>
    <div class="top-header">
        <div class="top-header-left">
            <div class="top-header-left-img" @click="goBack()">
                <img class="img" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/back.svg`" alt="" />
            </div>
        </div>
        <div class="top-header-content">
            {{MenuData.top_menu_title.title}}
        </div>
        <div class="top-header-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script setup>
import { MenuData,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import { useRoute , useRouter } from "vue-router";
import { useMittOn,MITT_TYPES, useMittEmit } from "src/core/mitt/index.js"
const route = useRoute()
const router = useRouter()
  /**
   * 初始化数据
   */
  const goBack = () =>{
    MenuData.set_top_menu_title({})
    MenuData.set_init_menu_list()
    useMittEmit(MITT_TYPES.EMIT_MENU_GO_BACK)
    if (route.name === 'esports_sports') router.back()
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