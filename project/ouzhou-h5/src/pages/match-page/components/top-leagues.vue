<!--
* @Description: 顶级赛事 -- 国家
-->

<template>
  <div class="top_leagues_page">
    <collapse v-for="item, index in store.leaguesMatchs" :key="index" :title="item.nameText" @click.stop="handle_jump_match(item)">
      <!-- 图片 -->
      <template v-slot:title_icon>
        <img class="national_icon" :src="league_collect_state(item) ? have_collect_ouzhou : no_collect_ouzhou" alt="" @click.stop="handle_match_collect(item)">
      </template>
      <!-- 右侧 -->
      <template v-slot:title_right>
        <span>{{ item.num }}</span>
      </template>
    </collapse>
  </div>
</template>
 
<script setup>
import { have_collect_ouzhou, no_collect_ouzhou } from 'src/base-h5/core/utils/local-image.js'
import { MenuData } from "src/output/index.js"
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import UserCtr from "src/core/user-config/user-ctr.js";
import collapse from "project_path/src/pages/home/components/collapse.vue"
import MatchCollect from 'src/core/match-collect'
import { api_common } from "src/api/index.js";
import { store } from "project_path/src/pages/match-page/index.js"

const league_collect_state = (value) => {
  return MatchCollect.get_league_collect_state(value.tid)
}

const handle_match_collect = (value) => {
  const { tid } = value
  const league_collect = MatchCollect.get_league_collect_state(tid)
  api_common.add_or_cancel_tournament({
    tid,
    cf: league_collect ? 0 : 1,
    cuid: UserCtr.get_uid()
  }).then(res => {
    if (+res.code !== 200) return
  })
  // 收藏页手动处理数据
  MenuData.is_collect() && MatchMeta.set_collect_match(value, 1)
  MatchCollect.handle_league_collect_state(tid)
}

const handle_jump_match = (item) => {
  store.isLeagueDetail = true
  store.selectLeague = item
  MatchMeta.clear_match_info()
  MatchMeta.get_ouzhou_leagues_list_data(item.tid, store.curSelectedOption.timestamp)
}
</script>
 
<style scoped lang="scss">
.top_leagues_page{
  background-color: var(--q-gb-bg-c-2);
  border-top: 0.027rem solid #FF7000;
  :deep(.collapse_page){
    &:not(:last-child){
      // border-bottom: 10px solid #F1F1F1;
    }
    .title{
      height: 50px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid var(--q-gb-bd-c-1);
      .national_icon{
        width: 14px;
        height: 14px;
        margin-right: 10px;
      }
    }
    .game{
      height: 50px;
      display: flex;
      font-weight: 400;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px 0 15px;
      border-bottom: 1px solid #eee;
      > span {
        font-size: 14px;
        display: flex;
        align-items: center;
        > img {
          width: 13px;
          height: 12px;
          margin-right: 8px;
        }
      }
      > span:last-child{
        font-weight: 500;
      }
    }
  }
}

</style>