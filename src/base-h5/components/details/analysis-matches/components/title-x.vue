<template>
  <div class="title">
    <div class="hengping-title row">
      <!-- 返回按钮 -->
      <div class="video_back yb_mx10" @click="handle_callback" style="height: 0.16rem"></div>
      <!-- 对阵信息 -->
      <span class="hengping-duiming ellipsis">{{get_detail_data.mhn}}</span>
      <span :style="{visibility: get_detail_data.ms == 110 ? 'hidden':'visible'}" class="score-title yb_mx4">{{ match_score }}</span>
      <span class="hengping-duiming ellipsis">{{get_detail_data.man}}</span>
      <!-- 比分 -->
      <div style="margin-left:auto">
        <match-score :detail_data="get_detail_data"></match-score>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { mapGetters } from "vuex";
import { computed, ref, toRefs } from 'vue'
import loadsh from 'lodash'
import matchScore from 'src/base-h5/components/match/match-score.vue' // 比分组件
  // name: "title_x",
  // components: {
  //   matchScore,
  // },
  const props = defineProps({
    get_detail_data: {
      type: Object,
      default: {}
    }
  })
  const handle_callback = () => {
    // TODO: 后续修改调整 $emit
      emit('handle_callback')
    }
  const match_score = computed(() =>{
      let msc = '0 v 0'
      !loadsh.isEmpty(props.get_detail_data) && props.get_detail_data.msc.map(item => {
        if (item.indexOf('S1|') > -1) {
          msc = item.split('|')[1].split(':').join(' v ')
        }
      })
      return msc
    })
  // computed: {
  //   match_score() ,
  // },
  // methods: {
  //   handle_callback() {
  //     this.$emit('handle_callback')
  //   },
  // }

</script>

<style scoped lang="scss">
.title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.44rem;
  color: var(--q-gb-t-c-18);
  box-shadow: var(--q-color-com-box-shadow-11);
  z-index: 100000;
  .hengping-title {
    height: 100%;
    align-items: center;
    span {
      display: inline-block;
      font-size: 0.14rem;
    }
    .hengping-duiming {
      max-width: 20vw;
    }
  }
  .score-title {
    color: var(--q-color-fs-color-50);
  }
  .video_back {
    display: inline-block;
    width: 0.12rem;
    height: 0.16rem;
    background-image: var(--q-color-com-img-bg-3);
    background-size: 100% 100%;
  }
}
</style>