<!--
 * @Author: cooper
 * @Date: 2023-06-013 14:13:55
 * @Description: 赛事分析页哪队能赢
-->
<template>
  <div class="analysis-team">
    <div class="analysis-team-l">
      <div>
        <span>{{ i18n_t("ouzhou.detail.which_team") }}Which team will</span>
        <span style="color: #ff7000"> {{ i18n_t("analysis.win_plate") }}</span>
      </div>
      <div class="analysis-switch-main">
        <div class="analysis-switch">
          <div class="analysis-switch-l to-collect">
            <q-img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/no_shoucan.png`" class="q-img" />
            <span>46%</span>
          </div>
          <div class="analysis-switch-r to-collect">
            <span>54%</span>
            <q-img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/shoucan.png`" class="q-img" />
          </div>
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/to_vs.png`" alt="" class="switch-img" />
        </div>
        <div class="analysis-btn">
          <div class="analysis-btn-box mr-8">
            <span>MIA</span>
            <span>3.56</span>
          </div>
          <div class="analysis-btn-box">
            <span>LAL</span>
            <span>1.89</span>
          </div>
        </div>
      </div>
    </div>
    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/trophy.png`" alt="" />
  </div>
  <div class="analysis-bottom">
    <div class="analysis-bottom-title">
      <span>{{ i18n_t("ouzhou.detail.keno_lottery") }}</span>
      <span>{{ i18n_t("ouzhou.detail.exciting_different") }}</span>
    </div>
    <div class="analysis-bottom-btn">
        Go In
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
// import trophy_img from "src/assets/images/trophy.png";
// import to_vs from "src/assets/images/to_vs.png";
// import no_shoucan from "src/assets/images/no_shoucan.png";
// import shoucan from "src/assets/images/shoucan.png";
</script>

<style lang="scss" scoped>
.analysis-team {
  margin-bottom: 10px;
  background: var(--q-gb-bg-c-4);
  display: flex;
  padding: 14px 0 0 20px;
  box-sizing: border-box;
  .analysis-team-l {
    width: 80%;
    font-size: 24px;
    font-weight: 700;
    color: #464646;
  }
  img {
    flex: 1;
  }
  .analysis-switch-main {
  }
  .analysis-switch {
    display: flex;
    margin-top: 30px;
    position: relative;
    .switch-img {
      position: absolute;
      left: 38%;
      top: -10px;
    }
    .to-collect {
      display: flex;
      align-items: center;
      .q-img {
        height: 24px;
        width: 26px;
        margin-top: 5px;
      }
      span {
        font-size: 20px;
        line-height: 22px;
        color: var(--q-gb-t-c-1);
        font-weight: 400;
      }
    }
  }
  .analysis-switch-l {
    padding-left: 15px;
    width: 50%;
    height: 50px;
    background: var(--q-gb-bg-lg-6);
    clip-path: polygon(0 1%, 100% 1%, 95% 100%, 0% 100%);
    margin-right: -5px;
  }
  .analysis-switch-r {
    padding-right: 15px;
    display: flex;
    justify-content: flex-end;
    width: 50%;
    height: 50px;
    background: var(--q-gb-bg-lg-7);
    clip-path: polygon(5% 0, 100% 1%, 100% 100%, 0 98%);
  }
}
.analysis-btn {
  display: flex;
  margin-top: 10px;
  font-weight: 400;

  .analysis-btn-box {
    width: 48%;
    height: 48px;
    background: var(--q-gb-bg-c-14);
    border: 1px solid var(--q-gb-bd-c-4);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 18px;
    color: #401c00;
    span:nth-child(2) {
      color: #401c00;
    }
  }
  .mr-8 {
    margin-right: 8px;
  }
}

.analysis-bottom {
  margin-bottom: 10px;
  height: 150px;
  background: var(--q-gb-bg-c-4);
  padding: 14px 0 0 20px;
  box-sizing: border-box;
  // background-image: url("src/assets/images/keno.png");
  background-repeat: no-repeat;
  background-position: right;
  .analysis-bottom-title {
    display: flex;
    flex-direction: column;
    span:nth-child(1) {
      font-weight: 700;
      font-size: 24px;
      line-height: 29px;
      color: #464646;
    }
    span:nth-child(2) {
      margin-top: 8px;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: var(--q-gb-t-c-8);
    }
  }
  .analysis-bottom-btn {
    margin-top: 26px;
    width: 90px;
    height: 29px;
    border: 0.5px solid var(--q-gb-bd-c-1);
    border-radius: 20px;
    background: rgba(255, 112, 0, 0.02);
    color: var(--q-gb-t-c-2);;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>