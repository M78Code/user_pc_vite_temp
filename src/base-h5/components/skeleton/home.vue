<!--
 * @Author:
 * @Description:  首页骨架屏
-->
<template>
  <div class="skeleton-wrap wrap" v-if="isshow">
    <skeleton class="carousel" :width="3.6" :height="1.6" :radius="10" />

    <div class="info">
      <div class="banlance">
        <skeleton :width="0.6" :height="0.14" :radius="12.5" />
        <skeleton :width="0.7" :height="0.14" :radius="12.5" />
      </div>
      <skeleton class="marquee" :width="2.76" :height="0.32" :radius="12.5" />
    </div>
    <div class="menu">
      <div class="side_menu">
        <skeleton :width="0.55" :height="0.6" :radius="8" v-for="(item, index) in 6" :key="index" />
      </div>
      <div class="right_menu">
        <skeleton :width="2.9" :height="1.2" :radius="8" v-for="(item, index) in 4" :key="index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import skeleton from './index.vue'
import { ref, onMounted,watch,computed,onUnmounted } from 'vue';
import { useMitt, MITT_TYPES } from "src/core/mitt/index.js"

const status = ref({
  carousel: false,
  menu: false
})

const isshow = ref(true)

const api_load = (data) => {
  Object.assign(status.value, data)
  if (status.value.carousel && status.value.menu) {
    isshow.value = false
  }
}
onMounted(() => {
  useMitt(MITT_TYPES.EMIT_API_LOAD, api_load)
})

</script>

<style lang="scss" scoped>
.wrap {
  top: 0.35rem;
  padding: 0 0.08rem 0 0.08rem;
  margin-top: 0.12rem;
  width: 3.78rem;
}

.carousel {
  margin-bottom: 0.15rem;
}

.info {

  height: 0.34rem;
  display: flex;
  align-content: center;
  margin-bottom: 0.1rem;

  .banlance {
    &>div {
      border-radius: 0.125rem;

      &:first-child {
        margin-bottom: 0.05rem;
        margin-top: 0.02rem;
      }
    }
  }

  .marquee {
    margin-left: 0.12rem;
    flex: 1;
    height: 0.25rem;
    border-radius: 0.125rem;
  }
}

.menu {
  display: flex;

  .side_menu {
    margin-right: 0.1rem;

    &>div {
      margin-bottom: 0.08rem;
    }
  }

  .right_menu>div {
    margin-bottom: 0.08rem;
  }
}
</style>
