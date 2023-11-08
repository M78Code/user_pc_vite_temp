<!--
 * @Author: nico
 * @Date: 2023-05-17 14:13:55
 * @Description: 即将推出页面
-->
<template>
<div style="height:100%">
  <!-- <MatchesHeader /> -->
  <div class="coming_soon_wrap">
    <div class="coming_soon_box">
      <img class="coming_soon_img" :src="coming_soon" alt="">
      <div class="description">Coming Soon</div>
    </div>
  </div>
    </div>
</template>
  
<script setup>
 import coming_soon from 'src/assets/images/conming_soons.png';
//  import MatchesHeader from "src/components/matches_header/matches_header.vue";
</script>
  
<style lang="scss" scoped>
  .coming_soon_wrap {
    width: 100%;
    height: 100%;
    padding-right: 7px;
    box-sizing: border-box;
  }
  .coming_soon_box {
    width: 100%;
    height: 100%;
    padding-top: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #FFFFFF;
    box-sizing: border-box;
  }
  .coming_soon_img {
    width: 200px;
    height: 200px;
    margin-bottom: 4px;
  }
  .description {
    font-family: Roboto;
    font-size: 16px;
    font-weight: 500;
    line-height: 18.75px;
    letter-spacing: 0px;
    color: #1A1A1A;
  }

.matches_header_wrap {
    height: v-bind('match_list_top');
    padding-right: 7px;
    box-sizing: border-box;
}

.matches_header {
    width: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    border-bottom: 2px solid #FF7000;
    background: linear-gradient(270deg, #9C9C9C 0.04%, #3B3B3B 99.96%);
    position: relative;

    .header_banner {
        position: absolute;
        right: 0;
        top: 0;
        width: 226px;
        height: 78px;
        // background-image: url('src/assets/images/icon_sport_bg.png');
        background-position: 0 -630px;
        background-size: 226px;
    }

    .matches-title {
        padding-left: 20px;
    }

    .current_match_title {
        font-size: 18px;
        font-weight: 500;
        color: #FFFFFF;
        margin-bottom: 21px;
        height: 48px;
        line-height: 48px;
    }

}

@media (max-width: 1450px) {
    .matches_header_wrap {
        padding-right: 3px;
    }
}
</style>
  