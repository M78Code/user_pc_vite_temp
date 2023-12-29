<template>
  <!--赛事列表骨架屏-->
  <div class="outter-wrap skeleton-wrap" :style="{ paddingTop: poisition_top }" @touch.stop.prevent="">
    <div class="list">
      <div class="tab" v-if="!loading_body">
        <div class="item" v-for="(item, index) in 5" :key="index">
          <skeleton :width="0.22" :height="0.22" :radius="50" />
          <skeleton :width="0.2" :height="0.08" :radius="4" />
        </div>
      </div>

      <!-- 标准版 -->
      <div class="version_biaozhun" v-if="PageSourceData.newer_standard_edition == 2">
        <div v-for="(item, index) in 4" :key="index" class="item">
          <div class="title">
            <skeleton :width="0.2" :height="0.2" :radius="50" />
            <skeleton :width="1.4" :height="0.1" :radius="6" />
          </div>
          <div class="info">
            <skeleton :width="3.19" :height="0.1" :radius="6" />
          </div>
          <div class="wrap">
            <div class="left">
              <skeleton :width="0.93" :height="0.1" :radius="6" />
              <skeleton :width="1.51" :height="0.1" :radius="6" />
              <skeleton :width="1.51" :height="0.1" :radius="6" />
              <skeleton :width="1.1" :height="0.1" :radius="6" />
            </div>
            <div class="content">
              <skeleton :width="1.84" :height="0.1" :radius="6" />
              <div class="content-wrap">
                <div>
                  <skeleton :width="0.6" :height="0.32" :radius="2" />
                  <skeleton :width="0.6" :height="0.32" :radius="2" />
                  <skeleton :width="0.6" :height="0.32" :radius="2" />
                </div>
                <div>
                  <skeleton :width="0.6" :height="0.49" :radius="2" />
                  <skeleton :width="0.6" :height="0.49" :radius="2" />
                </div>
                <div>
                  <skeleton :width="0.6" :height="0.49" :radius="2" />
                  <skeleton :width="0.6" :height="0.49" :radius="2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 简版 -->
      <div class="version_jian" v-if="PageSourceData.newer_standard_edition == 1">
        <div v-for="(item, index) in 4" :key="index" class="item">
          <div class="title">
            <skeleton :width="0.2" :height="0.2" :radius="50" />
            <skeleton :width="1.4" :height="0.1" :radius="6" />
          </div>

          <div class="info">
            <div class="center">
              <div class="center-left">
                <skeleton :width="1.51" :height="0.1" :radius="6" />
                <skeleton :width="1.51" :height="0.1" :radius="6" />
              </div>
              <skeleton :width="1.7" :height="0.56" :radius="4" />
            </div>
            <skeleton :width="3.45" :height="0.1" :radius="6" />
          </div>
          <div class="info">
            <div class="center">
              <div class="center-left">
                <skeleton :width="1.51" :height="0.1" :radius="6" />
                <skeleton :width="1.51" :height="0.1" :radius="6" />
              </div>
              <skeleton :width="1.7" :height="0.56" :radius="4" />
            </div>
            <skeleton :width="3.45" :height="0.1" :radius="6" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import skeleton from './index.vue'
import { MenuData } from "src/output/index.js";
import PageSourceData from "src/core/page-source/page-source.js";
const props = defineProps({
  loading_body: Boolean
})

const poisition_top = computed(() => {
  const menu_type = MenuData.current_menu
  if ([4, 11, 3000].includes(menu_type)) {
    return '1.33rem';
  }

  if (props.loading_body) {
    // 赛果
    if (menu_type === 28) {
      return '1.4rem';
    }
    // 今日
    else if (menu_type === 3) {
      return '1.05rem'
    }
    // 竞足
    else if (menu_type === 30) {
      return '0.4rem';
    }
    // 冠军
    else if (menu_type === 100) {
      return '1.07rem';
    }
    else {
      return '1.1rem';
    }
  }

  return '.44rem';
})

</script>

<style lang="scss" scoped>
.list {
  top: 0;

  .tab {
    height: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.36rem;
    margin-bottom: 0.08rem;

    .item {
      margin-right: 0.48rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      &>div:first-child {
        margin-bottom: 0.07rem;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .version_jian {
    padding: 0 0.07rem;

    .item {
      padding: 0 0.08rem;
      margin-bottom: 0.08rem;
      border-radius: 0.08rem;

      .title {
        display: flex;
        align-items: center;
        height: 0.4rem;

        &>div:first-child {
          margin-right: 0.06rem;
        }
      }

      .info {
        height: 1rem;
        padding: 0.1rem 0 0.12rem;

        .center {
          display: flex;
          align-items: center;
          margin-bottom: 0.12rem;

          .center-left {
            margin-right: 0.24rem;
            display: flex;
            flex-direction: column;
            justify-content: center;

            &>div:first-child {
              margin-bottom: 0.16rem;
            }
          }
        }
      }
    }
  }

  .version_biaozhun {
    padding: 0 0.07rem;
    width: 100%;

    .item {
      width: 100%;
      padding: 0 0.08rem;
      margin-bottom: 0.08rem;
      border-radius: 0.08rem;
      background-color: var(--q-gb-bg-c-28);

      .title {
        display: flex;
        align-items: center;
        height: 0.4rem;

        &>div:first-child {
          margin-right: 0.06rem;
        }
      }

      .info {
        height: 0.24rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .wrap {
        height: 1.4rem;
        display: flex;
        justify-content: space-between;
        padding-top: 0.1rem;

        .left {
          margin-right: auto;

          &>div {
            margin-bottom: 0.24rem;

            &:first-child,
            &:last-child {
              margin-bottom: 0.2rem;
            }
          }
        }

        .content {
          &>div:first-child {
            margin-bottom: 0.1rem;
          }

          .content-wrap {
            display: flex;

            &>div {
              margin-right: 0.02rem;

              &:last-child {
                margin-right: 0;
              }

              &>div {
                margin-bottom: 0.02rem;

                &:last-child {
                  margin-bottom: 0;
                }
              }
            }
          }
        }
      }
    }
  }
}

.skeleton-wrap {
  z-index: 350 !important;
}
</style>