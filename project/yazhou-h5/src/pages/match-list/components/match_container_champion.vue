<!--
 * @Author: Cronus
 * @Date: 2020-10-13 12：29:47
 * @Description: 冠军赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="champion-wrap" v-if="is_show">
    <!--体育类别  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
    <div class="sport-title match-indent"
    v-if="get_sport_show(i)"
    @click="ball_folding_click(match_of_list.csid)"
    >
      <span class="score-inner-span">
        {{match_of_list.csna}}
      </span>
      <div class="collapse-dire">
        <img class="icon-down-arrow" src=" image/wwwassets/bw3/list/league-collapse-icon-black.svg" :class="{collapsed:collapsed}" alt="" v-if="get_sport_show(i)">
        <img class="icon-down-arrow" src="image/wwwassets/bw3/list/league-collapse-icon.svg" :class="{collapsed:collapsed}" alt="" v-else>
      </div>
    </div>
    <div
      v-if="is_show_league(i)"
      class="league-container flex items-center justify-between hairline-border"
      @click="toggle_collapse_state(match_of_list);">
      <div class="league-wrapper champion flex items-center">
        <div
          v-if="menu_type === 100 && get_access_config.collectSwitch"
          class="favorite" :class="[{favorited:match_of_list.tf},get_theme]"
          @click.self.stop="toggle_collect(match_of_list)"></div>
            <div class="league-title">
              <div v-if="match_of_list.csid == 101" class="league-icon-mini league-icon-mini2" style="--num:39"></div>
              <div v-else-if="match_of_list.csid == 100" class="league-icon-mini league-icon-mini2" style="--num:42"></div>
              <div v-else-if="match_of_list.csid == 103" class="league-icon-mini league-icon-mini2" style="--num:40"></div>
              <div v-else-if="match_of_list.csid == 102" class="league-icon-mini league-icon-mini2" style="--num:41"></div>
            </div>
            <div
                class="league-title-text row justify-between"
                :class="{'without-collect': menu_type !== 100 || (menu_type === 100 && !get_access_config.collectSwitch)}"
            >{{menu_type == 100 ? match_of_list.onTn : match_of_list.tn}}</div>
        </div>

      <div class="collapse-dire">
        <img class="icon-down-arrow" src="image/wwwassets/bw3/list/league-collapse-icon.svg" :class="{collapsed:collapsed}" alt="" v-if="get_theme.includes('theme01')">
        <img class="icon-down-arrow" src="image/wwwassets/bw3/list/league-collapse-icon-black.svg" :class="{collapsed:collapsed}" alt="" v-else>
      </div>
    </div>

    <template v-for="(hp,index) of match_of_list.hps">
      <div class="hps-wrap hairline-border" v-if="hp.hs != 2 && !collapsed" :key="index">
        <div v-if="!collapsed && hp.hmed" class="limit-time flex items-center justify-center"
          :class="{'first-t':index == 0}">
          <div class="limit-t-i row justify-center items-center">
            <template v-if="!['zh', 'tw'].includes(get_lang)">
              {{(new Date(+hp.hmed)).Format($root.$t('time7'))}} {{ $root.$t('match_main.cut_off')}}
            </template>
            <template v-else>
              {{(new Date(+hp.hmed)).Format($root.$t('time7'))}} {{ $root.$t('match_main.cut_off')}}
            </template>
          </div>
        </div>

        <div class="match-title flex items-center"
          :class="{'is-favorite':get_show_favorite_list}">
          <div class="debug-head" style="color:red;position:absolute;right:0;">
            {{get_key_by_obg(hp)}}
          </div>
          <div class="hpn-wrap ellipsis">
            {{hp.hps}}
          </div>
        </div>
        <div class="ol-list-wrap flex justify-start" :data-ol="hp.ol.length" v-if="hp.ol">

          <odd-item-champion v-for="(ol_item,i) of hp.ol"
                            :key="i"
                            :hs="hp.hs"
                            :data-i="i"
                            :ol_item="ol_item"
                            :style="calc_bgcolor(ol_item)"
                            :class="calc_bgcolor(ol_item) && 'active-item'"
                            :csid="match_of_list.csid"
                            @click.native.stop="item_click(match_of_list,hp,ol_item)">
          </odd-item-champion>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import formartmixin from 'src/project/mixins/module/formartmixin.js';
import odd_convert from "src/public/mixins/odds_conversion/odds_conversion.js";
import bettings from "src/project/mixins/betting/betting";
import match_list_mixin from "src/project/mixins/match_list/match_list_mixin.js";
import common from "src/project/mixins/constant";
import msc from 'src/public/mixins/common/msc.js';
import {mapMutations,mapGetters} from 'vuex';
import oddItemChampion from "src/project/pages/match-list/components/odd_item_champion.vue";


export default {
  name: "match_container_champion",
  mixins: [formartmixin, odd_convert, bettings, match_list_mixin,msc, common],
  props: {
    // 当前组件的赛事数据对应列表的赛事
    match_of_list: Object,
    // 赛事处于列表中的下标
    i: Number,
    // 值为6当前为收藏页
    menu_type: Number | String,
    // 赛事列表相关操作的类型封装对象
    matchCtr: Object,
  },
  created(){
  },
  data(){
    return {
      //当前折叠状态 默认展开
      cur_folding_type: true
    }
  },
  methods: {
    ...mapMutations([
      'set_goto_detail_matchid',
      'set_details_item',
      'set_collapse_map_match',
      'set_collapse_csid_map',
      'set_collapse_all_ball',
      'set_match_list_loading',
    ]),
    /**
     * @description 判断是否显示联赛标题
     * @param {Number} i 赛事处于列表中的下标
     * @returns {Boolean}
     */
    is_show_league(i) {
      let flag = false;
      // 当前赛事
      let curr = this.matchCtr.match_list_data_sources[i];
      if (!curr) {
        return false;
      }
      
      // 虚拟体育没有tid而是tnameCode
      let property_key = "tnameCode";
      if(!curr[property_key]){
        property_key = "tid";
      }
      if (i == 0) {
        flag = true;
      } else {
        // 前一个赛事
        let prev = this.matchCtr.match_list_data_sources[i - 1];
        // 如果显示  赛事未开赛标题， 或者是  上一次和这一次tid 不一样  则显示联赛标题高度
        if (curr[property_key] != prev[property_key]) {
          flag = true;
        }
      }
      
      return flag;
    },
    /**
       * 判断是否显示体育类型
       * @param {Object} match 赛事对象
       * @returns {Boolean}
       */
      get_sport_show(i) {
        if (!_.get(this.get_current_menu, 'main.menuType')) {
          if (i > 0) {
            let p = this.matchCtr.list[i - 1], c = this.matchCtr.list[i];
            if (p && c) {
              return p.csid !== c.csid;
            }
          } else {
            return true;
          }
        } else if ([1, 2, 3, 4, 11, 12,100].includes(_.get(this.get_current_menu, 'main.menuType'))) {

          if (i > 0) {
            let p = this.matchCtr.list[i - 1], c = this.matchCtr.list[i];
            if (p && c) {
              return p.csid !== c.csid;
            }
          } else {
            return true;
          }
        } else {
          return false;
        }
      },
    get_key_by_obg(obj){
      let r = "";
      if(sessionStorage.getItem('wsl') != '9999') return r;
      if(obj.hid){
        r = `hid:${obj.hid}`;
      }
      return r;
    },
    /**
     * @description: 获取赔率
     * @param {Object} ol_item 投注项
     * @param {Object} hsw
     * @return {Undefined}
     */
    get_odds_value(ol_item,hsw){
      let ov = ol_item.ov;hsw='1';  //冠军玩法只支持欧赔
      let r1 = this.compute_value_by_cur_odd_type(ov / 100000,null, hsw );
      return r1 || 0;
    },
    gen_collapse_key(match){
       return match.tid;
    },
    /**
     * @description: 翻转折叠状态
     * @param {Undefined} Undefined
     * @return {Undefined}
     */
    toggle_collapse_state(){
      let map_collapse = _.cloneDeep(this.get_collapse_map_match);
      if(map_collapse){
        // 翻转折叠时始终将 赛事列表请求状态设为false
        this.set_match_list_loading(false)

        let tmid_list = [],tid = null,mid = null,max_l = this.matchCtr.list.length;
        for(let i = 0; i < max_l;i++){
          let match = this.matchCtr.list[i];
          let match_c_key = this.gen_collapse_key(match);
          if(match.mid == this.match_of_list.mid){
            tid = match.tid;
            mid = match.mid;
            tmid_list.push(match_c_key);
          }
          if(tid){
            if(tid == match.tid){
              if(mid != match.mid){
                tmid_list.push(match_c_key);
              }
            }
            else{
              break;
            }
          }
        }
        let tmid = this.gen_collapse_key(this.match_of_list);
        let f = map_collapse[tmid] ? 0 : 1;
        tmid_list.forEach(tmid => map_collapse[tmid] = f);
        this.set_collapse_map_match(map_collapse);
      }
    },
    /**
     * @description: 冠军投注,内嵌版走这里逻辑
     * @param {Object} match 赛事对象
     * @param {Object} hp 盘口级别对象
     * @param {Object} ol_item 赔率对象
     * @return {String}
     */
    item_click(match,hp,ol_item){
      if (!ol_item.ov || ol_item.ov < 101000) return;   //对应没有赔率值或者欧赔小于101000
      let flag = this.$common.odds.get_odds_active(0, hp.hs, ol_item.os);
      if (flag == 1 || flag == 4) {   //开盘和锁盘可以点击弹起来
        this.bet_click2(match, hp, ol_item);
      }
    },
    /**
     * @description: 冠军玩法联赛收藏与取消收藏
     * @param {Object} match 赛事
     * @return {String}
     */
    toggle_collect(match){
      let item_ = this.i;

      let param = {
        match,
        index:item_,
        type:'tf',
        type2:true,
      };
      this.$emit('toggle_collect_league',param);
    },
  },
  computed:{
    ...mapGetters([
      "get_bet_list",
      "get_show_favorite_list",
      "get_collapse_map_match",
      "get_collapse_csid_map",
      "get_collapse_all_ball",
      "get_lang",
      "get_theme",
      'get_curr_sub_menu_type',
      'get_current_menu',
      'get_access_config',
    ]),
    collapsed(){
      let result = true;
      let tmid = this.gen_collapse_key(this.match_of_list);
      result = this.get_collapse_map_match[tmid];
      // if(typeof result == 'undefined') {
      //   if(this.matchCtr.list.length > 1){
      //     result = true;
      //   }
      // }
      return result;
    },
    /**
     *@description 赛事下的全部盘口关盘时,不展示
     *@return {Boolean} flag
     */
    is_show(){
      let flag = true;
      if( _.get(this.match_of_list, 'hps')){
        flag = !this.match_of_list.hps.every(item => item.hs == 2)
      }

      return flag
    },
    /**
     * @description: 计算投注项背景颜色(冠军玩法)
     * @param {Object} ol 投注项最里层ol
     * @return {Object}
     */
    calc_bgcolor(){
      return function(ol){
        if(!ol) return;
        if(this.get_bet_list.includes(ol.oid)){
          if(this.get_theme.includes('y0')){
            return {'background-color':'#569FFD'}
          }
          return {'background-color':'#FFB001'}
        }else{
          return ""
        }
      }
    },
  },
  components: {
    oddItemChampion
  }
}
</script>

<style lang="scss" scoped>
.champion-wrap {
  //width: 3.61rem;
  //margin: 0 0 0 0.07rem;
  //border-radius: 0.08rem;
  //overflow: hidden;
  width: 100%;
  height: auto;
  position: relative;

  .league-container {
    height: 0.4rem;
    margin: 0 0.07rem;
    margin-top: 0.07rem;
    border-radius: 0.08rem;

    .league-wrapper {
      height: auto;

      .favorite {
        width: 0.16rem;
        height: 0.16rem;
        margin: 0 0.1rem 0.02rem 0.06rem;
        background: var(--q-color-com-img-bg-38);
        background-size: contain;
        background-repeat: no-repeat;

        &.favorited {
          background-image: var(--q-color-com-img-bg-8);
        }

        &.theme02 {
          &.favorited {
            background-image: var(--q-color-com-img-bg-9);
          }
        }

        &.theme01_y0, &.theme02_y0 {
          &.favorited {
            background-image: var(--q-color-com-img-bg-10);
          }
        }
      }

      .league-title {
        overflow: hidden;
        white-space: nowrap;
        font-size: 0.13rem;
        font-weight: bold;

        .league-icon-mini {
          width: 0.22rem;
          height: 0.22rem;
          margin: 0.01rem 0.07rem 0 0.09rem;
          position: relative;
          transform: scale(0.85);

          &.league-icon-mini2 {
            --per: -0.32rem;
            background: var(--q-color-com-img-bg-11) no-repeat center / 0.2rem 18.88rem;
            background-position-y: calc(var(--per) * var(--num));
          }

          img {
            width: 0.22rem;
            height: 0.22rem;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }

      .league-title-text {
        font-size: 0.12rem;
        height: 0.22rem;
        transform: translateY(0.01rem);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex-wrap: nowrap;
        padding-top: 0.02rem;
        width: 2.95rem;

        &.without-collect {
          margin-left: .06rem;
          display: contents;
        }
      }
    }
    .collapse-dire {
      margin: 0.05rem 0.11rem 0.07rem 0;

      .icon-down-arrow {
        width: 0.12rem;
        height: 0.06rem;
        display: block;
        transition: transform 0.3s;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
    }

    .collapse-dire {
      margin: 0.05rem 0.11rem 0.07rem 0;

      .icon-down-arrow {
        width: 0.12rem;
        height: 0.06rem;
        display: block;
        transition: transform 0.3s;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
    }
  }

  .limit-time {
    width: 100%;
    padding-top: 0.05rem;
    height: 0.25rem;
    font-size: 0.1rem;

    &.first-t {
      padding-top: 0;
      height: 0.2rem;
    }

    .limit-t-i {
      width: 3.45rem;
      height: 0.2rem;
      line-height: normal;
      margin: 0 auto;
      border-radius: 0.04rem;
    }
  }

  .hps-wrap {
    margin: 0 0.07rem;
    margin-top: 0.05rem;
    padding-top: 0.05rem;

    .match-title {
      height: 0.34rem;
      padding-left: 0.11rem;
      padding-top: 0.12rem;
      position: relative;

      &:before {
        width: 0.03rem;
        height: 0.16rem;
        transform: translateY(-1px);
        content: ' ';
        display: block;
        border-radius: 0.015rem;
      }

      .hpn-wrap {
        width: 96%;
        margin-left: 0.06rem;
      }
    }

    .ol-list-wrap {
      width: 100%;
      height: auto;
      flex-wrap: wrap;
      margin-top: 0.07rem;
      padding-left: 0.07rem;
      padding-bottom: 0.08rem;
    }

    .ol-list-wrap2 {
      padding-bottom: 0.08rem;
    }
  }
}
.sport-title {
    width: calc(100% - 0.07rem * 2);
    display: flex;
    align-items: center;
    padding-left: 0.1rem;
    height: 0.26rem;
    font-size: 0.11rem;
    background-image: var(--q-color-linear-gradient-bg-19);
    /*transform: translateY(3px);*/
    margin: 0 auto;
    border-radius: 0.06rem;

    &.hidden_sport {
      display: none !important;
    }
    .score-inner-span{
      width: 3.3rem;
      color: var(--q-color-fs-color-153);
    }
    .icon_match_cup, .icon_notstarted {
      margin-right: 0.1rem;
      font-size: 0.12rem;

      &:before {
        color: var(--q-color-com-fs-color-35);
      }
    }

    .icon_notstarted {
      &:before {
        color: var(--q-color-com-fs-color-36);
      }
    }

    &.menu-type-3 {
      height: 0.25rem;
      border-top: 1px solid var(--q-color-com-border-color-19);
      background-color: var(--q-color-com-bg-color-12);
      font-weight: bold;
      box-shadow: var(--q-color-box-shadow-color-3);
      position: relative;
      z-index: 2;
      padding-left: 0;

      &.not-playing {
        &:before {
          background: var(--q-color-com-bg-color-38);
        }
      }

      &:before {
        margin-right: 0.1rem;
        display: block;
        content: ' ';
        width: 0.04rem;
        height: 100%;
        background: var(--q-color-com-bg-color-39);
      }
    }
    .collapse-dire {
      margin: 0.05rem 0.11rem 0.07rem 0;

      .icon-down-arrow {
        width: 0.12rem;
        height: 0.06rem;
        display: block;
        transition: transform 0.3s;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
    }
  }
</style>

