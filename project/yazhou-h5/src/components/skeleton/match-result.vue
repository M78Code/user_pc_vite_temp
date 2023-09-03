<!--
 * @Description:骨架
-->
<template>
  <div class="skeleton-wrap match_result"  :style="{top: loading_body? '1.7rem':'0'}" @touch.stop.prevent="">
    <template v-if="!loading_body">
      <div class="header-wrap">
        <div class="header">
          <div class="back" @click="router.go(-1)">
            <div class="back-btn"></div>
          </div>
          <skeleton :width="1.59" :height="0.1" :radius="5"/>
          <skeleton :width="0.18" :height="0.18" :radius="50"/>
        </div>
        <div class="s-rows">
          <div class="row-first">
            <skeleton :width="2.8" :height="0.1" :radius="5"/>
            <skeleton :width="0.4" :height="0.1" :radius="5"/>
          </div>
          <skeleton :width="3.55" :height="0.1" :radius="5"/>
        </div>
      </div>

      <div class="title">
        <skeleton :width="3.45" :height="0.1" :radius="5"/>
      </div>
    </template>
    <div v-for="(item,index) in 8" :key="index" class="item">
      <div class="flex-b">
        <skeleton :width="1.53" :height="0.1" :radius="5"/>
        <skeleton :width="0.3" :height="0.1" :radius="5"/>
      </div>
      <skeleton :width="3.55" :height="0.52" :radius="5"/>
    </div>

  </div>
</template>

<script setup>
import skeleton from './index.vue'
import { useRouter } from "vue-router"
let router = useRouter()
const props = defineProps({
  loading_body:Boolean
})
</script>

<style lang="scss" scoped>
.match_result {
  .header-wrap {
    padding: 0 0.2rem 0 0.1rem;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 0.44rem;

      .back {
        padding: 0 0.06rem;
        height: 100%;
        display: flex;
        align-items: center;

        .back-btn {
          width: 0.1rem;
          height: 0.18rem;
          background: var(--q-color-com-img-bg-3) no-repeat center / 100%;
        }
      }
    }

    .s-rows {
      height: 0.79rem;
      display: flex;
      justify-content: space-around;
      flex-direction: column;

      .row-first {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .title {
    display: flex;
    align-items: center;
    padding: 0 0.15rem;
    height: 0.46rem;
  }

  .item {

    padding: 0 0.1rem;

    .flex-b {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 0.1rem;
      height: 0.48rem;
    }
  }
}
</style>
