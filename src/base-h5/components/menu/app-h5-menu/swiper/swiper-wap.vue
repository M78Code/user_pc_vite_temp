<!--
 * @Author: rise
 * @Date: 2023-10-22 17:03:22
 * @LastEditors: rise
 * @LastEditTime: 2023-10-23 15:18:58
 * @Description:  
-->
<template>
    <div class="swiper-wap">
        <div class="swiper-content swiper-left">
            <SwiperNav />
        </div>
        <div class="swiper-content swiper-right">
            <SwiperNav />
        </div>
    </div>
</template>
<script setup>
import SwiperNav from "./swiper-nav.vue";
/**
 * 首页switch wap
 */
const switchData = [
    {
        defaultVal:0,
        list:[
            {
                name:"专业版",
                val:0,
                changeFun:(val)=>{
                    return console.log(`执行专业版-${val}`)
                }
            },
            {
                name:"新手版",
                val:1,
                changeFun:(val)=>{
                    return console.log(`执行新手版-${val}`)
                }
            }
        ]
    },
    {
        defaultVal:1,
        list:[
            {
                name:"热门",
                val:0,
                isSort:1,
                changeFun:(val,sort)=>{
                    return console.log(`执行热门-${val}-${sort}`)
                }
            },
            {
                name:"时间",
                val:1,
                isSort:1,
                changeFun:(val,sort)=>{
                    return console.log(`执行时间-${val}-${sort}`)
                }
            }
        ]
    },
    {
        defaultVal:0,
        list:[
            {
                name:"日间",
                val:0,
                changeFun:(val)=>{
                    return console.log(`执行日间-${val}`)
                }
            },
            {
                name:"夜间",
                val:1,
                changeFun:(val)=>{
                    return console.log(`执行夜间-${val}`)
                }
            }
        ]
    },
]
</script>
<style scoped lang="scss">
    .swiper-wap{
        width: 100%;
        padding: 0 0.1rem;
        height: 0.52rem;
        display: flex;
        margin: 0.04rem 0;
        .swiper-content{
            height: 100%;
            &.swiper-left{
                width: 1.4rem;
                margin-right: 0.08rem;
            }
            &.swiper-right{
                flex: 1;
            }
        }
    }
</style>
