<!--
 * @Author:
 * @Description: 热门榜单 骨架屏
-->
<template>
  <div class="list skeleton-wrap">
<!--    <div class="tab">-->
<!--      <div class="item" v-for="(item, index) in 5" :key="index">-->
<!--        <skeleton :width="0.22" :height="0.22" :radius="50"/>-->
<!--        <skeleton :width="0.2" :height="0.08" :radius="4"/>-->
<!--      </div>-->
<!--    </div>-->
    <div class="hot_list_title">
      <skeleton :width="1.4" :height="0.1" :radius="6"/>
      <skeleton :width="0.72" :height="0.1" :radius="6"/>
    </div>
    <div class="center">
      <div class="header-title">
        <skeleton :width="0.5" :height="0.1" :radius="6"/>
        <skeleton :width="0.4" :height="0.1" :radius="6" v-for="(item, index) in 4" :key="index"/>
      </div>
      <div class="center-main" v-for="(item, index) in 5" :key="index">
        <div>
          <div>
            <skeleton :width="0.2" :height="0.2" :radius="50"/>
            <skeleton :width="0.8" :height="0.1" :radius="6"/>
          </div>
          <skeleton :width="2.17" :height="0.1" :radius="6"/>
        </div>
        <div>
          <div>
            <skeleton :width="0.2" :height="0.2" :radius="50"/>
            <skeleton :width="0.5" :height="0.1" :radius="6"/>
          </div>
          <skeleton :width="2.17" :height="0.1" :radius="6"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import skeleton from '../index.vue'

</script>

<style lang="scss" scoped>
.list {
  top: 1.1rem;
  width:3.78rem;

  .tab {
    height: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.36rem;
    border-top: unset;
    box-shadow: unset;

    .item {
      margin-right: 0.48rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      & > div:first-child {
        margin-bottom: 0.07rem;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .hot_list_title {
    padding: 0.15rem 0.07rem 0.15rem 0.15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .center {

    border-radius: 0.08rem;
    margin: 0 0.07rem;
    padding: 0.15rem 0.08rem;

    .header-title {
      display: flex;
      align-items: center;
      justify-content: center;

      > .skeleton {
        margin-right: 0.2rem;

        &:nth-child(1) {
          margin-right: 0.78rem;
        }

        &:last-child {
          margin-right: unset;
        }
      }
    }

    .center-main {
      margin-top: 0.3rem;

      > div {
        display: flex;
        align-items: center;
        margin-top: 0.3rem;
        justify-content: space-between;

        > div {
          display: flex;
          align-items: center;

          > .skeleton {
            &:nth-child(2) {
              margin-left: 0.06rem;
            }
          }
        }
      }
    }
  }
}
</style>
