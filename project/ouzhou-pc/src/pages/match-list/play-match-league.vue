<template>
  <div class="ouzhou-match-league" :style="`height:40px !important;`">
    <!-- 第一行 -->
    <div class="tr-match-head" @click="jump_to_league_list()" :style="{ width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`,}">
      <!-- 联赛信息 -->
      <div class="leagues-wrap" :style="`width:${match_list_tpl_size.process_team_width}px !important;`">
        <div class="yb-flex-center" :style="`width:${match_list_tpl_size.media_width - 3}px !important;`">
          <!-- 联赛是否收藏 -->
          <div @click.stop="collect" class="icon-wrap m-star-wrap-league"
            v-if="GlobalAccessConfig.get_collectSwitch">
            <!-- <div class="collect-start"
              :style="compute_css_obj({ key: is_collect ? 'pc-home-star-fill' : 'pc-home-star-empty' })"></div> -->
          </div>
        </div>
        <!-- 联赛图标 -->
        <div class="league-icon-wrap">
          <img v-img="[lodash.get(league_obj, 'pickUrlthumb')]" />
        </div>
        <!-- 联赛名称 -->
        <div class="ellipsis-wrap">
          <div class="absolute-full">
            <!-- 联赛数量 -->
            <span class="ellipsis allow-user-select leagues-name" v-tooltip="{ content: league_obj.tn, overflow: 1 }">
              {{ league_obj.nameText }}
            </span>
          </div>
        </div>
      </div>
      <div class="play-name-ouzhou">
        <div class="play-name-title-box"
          v-for="(item, col_index) in 2"
          :style="{ 'width': match_list_tpl_size.bet_width + 'px' }">
        </div>
      </div>
      <!-- 赛事数量 -->
        <span class="league-match-count">{{ league_obj.num }}</span>
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';
  import { useRouter } from 'vue-router'

  import { GlobalAccessConfig, LayOutMain_pc } from 'src/core/index.js';

  import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'

  const router = useRouter();
  const props = defineProps({
    league_obj: {
      type: [Object],
      default: () => {}
    }
  })
  const match_list_tpl_size = lodash.get(MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`], 'width_config')

  function jump_to_league_list() {
    const { id, sportId } = props.league_obj
    router.push(`/league/${sportId}/${id}`)
  }
</script>

<style></style>

