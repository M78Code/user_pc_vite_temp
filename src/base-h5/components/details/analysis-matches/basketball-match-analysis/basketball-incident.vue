<!--
 * @Author:
 * @Date:
 * @Description: 详情页 或者 赛果  篮球赛事事件
-->
<template>
  <div class="basketball-incident" v-if="no_data">
    <div class="title">{{ i18n_t('match_result.event') }}</div>
    <div class="tabs">
      <div v-for="(item, index) in event_data" :key="index"
        :class="{active: tab_index == index}"
         @click="change_tab(index)"
      >
        {{item.key}}
      </div>
    </div>
    <div class="basketball-incident-content">
      <div v-for="(item, index) in event_data[tab_index]" :key="index">
        <span>{{(new Date(+item.createTime)).Format(i18n_t('time4'))}}</span>
        <i class="Glow" :class="{noLine: +event_data[tab_index].length -1 == index,home:item.team ==1, away: item.team == 2}"></i>
        <div class="ellipsis-2-lines">
          <span>{{ item.scores }} </span>
          <span class="ellipsis-2-lines">{{item.cnText}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { api_analysis } from "src/api/index.js";
import { ref, computed, onMounted, onUnmounted } from "vue";
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/index.js"
import { useRoute } from 'vue-router'
import { i18n_t } from "src/boot/i18n.js";
const get_detail_data = ref({
        csid: '1',
        mid: '1',
    })
//国际化


// TODO: 后续修改调整
// import {mapGetters} from "vuex";
  // name: "basketball_incident",

  const event_data = ref([
        {key: '第一节'},
        {key: '第二节'},
        {key: '第三节'},
        {key: '第四节'},
        {key: '++赛'},
      ])
  const tab_index = ref(0)
  const no_data = ref(false)
  // 路由
  let route = useRoute()
  onMounted(() => {
    // 添加监听 赛事分析刷新事件 TODO: $root emit 后续修改调整
    useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, get_list)
    get_list()
  })
    
  const match_id = computed(() => {
    // 赛事id TODO: route get_detail_data后续修改调整
    return route.params.mid || get_detail_data.value.mid
  })
  // computed: {
  //   ...mapGetters(["get_goto_detail_matchid", 'get_detail_data']),
  // },
  const change_tab = (i) => {
    tab_index.value = i
  }
  const get_list = async () => {
    try {
      let {code , data} = await api_analysis.get_live_event({mid: match_id.value})
      if(code == 200 && data.length > 0) {

        event_data.value = data
        no_data.value = true
      } else {
        no_data.value = false
      }
    } catch (error) {
      no_data.value = false
      console.error(error);
    }
  }
  onUnmounted(() => {
    // 移除监听 赛事分析刷新事件
    useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, get_list).off
    //   for (const key in $data) {
  //     $data[key] = null
  //   }
  })

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
