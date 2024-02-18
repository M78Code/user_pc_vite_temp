<!--
 * @Author       : pasta
 * @Date         : 2021-01-16 15:51:38
 * @Description  : 
 * @FilePath: /src/pages/game_event_new/components/event_content1.vue
-->
<template>
    <div class="content text-panda-text-light">
      <div class="row justify-between">
        <div class="q-mr-sm">{{item.currentTime}}</div>
        <div>{{ item.eventName }}</div>
        <div v-if="item.remark" class="q-ml-xs">{{item.remark}}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: {
        type: Object,
        defualt: () => ({})
      }
    },
    data() {
      return {
        i18ns: "zs"
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
    .content {
      font-size: 13px;
      background: transparent;
      padding: 2px 15px;
      border-radius: 2px;
      border: 1px solid var(--q-color-panda-light-light);
    }
  </style>