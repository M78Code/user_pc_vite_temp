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
      <!--更多玩法-->
      <div class="select-play" v-if="second_play_data.length > 0" @click.stop>
        <q-btn-dropdown
          :auto-close="true"
          ref="more_dropdown"
          menu-self="bottom middle" :menu-offset="[0, -30]" 
          flat outline padding="0" dropdown-icon="expand_more" content-class="select-play-style">
          <template v-slot:label>
            <template v-if="!select_second_item?.id">
              <IconWapper name="icon-close" size="7px" color="#C9CDDB" class="icon-del" />
              <span class="label"> 更多玩法 </span>
            </template>
            <template v-else>
              <div class="active-item">
                <span class="label"> {{ select_second_item.title }} </span>
                <IconWapper name="icon-triangle1" size="14px" />
              </div>
            </template>
          </template>
          <q-list>
            <q-item v-for="item, i in second_play_data" :key="item.hps_key" @click.stop="on_select_second_play(item, i)"
                :class="{active: select_second_item.id === item.id}" clickable v-close-popup >
              <q-item-section>
                <q-item-label> 
                  <span>{{ item.title }}</span> 
                  <img v-if="select_second_item.id === item.id" :src="select_check" alt="select check" /> 
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    <!-- 次要玩法   1. 左边队伍名标题   2. 右边 盘口组件  模块 -->
    <div 
      v-if="current_tab_item.hps" 
      :mid="match.mid"  
      :class="['transition-w-odd', {
      expanded: any_unfold && any_unfold != '0',
      five_minutes_wanfa: any_unfold && any_unfold != '0' && [19].includes(+ lodash.get(current_tab_item, 'id')),}]">
      <!--次要玩法标 队名 和 比分 和 盘口-->
      <div class="content row justify-between" v-if="any_unfold">
        <!--次要玩法标 队名 和 比分  次要玩法 左边的 区域    波胆，5分钟玩法  不显示-->
        <div class="team-title-container" v-if="![18, 19, 11].includes(+ lodash.get(current_tab_item, 'id'))">
          <!--主队名 和 比分 { 'is-handicap': current_tab_handicap_index == 1, 'is-handicap-1': current_tab_handicap_index == 2, } -->
          <div :class="['team-t-title-w']">
            <div class='team-title'> {{ match.mhn }}  </div>
            <!--显示次要玩法比分 7,8,9 网,乒,斯-->
            <div class="way-score" v-if="[1, 5, 7, 8, 9].includes(+current_tab_item.id) && match.ms == 1"> {{ home_score }} </div>
          </div>
          <!--副队名 和 比分 , { 'is-handicap': current_tab_handicap_index == 2, 'is-handicap-1': current_tab_handicap_index == 1, } -->
          <div :class="['team-t-title-w']">
            <div class='team-title'> {{ match.man }} </div>
            <!--显示次要玩法比分 7,8,9 网,乒,斯-->
            <div class="way-score" v-if="[1, 5, 7, 8, 9].includes(+current_tab_item.id) && match.ms == 1"> {{ away_score }}</div>
          </div>
          <!--  玩法描述图标显示  玩法id: 角球 1  15分钟 17  波胆 18  特色 11  罚牌 5  晋级  3  冠军  30-->
          <div class="team-t-title-w fight-type" v-if="[1, 3, 5, 7, 8, 9].includes(+match.csid) && is_show_title">
            <!-- :style="compute_css_obj(show_tips?'icon-tips':'icon-tips-d')" -->
            <span v-if="[2, 5, 17].includes(+current_tab_item.id)" @click="info_icon_click($event, match.mid)">
              <img :src="information_icon" alt="">
            </span>
            <!-- {{ match.csid == 1 ? current_tab_item.title : mmp_map_title }} -->
            {{  get_current_title(standard_odd_status)  }}
          </div>
        </div>
        <!--次要玩法 盘口 右边的 区域-->
        <OddListWrap 
          :match="match"
          invoke_source="attached"
          :hps="current_tab_item.hps"
          :current_tab_item="current_tab_item"
          :bold_all_list="bold_all_list"
          :five_minutes_all_list="five_minutes_all_list"
          @on_update_standard="on_update_standard" />
      </div>
    </div>
  </div>
</template>

<script>
import lodash from 'lodash'
import { ref, computed, onMounted, onUnmounted, defineComponent, getCurrentInstance, nextTick } from 'vue'
import second_mixin from '../mixins/second.mixin.js';
import { IconWapper } from 'src/components/icon'
import OddListWrap from 'src/base-h5/components/match-container/template/app/components/odd-list-wrap.vue';
import { compute_css_obj, useMittOn, MITT_TYPES } from "src/output/index.js"
import { select_check, information_icon } from 'src/base-h5/core/utils/local-image.js'


export default defineComponent({
  name: "match-container-second-template2",
  mixins: [second_mixin],
  props:{
    match: Object,  // 赛事数据
    i: Number, // 所在位置
  },
  components: {
    IconWapper,
    OddListWrap
  },
  setup () {
    const more_dropdown = ref(null)
    const { proxy } = getCurrentInstance()
    let emitters = {}

    // 当前总的要显示的次要玩法
    const show_second_data = computed(() => {
      return proxy.tab_list.filter((t) => t.show_tab)
    })
    // 当前显示的 次要玩法
    const current_second_data = computed(() => {
      return show_second_data.value.slice(0, 5)
    })
    // 更多次要玩法数据
    const second_play_data = computed(() => {
      const length = lodash.get(show_second_data.value, 'length', 0)
      return show_second_data.value.slice(5, length)
    })
    // 更多次要玩法 当前所选玩法
    const select_second_item = ref({})
    // 更多次要玩法选择
    const on_select_second_play = (item, i) => {
      if (select_second_item.value.id === item.id) return
      proxy.overtime_tab_handle(item, undefined, 'is-user', i)
      nextTick(() => {
        select_second_item.value = item
      })
    }
    onMounted(() => {
      emitters = {
        emitter_1: useMittOn(MITT_TYPES.EMIT_MATCH_LIST_SCROLLING, (v) => {
          more_dropdown.value && more_dropdown.value.hide()
        }).off
      }
    })
    onUnmounted(() => {
      Object.values(emitters).map((x) => x());
    })
    return { 
      compute_css_obj, on_select_second_play, select_second_item, second_play_data, current_second_data, select_check, information_icon, more_dropdown
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
      background: var(--q-gb-bg-c-28);
      color: var(--q-gb-t-c-18);
      display: flex;
      align-items: center;
      padding: 0 0.01rem 0 0.03rem;
      border: 1px solid transparent;
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

    .select-play{
      :deep(.q-btn){
        line-height: 22px;
        .q-focus-helper{
          background: transparent;
        }
        .q-btn__content{
          color: var(--q-gb-t-c-18);
          font-size: 0.1rem;
          
          .q-btn-dropdown__arrow-container{
            display: none;
          }
          .icon-close{
            margin-right: 4px;
            transform: rotate(45deg);
          }
          .label{
            color: #949AB6;
          }
          .active-item{
            display: flex;
            align-items: center;
            .label{
              color: #179cff;
              border-color: #179cff;
            }
            .q-icon {
              position: relative;
              top: -0.5px;
              transform: rotateZ(-180deg);
              &.icon-triangle1:before{
                color: #179cff;
              }
            }
          }
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

          margin-bottom: 0.02rem
        }
      }

      .team-title {
        overflow: hidden;
        display: flex;
        font-size: 0.12rem;
        flex-shrink: 0;
        flex: 1;
        display: -webkit-box;
        color: var(--q-gb-t-c-18);
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        word-break: break-all;
      }

      .way-score {
        height: 100%;
        display: flex;
        align-items: center;
        font-weight: 600;
        margin: 0 8px;
        color: var(--q-gb-t-c-18);
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
    margin-top: 5px;
    
    &.expanded {
      height: auto;
      max-height: none;
    }
    .content{
      .team-title-container{
        width: calc(100% - 1.84rem);
      }
    }
  }
}
</style>
