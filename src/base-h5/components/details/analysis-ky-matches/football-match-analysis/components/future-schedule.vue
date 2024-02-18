<!--
 * @Author:
 * @Date:
 * @Description: 详情页 或者 赛果  足球
-->
<template>
  <div class="future-schedule football_standings recent_record" v-if="Object.keys(data_).length > 0">
    <div class="title">
      {{ i18n_t('analysis_football_matches.Future_schedule') }}
    </div>

    <template v-for="(item, key, index) in data_" :key="index">
      <div class="technical-home team-recent">
        <template v-if="index == 1">
          <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
          <team-img :type="0" :csid="get_detail_data.csid" :url="get_detail_data.mhlu[0]" :fr="get_detail_data.frmhn[0]"
            :size="22"></team-img>
          <team-img v-if="get_detail_data.mhlu.length > 1" :type="0" :csid="get_detail_data.csid"
            :url="get_detail_data.mhlu[1]" :fr="get_detail_data.frmhn[1]" :size="22"
            style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          <span class="team-name">{{ get_detail_data.mhn }}</span>
        </template>
        <template v-if="index == 2">
          <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
          <team-img :type="1" :csid="get_detail_data.csid" :url="get_detail_data.malu[0]" :fr="get_detail_data.frman[0]"
            :size="22"></team-img>
          <team-img v-if="get_detail_data.malu.length > 1" :type="1" :csid="get_detail_data.csid"
            :url="get_detail_data.malu[1]" :fr="get_detail_data.frman[1]" :size="22"
            style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          <span class="team-name">{{ get_detail_data.man }}</span>
        </template>
      </div>
      <public-form :liat_data="item"
        :hm_index_name="index == 1 ? get_detail_data.mhn : index == 2 ? get_detail_data.man : ''"
        future_schedule="future_schedule" />
    </template>
  </div>
</template>

<script setup>
import { defineComponent, ref, onMounted } from 'vue'
// 详情页蓝色背景上的大型字母图标
import teamImg from "src/base-h5/components/details/team-img.vue";
// TODO: 后续修改调整
// import {mapGetters} from "vuex";
// 详情页  足球赛事分析 战绩 模块里边的 公共列表
import publicForm from "src/base-h5/components/details/analysis-matches/components/public-form.vue";
import { i18n_t } from "src/boot/i18n.js"
const get_detail_data = ref({
        csid: '1',
        mid: '1',
    })

  // components: {
  //   "team-img": team_img,
  //   "public-form": public_form,
  // },
  const data_ = ref({})
  const props = defineProps({
    // 基本面的数据
    future_schedule_data: {
      type: Object,
      default: () => {},
    },
  })
  onMounted(() => {
    data_.value = props.future_schedule_data
  })
  // TODO: 后续修改调整
  // computed: {
  //   ...mapGetters(['get_goto_detail_matchid', 'get_detail_data'])
  // },

</script>

<style lang="scss" scoped>
.future-schedule {
  margin-top: 0.1rem;

  .title {
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 0.24rem;
    font-size: 0.14rem;
    letter-spacing: 0;
    font-weight: bold;
    position: relative;

    &:before {
      content: '';
      width: 0.03rem;
      height: 0.12rem;
      position: absolute;
      left: 0.16rem;
      top: 0.14rem;
      border-radius: 1.5px;
    }
  }

  .technical-home {
    height: 0.4rem;

    display: flex;
    align-items: center;
    padding-left: 0.1rem;

    :deep(.team-img) {
      width: 0.2rem;
      height: 0.2rem;
      margin: 0.05rem;

      img {
        width: 0.2rem;
        height: 0.2rem;
        position: relative;
        border-radius: 50%;
      }
    }

    .team-name {
      font-size: 0.12rem;
      color: var(--q-gb-t-c-4);
      font-weight: bold;
      line-height: 0.12rem;
    }
  }
}
</style>
