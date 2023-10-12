<template>
  <div class="skeleton-wrap live">
    <div class="top">
      <skeleton :width="3.35" :height="0.08" :radius="5" />
    </div>

    <div class="list">
      <div class="side_list">
        <q-scroll-area :style="`height:100%`" :thumb-style="thumbStyle">
          <div class="item" v-for="(item, index) in 11" :key="index">
            <skeleton :width="0.16" :height="0.16" :radius="50" />
            <skeleton :width="0.36" :height="0.1" :radius="5" />
          </div>
        </q-scroll-area>
      </div>

      <div class="center_list">
        <q-scroll-area :style="`height:100%`" :thumb-style="thumbStyle">
          <div class="item" v-for="(item, index) in 20" :key="index">
            <skeleton :width="1.2" :height="0.68" :radius="4" />
            <div class="item_right">
              <skeleton :width="1.31" :height="0.1" :radius="5" />
              <skeleton :width="1.31" :height="0.1" :radius="5" />
              <skeleton :width="0.8" :height="0.1" :radius="4" />
            </div>
          </div>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script setup>
import skeleton from './index.vue'
import { ref, onMounted,watch,computed,onUnmounted } from 'vue';

const thumbStyle = ref({
  background: "transparent"
})
</script>

<style lang="scss" scoped>
.live {
  width: 3.78rem;
  top: 0.45rem;
  display: flex;
  flex-direction: column;
  background: var(--q-gb-bg-c-17);
}

.top {
  width: 100%;
  height: 0.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

.list {
  flex: 1;
  padding: 0.23rem 0.2rem 0;
  display: flex;
  overflow: hidden;

  .side_list {
    width: 0.58rem;
    margin-right: 0.18rem;

    .item {
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;

      &>div:last-child {
        margin-left: 0.06rem;
      }
    }
  }

  .center_list {
    flex: 1;

    .item {
      display: flex;
      margin-bottom: 0.28rem;

      .item_right {
        margin-left: 0.08rem;
        display: flex;
        flex-direction: column;
        justify-content: center;

        &>div {
          margin-bottom: 0.13rem;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
