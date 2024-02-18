<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show" @click="handleonmousedown">
    <!-- 失效蒙层 -->
    <!-- 左边 -->
    <div v-if="value_show.length > 0">

      <div class="row justify-start items-center" v-for="(item, index) in value_show" :key="index" :class="[get_bet_success ? 'yb_px14' : 'yb_pl12 yb_pr18', { 'bet-mix-show2': is_conflict }]
        ">
        <!-- 左边 -->
        <div class="yb_mr12 dele-left" v-if="get_bet_success">
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/bet_xuanx.svg`" alt="" @click.stop="remove_(value_show.id_)">
        </div>
        <div>
        </div>
        <!-- 右边 -->
        <div style="flex:1;">
          <!-- 上 -->
          <div class="row justify-between items-center yb_fontsize16 content-t yb_mb6 yb_mt8">
            <div class="col-9 row">
              <span class="fw_600">
                <!-- 投注成功后的展示值用接口返回的 -->
                <!-- <template v-if="bet_success_obj.playOptionName && [3, 6].includes(+get_bet_status)">{{bet_success_obj.playOptionName}} </template> -->
                <template>
                  <span class="yb_mr4">{{ item.home }}</span>
                  <span :class="pankou_change == 1 ? 'pankou-change' : null">{{ item.away }}</span>
                </template>
                [{{ item.marketTypeFinally }}]
              </span>
            </div>

            <div class="col-3 row justify-end items-center">
              <span class="yb_fontsize22" :class="{ 'red': odds_change == 1, 'green': odds_change == 2 }">
                <template>{{ item.oddFinally }}</template>
                <!-- <template v-else>{{odds_value()}}</template> -->
              </span>
              <!-- 红升绿降 -->
              <span :class="{ 'red-up': odds_change == 1, 'green-down': odds_change == 2 }"
                class="odd-change yb_ml4"></span>
            </div>
          </div>

          <div class="row justify-between yb_my4 yb_fontsize14">
            <span :class="get_lang == 'vi' && get_bet_success ? 'col-6' : 'col-7'">
              <span>{{ item.playId }}&thinsp;</span>
              <span>{{ item.playName }}&thinsp;</span>
              <span>{{ item.playOptions }}&thinsp;</span>

            </span>
          </div>
          <!-- 联赛名称 -->
          <div class="xia" v-if="item.tn_name">{{ item.tid_name }}</div>

          <!-- 下 -->
          <div class="xia row justify-between flex-end yb_my4" style="min-height: 0.22rem">
            <div class="col-9 row">
              <span>
                {{ item.home }}
                <span>v</span>
                {{ item.away }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 对应单关多个注单样式 -->
    <div>
      <!-- 单关金额输入框 v-bind="$attrs"-->
      <bet-single-detail ref="bet_single_detail"></bet-single-detail>
    </div>
  </div>
</template>

<script setup>
 
import betSingleDetail from './bet-single-detail.vue';
import BetData from "src/core/bet/class/bet-data-class.js";
 
import { ref, onMounted, watch, computed, onUnmounted, watchEffect } from 'vue';
 
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
 
import lodash from 'lodash'

const get_bet_success = ref(true)
const value_show = ref([])
const value_name = ref()
const is_conflict = ref(true)
const pankou_change = ref(false)
const odds_change = ref(1)
const get_lang = ref(2)

const props = defineProps({
  name_: String | Number,
  index_: Number,
  item: {}
})

onMounted(() => {
  // 监听 变化
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_bet_info)
  console.error('BetData', BetData.bet_single_list)
  value_show.value = BetData.bet_single_list
})
onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_bet_info).off
})

const set_bet_info = () => {
  console.error('BetData', BetData.bet_single_list)
  value_show.value = BetData.bet_single_list
  console.error(11111, value_show.value)
}

const handleonmousedown = () => {
  console.error(11111)
  value_show.value = BetData.bet_single_list
}
// watchEffect(() => {
//   value_show.value = props.bet_view_obj[props.name_]
//   value_name.value = props.name_
//   console.error('ssss7789', value_show.value)
//   console.error('name_', props.name_)
// })

// const value_show = computed(()=>{
//   console.error('变化了')
//   return props.bet_view_obj
// })







</script>
<style lang="scss" scoped>
.bet-mix-show {
  position: relative;
  line-height: 1.2;
}

/* ************** 失效蒙层 ************** -S */
.locked-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}

/* ************** 失效蒙层 ************** -E */

.content-t {
  line-height: 0.2rem;
}

.dele-left {
  z-index: 2;
  width: 0.14rem;
  height: 0.14rem;

  img {
    width: 99%;
    height: 99%;
  }
}

.pankou-change {
  border-radius: 2px;
  padding-left: 0.02rem;
  padding-right: 0.02rem;
}

/* ************** 红升绿降 ************** -S */
.odd-change {
  display: inline-block;
  width: 0.06rem;
  height: 0.1rem;
  background-repeat: no-repeat;
  background-size: contain;

  &.green-down {
    background-image: var(--q-color-com-img-bg-18);
  }

  &.red-up {
    background-image: var(--q-color-com-img-bg-19);
  }
}

/* ************** 红升绿降 ************** -E */
.invalid-span {
  border-radius: 2px;
  text-align: center;
  width: 0.4rem;
  line-height: 0.2rem;
  font-size: 0.13rem;
  margin-right: 0.1rem;
  height: min-content;
}

.invalid-span2 {
  border-radius: 2px;
  max-width: 1.1rem;
  line-height: 0.2rem;
  font-size: 0.13rem;
  height: min-content;
}

.xia {
  line-height: 1.2;
  font-size: 0.14rem;

  .pre-text {
    margin-right: 0.1rem;
  }
}

/* ************** 预约投注按钮 ************** -S */
.flex-end {
  align-items: flex-end;
}

.subscribe-button {
  width: 0.58rem;
  height: 0.22rem;
  border-radius: 0.14rem;
  font-size: 0.13rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-right: 0.1rem;
}

/* ************** 预约投注按钮 ************** -E */

/* ************** 预约投注操作栏 ************** -S */
.subscribe-wrap {
  margin-top: 0.12rem;

  .operation-line {
    margin: 0 12px 12px 12px;
    height: 1px;
  }
}

.subscribe-operation {
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.12rem 0.28rem;
  justify-content: space-between;

  .label {
    font-size: 14px;
    width: 0.62rem;
    max-width: 0.62rem;
  }

  .operation {
    width: 1.8rem;
    height: 0.32rem;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    .odd {
      flex: 1;
      font-size: 18px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;

      .odd_text {
        height: 0.16rem;
      }

      .money-span {
        // position: absolute;
        // top: 50%;
        // right: 0.08rem;
        width: 0.02rem;
        height: 0.16rem;
        margin-left: 0.05rem;
      }
    }

    .reduce,
    .add {
      width: 0.3rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        pointer-events: none;
        width: 0.11rem;
        height: auto;
      }
    }

    .shadow-show {
      opacity: 0.4;
    }
  }

  .delete {
    width: 0.13rem;

    img {
      width: 100%;
      height: auto;
    }
  }

}

/* ************** 预约投注操作栏 ************** -E */

/* ************** 投注完成后的颜色展示 ************** -S */
.img0 {
  margin-right: 0.06rem;
  width: 0.158rem;
  vertical-align: -3px;
}

.img1 {
  transform: rotate(0);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(1turn);
  }
}

/* ************** 投注完成后的颜色展示 ************** -E */
.line {
  height: 1px;
  transform: scaleY(0.5);
}
</style>