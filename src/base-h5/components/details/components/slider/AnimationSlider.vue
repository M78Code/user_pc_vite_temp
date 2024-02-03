<script setup name="animation-slider">
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { reactive } from "vue"

const anchor_img = LOCAL_PROJECT_FILE_PREFIX + '/image/details/slider/Anchor.png'
const animation_img = LOCAL_PROJECT_FILE_PREFIX + '/image/details/slider/Animation.png'
const fullScreen_img = LOCAL_PROJECT_FILE_PREFIX + '/image/details/slider/FullScreen.png'
const info_img = LOCAL_PROJECT_FILE_PREFIX + '/image/details/slider/Info.png'
const live_img = LOCAL_PROJECT_FILE_PREFIX + '/image/details/slider/Live.png'
const sound_img = LOCAL_PROJECT_FILE_PREFIX + '/image/details/slider/Sound.png'

const State = reactive({
    slider: {
        left: [
            // { name: '主播', icon: anchor_img },
            { label: '直播', icon: live_img, value: 'live' },
            { label: '动画', icon: animation_img, vlaue: 'animation' }
        ],
        right: [
            { label: '主播', icon: info_img, value: 'info' },
            { label: '主播', icon: sound_img,value: 'sound' },
            { label: '主播', icon: fullScreen_img,value: 'fullScreen' },
        ]
    }
})

const anything_else = function(event){
    console.log(event,'event')
}

</script>

<template>
    <article class="animation-slider">
        <ul class="slider">
            <li 
                v-for="item of State.slider.left" 
                class="slider--item"
                :data-type="item.value"
                @click="anything_else($event)"
            >
                <img :src="item.icon" alt="">
                <span>{{ item.label }}</span>
            </li>
        </ul>
        <ul class="slider">
            <li v-for="item of State.slider.right" class="slider--item">
                <img :src="item.icon" alt="">
                <!-- <span>{{ item.name }}</span> -->
            </li>
        </ul>
    </article>
   
</template>

<style lang="scss" scoped>
.animation-slider{
    width: 100%;
    height: .48rem;
    position: absolute;
    padding: 0 .08rem;
    box-sizing: border-box;
    z-index: 99;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: black;
    .slider{
        display: flex;
        align-items: center;
        gap: .16rem;
        &--item{
            // display: flex;
            // align-items: center;
            place-items: center;
            img{
                height: .24rem;
                width: .24rem;
                // margin-right: .04rem;
                vertical-align: bottom;
            }
            span{
                color: #fff;
                font-size: .12rem;
                line-height: .24rem;
                margin-left: .04rem;
            }
        }
    }
}
</style>