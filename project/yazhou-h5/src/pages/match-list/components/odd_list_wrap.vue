<!--
 * @Author: cronus
 * @Date: 2020-11-14 11:05:33
 * @Description: 投注想列表
-->
<template>
<div class="odd-list-wrap" 
     :class="{
        standard: !show_newer_edition,
        special_play: [18].includes(+ _.get(current_tab_item, 'id')), 
        five_special_play: _.get(current_tab_item, 'id') === 19,
        five_no_data: !_.size(_.get(five_minutes_all_list, 'hl[0].ol'))
     }
    ">
  <!--新手版-->
  <div class="odd-list-container flex" v-if="show_newer_edition">
    <!--角球选中标志2白色版4黑色版-->
    <img class="icon-jiaoqiu"
      :class="{'selected show':show_lock_selected}"
      :src="calculate_color" />
      <!--角球未选中标志1白色版3黑色版-->
    <img class="icon-jiaoqiu"
      :style="{display:match.csid == 1 && footer_sub_menu_id == 114 ? 'block':'none'}"
      :src="get_theme.includes('theme01')?img1:img3" />
    <odd-column-item
      v-for="(ol_item,i) of ol_list"
      :key="i"
      @select_change="select_column_change_handle"
      :odd_item_i="i" 
      :match="match" 
      :odd_field="hp_item" 
      :hl_hs="hl_hs"
    />
    <template v-if="!ol_list || !ol_list.length">
      <odd-column-item :placeholder="1" :odd_item_i="0"/>
      <!--独赢才显示三个投注-->
      <odd-column-item :placeholder="1" v-if="show_3_space()" />
      <odd-column-item :placeholder="1" :odd_item_i="2"/>
    </template>
  </div>
  <!--标准版赔率容器  波胆 5分钟  玩法除外-->
  <template v-if="![18,19].includes(+_.get(current_tab_item, 'id'))">
    <div class="standard-odd-l-w" v-touch-swipe.mouse.right.left="odd_wrapper_pan"
      :class="{'status2':standard_odd_status == 1}"
      v-if="!show_newer_edition && get_n_s_changed_loaded">
      <!--标准版-->
      <div class="standard-odd-list row" 
           :class="{'f-child':standard_odd_status == 0,'r-child':standard_odd_status == 1}">
        <div class="odd-column-w" :key="hp_i_i+''+standard_odd_status"
             :class="{'boxing':match.csid == 12 } "
             v-for="(hp_item_obj,hp_i_i) of fill_empty_hps(get_hp_list(standard_odd_status))">
          <div class="odd-wrap-min" :class="`hp-${get_ol_length(hp_item_obj,hp_i_i)}`"
              :key="ol_item_i" v-for="(ol_item,ol_item_i) of get_ol_list(hp_item_obj,hp_i_i)">
            <odd-column-item
              :placeholder="ol_item.placeholder"
              :n_s="get_newer_standard_edition"
              :column_ceil="get_ol_length(hp_item_obj)"
              :odd_item_i="ol_item_i"
              :match="match"
              :odd_field="hp_item_obj"
              :hl_hs="get_hl_hs(hp_item_obj)"
            />
          </div>
        </div>
      </div>
    </div>
    <!--标准版 才有的样式 下划线 -->
    <div class="dir-standard row justify-center items-center"
      v-show="get_hp_list(1).length && !show_newer_edition">
      <div class="block" :class="{selected:standard_odd_status == 0}"></div>
      <div class="block" :class="{selected:standard_odd_status == 1}"></div>
    </div>
    <!--标准版 才有的样式  动态图方向箭头-->
    <template v-if="get_theme.includes('theme02')">
      <i class="slide_icon slide_icon_l animate-effect" v-if="is_show_scroll_dir(0)"></i>
      <i class="slide_icon slide_icon_r animate-effect-r" v-if="is_show_scroll_dir(1)"></i>
    </template>
    <template v-if="get_theme.includes('theme01')">
      <i class="slide_icon slide_icon_l animate-effect" v-if="is_show_scroll_dir(0)"></i>
      <i class="slide_icon slide_icon_r animate-effect-r" v-if="is_show_scroll_dir(1)"></i>
    </template>
  </template>
  <!-- 标准版 波胆玩法盘口赔率组件 -->
  <div v-else-if="[18].includes(+_.get(current_tab_item, 'id'))" class="correct_style">
    <!-- 波胆玩法 标题 -->
    <div class="correct_style_title">
      <div>
        <span>{{match.mhn}}</span>
        <span>{{$root.$t('football_playing_way.full_time_draw')}}</span>
        <span>{{match.man}}</span>
      </div>
      <div>
        <span>{{match.mhn}}</span>
        <span>{{$root.$t('football_playing_way.half_time_draw')}}</span>
        <span>{{match.man}}</span>
      </div>
    </div>
    <!-- 波胆玩法 盘口赔率 -->
    <div class="hps-bold-main-container">
      <div class="hps-bold-container" :key="hp_i+'hp_i_i_bold'" v-for="(hp_item,hp_i) of bold_all_list">
        <div class="hps-bold-other-left" :key="main_i+'main_i_bold'" v-for="(main_item,main_i) of get_bold_ol_list(hp_item,hp_i)">
          <div class="odd-wrap-hps-bold-other" 
               :key="ol_item_i+'ol_item_i_bold'" 
               v-for="(ol_item,ol_item_i) of main_item" 
               :class="{hold_other:ol_item.otd == -1}"
          >
            <odd-column-item
              :placeholder="ol_item.placeholder"
              :n_s="get_newer_standard_edition"
              :ol_list_item="ol_item"
              :match="match"
              :odd_field="hp_item"
              :hl_hs="get_hl_hs(hp_item)"
              :current_tab_item="current_tab_item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 标准版 5分钟 盘口赔率组件 -->
  <div v-else-if="[19].includes(+_.get(current_tab_item, 'id'))" class="five-minutes-to-play">
    <div class="odd-wrap-hps-bold-other" 
         :key="ol_item_i_five+'ol_item_i_five'" v-for="(ol_item,ol_item_i_five) of get_five_minutes_ol_list(this.five_minutes_all_list)"
         :class="{
           lastBestTwoOddWraps:[1172,1192].includes(+_.get(ol_item, 'otd')),
           lastFiveOddWraps:[1173,1193].includes(+_.get(ol_item, 'otd')),
           second_half: _.get(ol_item, 'ot') === '46-50',
           kill_shot: _.get(ol_item, 'ot') === 'ClutchGoal' && _.get(ol_item, 'os') === 1,
           'ClutchGoal-os-3': _.get(ol_item, 'ot') === 'ClutchGoal' && [1,2,7,10].includes(+match['ms']),
         }"
    >
      <odd-column-item
        :placeholder="ol_item.placeholder"
        :n_s="get_newer_standard_edition"
        :ol_list_item="ol_item"
        :match="match"
        :odd_field="five_minutes_all_list"
        :hl_hs="get_hl_hs(five_minutes_all_list)"
        :current_tab_item="current_tab_item"
      />
    </div>
    <!--  5分钟 图标  -->
    <div class="team-t-title-w" v-if="[1,3,5,7,8,9].includes(+match.csid) && _.size(_.get(five_minutes_all_list, 'hl[0].ol'))">
      <img @click="info_icon_click($event,match.mid)"
           :src="show_tips ? (get_theme.includes('y0') ? `${ $g_image_preffix}/image/bw3/svg/match-list/information-icon_y0.svg` : `${ $g_image_preffix }/image/bw3/svg/match-list/information-icon.svg`):
                (get_theme.includes('02') ? `${ $g_image_preffix }/image/bw3/svg/match-list/information-icon-gray2.svg` : `${ $g_image_preffix }/image/bw3/svg/match-list/information-icon-gray.svg`)" alt="">
      <span class="ellipsis">
        {{[1,2,7,10].includes(+match['ms']) ? $root.$t('football_playing_way.minutes_of_the_Xth_goal', {goalnr: minutes_of_the_Xth_goal}) : $root.$t('football_playing_way.any_goal')}}
      </span>
    </div>
    
  </div>

</div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import odd_column_item from "src/project/pages/match-list/components/odd_column_item.vue"

export default {
  props:{
    match:Object, // 赛事信息
    main_source:String, // 来源组件
    invoke_source:String,
    current_tab_item:Object, // 当前选中的小节玩法
    hps:Array,
    bold_all_list:null, // 波胆玩法的数据
    five_minutes_all_list:null, // 5分钟玩法的数据
  },
  data(){
    return {
      show_tips:false, // 罚牌玩法描述显示
      img1: "image/wwwassets/bw3/list/m_list_jiaoqiu_icon.svg",  // 白色版角球图标
      img2:"image/wwwassets/bw3/list/m_list_jiaoqiu_icon_s.svg",  // 白色版角球选中图标
      img3:"image/wwwassets/bw3/list/m_list_jiaoqiu_icon_black.svg",  // 黑色版角球图标
      img4:"image/wwwassets/bw3/list/m_list_jiaoqiu_icon_black_s.svg",  // 黑色版角球选中图标
      Y0_img_white: "image/wwwassets/bw3/list/m_list_jiaoqiu_icon_black_s_y0_white.png", // Y0 白色版角球选中图标
      hp_item:{},
      hl_hs:0,
      sport_id_convert:'',
      standard_odd_status:0, // 0 在左 1 在右
      show_lock_selected:false,  // 简版投注项选中时角球标志
      index_show_map:{}, // 简版投注项选中时角球标志
      screen_changing_timer:0
    }
  },
  mounted(){
    // 从vuex获取初始状态
    this.standard_odd_status = this.get_standard_odd_status
    this.modify_overtime_status(this.get_standard_odd_status);// 初始化时也调用
    this.$root.$on(this.emit_cmd.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE,this.fapai_way_tips_status_change_h);
  },
  computed:{
    ...mapGetters({
      footer_sub_menu_id:"get_footer_sub_menu_id",
      get_secondary_unfold_map:"get_secondary_unfold_map",
      get_bet_list:"get_bet_list",
    }),
    ...mapGetters([
      'get_newer_standard_edition',
      'get_curr_sub_menu_type',
      'get_n_s_changed_loaded',
      'get_theme',
      'get_menu_type',
      'get_standard_odd_status',
      'get_lang',
    ]),
    // 5分钟第X个进球时分tips文本提示
    minutes_of_the_Xth_goal() {
      if (!(this.match.msc && Array.isArray(this.match.msc) && this.match.msc.length)) {
        const suffix = this.get_lang === 'en' ? 'st' : ''
        return 1 + suffix;
      }
      
      const mscmap = new Map(this.match.msc.map(item => [item.split('|')[0], item.split('|')[1].split(':')]));
      const [home = 0, away = 0] = mscmap.get('S1');
      const score = +home + +away + 1;
      let suffix = ''
      if (this.get_lang === 'en') {
        if (score === 1) {
          suffix = 'st'
        } else if (score === 2) {
          suffix = 'nd'
        } else if (score === 3 ) {
          suffix = 'rd'
        } else {
          suffix = 'th'
        }
      }
      
      return score + suffix;
    },
    // 显示新手版
    show_newer_edition(){
      return this.get_newer_standard_edition == 1 || this.main_source == 'detail_match_list';
    },
    // 黑白色版，商户，图片显示判断
    calculate_color() {
      let flag = null
      if(this.get_theme.includes('y0')) {
        flag = this.Y0_img_white
      }else{
        this.get_theme.includes('theme01') ? flag = this.img2: flag = this.img4
      }
      return flag
    },
    //新手版赔率
    ol_list(){
      // hpid 对应球类
      let sport_id_convert;
      const sport_id = +this.match.csid;
      switch(sport_id){
        // 网球
        case 5:
          if(this.footer_sub_menu_id == 1){
            sport_id_convert = 153   //独赢
          }
          else if(this.footer_sub_menu_id == 4){
            sport_id_convert = 154   //让盘
          }
          else if(this.footer_sub_menu_id == 2){
            sport_id_convert = 169;  // 大小
          }
          else if(this.footer_sub_menu_id == 114){
            sport_id_convert = 153   //角球变独赢
          }
          break;
        // 羽毛球
        case 10:
          if(this.footer_sub_menu_id == 1){
            sport_id_convert = 153   //独赢
          }
          else if(this.footer_sub_menu_id == 4){
            sport_id_convert = 172   //让盘
          }
          else if(this.footer_sub_menu_id == 2){
            sport_id_convert = 173;  // 大小
          }
          else if(this.footer_sub_menu_id == 114){
            sport_id_convert = 153   //角球变独赢
          }
          break;
        case 8: // 乒乓球
        case 9: //排
        case 13: // 沙滩排球
        {
          if (this.footer_sub_menu_id == 1) {
            sport_id_convert = 153
          } else if (this.footer_sub_menu_id == 4) {
            sport_id_convert = 172
          } else if (this.footer_sub_menu_id == 2) {
            sport_id_convert = 173
          } else if (this.footer_sub_menu_id == 114) {
            sport_id_convert = 153   //角球独赢
          }
          break;
        }
        // 斯诺克
        case 7:
          if(this.footer_sub_menu_id == 1){
            sport_id_convert = 153
          }
          else if(this.footer_sub_menu_id == 4){
            sport_id_convert = 181
          }
          else if(this.footer_sub_menu_id == 2){
            sport_id_convert = 182
          }
          else if(this.footer_sub_menu_id == 114){
            sport_id_convert = 153   //角球独赢
          }
          break;
        // 篮球
        case 2:
        case 6:  //美
          if(this.footer_sub_menu_id == 1){
            sport_id_convert = 37
          }
          else if(this.footer_sub_menu_id == 4){
            sport_id_convert = 39
          }
          else if(this.footer_sub_menu_id == 2){
            sport_id_convert = 38
          }
          else if(this.footer_sub_menu_id == 114){
            sport_id_convert = 37   //角球独赢
          }
          break;
        // 足球
        case 1:       // hpid 1(独赢) 4(让球) 2(大小) 114(角球)
          sport_id_convert = this.footer_sub_menu_id;
          break;
        // 3、4、6、9棒冰美排
        case 3:  //棒
          if(this.footer_sub_menu_id == 1){
            sport_id_convert = 242
          }
          else if(this.footer_sub_menu_id == 4){
            sport_id_convert = 243
          }
          else if(this.footer_sub_menu_id == 2){
            sport_id_convert = 244
          }
          else if(this.footer_sub_menu_id == 114){
            sport_id_convert = 242   //角球独赢
          }
          break;
        case 4:  //冰
          sport_id_convert = this.footer_sub_menu_id;
          if(this.footer_sub_menu_id == 114){
            sport_id_convert = 1   //角球独赢
          }
          break;
        case 12: // 拳击
          if(this.footer_sub_menu_id == 1){
            sport_id_convert = 153
          }
          else if(this.footer_sub_menu_id == 2){
            sport_id_convert = 2
          }
          break;
        case 101: //电竞DOTA
        case 100: //电竞lol
        case 102: //CS GO
        case 103: //王者荣耀1
          if(this.footer_sub_menu_id == 1){
            sport_id_convert = 30001   //独赢
          }
          else if(this.footer_sub_menu_id == 4){
            sport_id_convert = 30002   //让盘
          }
          else if(this.footer_sub_menu_id == 2){
            sport_id_convert = 30003;  // 大小
          }
          else if(this.footer_sub_menu_id == 114){
            sport_id_convert = 30001   //角球变独赢
          }
          break;
        default:
          sport_id_convert = this.footer_sub_menu_id;
          break;
      }

      // 赛果精选赛事
      if(this.main_source == "detail_match_list"){
        switch(sport_id){
          case 5:
            sport_id_convert = 154
            break;
          case 10:
            sport_id_convert = 172
            break;
          case 8:
            sport_id_convert = 172
            break;
          case 7:
            sport_id_convert = 181
            break;
          case 2:
            sport_id_convert = 39
            break;
          case 1:
            sport_id_convert = 4;
            break;
          case 3:
            sport_id_convert = 243
            break;
          case 4:
            sport_id_convert = 4;
            break;
          case 6:
            sport_id_convert = 39
            break;
          case 9:
            sport_id_convert = 172
            break;
        }
      }

      //足球加时阶段处理 手球
      if(sport_id == 1){
        if([32,33,41,42].includes(+this.match.mmp)){
          // hpid 1(独赢) 4(让球) 2(大小) 114(角球)
          if(this.footer_sub_menu_id == 1){
            sport_id_convert = 126
          }
          else if(this.footer_sub_menu_id == 4){
            sport_id_convert = 128
          }
          else if(this.footer_sub_menu_id == 2){
            sport_id_convert = 127
          }
          else if(this.footer_sub_menu_id == 114){
            sport_id_convert = 114   //角球独赢
          }
        }
      }
      this.sport_id_convert = sport_id_convert;
      let found = this.match.hps ? this.match.hps.filter(item => item.hpid == sport_id_convert)[0] : null;
      let ol_list_custom=[];
      if(found){
        Object.assign(this.hp_item,found);

        let f_hl_item = found.hl[0];
        if(found.hl && f_hl_item){
          this.hl_hs = f_hl_item.hs;
          let ol_list = f_hl_item.ol;
          if(ol_list && ol_list.length){
            //主胜,客胜,平变为主胜,平,客胜
            if(this.show_newer_edition){
              if(ol_list.length == 3){//只有三个投注项时才做此操作
                let found = _.findIndex(ol_list,item => item.ot == 2);
                if(found == 1){
                  let delted = f_hl_item.ol.splice(found,1);
                  f_hl_item.ol.push(delted[0]);
                }
              }
            }
            ol_list_custom = ol_list;
          }
          else{
            ol_list_custom = [];
          }
        }
      }
      return ol_list_custom;
    },
    //根据调用方式获取赔率列表
    finally_ol_list(){
      let data = [];
      if(!this.invoke_source){
        data = this.match.hps;
      }
      else if(this.invoke_source == "attached" && this.hps && this.hps.length){
        data = this.hps;
      }
      return data;
    },
  },
  methods:{
    ...mapMutations(['set_foot_ball_screen_changing', 'set_standard_odd_status']),
    // 占位,填充三个空元素
    fill_empty_hps(hpsArr){
      if((hpsArr||[]).length==0){
        return [{hl:[{}]},{hl:[{}]},{hl:[{}]}]
      }
      return hpsArr;
    },
    // 5分钟玩法
    get_five_minutes_ol_list(data){
      // 前端 写死的格子，3行，一行6个格子
      let ol_list = [{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},
                     {placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},
                     {placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},
                    ]
      let ol = _.get(data, 'hl[0].ol', [])
      let ol_len = 0
      if(ol.length){
        const mst = +this.match.mst
        // 滚球阶段无绝杀投注项，最多为19个投注项, 非滚球阶段最多为20个投注项
        const ol_max_len = [1,2,7,10].includes(+this.match.ms) ? 19 : 20
        const placeholder_len = ol_max_len - ol.length

        // 投注项格子补齐
        if (ol.length < ol_max_len) {
          for (let i = 0; i < placeholder_len; i++) {
            ol.unshift({placeholder:1})
          }
        }
        // 25分钟前显示4行，25分钟(包含)后显示3行
        if (mst < 25 * 60) {
          ol_list = ol;
        } else {
          // 25分钟(包含)后显示3行,从第6个开始 截取
          ol_list = ol.slice(6)
        }
        for(let i=0, list_len = ol.length; i< list_len; i++){
          //  如果是特殊的无进球  或者   绝杀(补时) 球, 累加多少次出现
          if([1172, 1192, 1173,1193].includes(+ol[i].otd)){
            ol_len++
          }
        }
        // ol 的长度 减去 无进球 绝杀球 的次数，小于7个，前端手动填补格子
        if(ol.length - ol_len <= 6){
          // 前端手动 填补 1行6列 的格子
          ol_list = [{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1},{placeholder:1}].concat(ol_list)
        }
      }
      // console.error(1111, ol_list);
      return ol_list
    },
    // 罚牌玩法描述显示
    fapai_way_tips_status_change_h(flag){
      this.show_tips = flag;
    },
    // 波胆玩法
    // h获取 ol 投注项数组， otd 1  主队，  otd 0  平， otd 2  客队， otd -1  其它 
    get_bold_ol_list(data, index){
      // 默认3行 投注项
      let ol_list = [
        [{placeholder:1},{placeholder:1},{placeholder:1}],
        [{placeholder:1},{placeholder:1},{placeholder:1}],
        [{placeholder:1},{placeholder:1},{placeholder:1}],
      ];
      let mapping = this.get_secondary_unfold_map[this.match.mid];
      let bodan_len =  0 
      if(mapping && mapping.split('-') && mapping.split('-')[2] ){
        bodan_len = mapping.split('-')[2] - 1
      }
      if(_.get(data, 'hl[0].ol')){
        ol_list = data.hl[0].ol;
        let bold_left =[], bold_middle=[], bold_right=[], bold_other= [] // 其它
        for(let i=0, list_len = ol_list.length; i< list_len; i++){
          if(ol_list[i].otd == 1){
            bold_left.push(ol_list[i])
          }else if(ol_list[i].otd == 0){
            bold_middle.push(ol_list[i])
          }else if(ol_list[i].otd == 2){
            bold_right.push(ol_list[i])
          }else if(ol_list[i].otd == '-1'){
            bold_other.push(ol_list[i])
          }
        }
        // 如果没有值，就负责个初始值
        function chect_array(arr){
          if (arr.length === 0) {
            arr.push({
              placeholder:1,
              otd:-1,
              os:1
            }) 
          }
        }
        chect_array(bold_other)
        let all_bold_list =[bold_left, bold_middle, bold_right]
        this.supplementary_spaces(all_bold_list.length, all_bold_list, bodan_len)
        // 最长数组的，再添加个 其它投注项
        all_bold_list[0].push(...bold_other)
        return all_bold_list
      }else{
        // 如果总高度 大于 3行，则补充
        if(bodan_len>3){
          this.supplementary_spaces(ol_list.length, ol_list, bodan_len)
          ol_list[2].push({placeholder:1,otd:-1})
        }
        return ol_list
      }
    },
    // 波胆玩法补充 封盘空格
    supplementary_spaces(all_bold_list_length, all_bold_list, bodan_len){
      for(let j = 0; j < all_bold_list_length; j++){
        if(all_bold_list[j].length < bodan_len){
          for(let x = all_bold_list[j].length; x <bodan_len; x++){
            all_bold_list[j].push({placeholder:1})
          }
        }
      }
    },
    // $event 时间对象 mid 赛事id
    info_icon_click($event,mid){
      this.$root.$emit(this.emit_cmd.EMIT_INFO_ICON_CLICK,$event,mid,this.current_tab_item,this.match);
    },
    /**
     * 显示横向滚动标识
     * @param {Number} dir 0 向左; 1 向右
     */
    is_show_scroll_dir(dir){
      let have_2_part = this.get_hp_list(1).length;
      if(!have_2_part) return false;
      // 增加水球csid：16 联合式橄榄球14 的显示
      if(dir == 0){
        return this.standard_odd_status != 1 && !this.show_newer_edition && [1,7,11,16,14].includes(+this.match.csid);
      }
      else if(dir == 1){
        return this.standard_odd_status == 1 && !this.show_newer_edition && [1,7,11,16,14].includes(+this.match.csid);
      }
    },
    /**
     * 滑动赔率容器
     * @param {Number} type 0 第一部分; 1 第二部分
     * @return Undefined Undefined
     */
    odd_wrapper_pan({ direction }){
      let standard_odd_status=0;
      if (this.get_hp_list(1).length ) {
        if(direction == "left"){
          standard_odd_status = 1;
        }
        else{
          standard_odd_status = 0;
        }
        this.set_standard_odd_status(standard_odd_status)
        // this.$emit('odd_pan',this.standard_odd_status);
        clearTimeout(this.screen_changing_timer);
        this.set_foot_ball_screen_changing(1);
        this.screen_changing_timer = setTimeout(() => {
          this.set_foot_ball_screen_changing(0);
        },500);
      }
    },
    /**
     * 获取hp指定部分
     * @param {Number} type 0 第一部分; 1 第二部分
     */
    get_hp_list(type){
      if(type == 0){
        let hps = [];
        if(this.match && this.finally_ol_list){
          if(this.match.csid == 12){
            hps = this.finally_ol_list.slice(0,2);
          }else{
            hps = this.finally_ol_list.slice(0,3);
            for(let i = 3 - hps.length;i > 0;i--){
              hps.push({
                hl:[{}]
              });
            }
          }
        }
        return hps;
      }
      else if(type == 1){
        let hps = [];//
        if(this.match && _.size(this.finally_ol_list) > 3){
          if(this.match.csid == 12){
            hps = this.finally_ol_list.slice(3,5);
          }else{
            hps = this.finally_ol_list.slice(3,6);
          }
        }
        return hps;
      }
    },
    // 获取hl的hs
    get_hl_hs(hp_item_obj){
      let hs = 0;
      if(_.get(hp_item_obj, 'hl[0]')){
        hs = hp_item_obj.hl[0].hs;
      }
      return hs;
    },
    /**
     * 获取ol的 长度
     * @param {Number} hp_item_obj
     * @param {Number} hp_i_i
     * @return Undefined Undefined
     */
    get_ol_length(hp_item_obj,hp_i_i){
      let ol_list = [];
      if(_.get(hp_item_obj, 'hl[0].ol')){
        ol_list = hp_item_obj.hl[0].ol;
        if(this.get_menu_type == 3000){
          return 2;
        }
      }
      else{
        if([1,4,11,16].includes(+this.match.csid)){
          if(this.match.hps && this.match.hps[hp_i_i]){
            if(this.match.hps[hp_i_i].hpid == 1){
              return 3;
            }
          }
        }
        if([1].includes(+this.match.csid) && hp_i_i == 0 && !_.get(this.match, 'hps.length')){
          return 3;
        }
      }
      return ol_list.length;
    },
    /**
     * 获取投注项
     * @param {Object} hp_item
     * @param {Number} hp_i_i
     * @return Undefined Undefined
     */
    get_ol_list(hp_item,hp_i_i){
      let ol_list = [{placeholder:1},{placeholder:1},{placeholder:1}];
      if(_.get(hp_item, 'hl[0].ol')){
        ol_list = hp_item.hl[0].ol;
      }
      else{
        // 次要玩法
        if(this.invoke_source == 'attached'){
          //独赢与半场独赢
          if([111,119,126,129].includes(+hp_item.hpid)){
            ol_list = [{placeholder:1}, {placeholder:1}, {placeholder:1}];
          }
        } else{
          if([1,4,11,16].includes(+this.match.csid)){
            if(this.match.hps && this.match.hps[hp_i_i]){
              if(this.match.hps[hp_i_i].hpid == 1){
                ol_list = [{placeholder:1},{placeholder:1},{placeholder:1}];
              }
            }
          }
        }

      }
      return ol_list;
    },
    // 简版投注项选中时角球标志
    select_column_change_handle($event){
      this.index_show_map[$event.i] = $event.flag;
      let flag = false;
      Object.keys(this.index_show_map).forEach(key => {
        if(this.index_show_map[key]){
          flag = true;
        }
      });
      if(flag){
        flag = this.footer_sub_menu_id == 114;
      }
      this.show_lock_selected = flag;
    },
    // 如果是在子玩法中,数据不足6条
    modify_overtime_status(vuex_status){
      // 如果第二页为空 则取第一页
        if(vuex_status==1 && this.get_hp_list(1).length==0){
          this.standard_odd_status = 0;
        }else {
          this.standard_odd_status = vuex_status;
        }
    },
    /**
     * 显示三个投注项
     * @param Undefined Undefined
     * @return Undefined Undefined
     */
    show_3_space(){
      let r = false;
      if(this.footer_sub_menu_id == 1){
        r = [1,4,11,16].includes(this.match.csid * 1);
      }
      if(this.main_source == 'detail_match_list'){
        r = false;
      }
      return r;
    },
  },
  components:{
    "odd-column-item":odd_column_item
  },
  destroyed(){
    this.$root.$off(this.emit_cmd.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE,this.fapai_way_tips_status_change_h);
  },
  watch:{
    get_standard_odd_status(status) {
       this.modify_overtime_status(status);
    },
    hps() { // 左右tab切换也要计算赔率
      this.modify_overtime_status(this.get_standard_odd_status);
    }
  }
}
</script>

<style lang="scss" scoped>
.correct_style{
  .correct_style_title{
   display: flex;
    //width: 100%;
    //overflow: hidden;
    position: relative;
    left: -.03rem;
    >div{
      width: 1.75rem;
      display: flex;
      padding-left: .1rem;
      >span{
        flex: 1;
        font-size: 10px;
        color: var(--q-color-fs-color-3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        //height: .24rem;
        //line-height: .24rem;
      }
      &:nth-child(1){
        >span{
          &:nth-child(2){
            flex: 1.2;
            position: relative;
            left: -.02rem;
          }
        }
      }
      &:nth-child(2){
        >span{
          color: var(--q-color-fs-color-135);
        }
      }
    }
  }
  //  波胆 容器
  .hps-bold-main-container{
    display: flex;
    .hps-bold-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      &:last-child{
        margin-left: 0.05rem;
      }
      //padding-left: .05rem;
      .hps-bold-other-left{
        margin-right: .02rem;
        position: relative;
        &:last-child{
          margin-right: unset;
          .odd-wrap-hps-bold-other {
            &.hold_other{
              left: unset;
              right: 0;
            }
          }
        }
        .odd-wrap-hps-bold-other {
          width: 0.56rem;
          height: 0.3rem;
          overflow: hidden;
          border-radius: 0.02rem;
          margin-bottom: .02rem;
          background-color: var(--q-color-page-bg-color-9);
          &.hold_other{
            width: 1.72rem;
            position: absolute;
            bottom: -.33rem;
          }
          ::v-deep .odd-column-item{
            flex: unset!important;
            width: 100%;
            &.mred{
              background: var(--q-color-page-bg-color-97);
              border: 1px solid var(--q-color-com-border-color-14);
              border-radius: 2px;
            }
            &.mgreen{
              background: var(--q-color-page-bg-color-98);
              border: 1px solid var(--q-color-com-border-color-15);
              border-radius: 2px;
            }
            .odd-title{
              font-size: .1rem;
              margin-bottom: unset;
              color:var(--q-color-fs-color-6);
            }
            .odd-value{
              color: var(--q-color-fs-color-3);
              &.red{
                color: var(--q-color-com-fs-color-17) !important;
              }
              &.green{
                color: var(--q-color-com-fs-color-10) !important;
              }
            }
          }
        }
      }
    }
  }
}
.five-minutes-to-play{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .team-t-title-w {
    width: 1.1rem;
    height: 0.3rem;
    margin-bottom: 0.02rem;
    font-size: 0.12rem;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    color: var(--q-color-fs-color-6)!important;
    img {
      display: block;
      margin-bottom: 0.02rem;
      margin-right: .05rem;
    }
    .team-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 1.07rem;
    }
  }
    .odd-wrap-hps-bold-other {
      width: 0.56rem;
      height: 0.3rem;
      overflow: hidden;
      border-radius: 0.02rem;
      margin-bottom: .02rem;
      margin-right: .02rem;
      background-color: var(--q-color-page-bg-color-9);
      &.hold_other{
        width: 1.72rem;
        position: absolute;
        bottom: -.33rem;
      }
      &:nth-child(6n){
        margin-right: unset;
      }
      &.lastBestTwoOddWraps{
        position: absolute;
        right: 1.165rem;
        bottom: 0;
        width: 1.14rem;
        margin-right: 0;
      }
      &.lastFiveOddWraps{
        position: absolute;
        right: 0;
        bottom: 0;
        width: 1.14rem;
        margin-right: 0;
      }
      &.second_half, &.kill_shot {
        ::v-deep .odd-title {
          display: inline-block;
          white-space: nowrap;
          transform: scale(0.9);
        }
      }
      &.ClutchGoal-os-3 {
        ::v-deep .item-inner {
          display: none;
        }
      }
      ::v-deep .odd-column-item{
        flex: unset!important;
        width: 100%;
        &.mred{
          background: var(--q-color-page-bg-color-97);
          border: 1px solid var(--q-color-com-border-color-14);
          border-radius: 2px;
        }
        &.mgreen{
          background: var(--q-color-page-bg-color-98);
          border: 1px solid var(--q-color-com-border-color-15);
          border-radius: 2px;
        }
        .odd-title{
          font-size: .1rem;
          margin-bottom: unset;
          color:var(--q-color-fs-color-6);
        }
        .odd-value{
          color: var(--q-color-fs-color-3);
          &.red{
            color: var(--q-color-com-fs-color-17) !important;
          }
          &.green{
            color: var(--q-color-com-fs-color-10) !important;
          }
        }
      }
    }
}

@keyframes dir_remind_animate {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  60% {
    transform: translateX(-0.06rem);
    opacity: 1;
  }
  100% {
    transform: translateX(-0.09rem);
    opacity: 0;
  }
}

@keyframes dir_right_remind_animate {
  0% {
    transform: translateX(-0.09rem) rotate(180deg);
    opacity: 0;
  }
  60% {
    transform: translateX(-0.06rem) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: translateX(0) rotate(180deg);
    opacity: 0;
  }
}

.odd-list-wrap {
  position: relative;
  flex-shrink: 0;

  &.standard {
    width: 1.84rem;
    height: 1.05rem;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  &.special_play{
    width: unset;
    height: unset;
    overflow: unset;
    //padding-bottom: .31rem;
  }
  &.five_special_play{
    width: 100%;
    height: unset;
    padding-bottom: .32rem;
  }
  &.five_no_data{
    padding-bottom: unset;
  }

  .slide_icon {
    width: 0.12rem;
    height: 0.12rem;
    position: absolute;
    top: 0.43rem;
    right: -0.03rem;

    &.animate-effect {
      animation: dir_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
    }

    &.animate-effect-r {
      animation: dir_right_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
    }
  }

  .odd-list-container {
    width: 1.7rem;
    height: 0.56rem;
    border-radius: 0.06rem;
    position: relative;
    overflow: hidden;

    .icon-jiaoqiu {
      width: 0.255rem;
      height: 0.255rem;
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 1;

      &.selected {
        z-index: 2;
        display: block;
      }
    }
  }

  .standard-odd-l-w {
    height: 1.01rem;
    touch-action: pan-y !important;
    width: 3.68rem;
    flex-shrink: 0;
    position: relative;
    left: 0;
    display: flex;
    transition: transform 0.2s;
    -webkit-transition: transform 0.2s;
    overflow: hidden;

    &.status2 {
      -webkit-transform: translateX(-1.7rem);
      transform: translateX(-1.7rem);
    }
  }

  .dir-standard {
    width: 1.8rem;
    position: absolute;
    bottom: 0;

    .block {
      width: 0.08rem;
      height: 0.02rem;
      background: var(--q-color-com-bg-color-44);
      border-radius: 0.01rem;

      &:last-child {
        margin-left: 0.04rem;
      }
    }
  }

  .standard-odd-list {
    width: 1.84rem;
    flex-shrink: 0;
    position: absolute;
    height: 100%;

    &.f-child {
      left: 0;
    }

    &.r-child {
      right: 0.14rem;
    }

    .odd-wrap-min {
      width: 0.6rem;
      height: 0.32rem;
      overflow: hidden;
      border-radius: 0.02rem;
      margin-bottom: 0.02rem;

      &.hp-2, &.hp-0 {
        height: 0.49rem;
      }

      &:last-child {
        margin-bottom: 0;
      }

      &.column2 {
        height: 0.46rem;
      }
    }

    .odd-column-w {
      margin-left: 0.02rem;
      height: 100%;

      &:first-child {
        margin-left: 0;
      }

      &.boxing {
        .odd-wrap-min {
          width: 0.91rem;
        }
      }
    }
  }
}
</style>
