<!--
 * @Author       : pasta
 * @Date         : 2021-01-16 15:15:19
 * @Description  :
 * @FilePath: /src/pages/game_event_new/components/event_content.vue
-->
<template>
    <div class="content text-panda-text-light" :class="`bg-color-${item.eventType}`">
      <div class="row justify-between">
        <div class="RobotoBold1">{{ item.currentTime }}</div>
        <div class="RobotoBold1">{{ item.score && item.score.replace(':','-') }}</div>
      </div>
      <div class="row justify-between">
        <div class="row col event-name" style="font-family: PingFangSC-Regular;">
          <div>{{item.eventName }}</div>
        </div>
        <div class="RobotoBold1">
          {{ eventTime(item.eventTime)}}
        </div>
      </div>
    </div>
  </template>
  
  <script>
//   import mixins from "src/mixins/index.js";
//   import { eventTypeList } from "src/pages/game_event_new/config/config.js"
//   import { api_order } from "src/api/index.js";
//   import { SessionStorage } from "quasar";
  export default {
    // mixins: [ ...mixins ],
    props: {
      item: {
        type: Object,
        defualt: () => ({})
      }
    },
    data() {
      return {
        show: false,
        color: '',
        eventType: 0,
        // eventTypeList,
      }
    },
    computed: {
      i18ns(){
        return "zs";
      }
    },
    methods: {
      edit() {
        this.show = true
      },
      get_bg_color(type) {
        return 'red'
      },
      eventTime(time) {
        return time
        // let second_time = time%1000
        // let str = this.get_times(time).slice(10).split(':')
        // str = `${str[0]}:${str[1]}:${str[2]} '${second_time}''`
        // return str
      },
    }
  };
  </script>
  
  <style lang="scss" scoped>
    .content {
      font-size: 14px;
      height: 42px;
      background: var(--q-color-panda-base-light5);
      padding: 0 10px;
      border-radius: 3px;
      overflow:hidden
    }
    .bg-color-0 {
      background: #28303f
    }
    .bg-color-2 {
      background: #DB6372
    }
    .bg-color-3, .bg-color-4 {
      background: #683B48
    }
  </style>
  