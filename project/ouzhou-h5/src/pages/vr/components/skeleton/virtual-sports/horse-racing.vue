<template>
  <div class="skeleton-wrap virtual">
    <q-scroll-area :style="`height:100%`" :thumb-style="thumbStyle">
      <div class="center">
        <div class="first">
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
        </div>
        <div class="rect row justify-center">
          <skeleton :width="3.59" :height="2.1" :radius="5"/>
        </div>
        <div class="first">
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
        </div>
      </div>
      <!-- 标准版 -->
      <div class="version_biaozhun">
        <div v-for="(item, index) in 5" :key="index" class="item">
          <div class="wrap">
            <div class="left">
              <skeleton :width="2.6" :height="0.1" :radius="6"/>
              <skeleton :width="3.45" :height="0.1" :radius="6"/>
              <skeleton :width="3.45" :height="0.1" :radius="6"/>
            </div>
          </div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import skeleton from 'project/ouzhou-h5/src/pages/vr/components/skeleton/index.vue'

export default {
  components:{ skeleton },
  data(){
    return {
      thumbStyle:{
        background: "transparent"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.virtual {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0.92rem;
  width: 3.75rem;
  height: 100%;
  transform: unset;

  .center {
    margin-bottom: 0.08rem;
    background: #fff;

    .first {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 0.4rem;

      & > div {
        margin-right: 0.15rem;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .rect {
      height: 2.1rem;
      width: 3.75rem;
    }
  }

  .version_biaozhun {
    padding: 0 0.07rem;
    margin-bottom: 0.4rem;

    .item {
      padding: 0 0.08rem;
      border-radius: 0.08rem;

      .wrap {
        height: 1.2rem;
        display: flex;
        justify-content: space-between;
        padding-top: 0.1rem;

        .left {
          margin-right: 0.1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
      }
    }
  }
}
</style>
