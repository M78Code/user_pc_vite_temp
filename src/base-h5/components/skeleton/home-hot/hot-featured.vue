<!--
 * @Author:
 * @Description: 热门精选 骨架屏
-->
<template>
  <div class="list skeleton-wrap" :style="{top: first ? '.45rem':'1.1rem'}">
    <div class="tab" v-if="first">
      <div class="item" v-for="(item, index) in 5" :key="index">
        <skeleton :width="0.22" :height="0.22" :radius="50"/>
        <skeleton :width="0.2" :height="0.08" :radius="4"/>
      </div>
    </div>

    <div class="hot-featured">
      <skeleton class="hot-featured-title" :width="1.4" :height="0.1" :radius="6"/>
      <div class="carousel">
        <skeleton :width="1.77" :height="0.98" :radius="4"/>
        <skeleton :width="1.77" :height="0.98" :radius="4"/>
      </div>
    </div>

    <skeleton class="hot-featured-title" :width="1.4" :height="0.1" :radius="6"/>
    <!-- 标准版 -->
    <div class="version_biaozhun" v-if="PageSourceData.newer_standard_edition == 2">
      <div v-for="(item, index) in 3" :key="index" class="item">
        <skeleton class="title-url" :width="3.45" :height="0.4" :radius="20"/>
        <div class="info">
          <skeleton :width="3.19" :height="0.1" :radius="6"/>
        </div>
        <div class="wrap">
          <div class="left">
            <skeleton :width="0.93" :height="0.1" :radius="6"/>
            <skeleton :width="1.51" :height="0.1" :radius="6"/>
            <skeleton :width="1.51" :height="0.1" :radius="6"/>
            <skeleton :width="1.1" :height="0.1" :radius="6"/>
          </div>
          <div class="content">
            <skeleton :width="1.84" :height="0.1" :radius="6"/>
            <div class="content-wrap">
              <div>
                <skeleton :width="0.6" :height="0.32" :radius="2"/>
                <skeleton :width="0.6" :height="0.32" :radius="2"/>
                <skeleton :width="0.6" :height="0.32" :radius="2"/>
              </div>
              <div>
                <skeleton :width="0.6" :height="0.49" :radius="2"/>
                <skeleton :width="0.6" :height="0.49" :radius="2"/>
              </div>
              <div>
                <skeleton :width="0.6" :height="0.49" :radius="2"/>
                <skeleton :width="0.6" :height="0.49" :radius="2"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 简版 -->
    <div class="version_jian" v-if="PageSourceData.newer_standard_edition == 1">
      <div v-for="(item, index) in 3" :key="index" class="item">
        <skeleton class="title-url" :width="3.45" :height="0.4" :radius="20"/>
        <div class="info">
          <div class="center">
            <div class="center-left">
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
            </div>
            <skeleton :width="1.7" :height="0.56" :radius="4"/>
          </div>
          <skeleton :width="3.45" :height="0.1" :radius="6"/>
        </div>
        <div class="info">
          <div class="center">
            <div class="center-left">
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
            </div>
            <skeleton :width="1.7" :height="0.56" :radius="4"/>
          </div>
          <skeleton :width="3.45" :height="0.1" :radius="6"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import skeleton from '../index.vue'
import PageSourceData from "src/core/page-source/page-source.js";

const props = defineProps({
  first: Boolean,
})
</script>

<style lang="scss" scoped>
.list {
  top: 0.45rem;
  width:3.78rem;

  .tab {
    height: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.36rem;
    margin-bottom: 0.08rem;
    border-top: unset;
    box-shadow: unset;

    .item {
      margin-right: 0.48rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;

      & > div:first-child {
        margin-bottom: 0.07rem;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .hot-featured {
    margin-bottom: 0.08rem;

    .carousel {
      display: flex;
      justify-content: center;
      align-items: center;

      .skeleton {
        margin-right: 0.05rem;

        &:nth-child(2) {
          margin-right: unset;
        }
      }
    }
  }

  .hot-featured-title {
    margin: 0.2rem 0 0.1rem 0.15rem;
  }

  .version_jian {
    padding: 0 0.07rem;
    margin-top: 0.32rem;

    .item {
      padding: 0.25rem 0.08rem 0 0.08rem;
      margin-bottom: 0.36rem;
      border-radius: 0.08rem;
      position: relative;

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

            & > div:first-child {
              margin-bottom: 0.16rem;
            }
          }
        }
      }
    }
  }

  .title-url {
    position: absolute;
    top: -0.21rem;
  }

  .version_biaozhun {
    padding: 0 0.07rem;
    width: 100%;
    margin-top: 0.32rem;

    .item {
      width: 100%;
      padding: 0.25rem 0.08rem 0 0.08rem;
      margin-bottom: 0.36rem;
      border-radius: 0.08rem;
      position: relative;

      .title {
        display: flex;
        align-items: center;
        height: 0.4rem;

        & > div:first-child {
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
          margin-right: 0.1rem;

          & > div {
            margin-bottom: 0.24rem;

            &:first-child, &:last-child {
              margin-bottom: 0.2rem;
            }
          }
        }

        .content {
          & > div:first-child {
            margin-bottom: 0.1rem;
          }

          .content-wrap {
            display: flex;

            & > div {
              margin-right: 0.02rem;

              &:last-child {
                margin-right: 0;
              }

              & > div {
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
</style>
