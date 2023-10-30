<!--
 * @Description: app-h5  冠军   冠军赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="champion-wrap-2" v-if="is_show">
    <!--体育类别  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
    <div class="sport-title match-indent" v-if="get_sport_show(i)" @click="handle_ball_seed_fold">
      <span class="score-inner-span"> {{match_of_list.csna}} </span>
      <div class="collapse-dire">
        <img class="icon-down-arrow" :class="{ 'collapsed': league_collapsed }" :src='compute_img_url("icon-collapse")' />
      </div>
    </div>
    <div v-if="is_show_league(i)" 
      :class="['league-container flex items-center justify-between right-border', {collapsed: !collapsed}]"
      @click="handle_league_fold">
      <div class="league-wrapper champion flex items-center">
        <!-- <div @click.stop="handle_match_collect" class="collect-img">
          <img v-if="!match_collect_state" :src="compute_img_url('icon-favorite')" alt="">
          <img v-if='match_collect_state' :src="compute_img_url('icon-favorite-s')">
        </div> -->
        <div v-if="menu_type === 100 && GlobalAccessConfig.get_collectSwitch()"  class="favorite" :class="[{favorited:match_of_list.tf},theme]"
          @click.stop="handle_league_fold"></div>
            <span class="league-title-text row justify-between" :class="{'without-collect': menu_type !== 100 || (menu_type === 100 && !GlobalAccessConfig.get_collectSwitch())}" >
              {{menu_type == 100 ? match_of_list.onTn : match_of_list.tn}}
            </span>
        </div>

      <div class="collapse-dire">
        <!-- <img class="icon-down-arrow" :class="{ 'collapsed': league_collapsed }" :src='compute_img_url("icon-collapse")' /> -->
        <icon-wapper color="#c9c9c9" name="icon-arrow" size="15px" :class="['icon-wapper', {'collapsed': !collapsed}]" />
      </div>
    </div>

    <template v-for="(hp,index) of match_of_list.hps">
      <div class="hps-wrap hairline-border" v-if="hp.hs != 2 && !collapsed" :key="index">
       
        <div class="flex items-center justify-between"
          :class="{'is-favorite':get_show_favorite_list}">
          <div class="match-title items-center">
            <div class="debug-head" style="color:red;position:absolute;right:0;">
              {{get_key_by_obg(hp)}}
            </div>
            <div class="hpn-wrap ellipsis">
              {{hp.hps}}
            </div>
          </div>
          <div v-if="!collapsed && hp.hmed" class="limit-time">
            <div class="limit-t-i">
              <template v-if="!['zh', 'tw'].includes(lang)">
                {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ $t('match_main.cut_off')}}
              </template>
              <template v-else>
                {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ $t('match_main.cut_off')}}
              </template>
            </div>
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
 
<style scoped lang="scss">
  @import "../styles/match-container-champion-2.scss";
</style>