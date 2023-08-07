<!--
 * @Description: 网络不给力，空空如也这些信息展示
-->
<template>
  <div class="no-data" :style="{'min-height':top_height +'px',paddingTop:is_detail && top_height < 500 ? '.6rem' : '80px'}">

    <template v-if="['暂无,此处逻辑产品暂时说放弃'].includes(which)">
      <div class="empty-favorite-bg" :style="{backgroundImage:get_theme.includes('theme01') ?`url(${arr.noMatchNew.url})`:`url(${arr.noMatchNew.url2})` }"></div>
      <p class="title"  :style="{color:get_theme.includes('theme01') ?'#666666':' #B9B9B9' }">{{ arr.noMatchNew.txt[0] }}</p>
      <p class="title-tint" :style="{color:get_theme.includes('theme01') ?'#999999':' #999999'}">{{ arr.noMatchNew.txt[1] }}</p>
      <p>
        <span class="btn" @click="refresh_data" :style="{color:get_theme.includes('y0') ?'#4987FB':'#FF9124',borderColor:get_theme.includes('y0') ?'#569FFD':'#FF9124'}">
      {{ arr.noMatchNew.txt[2] }}</span>
      </p>
    </template>

    <template v-if="['noMatch', 'noWifi', 'noMessage'].includes(which)">
      <div class="empty-favorite-bg" :style="{backgroundImage:get_theme.includes('theme01') ?`url(${arr.noMatch.url})`:`url(${arr.noMatch.url2})` }"></div>
      <p style="color:#A5A9B3;">{{ which === 'noMessage' ? arr.noMessage.txt : arr.noMatch.txt }}</p>
    </template>

    <template v-if="which === 'nolive'">
      <div class="empty-favorite-bg" :style="{backgroundImage:get_theme.includes('theme01')?`url(${arr.nolive.url})`:`url(${arr.nolive.url2})`}"></div>
      <p style="color:#A5A9B3;"> {{arr.nolive.txt}} </p>
    </template>

    <template v-if="which === 'collect'">
      <div class="empty-favorite-bg" :style="{backgroundImage:get_theme.includes('theme01')?`url(${arr.collect.url})`:`url(${arr.collect.url2})`}"></div>
      <p style="color:#A5A9B3;">{{arr.collect.txt}}</p>
    </template>
  </div>
</template>

<script setup>
// import { mapGetters } from "vuex";


</script>

<style lang="scss" scoped>
.no-data {
  border-bottom: 1px solid transparent;
  min-height: 100%;
  text-align: center;
  color: #a5a9b3;
  .empty-favorite-bg {
    width: 1.8rem;
    height: 1.61rem;
    margin: 0 auto;
    background-size: contain;
    background-repeat: no-repeat;
    user-select: none;
  }

  .title{
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    color: #666666;
    margin-bottom: 0rem;
  }
  .title-tint{
    margin-top: 0.03rem;
    font-size: 0.12rem;
    color: #999999;
  }

  .btn{
    display: inline-block;
    width: 1.2rem;
    height: 0.34rem;
    border: 1px solid transparent;
    border-radius: 0.17rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.14rem;
    margin: auto;
  }


  p {
    margin: 0.14rem;
    font-size: 0.14rem;

    span {
      display: inline-block;
      width: 1.4rem;
      height: 0.4rem;
      line-height: 0.4rem;
      border-radius: 0.05rem;
      color: #ffb001;
      border: 1px solid #ffb001;
    }
  }
}
</style>
