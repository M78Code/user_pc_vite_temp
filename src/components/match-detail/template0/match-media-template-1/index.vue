<!--
 * @Author: cooper
 * @Date: 2023-08-05 19:40:55
 * @Description:详情页玩法模板-0  玩法模板0  特点：两列无数行  例：独赢&进球大小 、准确进球数等
-->

<template>
    <div class="wrap-template template0" data-template="template0" v-if="curIsShow">
    <!-- 主盘 S-->
    <div class="main-handicap">
      <handicap-title
        :index="index"
        :item_details="item_details"
        @sort_index="sort_index(arguments)"
        @click="toggle_menu"
        :is_show="isShow"
        :match_info="match_info"
      ></handicap-title>
      <!-- isShow玩法是否折叠 -->
      <template v-if="isShow">
        <div class="handicap" v-for="(list,j) in _.get(item_details, 'hl')" :key="list.hid">
          <template v-for="(item,i) in list.ol">
            <!-- os参数： 1开盘、2封盘、3关盘、4锁盘 -->
            <div
              class="handicap-item"
              v-if="item.os != 3"
              :class="[`os-${item.os}`, {'no_border_bottom': i > (_.get(list, 'ol.length') - 3) && j > _.get(item_details, 'hl.length') - 2}]"
              :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
            >
            <!--osn：投注项显示名称，空则不需要显示 -->
              <bet-item
                :key="`bet_oid_${item.oid ? item.oid : 'placeholder_' + i}`"
                :match_info="match_info"
                :play_data="item_details"
                :bet_data="item"
                :bet_path="{hl_index: j, ol_index: i}"
                :team_name="!$utils.is_eports_csid(match_info.csid) ? _.get(item_details, `title[${i}].osn`) : ''"
                bet_source="match_details"
              >
                <div class="bet-item">
                  <!-- csid 球类id 虚拟赛狗1002 虚拟赛马1011 虚拟摩托1010 泥地摩托车1009-->
                  <div v-if="['1002','1011','1010','1009'].includes(match_info.csid)" class="rank-no" :class="`ranking-bg-style1-${item.ot} csid-${match_info.csid}`"></div>
                  <div class="item-label bet-ellipsis ellipsis">
                    <!-- ott 展示用的和title一样 -->
                    <span :class="['ellipsis-wrap',{'yb-family-odds':[361, 362].includes(+_.get(item_details, 'hpid',-1))}]">{{item.ott}}</span>
                    <!-- hpid 玩法id -->
                    <span v-if="['13', '102', '171', '216', '20006', '20010', '20025', '20026', '20031'].includes(_.get(item_details, 'hpid'))" class="bet_handicap yb-family-odds" :class="{'normal_color': item.on.indexOf('&') > -1}" v-html="item.on.indexOf('&') > -1 ? filter_odds(item.on) : item.on"></span>
                    <!-- on 投注项显示值 例：on: "0-1"  on: "莱昂 & 大 3.5"-->
                    <span v-else class="bet_handicap yb-family-odds" :class="{'normal_color':_.get(item_details, 'hpid') == 31}">{{item.on}}</span>
                  </div>
                </div>
              </bet-item>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- 主盘 E-->
  </div>
  
</template>

<script setup>
import lodash from 'lodash'

const updateCurMode = ()=>{
    if (this.$utils.is_eports_csid(lodash.get(this.item_details, 'hl[0].ol[0].csid'))) {
        // hipo 1 为支持串关 0 为不支持
        // 如果当前是串关模式但是玩法不支持串关，就隐藏不支持串关的玩法
        if (mode) {
          this.curIsShow = this.item_details.hl[0].hipo == 1
        } else {
          this.curIsShow = true;
        }
      } else {
        this.curIsShow = true;
      }
}




</script>
<style lang="scss" scoped>
</style>