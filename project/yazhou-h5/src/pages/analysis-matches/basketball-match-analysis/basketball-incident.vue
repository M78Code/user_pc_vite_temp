<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
 * @Description: 详情页 或者 赛果  篮球赛事事件
-->
<template>
  <div class="basketball-incident" v-if="no_data">
    <div class="title">{{ $root.$t('match_result.event') }}</div>
    <div class="tabs">
      <div v-for="(item, index) in event_data" :key="index"
        :class="{active: tab_index == index}"
         @click="change_tab(index)"
      >
        {{item.key}}
      </div>
    </div>
    <div class="basketball-incident-content">
      <div v-for="(item, index) in event_data[tab_index].value" :key="index">
        <span>{{(new Date(+item.createTime)).Format($root.$t('time4'))}}</span>
        <i class="Glow" :class="{noLine: +event_data[tab_index].value.length -1 == index,home:item.team ==1, away: item.team == 2}"></i>
        <div class="ellipsis-2-lines">
          <span>{{ item.scores }} </span>
          <span class="ellipsis-2-lines">{{item.cnText}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api_result } from "src/project/api";
import {mapGetters} from "vuex";
export default {
  name: "basketball_incident",
  data() {
    return {
      event_data:[
        {key: '第一节'},
        {key: '第二节'},
        {key: '第三节'},
        {key: '第四节'},
        {key: '++赛'},
      ],
      tab_index: 0,
      no_data: false
    }
  },
  created() {
    // 添加监听 赛事分析刷新事件
    this.$root.$on(this.emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, this.get_list)

    this.get_list()
  },
  computed: {
    ...mapGetters(["get_goto_detail_matchid", 'get_detail_data']),
    // 赛事id
    match_id() {
      return this.$route.params.mid || this.get_detail_data.mid
    },
  },
  methods:{
    change_tab(i) {
      this.tab_index = i
    },
    async get_list() {
      try {
        let {code , data} = await api_result.get_live_event({mid: this.match_id})
        if(code == 200 && data.length > 0) {

          this.event_data = data
          this.no_data = true
        } else {
          this.no_data = false
        }
      } catch (error) {
        this.no_data = false
        console.error(error);
      }
    },
  },
  destroyed() {
    // 移除监听 赛事分析刷新事件
    this.$root.$off(this.emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, this.get_list)

    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
}
</script>

<style lang="scss" scoped>
.basketball-incident {
  .tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.25rem;

    > div {
      width: 0.64rem;
      height: 0.24rem;
      line-height: 0.24rem;

      font-size: 0.12rem;

      text-align: center;
      border-radius: 0.13rem;
      margin-right: 0.06rem;

      &:last-child {
        margin-right: unset;
      }
    }
  }

  .basketball-incident-content {
    padding: 0 0.18rem 0;

    > div {
      width: 100%;
      display: flex;
      height: 0.46rem;
      align-items: center;

      > span {
        font-size: 0.12rem;

        &:nth-child(1) {
          width: 0.75rem;
        }
      }

      > .ellipsis-2-lines {
        width: 3rem;
        display: flex;
        align-items: center;

        span {
          &:nth-child(1) {
            min-width: 0.45rem;
            margin-right: 0.1rem;
            text-align: center;
          }

          &:nth-child(2) {
            width: 2.8rem;
          }
        }
      }

      > i {
        width: 0.07rem;
        height: 0.07rem;

        margin: 0 0.08rem;
        border-radius: 50%;
        position: relative;

        &:after {
          content: "";
          width: 1px;
          height: 0.43rem;
          position: absolute;
          left: unset;
          right: 0.027rem;
          top: 0.07rem;
        }

        &.noLine {
          &:after {
            content: unset;
          }
        }
      }
    }
  }
}

.title {
  height: 0.4rem;
  line-height: 0.4rem;
  padding-left: 0.24rem;
  font-size: 0.14rem;

  letter-spacing: 0;
  font-weight: bold;
  margin-bottom: 0.15rem;
  position: relative;

  &:before {
    content: '';
    width: 0.03rem;
    height: 0.12rem;
    position: absolute;
    left: 0.16rem;
    top: 0.14rem;

    border-radius: 1.5px;
  }
}
</style>
