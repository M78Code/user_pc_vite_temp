<!--
 * @Author:
 * @Description: bw3新版投注记录页展示联赛名和比赛时间 非冠军玩法的单关才展示
-->
<template>
  <div class="row items-center body-top yb_fontsize12">
      <!-- 左 -->
      <p class="p1 yb_mr4">
        <!-- 电竞图标先写死 -->
        <span v-if="top_.sportId == 101" style="--num:39"></span>
        <span v-else-if="top_.sportId == 100" style="--num:42"></span>
        <span v-else-if="top_.sportId == 103" style="--num:40"></span>
        <span v-else-if="top_.sportId == 102" style="--num:41"></span>
        {{store_data.theme}}
        <!-- <img :src="get_file_path(top_.tournamentPic,top_.sportId)" @error="handle_img_load_error" v-else> -->
        <!-- <img v-if="store_data.theme.includes('theme01')"  src="image/wwwassets/bw3/common/match_cup.svg" class="beif_src"> -->
        <!-- <img v-else  src="image/wwwassets/bw3/common/match_cup2.svg" class="beif_src"> -->
      </p>
      <p class="col league-title-w ellipsis">
        <template v-if="top_.sportName">{{top_.matchName}}</template>
        <template v-if="top_.sportId == 1001 || top_.sportId == 1004">&ensp;{{top_.matchDay}}&ensp;{{top_.batchNo}}</template>
      </p>
      <p class="pre-wrapper" v-if="[0,2,3,4].includes(pre_order_status)">
        <span v-if="[2,3].includes(pre_order_status)">{{$root.$t('pre_record.booked_fail')}}</span>
        <span v-else-if="pre_order_status == 4 || user_operation_done">{{$root.$t('pre_record.canceled')}}</span>
        <span v-else class="pre-button">{{$root.$t('pre_record.booking')}}
          <span class="pre-cancle-button" @click="cancleOrder()">
            <!-- 取消 -->
            <template v-if="!cancleFlag">{{$root.$t('common.cancel')}}</template>
            <!-- 确认取消 -->
            <template v-if="cancleFlag && !cancled">{{$root.$t('pre_record.confirm_cancle')}}</template>
            <!-- 确认中 -->
            <template v-if="cancleFlag && cancled">{{$root.$t('early.btn4')}}</template>
          </span></span>
      </p>
      <p class="pre-wrapper" v-if="preOrder">
        {{$root.$t('pre_record.book')}}
      </p>
  </div>
</template>

<script setup>
import { api_betting } from "src/api/index.js";
import { ref, onUnmounted  } from 'vue'
import {useMittOn, MITT_TYPES} from  "src/core/mitt/"
import { get_file_path } from "src/core/file-path/file-path.js";
// import { mapGetters } from "vuex";
import store from 'src/store-redux'

const props = defineProps({
  top_: {
    type: Object
  },
  pre_order_status: {
    type: Number || String
  },
  orderNumber: {
    type: Number || String
  },
  preOrder: {
    type: Boolean
  }
})
  let store_data = ref(store.getState())
  let cancleFlag = ref(false)
  let cancled = ref(false)
  //用户手动点击取消之后的状态
  let user_operation_done = ref(false)
  //延时器
  let timer = ref(null)


  onUnmounted(() => {
    console.error(store_data);
    clearTimeout(timer)
    timer = null
  })
  // computed: {
  //   ...mapGetters([
  //     'get_theme',
  //     'get_combine_tips_show'
  //   ])
  // },
  const cancleOrder = () => {
    console.error('取消吗');
    useMittOn(MITT_TYPES.EMIT_SHOW_CANCLE_POP,{
      orderNo: props.orderNumber,
      name: props.top_.matchInfo
    })
  }
  const handle_img_load_error = (e) => {
    e.target.classList.add('err_src')
    e.target.onerror = null
  }
</script>

<style lang="scss" scoped>
.body-top {
  height: 0.38rem;
  .league-title-w {
    height: 0.2rem;
    line-height: 0.22rem;
  }
}
.half-border-bottom {
  &::after{
    border-bottom: 1px solid var(--q-color-border-color-58);
  }
}
.p1 {
  width: 0.2rem;
  height: 0.22rem;
  span {
    --per: -0.32rem;
    display: inline-block;
    width: 100%;
    height: 100%;
    background: var(--q-color-com-img-bg-11) no-repeat  center / 0.2rem 18.88rem;
    background-position-y: calc(var(--per) * var(--num));
  }

  img {
    width: 98%;
    height: 98%;
  }
}
.beif_src {
  display: none;
}
.err_src {
  display: none;
  & + .beif_src {
    display: block;
  }
}
.pre-wrapper{
  font-weight: 500;
  font-size: 12px;
  .pre-button{
    display: flex;
    align-items: center;
  }
  .pre-cancle-button{
    height: 0.22rem;
    margin-left: 0.12rem;
    border-radius: 0.12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.14rem;
  }
}
</style>
