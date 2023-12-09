<!--
 * @Author:
 * @Date: 2021-03-21 09:53:26
 * @Description:
-->
<template>
  <div class="skeleton-wrap s-search" :style="{ top: loading_body ? '0rem' : '0.56rem', height: skeleton_height }">
    <div class="title" v-if="!loading_body">
      <skeleton :width="0.72" :height="0.1" :radius="5" />
      <skeleton :width="0.72" :height="0.1" :radius="5" />
      <skeleton :width="0.72" :height="0.1" :radius="5" />
      <skeleton :width="0.72" :height="0.1" :radius="5" />
    </div>

    <div class="wrap-first flex-a-c">
      <div>
        <skeleton :width="0.72" :height="0.1" :radius="5" />
      </div>
      <div>
        <skeleton :width="2" :height="0.1" :radius="5" />
      </div>
      <div>
        <skeleton :width="1.5" :height="0.1" :radius="5" />
      </div>
      <div>
        <skeleton :width="2" :height="0.1" :radius="5" />
      </div>
      <div>
        <skeleton :width="1.5" :height="0.1" :radius="5" />
      </div>
    </div>

    <div class="wrap-last">
      <div>
        <skeleton :width="0.72" :height="0.1" :radius="5" />
      </div>
      <div class="wrap-more">
        <div class="flex-a-c">
          <div>
            <skeleton :width="1.19" :height="0.1" :radius="5" />
          </div>
          <div>
            <skeleton :width="0.89" :height="0.1" :radius="5" />
          </div>
          <div>
            <skeleton :width="1.19" :height="0.1" :radius="5" />
          </div>
        </div>
        <div class="flex-a-c">
          <div>
            <skeleton :width="1.19" :height="0.1" :radius="5" />
          </div>
          <div>
            <skeleton :width="0.89" :height="0.1" :radius="5" />
          </div>
          <div>
            <skeleton :width="1.19" :height="0.1" :radius="5" />
          </div>
        </div>
      </div>
    </div>
    <div class="wrap-first flex-a-c">
      <div>
        <skeleton :width="0.72" :height="0.1" :radius="5" />
      </div>
      <div>
        <skeleton :width="2" :height="0.1" :radius="5" />
      </div>
      <div>
        <skeleton :width="1.5" :height="0.1" :radius="5" />
      </div>
      <div>
        <skeleton :width="2" :height="0.1" :radius="5" />
      </div>
      <div>
        <skeleton :width="1.5" :height="0.1" :radius="5" />
      </div>
    </div>
  </div>
</template>

<script setup>
import skeleton from './index.vue'
import { ref, onMounted } from 'vue';

const thumbStyle = ref({
  background: "transparent"
})
const skeleton_height = ref('1rem')
const props = defineProps({
  loading_body: Boolean
})
onMounted(() => {
  // 骨架屏高度计算 弹框的高度bounced_high - 头部tab高度 - 搜索框高度
  let rem_1 = window.innerWidth * 100 / 375;
  skeleton_height.value = window.innerHeight - rem_1 + 50 - rem(0.56 + 0.5) + 'px'
})
</script>

<style lang="scss" scoped>
.s-search {

  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0 0.07rem;
  transform: unset;

  .title {
    height: 0.44rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 0.13rem;
  }

  .wrap-first,
  .wrap-last {

    margin: 0 0 0.08rem 0;
    border-radius: 0.08rem;
  }

  .wrap-last {
    .wrap-more {
      display: flex;
    }
  }

  .flex-a-c>div,
  .wrap-last>div:first-child {
    height: 0.4rem;
    display: flex;
    align-items: center;

    :deep(.skeleton) {
      margin: 0 0.15rem;
    }
  }
}
</style>