<template>
  <div class="ouzhou-match-league" :style="`height:40px !important;`">
    <!-- 第一行 -->
    <div class="tr-match-head" @click="jump_to_league_list()" :style="{ width: `${LayOutMain_pc.oz_layout_content - (LayOutMain_pc.oz_right_width + LayOutMain_pc.oz_left_width)}px`,}">
      <!-- 联赛信息 -->
      <div class="leagues-wrap" :style="`width:${match_list_tpl_size.process_team_width}px !important;`">
        <!-- <div class="yb-flex-center" :style="`width:${match_list_tpl_size.media_width - 3}px !important;`"> -->
          <!-- 联赛是否收藏 -->
          <!-- <div @click.stop="collect" class="icon-wrap m-star-wrap-league"
            v-if="GlobalAccessConfig.get_collectSwitch">
          </div>
        </div> -->
        <!-- 联赛图标 -->
        <div class="league-icon-wrap">
          <img :src="leagueIcon" />
        </div>
        <!-- 联赛名称 -->
        <div class="ellipsis-wrap">
          <div class="absolute-full">
            <!-- 联赛数量 -->
            <span class="ellipsis allow-user-select leagues-name" v-tooltip="{ content: league_obj.tn, overflow: 1 }">
              {{ lodash.get(league_obj, 'nameText') }}
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
// import { defineProps, ref, computed} from 'vue';
import { ref, computed} from 'vue';
import { useRouter,useRoute } from 'vue-router'

import { GlobalAccessConfig, LayOutMain_pc, LOCAL_PROJECT_FILE_PREFIX, compute_img_url, MenuData } from 'src/output/index.js';

import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import { get_server_file_path } from "src/core/file-path/file-path.js";


  const router = useRouter();
  const route = useRoute();

  const props = defineProps({
    league_obj: {
      type: [Object],
      default: () => {}
    }
  })
 const leagueIcon = computed(()=>{
    const url =  get_server_file_path(props.league_obj.picUrlthumb);
    return url ? url : compute_img_url('pc-home-league-default')
  })
  const match_list_tpl_size = lodash.get(MATCH_LIST_TEMPLATE_CONFIG[`template_101_config`], 'width_config')

  function jump_to_league_list() {
    const { id, sportId, nameText } = props.league_obj
	  localStorage.setItem('league_name', nameText)
    router.push(`/league/${sportId}/${id}/1`)
    let obj = {
      pre_route : route.name
    }
    MenuData.set_router_info(obj)
  }

</script>

<style lang="scss" scoped>

.ouzhou-match-league {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--q-gb-bg-c-15);
  border-bottom: 1px solid var(--q-gb-bd-c-2);
  font-weight: 500;
  cursor: pointer;
  .league-icon-wrap {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      line-height: 18px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  .leagues-wrap {
    padding-left: 14px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .tr-match-head {
    display: flex;
    flex-grow: 1;
    position: relative;
  }
  .league-match-count {
      height: 100%;
      position: absolute;
      right: 13px;
      font-weight: 600;
      color: var(--q-gb-t-c-5);
      display: flex;
      align-items: center;
      // span {
      //   display: flex;
      //   height: 100%;
      //   align-items: center;
      // }
    }
    
    .collect-start {
      width: 14px;
      height: 14px;
      cursor: pointer;
      background-size: 100%;
    }

}
</style>

src/output/index.js