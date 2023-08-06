<!--
 * @Author: cooper
 * @Date: 2023-08-05 15:13:55
 * @Description:详情页头部
-->

<template>
  <div class="">
    <!-- 顶部栏 -->
    <div class="wrap-title" ref="wrap_title">
      <!-- 返回按钮 -->
      <div class="group-back cursor-pointer" @click.stop="back_to">
        <icon name="icon-back" class="back" color="#ABBAC8" />
      </div>
      <!-- 联赛标题 -->
      <div class="title ellipsis allow-user-select">
        {{ match_infoData.tn }}
      </div>
      <div class="right-icon">
        <!-- 显示比分栏 -->
        <span v-if="!toggle_panel" @click="toggle_panel = true">{{
          $root.$t("common.show_score_panel")
        }}</span>
        <!-- 打开赛事分析窗口 -->
        <div
          class="sr-link-icon-w"
          v-if="$utils.is_show_sr_flg(match_infoData)"
          @click.stop="sr_click_handle(match_infoData, 'details')"
          v-tooltip="{ content: $root.$t('common.analysis') }"
        >
          <icon name="icon-signal" color="#ABBAC8" />
        </div>
        <!-- 刷新按钮 -->
        <div class="refresh">
          <refresh
            :other_icon="true"
            icon_name="icon-balance_refresh"
            :loaded="data_loaded"
            @click="refresh()"
          />
        </div>
      </div>
    </div>

    <!-- 赛事基本信息 start -->
    <template v-if="toggle_panel">
      <div
        :style="{ background: `url('${background_img}') center center` }"
        class="head-info relative-position"
        :class="`esports-head-info-${sportId}`"
      >
        <!-- 赛事对阵状态展示面板 -->
        <info
          class="info-upd full-width row justify-center fod_show"
          :match_info="match_infoData"
        />
        <!-- 隐藏 -->
        <div
          v-if="!$utils.is_eports_csid(sportId)"
          class="hide-btn"
          @click="toggle_panel = false"
        >
          {{ $root.$t("common.hide_score_panel") }}
        </div>
      </div>
    </template>
    <!-- 赛事基本信息 end -->
    <!-- 玩法tab条 -->
    <handicap-tabs-bar
      ref="handicap-tabs-bar"
      :handicap_this="handicap_this"
      :match_info="match_infoData"
      @get_mattch_details="get_mattch_details"
      @on_go_top="on_go_top"
      @change-loading-state="change_loading_state"
      :class="{
        all_empty: ['all_empty', 'new_empty'].includes(handicap_state),
      }"
      whitchDetail="details"
    />
  </div>
</template>

<script setup>

</script>
