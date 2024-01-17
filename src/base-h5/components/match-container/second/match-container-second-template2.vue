<!--
 * @Description: 复刻版  次要玩法 
-->
<template>
  <div class="second-container match-container-second-template2" v-if="show_tab_by_data">
    <!--次要玩法 标题主名称-->
    <div class="tab-m-o-w row items-center" ref="sub_play_scroller">
      <div v-for="(t_item, i) of current_second_data" 
        :key="t_item.id" 
        :class="['tab-item-h row items-center', { 'collapsed': t_item.unfold == 1 }]"
        @click="overtime_tab_handle(t_item, undefined, 'is-user', i)">
        <div> {{ t_item.title }} </div>
        <IconWapper name="icon-triangle1" size="14px" class="league-collapse-dir" />
      </div>
      <div class="select_time" v-if="second_play_data.length > 0">
        <span @click.stop>
          <q-btn-dropdown flat outline style="color: #FF7000"  padding="0" :label="select_second_label"
            dropdown-icon="expand_more" content-class="select_time_style">
            <q-list>
              <q-item v-for="item in second_play_data" :key="item.hpid" @click.stop="on_select_second_play(item)"
                  :class="{active: select_play === item.hpid}" clickable v-close-popup >
                <q-item-section>
                  <q-item-label>{{ item.label || i18n_t(`ouzhou.match.play_map.${item.hpid}`)}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </span>
      </div>
    </div>
    <!-- 次要玩法   1. 左边队伍名标题   2. 右边 盘口组件  模块 -->
    <div 
      v-if="current_tab_item.hps" 
      :mid="match_info.mid"  
      :class="['transition-w-odd', {
      expanded: any_unfold && any_unfold != '0',
      five_minutes_wanfa: any_unfold && any_unfold != '0' && [19].includes(+ lodash.get(current_tab_item, 'id')),}]">
      <!--次要玩法标 队名 和 比分 和 盘口-->
      <div class="content row justify-between" v-if="any_unfold">
        <!--次要玩法标 队名 和 比分  次要玩法 左边的 区域    波胆，5分钟玩法  不显示-->
        <div class="team-title-container" v-if="![18, 19, 11].includes(+ lodash.get(current_tab_item, 'id'))">
          <!--主队名 和 比分-->
          <div :class="['team-t-title-w', { 'is-handicap': current_tab_handicap_index == 1, 'is-handicap-1': current_tab_handicap_index == 2, }]">
            <div class='team-title'> {{ match_info.mhn }}  </div>
            <!--显示次要玩法比分 7,8,9 网,乒,斯-->
            <div class="way-score" v-if="[1, 5, 7, 8, 9].includes(+current_tab_item.id) && match_info.ms == 1"> {{ home_score }} </div>
          </div>
          <!--副队名 和 比分-->
          <div :class="['team-t-title-w', { 'is-handicap': current_tab_handicap_index == 2, 'is-handicap-1': current_tab_handicap_index == 1, }]">
            <div class='team-title'> {{ match_info.man }} </div>
            <!--显示次要玩法比分 7,8,9 网,乒,斯-->
            <div class="way-score" v-if="[1, 5, 7, 8, 9].includes(+current_tab_item.id) && match_info.ms == 1"> {{ away_score }}</div>
          </div>
          <!--  玩法描述图标显示  -->
          <div class="team-t-title-w fight-type" v-if="[1, 3, 5, 7, 8, 9].includes(+match_info.csid)">
            <span v-if="[2, 5, 17].includes(+current_tab_item.id)" 
              @click="info_icon_click($event, match_info.mid)"
              :style="compute_css_obj(show_tips?'icon-tips':'icon-tips-d')"
            ></span>
            {{ match_info.csid == 1 ? current_tab_item.title : mmp_map_title }}
          </div>
        </div>
        <!--次要玩法 盘口 右边的 区域-->
        <OddListWrap 
          :match="match_info"
          :hps="current_tab_item.hps"
          :current_tab_item="current_tab_item"
          :invoke_source="'attached'"
          :bold_all_list="bold_all_list"
          :five_minutes_all_list="five_minutes_all_list" />
      </div>
    </div>
  </div>
</template>

<script>
import lodash from 'lodash'
import { ref, computed, defineComponent, getCurrentInstance } from 'vue'
import second_mixin from '../mixins/second.mixin.js';
import { IconWapper } from 'src/components/icon'
import OddListWrap from 'src/base-h5/components/match-container/template/app/components/odd-list-wrap.vue';
import { compute_css_obj } from "src/output/index.js"

export default defineComponent({
  name: "match-container-second-template2",
  mixins: [second_mixin],
  components: {
    IconWapper,
    OddListWrap
  },
  setup () {
    const { proxy } = getCurrentInstance()

    // 当前总的要显示的次要玩法
    const show_second_data = computed(() => {
      return proxy.tab_list.filter((t) => t.show_tab)
    })
    // 当前显示的 次要玩法
    const current_second_data = computed(() => {
      return show_second_data.value.slice(0, 4)
    })
    // 更多次要玩法数据
    const second_play_data = computed(() => {
      const length = lodash.get(show_second_data.value, 'length', 0)
      return show_second_data.value.slice(4, length - 1)
    })
    // 更多次要玩法 当前所选玩法
    const select_second_label = ref('')
    // 更多次要玩法选择
    const on_select_second_play = (item) => {
      console.log(item)
    }
    return { 
      compute_css_obj, on_select_second_play, select_second_label, second_play_data, current_second_data
    }
  }
})


</script>
  
<style scoped lang="scss">
.second-container {
  margin-bottom: 5px;
  .tab-m-o-w {
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 0 auto;
    flex-wrap: nowrap;
    height: 22px;

    .tab-item-h {
      height: 0.18rem;
      border-radius: 0.04rem;
      flex-wrap: nowrap;
      white-space: nowrap;
      flex-shrink: 0;
      font-size: 0.1rem;
      background: #fff;
      display: flex;
      align-items: center;
      padding: 0 0.01rem 0 0.03rem;
      border: 0.02rem solid transparent;
      justify-content: center;
      &.collapsed{
        color: #179cff;
        border-color: #179cff;
        .league-collapse-dir{
          color: #179cff;
          transform: rotateZ(-180deg);
          &.icon-triangle1:before{
            color: #179cff;
          }
        }
      }
      .league-collapse-dir {
        transform: rotateZ(0);
        position: relative;
        top: -1px;
        margin-left: 1px;
        transition: transform 0.2s ease-in;
        &.icon-triangle1:before{
          color: #888;  
        }
      }
    }
  }

  .team-title-container {
    flex: 1;
    .team-t-title-w {
      height: 0.32rem;
      font-size: 0.12rem;
      display: flex;
      align-items: center;
      position: relative;

      &.is-handicap {
        font-weight: bold;
      }

      &.fight-type {
        font-size: 0.12rem;
        color: #7981a4;

        img {
          display: block;
          /*width: 0.14rem;*/
          /*height: 0.14rem;*/
          margin-right: 0.055rem;
          margin-left: -0.17rem;

          margin-bottom: 0.02rem
        }
      }

      .team-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--q-gb-t-c-18);
      }

      .way-score {
        position: absolute;
        right: 8px;
      }
    }
  }

  .title-15min  {
    text-align: left;
    display: flex;
    width: 1.4rem;
    display: flex;
    color:var(--p-theme-color) ;
    align-items: center;
    font-size: .12rem
  }

  .transition-w-odd {
    font-size: 0.1rem;
    max-height: 0;
    margin-top: 0.05rem;
    &.expanded {
      height: auto;
      max-height: none;
    }
  }
}
</style>
