<!--
 * @Author: MasterJ
 * @Date: 2022-08-27 14:45
 * @Description TODO
-->
<template>
  <div class="stats-wrapper">
    <!-- 统计数据 标题 -->
    <panel-header 
        v-if="show_header"
        :title="i18n_t('common.panel_total')" icon="stats">
      <template v-slot:append>
        <div class="square-wrapper flex flex-center" v-if="$is_show_sr_flg(match_info)" @click="sr_click_handle">
          <icon size="12px" name="icon-signal" />
          <q-tooltip anchor="top middle" self="center middle" :content-style="tooltip_style">{{i18n_t('common.analysis')}}</q-tooltip>
        </div>
      </template>
    </panel-header>

    <!-- 统计数据 图表 -->
    <chart class="total_chart" :match_info="match_info" />
  </div>
</template>

<script>
import panel_header from "src/project/yabo/components/match_details/panel/components/panel_header";
import chart from "src/project/yabo/components/match_details/match_info/chart";
import details from "src/public/utils/detailsClass/details.js";

export default {
  name: "stats",
  components: {
    'panel-header': panel_header,
    chart
  },
  props: {
    show_header: {
      type: Boolean,
      default: true
    },
    match_info: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * @Description:跳转数据分析
     * @return {undefined} undefined
     */
    sr_click_handle(){
      details.sr_click_handle(this.match_info)
    },
  }
}
</script>

<style scoped lang="scss">
.stats-wrapper {
  border-radius: 8px;
  overflow: hidden;
  .square-wrapper {
    width: 20px;
    height: 20px;
    margin-left: auto;
    margin-right: 16px;
    border-radius: 6px;
    cursor: pointer;
  }
}
</style>