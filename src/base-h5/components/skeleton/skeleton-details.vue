<template>
  <div class="skeleton-wrap s-details">
    <div class="detail_wrap-header">
      <div class="header">
        <div class="back" @click="$common.go_where({ back_to: 'go_to_back' })">
          <div class="back-btn"></div>
        </div>
        <skeleton :width="0.18" :height="0.18" :radius="50" />
      </div>

      <div class="info">
        <div class="both">
          <skeleton :width="0.44" :height="0.44" :radius="50" />
          <skeleton :width="0.82" :height="0.1" :radius="5" />
          <skeleton :width="0.6" :height="0.1" :radius="5" />
        </div>
        <skeleton :width="0.85" :height="0.1" :radius="5" class="info-center" />
        <div class="both">
          <skeleton :width="0.44" :height="0.44" :radius="50" />
          <skeleton :width="0.82" :height="0.1" :radius="5" />
          <skeleton :width="0.6" :height="0.1" :radius="5" />
        </div>
      </div>

      <skeleton :width="1.59" :height="0.1" :radius="5" class="last" />
    </div>

    <div class="handicap">
      <div class="tab">
        <skeleton :width="3.45" :height="0.1" :radius="6" />
      </div>
      <div class="wrap">
        <div class="item" v-for="(item, index) in 6" :key="index">
          <div class="first">
            <skeleton :width="1.53" :height="0.1" :radius="5" />
            <skeleton :width="0.3" :height="0.1" :radius="5" />
          </div>
          <skeleton :width="3.55" :height="0.52" :radius="4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import skeleton from './index.vue'


// ...mapGetters([
//   // 视频是否关闭
//   "get_is_close_video",
//   // 菜单类型，收藏菜单为6
//   "get_menu_type",
//   // 是否从首页轮播区域跳转到详情
//   "get_is_banner_jump",
// ])
</script>

<style lang="scss" scoped>
.s-details {
  top: 0;
  bottom: unset;
  background: var(--q-color-skeleton-bg-3);

  .detail_wrap-header {

    height: 2.11rem;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.2rem 0 0.1rem;
    height: 0.44rem;

    .back {
      padding: 0 0.1rem;
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

  .info {
    margin: 0.06rem 0 0.34rem;
    padding: 0 0.33rem;
    display: flex;

    .both {
      display: flex;
      flex-direction: column;
      align-items: center;

      &>div {
        &:first-child {
          margin-bottom: 0.12rem;
        }

        &:nth-child(2) {
          margin-bottom: 0.1rem;
        }
      }
    }

    .info-center {
      margin: 0.18rem 0.3rem 0;
    }
  }

  .last {
    margin: 0 auto;
  }
}

.handicap {
  padding: 0 0.1rem;

  .tab {
    height: 0.46rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wrap {
    .first {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.48rem;
      padding-left: 0.1rem;
    }
  }
}
</style>
