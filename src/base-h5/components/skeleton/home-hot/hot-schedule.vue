<!--
 * @Author:
 * @Date: 2021-03-21 09:53:26
 * @Description: 热门赛程 骨架屏
-->
<template>
  <div class="list skeleton-wrap">
    <div class="hot_list_title">
      <skeleton :width="1.4" :height="0.1" :radius="6"/>
      <skeleton :width="0.72" :height="0.1" :radius="6"/>
    </div>
    <!-- 标准版 -->
    <div class="version_biaozhun" v-if="PageSourceData.newer_standard_edition == 2">
      <div v-for="(item, index) in 3" :key="index" class="item">
        <div class="title">
          <skeleton :width="0.2" :height="0.2" :radius="50"/>
          <skeleton :width="1.4" :height="0.1" :radius="6"/>
        </div>
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
        <div class="title">
          <skeleton :width="0.2" :height="0.2" :radius="50"/>
          <skeleton :width="1.4" :height="0.1" :radius="6"/>
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

</script>

<style lang="scss" scoped>
.list {
  top: 1.1rem;
  width:3.78rem;

  .hot_list_title {
    padding: 0.15rem 0.07rem 0.15rem 0.15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

        & > div:first-child {
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

            & > div:first-child {
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
