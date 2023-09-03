<template>
  <div class="skeleton-wrap record">
    <q-scroll-area :style="`height:100%`" :thumb-style="thumbStyle">
      <!-- <div class="date">
          <skeleton :width="0.74" :height="0.18" :radius="5"/>
      </div> -->
      <div class="item" v-for="(item,index) in 6" :key="index">
        <div class="title">
          <skeleton :width="0.2" :height="0.2" :radius="50"/>
          <skeleton :width="1.53" :height="0.1" :radius="5"/>
        </div>

        <div class="first">
          <skeleton :width="1.53" :height="0.1" :radius="5"/>
          <skeleton :width="0.68" :height="0.1" :radius="5"/>
        </div>
        <div class="info">
          <skeleton :width="1.95" :height="0.1" :radius="5"/>
          <skeleton :width="1.16" :height="0.1" :radius="5"/>
          <skeleton :width="3.25" :height="0.5" :radius="4"/>
          <skeleton :width="3.25" :height="0.1" :radius="5"/>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import skeleton from './index.vue'

const thumbStyle = ref({
  background: "transparent"
})
</script>

<style lang="scss" scoped>
.record {
  position: unset;
  transform: unset;
  height: 100%;
  width: 100%;

  padding-top: 0.16rem;

  .item {

    padding: 0 0.08rem;
    margin-bottom: 0.08rem;
    border-radius: 0.08rem;
    height: 2.12rem;

    .title {
      display: flex;
      align-items: center;
      height: 0.4rem;

      & > div:first-child {
        margin-right: 0.06rem;
      }
    }

    .first {
      margin-top: 0.14rem;
      display: flex;
      justify-content: space-between;
    }

    .info > div {
      margin-top: 0.14rem;

      &:nth-child(3) {
        margin-top: 0.17rem;
      }
    }
  }
}
</style>