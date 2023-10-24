<!--
 * @Author: rise
 * @Date: 2023-10-22 17:03:22
 * @LastEditors: rise
 * @LastEditTime: 2023-10-24 13:43:53
 * @Description:  
-->
<template>
    <div class="swiper-wap">
        <div class="swiper-content swiper-left">
            <SwiperNav :slideList="slideImgList"/>
        </div>
        <div class="swiper-content swiper-right">
            <SwiperNav :slideList="slidEeventList"/>
        </div>
    </div>
</template>
<script setup>
import SwiperNav from "./swiper-nav.vue";
/**
 * 图片轮播
 */
const slideImgList = [
  {
    img:"https://cdn.quasar.dev/img/mountains.jpg",
    toUrl:""
  },
  {
    img:"https://cdn.quasar.dev/img/parallax1.jpg",
    toUrl:""
  },
  {
    img:"https://cdn.quasar.dev/img/parallax2.jpg",
    toUrl:""
  },
  {
    img:"https://cdn.quasar.dev/img/quasar.jpg",
    toUrl:""
  },
];
/**
 * 赛事轮播
 */
const slidEeventList = [
    {
        isGame:true,//是否赛事
        anchorName:"名称",//主播名称
        anchorAvatar:"https://cdn.quasar.dev/img/quasar.jpg",//主播头像
        gameName:"欧洲足球联赛",//比赛名称
        gameParticipants:[//参赛方信息
            {
                name:"美国",
                avatar:"https://cdn.quasar.dev/img/parallax2.jpg"//头像
            },
            {
                name:"日本",
                avatar:"https://cdn.quasar.dev/img/parallax1.jpg"
            }
        ]
    },
    {
        isGame:true,
        anchorName:"名称1",//主播名称
        anchorAvatar:"https://cdn.quasar.dev/img/quasar.jpg",//主播头像
        gameName:"欧洲足球联赛",//比赛名称
        gameParticipants:[//参赛方信息
            {
                name:"美国",
                avatar:"https://cdn.quasar.dev/img/parallax2.jpg"//头像
            },
            {
                name:"日本",
                avatar:"https://cdn.quasar.dev/img/parallax1.jpg"
            }
        ]
    }
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
                border-radius: 0.08rem;
                overflow: hidden;
            }
            &.swiper-right{
                flex: 1;
                border-radius: 0.08rem;
                overflow: hidden;
            }
        }
    }
</style>
