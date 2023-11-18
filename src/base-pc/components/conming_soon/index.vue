<!--
 * @Author: nico
 * @Date: 2023-05-17 14:13:55
 * @Description: 即将推出页面
-->
<template>
    <div style="height:100%">
        <div class="matches_header_wrap">
            <div class="matches_header">
                <div class="header_banner"></div>
                <div class="matches-title">
                    <div class="current_match_title ">
                      {{i18n_t("ouzhou.match.favorites")}}
                    </div>
                </div>
            </div>
        </div>


  <div class="coming_soon_wrap">
    <div class="coming_soon_box">
      <img class="coming_soon_img" :style="compute_css_obj({key: 'pc-home-coming-soon'})" alt="">
      <div class="description">{{ i18n_t("ouzhou.no_data.coming_soon") }}</div>
    </div>
  </div>
    </div>
</template>
  
<script setup>
import { compute_css_obj } from 'src/core/server-img/index.js'
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
    background: var(--q-gb-bg-c-4);
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
    border-bottom: 2px solid var(--q-gb-bd-c-1);
    background: var(--q-gb-bg-lg-8);
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
        color: var(--q-gb-t-c-1);
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
  