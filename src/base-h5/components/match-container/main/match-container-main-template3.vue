
<!--
 * @Description: 冠军赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="champion-wrap" v-if="is_show">
    <!--体育类别  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
    <div class="sport-title match-indent" v-if="get_sport_show(i)" @click="handle_ball_seed_fold">
      <span class="score-inner-span"> {{match_of_list.csna}} </span>
      <div class="collapse-dire">
        <img class="icon-down-arrow" :class="{ 'collapsed': league_collapsed }" :src='compute_img_url("icon-collapse")' />
      </div>
    </div>
    <div v-if="is_show_league(i)" class="league-container flex items-center justify-between hairline-border" @click="handle_league_fold">
      <div class="league-wrapper champion flex items-center">
        <div @click.stop="handle_match_collect" class="collect-img">
          <!-- 未收藏图标 -->
          <img v-if="!match_collect_state" :src="compute_img_url('icon-favorite')" alt="">
          <!-- 收藏图标 -->
          <img v-if='match_collect_state' :src="compute_img_url('icon-favorite-s')">
        </div>
        <div v-if="menu_type === 100 && GlobalAccessConfig.get_collectSwitch()"  class="favorite" :class="[{favorited:match_of_list.tf},theme]"
          @click.stop="handle_league_fold"></div>
            <div class="league-title-text row justify-between" :class="{'without-collect': menu_type !== 100 || (menu_type === 100 && !GlobalAccessConfig.get_collectSwitch())}" >
              {{menu_type == 100 ? match_of_list.onTn : match_of_list.tn}}
            </div>
        </div>

      <div class="collapse-dire">
        <img class="icon-down-arrow" :class="{collapsed:collapsed}" alt="" :src="compute_img_url('icon-collapse')">
      </div>
    </div>

    <template v-for="(hp,index) of match_of_list.hps">
      <div class="hps-wrap hairline-border" v-if="hp.hs != 2 && !collapsed" :key="index">
       
        <div class="match-title flex items-center"
          :class="{'is-favorite':get_show_favorite_list}">
          <div class="debug-head" style="color:red;position:absolute;right:0;">
            {{get_key_by_obg(hp)}}
          </div>
          <div class="hpn-wrap ellipsis">
            {{hp.hps}}
          </div>
        </div>

        <div v-if="!collapsed && hp.hmed" class="limit-time flex items-center justify-center"
          :class="{'first-t':index == 0}">
          <div class="limit-t-i row justify-center items-center">
            <template v-if="!['zh', 'tw'].includes(lang)">
              {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ $t('match_main.cut_off')}}
            </template>
            <template v-else>
              {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ $t('match_main.cut_off')}}
            </template>
          </div>
        </div>

        <div class="ol-list-wrap flex justify-start" :data-ol="hp.ol.length" v-if="hp.ol">

          <odd-item-champion 
            v-for="(ol_item,i) of hp.ol"
            :key="i"
            :hs="hp.hs"
            :data-i="i"
            :ol_item="ol_item"
            :style="calc_bgcolor(ol_item)"
            :class="calc_bgcolor(ol_item) && 'active-item'"
            :csid="match_of_list.csid"
            @click.stop="item_click(match_of_list,hp,ol_item)">
          </odd-item-champion>
        </div>
      </div>
    </template>

  </div>
</template>
<script>
import champion_mixin from  "../mixins/champion.mixin.js"
export default{

  mixins:[champion_mixin]
}
</script>
<style scoped lang="scss">
  @import "../styles/match-container-champion.scss";
</style>
 