<!--
 * @Author: rise
 * @Date: 2023-10-22 13:33:28
 * @LastEditors: rise
 * @LastEditTime: 2023-10-27 16:46:47
 * @Description:  
-->
<template>
  <div class="swiper-nav">
    <q-carousel
      animated
      v-model="slide"
      infinite
      :autoplay="true"
      swipeable
      no-swipe
      height="0.52rem"
    >
    <template v-for="(item,index) in slideList" :key="index" >
      <q-carousel-slide  @click="changeSwiper(item)" :name="index" :img-src="item.imgUrl" v-if="!item.isGame" />
      <q-carousel-slide @click="changeSwiper(item,1)" :name="index" img-src="" v-else>
          <div class="swiper-game-content">
            <div class="swiper-game-content-left">
              <p class="swiper-game-content-img">
                <img class="swiper-game-content-left-avatar" :src="item.anchorAvatar" />
                <img class="swiper-game-content-left-icon" :src="anchor" />
              </p>
              <span>{{item.anchorName}}</span>
            </div>
            <div class="swiper-game-content-right">
              <p>{{item.gameName}}</p>
              <div class="swiper-game-content-right-participants">
                <span>
                  {{item.gameParticipants?.[0]?.name}}
                  <template v-for="(n,m) in item.gameParticipants?.[0]?.imgFile">
                    <img v-img="[
                      n,
                      item.gameParticipants?.[0]?.initials[m],
                      item.gameParticipants?.[0]?.csid,
                      { data: item.gameParticipants?.[0], name: `_t1${m+1}_img` }
                    ]" alt/>
                  </template>
                  <!-- <img :src="item.gameParticipants?.[0]?.avatar" /> -->
                </span>
                VS
                <span>
                  <template v-for="(n,m) in item.gameParticipants?.[1]?.imgFile">
                    <img v-img="[
                      n,
                      item.gameParticipants?.[1]?.initials[m],
                      item.gameParticipants?.[1]?.csid,
                      { data: item.gameParticipants?.[1], name: `_t2${m+1}_img` }
                    ]" alt/>
                  </template>
                  <!-- <img :src="item.gameParticipants?.[1]?.avatar" /> -->
                  {{item.gameParticipants?.[1]?.name}}
                </span>
              </div>
            </div>
          </div>
      </q-carousel-slide>
    </template>
      <template v-slot:control v-if="slideList.length > 1">
        <!-- 控制按钮 -->
        <q-carousel-control position="bottom" :offset="[0, 3]">
          <span v-for="(n,m) in slideList" :key="m" class="tab" :class="{'tab2': m == slide}"></span>
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import anchor from "./img/anchor.svg";
const slide = ref(1);
const emits = defineEmits(['swiperChange'])
const props = defineProps({
  slideList: {
      type: Array,
      default:[]
  }
})
/**
 * 轮播点击事件
 * @param {*} item 
 */
const changeSwiper = (item,type) =>{
  emits('swiperChange',item,type);
}
</script>
<style scoped lang="scss">
.swiper-nav{
  width: 100%;
  height: 0.52rem;
  overflow: hidden;
  :deep(.q-carousel__control) {
    display: flex;
    justify-content: center;
  }
  :deep(.q-carousel__slide) {
    background-size: 100% 100%;
    padding: 0;
  }
  :deep(.q-carousel) {
    background: transparent;
  }
  .swiper-game-content{
    width: 100%;
    height: 100%;
    display: flex;
    background: #e8f5ff;
    .swiper-game-content-left{
      width: 0.52rem;
      height: 100%;
      position: relative;
      text-align: center;
      &::after{
        content: "";
        position: absolute;
        width: 0.01rem;
        height: 0.4rem;
        background-color: var(--q-gb-t-c-1);
        right: 0;
        top: 50%;
        margin-top: -0.2rem;
      }
      .swiper-game-content-img{
        width: 0.32rem;
        height: 0.32rem;
        border-radius: 50%;
        border: 0.01rem solid var(--q-gb-t-c-1);
        text-align: center;
        margin: 0.04rem auto 0;
        line-height: 0.32rem;
        position: relative;
        .swiper-game-content-left-avatar{
          width: 0.28rem;
          height: 0.28rem;
          border-radius: 50%;
          margin-top: 0.01rem;
          overflow: hidden;
        }
        .swiper-game-content-left-icon{
          position: absolute;
          right: -0.02rem;
          bottom: -0.02rem;
        }
      }
      span{
        width: 100%;
        font-size: 0.1rem;
        text-align: center;
      }
    }
    .swiper-game-content-right{
      flex: 1;
      font-size: 0.1rem;
      p{
        width: 100%;
        height: 0.14rem;
        line-height: 0.14rem;
        margin: 0.06rem auto 0;
        text-align: center;
        color:#7981A4;
      }
      .swiper-game-content-right-participants{
        width: 100%;
        height: 0.23rem;
        line-height: 0.23rem;
        font-weight: 600;
        text-align: center;
        span{
          margin: 0 0.02rem;
          img{
            width: 0.15rem;
            height: 0.15rem;
            border-radius: 50%;
            vertical-align: middle;
            margin-top: -2px;
          }
        }
      }
    }
  }
  .tab {
    width: 0.04rem;
    height: 0.02rem;
    border-radius: 2px;
    display: inline-block;
    margin: 0 2px;
    opacity: .4;
    background-color: var(--q-gb-t-c-1);
  }
  .tab2 {
    width: 0.08rem;
    opacity: 1;
    background-color: var(--q-gb-t-c-1);
  }
}
</style>