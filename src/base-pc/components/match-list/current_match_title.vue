<!--
 * @Date           : 2023-06-26 19:20:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-16 15:03:34
 * @FilePath: \user-pc-vue3\src\components\match_list\current_match_title.vue
-->
<template>
  <div class="current_match_header_wrap">
    <div class="current_match_title">{{ title_value }}</div>
    <div class="current_match_total" v-show="show_more_icon">
      <div>{{ defineMockObj.match_total }}</div>
      <div>
        <img src="../../../assets/images/show_more_match.png" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    title_value: {
      type: [ String ],
      default: () => '',
    },
    show_more_icon: {
      type: [ Boolean ],
      default: () => false
    }
  });

  const defineMockObj = {
    title_value: 'In-Play',
    match_total: '',
  }

</script>

<style lang="scss" scoped>
  .current_match_header_wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 24px 0 10px;
    padding-right: 10px;
    .current_match_title {
      font-weight: 500;
      color: #333333;
      font-size: 18px;
    }
    .current_match_total {
      display: flex;
      align-items: center;
      img {
        width: 6.25px;
        height: 10px;
        margin-left: 7.75px;
      }
    }
  }
</style>