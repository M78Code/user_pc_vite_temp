<!--
 * @Author: ladron
 * @Date: 2020-12-27 11:34:53
 * @Description: 球类 排行榜页面 只需要传个 tid 联赛id进来
-->
<template>
  <div class="ranking_list hairline-border">
    <!-- <span class="navigation-title">{{ i18n_t('virtual_sports.leaderboard') }}</span> -->
    <!-- header -->
    <div v-if="0" class="header">
      <div class="col1"></div>
      <div class="col2">{{ i18n_t('virtual_sports.team') }}</div>
      <div class="col3">{{ i18n_t('virtual_sports.game') }}</div>
      <div class="col4">{{ i18n_t('virtual_sports.win_tie_loss') }}</div>
      <div class="col5">{{ i18n_t('virtual_sports.integral') }}</div>
    </div>
    <!-- 小组 -->
    <div  class="group-item" v-if="0 && !no_data">
      <div class="team-item" v-for="(item, i) in ranking_data" :key="i">
        <div class="col1">{{+i + 1}}</div>
        <div class="col2 ellipsis">
          {{item.virtualTeamName}}
        </div>
        <div class="col3">{{ item.totalCount }}</div>
        <div class="col4">{{ item.winDrawLostDescription }}</div>
        <div class="col5">{{ item.points }}</div>
      </div>
    </div>
    <!-- 没有数据 组件 -->
    <no-data v-if="no_data" which='noMatch' height='500' class="no-list"></no-data>
  </div>
</template>

<script setup>
import { api_virtual } from "src/api/index.js";
import noData from "src/base-h5/components/common/no-data.vue";
import { onUnmounted,watch,ref } from 'vue';
import { i18n_t } from "src/output/index.js"

const props = defineProps({
  tid: {
    type:String,
    default: null,
    require: true
  },
})

const no_data = ref(false)
const ranking_data = ref([])
const get_list = async () => {
  try {
    let {code , data} = await api_virtual.get_virtual_sport_team_ranking({tid: props.tid})
    if(code == 200) {
      if (data && data.length > 0) {
        ranking_data.value = data
      }else {
        no_data.value = true
      }
    }
  } catch (error) {
    no_data.value = true
    console.error(error);
  }
}
watch(() => props.tid, () => {
  get_list()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.ranking_list {
  // padding-top: 0.04rem;
  background-color: var(--q-gb-bg-c-15);
  color: #303442; // #TODO: css var
  padding: 0 .09rem;
  .navigation-title {

    font-size: 0.15rem;

    display: block;
    position: relative;
    margin: 0 0 0.15rem;
    padding-left: 0.28rem;
    font-weight: 700;

    &:before {
      content: "";
      width: 0.03rem;
      height: 0.14rem;
      position: absolute;
      left: 0.17rem;
      top: 0.035rem;

      border-radius: 1.5px;
    }
  }

  .col1 {
    flex: 20;
  }

  .col2 {
    flex: 112;
    text-align: left;
    display: unset !important; /*  避免flex 没有显示省略号 */
  }
  /*  3~8 总宽度220px */
  .col3 {
    flex: 78;
  }

  .col4 {
    flex: 78;
  }

  .col5 {
    flex: 59;
    text-align: right;
    width: 100%;
  }

  .col6 {
    flex: 1;
    height: 100%;
    text-align: center;
  }

  /*  头部 */
  .header {
    // height: 0.32rem;
    padding: .13rem 0rem;
    display: flex;
    text-align: center;
    // line-height: 0.32rem;
    > div {
      font-size: 0.10rem;
    }
  }
  .header,.team-item{
    --private-padding-y: 0.04rem;
    padding-left: var(--private-padding-y);
    padding-right: var(--private-padding-y);
  }

  .group-name {
    height: 0.40rem;
    line-height: 0.40rem;
    padding-left: 0.15rem;
    font-size: 0.14rem;
    margin-bottom: 0.07rem;
  }

  .team-item {
    display: flex;
    align-items: center;
    font-size: 0.12rem;
    height: 0.40rem;
    text-align: center;
    border-top: 0.005rem solid var(--q-gb-bg-c-18);
    &:last-child{
      // border-bottom: 0.005rem solid var(--q-gb-bg-c-18);
    }
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.12rem;
      font-weight: 500;
    }

    &:nth-child(-n+3) {
      div {
        // font-size: 0.14rem;
        // color: var(--q-color-fs-color-3);
      }
    }

    .col1 {
      font-size: 0.12rem;
      text-align: right;
    }

    .col2 {
      justify-content: inherit;
      font-weight: 800;
    }
    .col5{
      justify-content: flex-end;
    }
  }
}
</style>