<!--
 * @Author: Amor
 * @Date: 2020-08-08 08:56:43
 * @Description: 赛事列表头部——滚球——联赛信息
-->
<template>
  <div
    class="c-match-league"
    :class="[{'match-tpl0-bg':tpl_id == 0},card_style_obj.is_league_fold ?'leagues-pack':`match-tpl${tpl_id}`]"
    v-if="_.get(card_style_obj,'league_obj.csid')"
  >
    <!-- 第一行 -->
    <div
      class="tr-match-head"
      @click="set_fold"
    >
      <!-- 联赛信息 -->
      <div
        class="leagues-wrap"
        :class="tpl_id == 12 && 'jingcai'"
        :style="`width:${match_list_tpl_size.process_team_width}px !important;`"
      >
      <!-- 箭头 -->
      <i class="icon-arrow q-icon c-icon" size="14px" ></i>
        <!-- 联赛图标 -->
        <div class="league-icon-wrap">
          <sport-icon v-if="NewMenu.is_esports()" :sport_id="card_style_obj.league_obj.csid" status="2" size="18px" is_esports />
          <img v-else v-img="[_.get(card_style_obj,'league_obj.lurl')]"/>
        </div>
        <!-- 联赛名称 -->
        <div class="ellipsis-wrap">
          <div class="absolute-full">
            <!-- 联赛数量 -->
            <span class="ellipsis allow-user-select" v-tooltip="{content:card_style_obj.league_obj.tn,overflow:1}">{{card_style_obj.league_obj.tn}}</span><span class="league-match-count">{{card_style_obj.match_count}}</span>
          </div>
        </div>
      </div>
      <!-- 玩法名称 -->
      <div class="play-name row col">
        <template v-if="[1,3,5,21].includes(+tpl_id)">
          <div class="col" >
            {{bet_title[0]}}
          </div>

          <div class="col" :class="{'bet-col4 y0-col4':[3,21].includes(+tpl_id)}" v-if="tpl_id != 5">
            {{bet_title[1]}}
          </div>
        </template>
        <template v-else-if="[22].includes(+tpl_id)">
          <div class="col"  :style="get_title_style()">
            {{bet_title[0]}}
          </div>
          <div class="col bet-col4 y0-col4" :style="get_title_style()">
            {{bet_title[1]}}
          </div>
          <div class="col">
            {{bet_title[2]}}
          </div>
        </template>
        <!-- 篮球 -->
        <template v-else-if="tpl_id == 7">
            <div v-for="(item,key) in bet_col" class="col" :class="key == 3 && 'col2'" :key="key">
              {{item}}
            </div>
        </template>
        <template v-else>
            <div v-for="(item,key) in bet_col" class="col ellipsis"  :style="get_bet_width(key)" :class="[is_highlighted(+card_style_obj.league_obj.csid) ? 'bet-col'+key : '' ,{'highlight-t': get_highlight_title(item.includes('%n'),key)}]" :key="key" v-tooltip="{content:item.includes('%n') ? '' : item,overflow: 1,m_width: 7}">
              <div class="double-row" v-if="item.includes('%n')">
                <div v-for="(text,i) in item.split('%n')" :class="[{'highlight-t': get_highlight_title(true,key,i)}]" :key="i">{{text}}</div>
              </div>
              <template v-else>
                {{item}}
              </template>
            </div>
        </template>
      </div>
      <div class="action-col" style="width:60px" v-if="tpl_id == 12"></div>
      <div
        class="yb-flex-center"
        :style="`width:${match_list_tpl_size.media_width-3}px !important;`"
      >
        <!-- 联赛是否收藏 -->
        <div
          @click.stop="match_list_card.view.mx_collect({type:'leagues',match:card_style_obj.league_obj})"
          class="icon-wrap m-star-wrap-league"
          v-if="!NewMenu.is_esports() && get_global_switch.collect_switch"
        >
          <i class="icon-star q-icon c-icon" :class="card_style_obj.league_obj.tf && 'active'"></i>
        </div>
      </div>
    </div>
    <!-- 第二行 玩法名称 -->
    <div class="tr-col-name" v-if="[1,3,5,21,22].includes(+tpl_id)">
      <div :style="`width:${match_list_tpl_size.process_team_width}px !important;`"></div>
      <div class="play-name row col">
          <div v-for="(item,key) in bet_col" class="col ellipsis" :style="`width: ${(tpl_id == 22 && key <=5  ) ?  match_list_tpl_size.bet_width+5+'px !important; flex:auto'  : ''}`"  v-tooltip="{content:item,overflow:1}"  :key="key">
            {{item}}
          </div>
      </div>
      <div :style="`width:${match_list_tpl_size.media_width}px !important;`"></div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, computed, ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  import { EMIT_FETCH_MATCH_LIST } from 'src/core/http/emit_cmd.js'
  import { useRegistPropsHelper, useProps  } from "src/composables/regist-props/index.js"
  import { useMittEmit } from 'src/core/mitt/index.js'
  import {component_symbol ,need_register_props} from "../config/index.js"
  import match_list_tpl_size from "src/core/match-class/match_list_tpl_size.js"
  useRegistPropsHelper(component_symbol, need_register_props)

  const props = defineProps({ ...useProps })
  const tpl_id = ref('');
  const match_list_tpl_size = ref(match_list_tpl_size['template'+tpl_id] || {})

  if(!_.get(this,'card_style_obj.league_obj.csid') && ['1','500'].includes(props.NewMenu.menu_root)){
    useMittEmit(EMIT_FETCH_MATCH_LIST, true)
  }

</script>

<style lang="scss" scoped>
.match-tplesports{
  .sport-img {
 background-image: url("~public/image/common/png/sport_old_icon.png");
  }
}
.league-icon-wrap{
  .sport-img {
    background-image: url("~public/image/common/png/sport_old_icon.png");
     }
}
.c-match-league {
  height: 34px;
  &.match-tpl13{
    .tr-match-head{
        .play-name{
          .col{
           &.bet-col2,&.bet-col4{
              border-left: 0 !important;
            }
          }
        }
    }

  }
}
.tr-match-head {
  display: flex;
  height: 34px;
  line-height: 34px;
  cursor: pointer;
  .leagues-wrap {
    display: flex;
    align-items: center;
    padding: 0 13px;
    .icon-arrow{
      font-size: 20px;
      margin-right: 20px;
      left: 10px;
      top: -1px;
      transition: transform 0.3s;
    }
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
    .ellipsis-wrap {
      font-size: 13px;
    }
    .league-match-count {
      margin-left: 10px;
      display: none;
    }
  }
  .play-name {
    text-align: center;
    line-height: 32px;
    .col2 {
      flex: 20000 1 0%;
    }
    .col{
      height: 100%;
      max-height: 100%;
      .double-row{
        font-size: 12px;
        height: 100%;
        padding: 1px 0;
        line-height: 15px;
      }
    }
  }
  .m-star-wrap-league {
    cursor: pointer;
  }
}
.tr-col-name {
  display: flex;
  height: 24px;
  .play-name {
    text-align: center;
    line-height: 24px;
  }
}

/*  联赛折叠样式 */
.leagues-pack {
  .tr-match-head {
    .leagues-wrap {
      .icon-arrow {
        transform: rotate(180deg);
      }
    }
    .play-name div {
      display: none;
    }
    .league-match-count {
      display: block;
    }
  }
  .tr-col-name {
    display: none;
  }
}
</style>
