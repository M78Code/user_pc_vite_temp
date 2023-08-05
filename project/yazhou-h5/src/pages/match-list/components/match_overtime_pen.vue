<!--
 * @Author: Cronus
 * @Date: 2021-05-12 10:16:17
 * @Description: 加时赛点球大战等新增玩法
-->
<template>
  <div class="m-o-p-wrapper" v-show="show_tab_by_data">
    <span v-if="wsl_flag" class="wsl_flag_777">
      {{'csid:'+match.csid+ '---mid:'+match.mid+ '---tid:'+match.tid}}---{{get_secondary_unfold_map[match.mid]}}
    </span>
    <!--次要玩法 标题主名称-->
    <div class="tab-m-o-w row items-center" ref="sub_play_scroller">
      <template v-for="(t_item, i) of tab_list.filter(x=>x.show_tab)">
        <div
          ref="sub_play_scroll_item"
          class="tab-item-h row items-center" :class="{'collapsed':t_item.unfold == 1}"
          @click="overtime_tab_handle(t_item,undefined,'is-user', i)"
            :key="i">
          <div>
            {{t_item.title}}
          </div>
          <!--折叠得箭头图标-->
          <img class="league-collapse-dir" :class="{'collapsed':t_item.unfold  == 1 }"
               :src="(`${ $g_image_preffix }/image/wwwassets/bw3/list/league-collapse-icon${get_theme.includes('theme02')?'-black':''}${t_item.unfold== 1?(get_theme.includes('y0')?'-collapse-y0':'-collapse'):''}.svg`)" />
        </div>
      </template>
    </div>
    <!-- 次要玩法   1. 左边队伍名标题   2. 右边 盘口组件  模块 -->
    <div class="transition-w-odd" :mid="match.mid" v-if="current_tab_item.hps" 
         :class="{
          expanded:any_unfold && any_unfold != '0', 
          bodan_wanfa: [18].includes(+ _.get(current_tab_item,'id')) && bold_gaodu_css > 3,
          bodan_wanfa_small: any_unfold && [18].includes(+ _.get(current_tab_item,'id')) && bold_gaodu_css <= 3,
          five_minutes_wanfa: any_unfold && any_unfold != '0' && [19].includes(+ _.get(current_tab_item,'id')),
        }"
    >
      <!--次要玩法标 队名 和 比分 和 盘口-->
      <div class="row justify-between" v-if="any_unfold">
        <!--次要玩法标 队名 和 比分  次要玩法 左边的 区域    波胆，5分钟玩法  不显示-->
        <div class="team-title-container" v-if="![18,19].includes(+ _.get(current_tab_item, 'id'))">
          <!--主队名 和 比分-->
          <div class="team-t-title-w" :class="{
            'is-handicap':current_tab_handicap_index == 1,
            'is-handicap-1':current_tab_handicap_index == 2,
            }">
            <div class='team-title'>
              {{match.mhn}}
            </div>
            <!--显示次要玩法比分-->
            <div class="way-score"
              v-if="[1,5,7,8,9].includes(+current_tab_item.id) && match.ms == 1">
              {{home_score}}<!--7,8,9 网,乒,斯-->
            </div>
          </div>
          <!--副队名 和 比分-->
          <div class="team-t-title-w" :class="{
            'is-handicap':current_tab_handicap_index == 2,
            'is-handicap-1':current_tab_handicap_index == 1,
            }">
            <div class='team-title'>
              {{match.man}}
            </div>
            <!--显示次要玩法比分-->
            <div class="way-score"
              v-if="[1,5,7,8,9].includes(+current_tab_item.id) && match.ms == 1">
              {{away_score}}<!--7,8,9 网,乒,斯-->
            </div>
          </div>
          <!--  玩法描述图标显示  -->
          <div class="team-t-title-w fight-type" v-if="[1,3,5,7,8,9].includes(+match.csid)"> <!--csid 7斯诺克-->
            <!--csid 1足球-->
            <img v-if="[2,5,17].includes(+current_tab_item.id)"
                 @click="info_icon_click($event,match.mid)"
                 :src="show_tips ? (get_theme.includes('y0') ? `${ $g_image_preffix}/image/bw3/svg/match-list/information-icon_y0.svg` : `${ $g_image_preffix }/image/bw3/svg/match-list/information-icon.svg`):
                (get_theme.includes('theme01') ? `${ $g_image_preffix }/image/bw3/svg/match-list/information-icon-gray.svg` : `${ $g_image_preffix }/image/bw3/svg/match-list/information-icon-gray2.svg`)" alt="">
            {{match.csid == 1  ? current_tab_item.title : mmp_map_title}}
          </div>
        </div>
        <!--次要玩法 盘口 右边的 区域-->
        <odd-list-wrap
          :main_source="main_source"
          :match="matchCtr.list[i]"
          :hps="current_tab_item.hps"
          :current_tab_item="current_tab_item"
          :invoke_source="'attached'"
          :bold_all_list="bold_all_list"
          :five_minutes_all_list="five_minutes_all_list"
        />
      </div>
    </div>

  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import odd_list_wrap from 'src/project/pages/match-list/components/odd_list_wrap.vue';
import {get_match_base_info_by_mids} from "src/project/api/module/common/index.js";
import match_list_mixin from "src/project/mixins/match_list/match_list_mixin";

export default {
  name:'match_overtime_pen',
  mixins:[match_list_mixin],
  props:{
    main_source:String,   //数据源
    matchCtr:Object,      //数据仓库数据
    i:Number,   //所在位置
  },
  data(){
    return{
      wsl_flag: sessionStorage.getItem('wsl') == 7777,
      show_tips:false, // 罚牌玩法描述显示
      any_unfold:false, // 次要玩法 整块区域是否展开
      // 当前的次要玩法 item 内容
      current_tab_item:{
        hps:[ {hl:[{}]} ],
        title:'',
        id:undefined,
      },
      current_hps_key: '', // 玩法 key （如：hpsAdd, hps15Minutes）
      // 玩法标题总内容
      tab_list:[
        { // 5分钟
          title:this.$root.$t('football_playing_way.hps5Minutes'),
          id:19,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids: "",
          hps_key:'hps5Minutes',// 5分钟
          play_id:1009,
        },
        {  // 十五分钟玩法
          title:this.$root.$t('football_playing_way.hps15Minutes'),
          id:17,
          unfold:0,
          show_tab:false,
          hps15Minutes:[{
            hl:[{}]
          }],
          pids:'32,33,34,231,232,233',
          hps_key:'hps15Minutes',// 15分钟
          play_id:1007,
        },
        { // 波胆
          title:this.$root.$t('football_playing_way.hpsBold'),
          id:18,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids: "7",
          hps_key:'hpsBold',// 波胆
          play_id:1008,
        },
        { // 角球
          title:this.$root.$t('football_playing_way.corner'),
          id:1,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'-111,113,-114,-119,-121,-122',
          hps_key:'hpsCorner',// 角球
          play_id:1001,
        },
        {// 罚牌
          title:this.$root.$t('football_playing_way.penalty_cards'),
          id:5,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'310,306,307,311,308,309',
          hps_key:'hpsPunish',// 罚牌
          play_id:1003,
        },
        {// 晋级
          title:this.$root.$t('football_playing_way.promotion'),
          id:3,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'-135,-136',
          hps_key:'hpsPromotion',// 晋级
          play_id:1005,
        },
        {
          title:this.$root.$t('football_playing_way.champion'),
          id:30,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'136',
          hps_key:'hpsOutright',// 冠军
          play_id:1006,
        },
        {
          title:this.$root.$t('football_playing_way.overtime'),
          id:4,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'-126,-128,-127,-129,-130,-332',
          hps_key:'hpsOvertime', // 加时
          play_id:1002,
        },
        {
          title:this.$root.$t('football_playing_way.penalty_shootout'),
          id:2,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'-333,-334,-335',
          hps_key:'hpsPenalty', // 点球大战
          play_id:1004,
        },
        // 篮球
        {
          title:this.$root.$t('basketball_playing_way.quarter'),
          id:6,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'48,46,45',
          hps_key:'hpsAdd', // 篮球小节玩法
          play_id:2003,
        },
        // 网球
        {
          title:this.mmp_map_title,
          id:7,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'162,163,164',
          hps_key:'hpsAdd',
          play_id:2003,
        },
        //乒乓球
        {
          title:this.mmp_map_title,
          id:8,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'175,176,177',
          hps_key:'hpsAdd',
          play_id:2003,
        },
        //斯诺克
        {
          title:this.mmp_map_title,
          id:9,
          unfold:0,
          show_tab:false,
          hps:[{
            hl:[{}]
          }],
          pids:'184,185,186,190,191',
          hps_key:'hpsAdd',
          play_id:2003,
        },
      ],
      // 当前打开的玩法名称
      mmp_map_title:'',
      // 波胆玩法数据
      bold_all_list:[{hl:[{}]},{hl:[{}]}],
      five_minutes_all_list:{hl:[{}]}, // 5分钟玩法数据
      bold_gaodu_css: 3,
    }
  },
  created () {
    //用户改变展开折叠状态时钟
    this.init_tab_timer = null;
    this.compute_list_dom_time = null;
  },
  mounted(){
    if(["virtual_sports","category"].includes(this.$route.name)){
      return;
    }
    // mmp映射赛事阶段名，国际化语言
    this.match_period_map(this.match, 'replace');

    //自动展开次要玩法
    this.init_unfold_play_way('mounted');
    this.on_listeners();

    // 足球进行到加时赛及以后阶段不显示加时赛玩法
    this.not_show_overtime_play()
    //  足球之外调用此方法，通过折叠状态
    this.change_status_by_any_unfold();
  },
  methods:{
    ...mapMutations(['set_secondary_unfold_map','set_is_user_change_status']),
    // 足球进行到加时赛及以后阶段不显示加时赛玩法，折叠起来
    not_show_overtime_play() {
      if(this.is_overtimeed){
        this.tab_list.filter(t => t.id == 4)[0].show_tab = false;
        if(this.current_hps_key == 'hpsOvertime'){
          this.any_unfold = false;
          let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
          if(this.match.mid in unfold_map){
            let id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
            let status = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[1];
            unfold_map[this.match.mid] = `${id}-${status}`;
          }
          this.set_secondary_unfold_map(unfold_map);
          this.tab_list.filter(t => t.id == 4)[0].unfold = false;
        }
      }
    },
    // c105  盘口和投注项的 ws 更新
    c105_handle(skt_data){
      // console.error(skt_data);
      // hls 判断为undefined 执行下次循环
      if(!skt_data.hls) return;
      if(this.match.mid == skt_data.mid){
        skt_data = _.cloneDeep(skt_data)
        skt_data.hls.forEach(hl_ws => {
          // 更新盘口级别hs
          _.size(this.current_tab_item.hps) && this.current_tab_item.hps.forEach(match_hp => {
            if(match_hp.hl){
              match_hp.hl.forEach(hl => {
                if(hl.hid == hl_ws.hid){
                  hl.hs = hl_ws.hs
                  if (hl.hv && hl_ws.hv) {
                    hl.hv = hl_ws.hv
                  }
                }
              });
            }
            else{
              if(match_hp.hid == hl_ws.hid){
                match_hp.hs = hl_ws.hs
              }
            }
          });

          // 更新投注项级别ol
          if(hl_ws.ol) {
            hl_ws.ol.forEach(ol_ws => {
              _.size(this.current_tab_item.hps) && this.current_tab_item.hps.forEach(match_hp => {
                if(match_hp.hl){
                  match_hp.hl.forEach(hl => {
                    if(!hl.ol) return;
                    hl.ol.forEach(ol_item => {
                      if(ol_ws.oid == ol_item.oid){
                        if (ol_item.onb && ol_item.on && ol_ws.on && !ol_ws.onb) {  //queryLatestMarketInfo 接口模拟触发需要跟新 on 值
                          ol_ws.onb = ol_item.onb.replace(/\d+\.?\d*/,ol_ws.on)
                          ol_ws.on = ol_item.on.replace(/\d+\.?\d*/,ol_ws.on)
                        }
                        Object.assign(ol_item,ol_ws);
                      }
                    });
                  });
                }
                else{
                  let ol_list = match_hp.hl ? match_hp.hl.ol : match_hp.ol;
                  ol_list.forEach(ol_item => {
                    if(ol_ws.oid == ol_item.oid){
                      Object.assign(ol_item,ol_ws);
                    }
                  });
                }
              });
            });
          }
        });
      }
    },
    // 罚牌玩法描述显示
    fapai_way_tips_status_change_h(flag){
      this.show_tips = flag;
    },
    // 存储次要玩法  赛事id  展开/折叠  状态
    save_second_play_mid_map_unfold_status(item, bold_list, five_minutes_list){
      let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
      unfold_map[this.match.mid] = `${item.id}-${item.unfold}`;
      // 如果是波胆玩法开
      if(item.id == 18){
        // 最终 的波胆列表长度     波胆的高度      默认三行
        let finall = [], bold_gaodu = 3, ol_list = [{placeholder:1},{placeholder:1},{placeholder:1}];
        if( _.size(bold_list) ){
          for (let m =0, hps_length = bold_list.length; m < hps_length; m++){
            if(_.get(bold_list[m], 'hl[0].ol')) {
              ol_list = bold_list[m].hl[0].ol
              finall.push(ol_list.filter(tab => tab.otd == 1).length)
              finall.push(ol_list.filter(tab => tab.otd == 0).length)
              finall.push(ol_list.filter(tab => tab.otd == 2).length)
            }
          }
          if(_.size(finall)){
            // 波胆 动态高度
            bold_gaodu = Math.max(...finall) + 1
          }
        }
        if(bold_gaodu > 3){
         this.bold_gaodu_css = bold_gaodu
        }else{
          this.bold_gaodu_css = 3
        }
        unfold_map[this.match.mid] = `${item.id}-${item.unfold}-${bold_gaodu}`;
      }// 如果是5分钟玩法
      else if (item.id == 19){
        let five_height = 3, ol_list = [{placeholder:1}];
        if(_.get(five_minutes_list, 'hl[0].ol')) {
          const mst = +this.match.mst
          /**
           * 25分钟前显示4行，25分钟(包含)后显示3行
           */
          if (mst < 25 * 60) {
            five_height = 4
          }
          else {
            five_height = 3
          }
        }
        unfold_map[this.match.mid] = `${item.id}-${item.unfold}-${five_height}`;
      }
      this.set_secondary_unfold_map(unfold_map);
    },
    /**
     * 初始化展开玩法
     * 展开优先级 , 加时赛>点球大战>晋级>角球>罚牌 todo 前面设置为0 都是因为这些没必要自动展开属于垃圾代码,测试一段时间没问题后删除
     */
    init_unfold_play_way(type_way = 'is-auto'){
      //足球
      if(this.match.csid == 1){
        let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
        if(this.match.mid in unfold_map){
          let [id,status] = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-');
          unfold_map[this.match.mid] = `${id}-${status}`;
          let second_hps = this.tab_list.filter(tab => tab.id == id)[0];
          this.overtime_tab_handle(second_hps,status,type_way);
        }
      }
      // 非足球展开默认
      if(this.match.csid != 1){
        let tab_id = this.get_tabid_by_csid(), init_und = 0;
        let quater = this.tab_list.filter(t => t.id == tab_id)[0];
        if(quater && quater.show_tab){
          this.overtime_tab_handle(quater,init_und,type_way);
        }
      }
    },
    // 通过tab id获取赔率属性 key （如：hpsAdd, hps15Minutes）
    get_hps_key_by(item){
      let o_hps_key = '';
      let tab_id_map_hps_key = {
        1:"hpsCorner",
        2:"hpsPenalty",
        3:"hpsPromotion",
        4:"hpsOvertime",
        5:"hpsPunish",
        17:"hps15Minutes",
        19:"hps5Minutes",
        18:"hpsBold",
        30:"hpsOutright",
      };
      o_hps_key = tab_id_map_hps_key[item.id];
      if(!o_hps_key && [6,7,8,9].includes(+item.id)){
        o_hps_key = 'hpsAdd';
      }
      return o_hps_key;
    },
    /**
     * @description: 切换tab
     * @param {Object} item 切换的指定tab
     * @param {Number} unfold 展开1或收起0状态
     * @param {String} operate_type
     *  is-auto(自动展开) is-user(用户点击展开) is-mmp-change(赛事阶段变化)
     * @return {Undefined}
     */
    overtime_tab_handle(item, unfold, operate_type, sub_i){
      if(['category','virtual_sports'].includes(this.$route.name) || 900 == this.get_menu_type || !item){
        return;
      }

      // 滚动次要玩法选中项到屏幕显示区域
      this.$nextTick(()=>{
        this.$utils.tab_move(sub_i, this.$refs.sub_play_scroller, this.$refs.sub_play_scroll_item)
      })
      
      if(item && item.title && item.id && operate_type !=='is-auto') {   // 解决bug 24153
        this.current_tab_item.title = item.title
        this.current_tab_item.id = item.id
      }
      //改变折叠tab选项
      this.tab_list.forEach((t,i) => {
        if(item.id != t.id){
          this.tab_list[i].unfold = 0;
        }
      });
      if(typeof unfold != 'undefined'){
        item.unfold = unfold;
      } else{
        item.unfold = !item.unfold ? 1 : 0;
      }
      //检测到当前赛事无展开的次要玩法时移除vuex中的赛事/展开状态映射key
      this.any_unfold = this.tab_list.filter(t => t.unfold == 1).length;
      //  如果没有展开的选项，则所有都折叠
      if(!this.any_unfold){
        let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
        if(this.match.mid in unfold_map){
          let id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
          let status = 0;
          unfold_map[this.match.mid] = `${id}-${status}`;
        }
        this.set_secondary_unfold_map(unfold_map);
      }
      //隐藏次要玩法描述弹层
      this.$root.$emit(this.emit_cmd.EMIT_INFO_ICON_CLICK,null);
      //先用本地数据填充次要玩法投注项,避免拉取接口过程中的模板不完整， 获取 key （如：hpsAdd, hps15Minutes）
      let o_hps_key = this.get_hps_key_by(item);
      // if(! operate_type == 'is-user' ){
      //   this.set_local_hps_by_key(item,o_hps_key);
      // }
      // 展开次要玩法
      if(item.unfold == 1){
        let params = {
          mids: this.match.mid,
          cuid: this.get_uid,
          pids:item.pids,
          playId:item.play_id,
          device: 'v2_h5_st' ,
          sort:1,//排序	 int 类型 1 按热门排序 2 按时间排序
          inner_param: 'is_by_mids'
        };
        //自动展开次要玩法无需拉取新数据
        if(operate_type == 'is-auto') {
          this.save_second_play_mid_map_unfold_status(item);
          return;
        }
        //拉接口更新数据
        if(operate_type == 'is-user' || operate_type == 'mounted'){
          params.is_user = operate_type;
          let fun_temp = ()=>{
            get_match_base_info_by_mids(params).then(res => {
              if(res.data && res.data[0] && res.data[0][o_hps_key]){
                // 根据业务需求，修改冠军小节玩法  1585 单对应
                Object.assign(this.match,res.data[0]);
                this.matchCtr.updMatchInfo(res.data[0]); // 更新赛事盘口数据
                if(operate_type == 'is-user'){
                  // 次要玩法展开加载数据  订阅指定玩法赛事(C8)  status 1订阅赛事推送  0退订赛事推送
                  this.$root.$emit(this.emit_cmd.EMIT_SPECIAL_HPS_LOADED,res.data[0],o_hps_key);
                }
                this.current_tab_item.hps = this.match[o_hps_key];
                if([18].includes(+ _.get(this.current_tab_item, 'id'))){
                  // 波胆玩法 数据加工处理
                  this.bold_all_list = this.corrective_action_data_processing(_.get(this.current_tab_item,'hps'), this.match )
                }else if([19].includes(+ _.get(this.current_tab_item, 'id'))){
                  // 5分钟 玩法 数据加工处理
                  this.five_minutes_all_list = this.five_minutes_gameplay_data_processing(_.get(this.current_tab_item,'hps'), this.match )
                }
                this.current_hps_key = o_hps_key;
              }
              this.init_tab_show(); // 获取请求后重新计算tab
              // 波胆玩法，5分钟玩法 其他次要玩法 展开显示， 波胆和5分钟，虚拟滚高度计算
              this.save_second_play_mid_map_unfold_status(item, this.bold_all_list, this.five_minutes_all_list);
              //次要玩法展开或者关闭通知列表页重新计算dom高度
              if(item.id==17){
                this.apply_15min_title(); // 15分钟 次要玩法模块  左下角的 小标题
              }
              //次要玩法展开或者关闭通知列表页重新计算dom高度
              this.$root.$emit(this.emit_cmd.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, 'ciyao_bold');
            });
          }
          fun_temp();
        }
      }
      // 诸葛埋点
      if (this.match.csid == 1 && operate_type == 'is-user') {
        let zhugeObj = {
          "玩法集名称": item.title,
          "玩法集ID": '',
          "区域位置": "主列表"
        }
        this.$utils.zhuge_event_send('TY_H5_足球_玩法分类导航_点击', this.get_user, zhugeObj)
      }
      this.save_second_play_mid_map_unfold_status(item);
      if(item.id==17){
        this.apply_15min_title();// 15分钟 次要玩法模块  左下角的 小标题
      }
      //次要玩法展开或者关闭通知列表页重新计算dom高度
      this.$root.$emit(this.emit_cmd.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, 'ciyao_bold');
    },
    // 次要玩法   展开   显示本地已有赔率
    // set_local_hps_by_key(item,o_hps_key){
    //   // debugger
    //   //显示本地已有赔率
    //   if(this.match && this.match[o_hps_key] && this.match[o_hps_key].length){
    //     this.current_tab_item.hps = _.cloneDeep(this.match[o_hps_key]);
    //     if(!this.match.csid == 1){
    //       this.current_tab_item.title = this.mmp_map_title;
    //     }
    //     this.tab_list.filter(tab => tab.id == item.id)[0].hps = _.cloneDeep(this.match[o_hps_key]);
    //     this.current_hps_key = o_hps_key;
    //   }else{
    //     this.current_tab_item.hps = [{
    //       hl:[{}]
    //     }];
    //   }
    // },
    //玩法说明图标点击
    // $event 时间对象 mid 赛事id
    info_icon_click($event,mid){
      this.$root.$emit(this.emit_cmd.EMIT_INFO_ICON_CLICK,$event,mid,this.current_tab_item);
    },
    // 足球之外调用此方法， 获取要展开的tab项  获取次要玩法 id
    get_tabid_auto_unfold(){
      //获取vuex中的选中tab对象
      let unfold_map = this.get_secondary_unfold_map;
      let t_itemid = null, match = this.match;
      if(match.mid in unfold_map){
        let item_status = unfold_map[match.mid] && unfold_map[match.mid].split('-');
        t_itemid = item_status[0];
      }
      //vuex中无tab对象 获取赛事默认要展开的tab对象
      if(!t_itemid){
        if(match.csid == 2){
          t_itemid = 6
        }else if(match.csid == 5){
          t_itemid = 7
        }else if(match.csid == 8){
          t_itemid = 8
        }else if(match.csid == 7){
          t_itemid = 9
        }
      }
      return t_itemid;
    },
    /**
     * 根据球类csid获取默认展开的tab id,
     * 非足球,因为足球可以显示多个
     */
    get_tabid_by_csid(){
      let tab_id = '';
      let match = this.match;
      if(match.csid == 1){
        //足球可以展开多个tab
      }else if(match.csid == 2){
        tab_id = 6;
      }else if(match.csid == 5){
        tab_id = 7;
      }else if(match.csid == 8){
        tab_id = 8;
      }else if(match.csid == 7){
        tab_id = 9;
      }
      return tab_id;
    },
    /**
     * 异步初始化次要玩法tab显示1
     */
    init_tab_async_show(){
      clearTimeout(this.init_tab_timer);
      this.init_tab_timer = setTimeout(() => {
        this.init_tab_show();
      },200);
    },
    /**
     * 初始化次要玩法tab显示  两个功能
     *  1.标题列表：this.tab_list   tab列表的 （show_tab 是否为true， title 标题名称）
     *  2. this.any_unfold  次要玩法 整块区域是否展开
     * @param {Boolean} is_change_match 有值时， 收起所有tab
     */
    init_tab_show(is_change_match,show_tab_by_data){
      let match = this.match; //  match 直接从this中引入
      if(is_change_match){
        this.tab_list.forEach(t => {
          t.show_tab = false;
          t.unfold = 0;
        });
        this.current_tab_item.unfold = 0;
        this.any_unfold = 0;
      }
      //找出要显示的次要玩法tab
      //足球
      if(match.csid == 1){
        let id_show_map = {
          '1':match.cosCorner,
          '2':match.cosPenalty,
          '3':match.cosPromotion,
          '30':match.cosOutright,
          '17':match.cos15Minutes,
          '19':match.cos5Minutes,
          '4':match.cosOvertime,
          '18':match.cosBold,
          '5':match.cosPunish
        };
        this.tab_list.forEach((tab,i) => {
          // 5分钟赛前阶段，小节名称：5分钟
          // 滚球阶段，小节名称：下一个进球
          if (tab.id === 19) {
            if ([1,2,7,10].includes(+match.ms)) {
              this.tab_list[i].title = this.$root.$t('football_playing_way.hps_next_goal')
            } else {
              this.tab_list[i].title = this.$root.$t('football_playing_way.hps5Minutes')
            }
          }
          this.tab_list[i].show_tab = id_show_map[tab.id];
        });
      }else
      //篮球
      if(match.csid == 2){
        this.tab_list.filter(t => t.id == 6)[0].show_tab = match.hpsAdd && match.hpsAdd.length > 0;
      }else
      //网球
      if(match.csid == 5){
        this.tab_list.filter(t => t.id == 7)[0].show_tab = match.hpsAdd && match.hpsAdd.length > 0;
      }else
      //乒乓球
      if(match.csid == 8){
        this.tab_list.filter(t => t.id == 8)[0].show_tab = match.hpsAdd && match.hpsAdd.length > 0;
      }else
      //斯诺克
      if(match.csid == 7){
        this.tab_list.filter(t => t.id == 9)[0].show_tab = match.hpsAdd && match.hpsAdd.length > 0;
      }
      this.match_period_map(this.match, 'replace');
      if(match.csid != 1){
        this.tab_list.forEach(tab => {
          if([6,7,8,9].includes(+tab.id)){
            this.match_period_map(this.match, 'replace');
            tab.title = this.mmp_map_title;
          }
        });
      }
      //检测到有一个tab是展开的,就显示次要玩法投注项
      if(!show_tab_by_data){
        this.any_unfold = this.tab_list.filter(t => t.unfold == 1).length;
      }
    },
    /**
     * @Description:格式化比分数据
     * @param: key   (S151)
     * @return: 返回分隔后的数组
     */
    format_msc_handle(str) {
      if (!str) {
        return [];
      }
      if(!window.msc_map)
      {
        window.msc_map = this.$root.$t('msc')
      }
      if(!str.split){
        return [];
      }
      let list_ = str.split(/[:|]/);
      for(let i = 0,l = 3 - list_.length; i < l;i++){
        list_.push('');
      }
      list_.push(window.msc_map[list_[0]]);

      return list_;
    },
    /**
     * 篮球阶段变化处理
     * 当篮球玩法id为'43,19,18'时, 次要玩法要显示为"上半场"
     * 否则显示为"小节"
     */
    basketball_mmp_change(mmp){
      if(this.match.csid == 2){
        let get_data = false;
        let quater_tab_item = this.tab_list.filter(tab => tab.id == 6)[0];

        //篮球进入上半场,小节显示为半场
        if(mmp == 1 || mmp == 14){
          get_data = true;
          //上半场
          if(mmp == 1){
            quater_tab_item.pids = '43,19,18';
            quater_tab_item.play_id = '2001';
          }
          //第二节
          else if(mmp == 14){
            quater_tab_item.pids = '54,52,51';
            quater_tab_item.play_id = '2004';
          }
          quater_tab_item.show_tab = true;
        }
        //当收到302（第二节休息）时，小节玩法更新为 第三节独赢，第三节让分，第三节大小 玩法赔率
        //变为第三节
        else if(mmp == 302){
          get_data = true;
          quater_tab_item.pids = '60,58,57';
          quater_tab_item.play_id = '2005';
          // quater_tab_item.title = this.$root.$t('basketball_playing_way.quarter');
        }
        //当收到16阶段(第四节)时，移除‘小节’玩法TAB以及对应的玩法赔率行，仅展示全场玩法数据
        else if([31,16,100,1001,1002].includes(+mmp)){
          quater_tab_item.show_tab = false;
          this.any_unfold = false;
          let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
          if(this.match.mid in unfold_map){
            let id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
            unfold_map[this.match.mid] = `${id}-0`;
          }
          this.set_secondary_unfold_map(unfold_map);
        }

        //#region 参数说明
        // 第一节 "48,46,45"
        // 第二节 "54,52,51"
        // 第三节 "60,58,57"
        // 第四节 "66,64,63"
        // 上半场 "43,19,18"
        // 下半场 "142,143,26"
        //篮球大小节玩法  第一节玩法 playId   =   2003
        //篮球大小节玩法  第二节玩法 playId   =   2004
        //篮球大小节玩法  第三节玩法 playId   =   2005
        //篮球大小节玩法  第四节玩法 playId   =   2006
        //篮球大小节玩法  上半场玩法 playId   =   2001
        //篮球大小节玩法  下半场玩法 playId   =   2002
        //#endregion

        //展开次要玩法需要调用接口
        if(get_data){
          this.overtime_tab_handle(quater_tab_item, 0,'is-mmp-change');
        }

      }
    },
    /**
     * 获取次要玩法比分
     * @param {Number}index 1主队比分2客队比分
     */
    get_score_second(index){
      let r = 0;
      let split = 'S5|';
      if(this.current_tab_item.id == 1){ //角球
        split = 'S5|';
      }
      else if(this.current_tab_item.id == 5){ //罚牌
        split = 'S10102|';
      }
      if(this.match.csid == 5){//网球
        split = ['S23|','S39|','S55|','S71|','S87|'];
      }//羽毛球、乒乓球、斯洛克，排球，冰球，棒球，沙滩排球
      else if(this.match.csid == 7 || this.match.csid == 8){
        split = [];
        //比分S120到S160(不含)
        for(let min = 120;min < 160;min++){
          split.push(`S${min}|`);
        }
      }

      if(this.match.msc && this.match.msc.length){
        // 网  斯  乒
        if([5,7,8].includes(+this.match.csid)){
          let found_score_list = [];
          this.match.msc.forEach(f_score => {
            split.forEach(spl_str => {
              if(f_score.indexOf(spl_str) > -1){
                let sliced = this.format_msc_handle(f_score);
                found_score_list.push(sliced);
              }
            });
          });
          if(found_score_list && found_score_list.length){
            r = found_score_list[found_score_list.length - 1][index];
          }
        }
        else
        {
          this.match.msc.forEach(f_score => {
            if(f_score.indexOf(split) > -1){
              let sliced = this.format_msc_handle(f_score);
              r = sliced[index];
            }
          });
        }
      }
      if(this.current_tab_item.id == 5){
        if(this.is_overtimeed){
          r = '';
        }
      }
      return r;
    },
    //  足球之外调用此方法，通过折叠状态
    change_status_by_any_unfold(c_v){
      let tab_id = this.get_tabid_by_csid();
      if(!tab_id && this.match.csid == 1 || !this.match.mid) {
        return;
      }
      if(![2,5,7,8].includes(+this.match.csid)){
        this.any_unfold = 0;
      }
      let quater = this.tab_list.filter(t => t.id == tab_id)[0];
      let hps_list = [];
      if(quater){
        hps_list = this.match[quater.hps_key];
      } else{
        hps_list = null;
      }
      if(!c_v || !hps_list || !hps_list.length){
        // 获取次要玩法 id
        let tab_id = this.get_tabid_auto_unfold();
        if(tab_id){
          let set_dict = {};
          set_dict[this.match.mid] = `${tab_id}-0`;
          this.set_secondary_unfold_map(set_dict);
        } else{
          let v_k = {};
          let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
          if(this.match.mid in unfold_map){
            let id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
            v_k[this.match.mid] = `${id}-0`;
          }
          this.set_secondary_unfold_map(v_k);
        }
      }
    },
    // 15分钟 次要玩法模块  左下角的 小标题
    apply_15min_title(){
      if(this.current_tab_item.id==17){
        // 如果是15分钟玩法下展示玩法时段 ,如果没有滑动取最小值(因为在更新时已经进行了排序因此第一个为最小值),如果滑动到第二个tab取+1值
        let hSpecial=_.get(this.match.hps15Minutes,'[0].hSpecial',1) - 1;
        if(this.get_standard_odd_status==1 && _.get(this.match,'hps15Minutes',[]).length == 6){ // 翻转后取第二个值
          hSpecial=_.get(this.match.hps15Minutes,'[3].hSpecial',1)-1;
        }
        if(hSpecial>4){
          hSpecial=4; //容错 下标不能大于4 最大特5
        }
        if(hSpecial<0){
          hSpecial = 0
        }
        this.current_tab_item.title =  this.$root.$t(`football_playing_way.hps15_title[${hSpecial}]`)
      }
    },
    // 批量清除定时器
    clear_timer() {
      const timer_arr = [
        'init_tab_timer',
        'compute_list_dom_time',
      ]
      for (const timer of timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }
    },
    // 波胆玩法 数据加工处理
    corrective_action_data_processing(data, match) {
      let arr = []
      if(data && match){
        arr.push( ...data.filter((x,i) =>  x.hpid == 7))
        // 如果是上半场，就取上半场的数据         先取  341    再取  20
        if(match['mmp'] <= 6){
            let first_half1 = data.filter((x,i) =>  x.hpid == 341), first_half = data.filter((x,i) => x.hpid == 20)
            // 如果 玩法id 341 没数据，再取 hpid 20 的
            if(_.get(first_half1,'[0].hl[0].ol')){
              arr.push(...first_half1)
            }else if (_.get(first_half,'[0].hl[0].ol')){
              arr.push(...first_half)
            }else{
              arr.push({hl:[{}]})
            }
        }else{    // 如果是下半场，就取下半场的数据           先取 342         再取  74
          let second_half1 = data.filter((x,i) =>  x.hpid == 342), second_half = data.filter((x,i) => x.hpid == 74)
          // 如果 玩法id 341 没数据，再取 hpid 20 的
          if(_.get(second_half1,'[0].hl[0].ol')){
            arr.push(...second_half1)
          }else if (_.get(second_half,'[0].hl[0].ol')){
            arr.push(...second_half)
          }else{
            arr.push({hl:[{}]})
          }
        }
      }
      if(_.size(arr) < 2){
        arr = [{hl:[{}]},{hl:[{}]}]
      }
      return arr
    },
    // 5分钟玩法 数据加工处理
    five_minutes_gameplay_data_processing(data, match) {
      let arr = []
      if(data && match){
        // 如果是滚球，则取 362
        if([1,2,7,10].includes(+match['ms'])){
          arr.push( ...data.filter((x,i) =>  x.hpid == 362))
        }else{  // 如果是早盘 ，则取 361
          arr.push( ...data.filter((x,i) =>  x.hpid == 361))
        }
      }
      if(!_.size(arr)){
        arr = [{hl:[{}]}]
      }
      return arr[0]
    },
    on_listeners() {
      //WS 对应事件
      // c105  盘口/投注项
      // c303  滚球新赛事通知
      // c305  赛事订阅(C8)-玩法tab(C305)
      // 封盘事件
      this.$root.$on(this.emit_cmd.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE,this.fapai_way_tips_status_change_h);
      // c105更新
      this.$root.$on(this.emit_cmd.EMIT_C105_CMD_NOTICE,this.c105_handle);
    },
    off_listeners() {
      this.$root.$off(this.emit_cmd.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE,this.fapai_way_tips_status_change_h);
      this.$root.$off(this.emit_cmd.EMIT_C105_CMD_NOTICE,this.c105_handle);
    }
  },
  computed:{
    ...mapGetters([
      'get_theme',
      'get_uid',
      'get_c303_data_change',
      'get_corner_oc_change',
      'get_c305_data_change',
      'get_secondary_unfold_map',
      'get_is_user_change_status',
      'get_match_top_map_dict',
      'get_menu_type',
      'get_current_sub_menuid',
      'get_user',
      'get_standard_odd_status',
    ]),
    //滚动列表时,组件赛事变化异步还原赛事次要玩法的显示状态
    match(){
      let match = this.matchCtr.list[this.i];
      if(match){
        this.init_tab_async_show();
        if(this.current_hps_key){
          let hps_ = _.cloneDeep(match[this.current_hps_key])
          this.current_tab_item.hps = hps_
          // 如果是波胆 和 5分钟玩法
          if([18].includes(+ _.get(this.current_tab_item, 'id'))){
            // 波胆玩法 数据加工处理
            this.bold_all_list = this.corrective_action_data_processing(_.get(this.current_tab_item,'hps'), match )
          }else if([19].includes(+ _.get(this.current_tab_item, 'id'))){
            // 5分钟 玩法 数据加工处理
            this.five_minutes_all_list = this.five_minutes_gameplay_data_processing(_.get(this.current_tab_item,'hps'), match )
          }
        }
      }
      return match || {};
    },
    // 判断是否显示tab栏
    show_tab_by_data(){
      let flag = false;
      let{cosCorner,cosOvertime,cosBold,cosPenalty,cosPromotion, cosOutright ,cosPunish,hpsAdd,cos15Minutes,cos5Minutes} = this.match;
      flag = cos15Minutes || cos5Minutes || cosCorner || cosOvertime|| cosBold || cosPenalty || cosPromotion || cosOutright || cosPunish || (hpsAdd && hpsAdd.length > 0)
      // 如果没有 玩法时
      if(!flag ){
        let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
        let status_id = '';
        if(this.match.mid in unfold_map){
          status_id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
          unfold_map[this.match.mid] = `${status_id}-0`;
          // 如果没有 玩法时,则隐藏次要玩法整个模块
          this.set_secondary_unfold_map(unfold_map);
        }
      } else{  // 如果有 玩法时， 初始化次要玩法tab显示
        this.init_tab_show(false,'show-tab-by-data');
      }
      return flag;
    },
    // 主队角球数或罚牌数
    home_score(){
      return this.get_score_second(1);
    },
    // 客队角球数或罚牌数
    away_score(){
      return this.get_score_second(2);
    },
    // 是否进行到加时赛及以后的阶段
    is_overtimeed(){
      return [32,33,34,41,42,50,80,90,100,110,120,999].includes(+this.match.mmp);
    },
    /**
     * @description: 获取赛事次要玩法的让球方
     */
    current_tab_handicap_index(){
      let result = 0;
      const hps_add=this.current_tab_item.hps;
      if(this.match && hps_add && hps_add[1]){
        let hp_item =hps_add[1];// 小节 或者角球等玩法 永远取第二个值 是让球数据
        if(hp_item){
            let hl_item = hp_item.hl[0];
          if(hl_item && hl_item.ol){
            let found_i = 0;
            hl_item.ol.forEach((ol_item,i) => {
              if(ol_item.on){
                let on_str = String(ol_item.on);
                if(on_str[0] == '-'){
                  found_i = (i + 1);
                }
              }
            });
            result = found_i;
          }
        }
      }
      return result;
    },
  },
  watch:{
    match(c_m,o_m){
      if(c_m.mid == o_m.mid){
        return;
      }
      this.init_tab_show(true); // 加载tab
      // 如果当场的赛事位置，换成了其他赛事了，则隐藏（折叠）当前的赛事
      if(c_m.mid in this.get_secondary_unfold_map){
        let [id, status, special]= this.get_secondary_unfold_map[c_m.mid] && this.get_secondary_unfold_map[c_m.mid].split('-');
        let unfold_map = {};
        // 如果是波胆玩法 或者 5分钟玩法
        if(special>0){
          unfold_map[c_m.mid] = `${id}-0-0`;
        }else{
          unfold_map[c_m.mid] = `${id}-0`;
        }
        this.set_secondary_unfold_map(unfold_map);
        // 通知列表页重新计算dom高度
        clearTimeout(this.compute_list_dom_time);
        this.compute_list_dom_time = setTimeout(() => {
          this.$root.$emit(this.emit_cmd.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE);
        },200);
      }
    },
    get_c303_data_change(curr){
      if(curr){
        let splited = curr.split('-');
        let mid = splited[0];
        let hpid = splited[1];
        // 匹配mid
        if(mid && hpid && mid == this.match.mid){
          // 指定页面屏蔽该功能
          if(['category','virtual_sports'].includes(this.$route.name) || 900 == this.get_menu_type){
            return;
          }
          // 检测是否有子tab打开状态
          let found = this.tab_list.filter(tab_item => {
            return tab_item && tab_item.unfold;
          });
          let item = _.get(found,'[0]');
          if(item){
            let o_hps_key = this.get_hps_key_by(item);
            let params = {
              mids: this.match.mid,
              cuid: this.get_uid,
              pids:item.pids,
              playId:item.play_id,
              device: 'v2_h5_st' ,
              sort:1,//排序	 int 类型 1 按热门排序 2 按时间排序
              inner_param: 'is_by_mids'
            };
            params.is_user = 'ws-user';
            let fun_temp = ()=>{
              get_match_base_info_by_mids(params).then(res => {
                if(res.data && res.data[0] && res.data[0][o_hps_key]){
                  // 根据业务需求，修改冠军小节玩法  1585 单对应
                  Object.assign(this.match,res.data[0]);
                  this.matchCtr.updMatchInfo(res.data[0]); // 更新赛事盘口数据
                  // if(operate_type == 'is-user'){
                  //   // 次要玩法展开加载数据  订阅指定玩法赛事(C8)  status 1订阅赛事推送  0退订赛事推送
                  //   this.$root.$emit(this.emit_cmd.EMIT_SPECIAL_HPS_LOADED,res.data[0],o_hps_key);
                  // }
                  this.current_tab_item.hps = this.match[o_hps_key];
                  if([18].includes(+ _.get(this.current_tab_item, 'id'))){
                    // 波胆玩法 数据加工处理
                    this.bold_all_list = this.corrective_action_data_processing(_.get(this.current_tab_item,'hps'), this.match )
                  }else if([19].includes(+ _.get(this.current_tab_item, 'id'))){
                    // 5分钟 玩法 数据加工处理
                    this.five_minutes_all_list = this.five_minutes_gameplay_data_processing(_.get(this.current_tab_item,'hps'), this.match )
                  }
                  // this.current_hps_key = o_hps_key;
                }
                // this.init_tab_show(); // 获取请求后重新计算tab
                // 波胆玩法，5分钟玩法 其他次要玩法 展开显示， 波胆和5分钟，虚拟滚高度计算
                // this.save_second_play_mid_map_unfold_status(item, this.bold_all_list, this.five_minutes_all_list);
                //次要玩法展开或者关闭通知列表页重新计算dom高度
                // if(item.id==17){
                //   this.apply_15min_title(); // 15分钟 次要玩法模块  左下角的 小标题
                // }
                //次要玩法展开或者关闭通知列表页重新计算dom高度
                // this.$root.$emit(this.emit_cmd.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, 'ciyao_bold');
              });
            }
            fun_temp();
          }
        }
      }
    },
    'current_tab_item.hps'(current,o){ // hps更新,该方法可以重构 与之前的代码重叠
      // this.any_unfold = this.tab_list.filter(t => t.unfold == 1).length;
      // if(!this.any_unfold){
      //   let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
      //   if(this.match.mid in unfold_map){
      //     let id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
      //     let status = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[1];
      //     unfold_map[this.match.mid] = `${id}-${status}`;
      //   }
      //   this.set_secondary_unfold_map(unfold_map);
      // }
    },
    // 是否至少存在一个展开tab状态变化,tab展开 属于唯一有用的方法之一
    any_unfold(){
      // debugger
      let any_unfold = 0;
      let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
      if(this.match.mid in unfold_map){
        let u_status = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[1];
        any_unfold = +u_status;
      } else{
        any_unfold = +this.any_unfold;
      }
      this.change_status_by_any_unfold(any_unfold);
    },
    /**
     * params {object} c_unfold 折叠 通用折叠方法,该方法以及在多处 复制粘贴
     * 折叠状态与赛事的映射
     */
    get_secondary_unfold_map(c_unfold){
      // if(this.match.mid in c_unfold){
      //   let status_str = c_unfold[this.match.mid];
      //   if(!status_str || !status_str.split) {
      //     return
      //   }
      //   let tab_id = status_str.split('-')[0];
      //   let status = status_str.split('-')[1];
      //   this.any_unfold = status;
      //   if(status == 1){
      //     let tab_item = this.tab_list.filter(t => t.id == tab_id)[0];
      //     tab_item.unfold = 1;
      //     let o_hps_key = this.get_hps_key_by(tab_item); // 获取 key （如：hpsAdd, hps15Minutes）
      //     this.set_local_hps_by_key({id:tab_id},o_hps_key);
      //   }
      // }
    },
    // 次要玩法开关,该事件主要从ws中推送中来
    //角球开关盘标识
    get_corner_oc_change(curr){
      if(curr){
        let splited = curr.split('-');
        let mid = splited[0];
        if(mid == this.match.mid){
          let tab_id = splited[2];
          let f_hps_key = this.tab_list.filter(t => t.id == tab_id)[0].hps_key;
          let displayStatus = splited[1];
          if(displayStatus == 'N'){ // 不展示
            if(this.current_hps_key == f_hps_key){
              this.any_unfold = false;
              let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
              // 如果传进来的是关闭状态 且当前的id 与传进来的id一样 ,则对当前的id进行折叠操作
              if((this.match.mid in unfold_map)&& tab_id==this.current_tab_item.id){
                // 当前match折叠状态 所有的折叠状态设置为收起
                this.overtime_tab_handle(this.current_tab_item,0,'is-auto');
                this.tab_list.filter(t => t.id == tab_id)[0].unfold = 0;
              }

            }
            this.tab_list.forEach((t,i)=>{
            if (t.id == tab_id){
              this.tab_list[i].show_tab=false;
              this.tab_list[i].unfold=0;
            }
            });
          }else if(displayStatus == 'Y'){ // 展示
            this.any_unfold = true;
            this.tab_list.filter(t => t.id == tab_id)[0].show_tab = true;
          }
          if(!this.any_unfold){
            let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
            if(this.match.mid in unfold_map){
              let id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
              let status = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[1];
              unfold_map[this.match.mid] = `${id}-${status}`;
            }
            this.set_secondary_unfold_map(unfold_map);
          }
        }
      }
    },
    'match.mmp'(curr){
      //足球进行到加时赛及以后阶段不显示加时赛玩法
      this.not_show_overtime_play()
      //篮球赛事阶段变化处理
      this.basketball_mmp_change(curr);
      this.match_period_map(this.match, 'replace');
    },
    get_standard_odd_status(){
      this.apply_15min_title();// 15分钟 次要玩法模块  左下角的 小标题
    },
    // 一级菜单切换，次要玩法，默认折叠
    get_menu_type(){
      this.tab_list.forEach(t => {
        t.unfold = 0;
      });
    },
    // 二级菜单切换，次要玩法，默认折叠
    get_current_sub_menuid(){
      this.tab_list.forEach(t => {
        t.unfold = 0;
      });
    },
  },
  components:{
    'odd-list-wrap':odd_list_wrap,
  },
  destroyed(){
    this.clear_timer()
    this.off_listeners()
  },
  deactivated() {
    this.clear_timer()
    this.off_listeners()
  }
}
</script>

<style lang="scss" scoped>
.m-o-p-wrapper {
  width: 100%;
  height: auto;
  padding: 0 0.07rem;
  position: relative;
  .wsl_flag_777{
    position: absolute;
    color: red;
    top: .24rem;
    //left: 1.08rem;
  }

  .tab-m-o-w {
    //width: 3.58rem;
    /*height: 0.44rem;*/
    margin: 0 auto;
    padding-left: 0.02rem;
    flex-wrap: nowrap;
    overflow: scroll;

    .tab-item-h {
      width: auto;
      height: 0.24rem;
      margin-right: 0.05rem;
      padding: 0 0.084rem;
      border-radius: 0.04rem;
      margin-bottom: 0.12rem;
      flex-wrap: nowrap;
      white-space: nowrap;

      &:last-child {
        margin-right: 0;
      }

      &.pena {
        margin-left: 0.2rem;
      }

      .league-collapse-dir {
        width: 0.08rem;
        height: 0.04rem;
        margin-left: 0.07rem;
        display: block;
        transform: rotateZ(180deg);

        &.collapsed {
          transform: rotateZ(0);
        }
      }
    }
  }

  .odd-l-head-w {
    width: 1.84rem;
    height: 0.48rem;
    overflow: hidden;

    .o-w-h-c {

      height: 100%;
      flex-shrink: 0;
      flex-wrap: nowrap;

      .hpl-t {
        position: relative;
        width: 0.6rem;
        height: 100%;
        line-height: 1;
        transition: transform 0.2s;
        padding: 0 0.02rem;
        margin-right: 0.02rem;

        &:nth-child(n + 4) {
          margin-right: 0;
        }

        &.status2 {
          transform: translateX(-1.84rem);
        }

        .div-inner-2 {
          width: 0.05rem;
          height: 100%;
          background-color: var(--q-color-com-bg-color-12);
          position: absolute;
          top: 0;
          right: -0.05rem;
          z-index: 1;
        }
      }
    }
  }

  .team-title-container {
    .team-t-title-w {
      width: 1.30rem;
      margin-left: 0.20rem;
      height: 0.31rem;
      font-size: 0.14rem;
      display: flex;
      align-items: center;
      position: relative;

      &.is-handicap {
        font-weight: bold;
      }

      &.fight-type {
        font-size: 0.12rem;
     //   margin-left: 0.04rem;

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
        max-width: 1.07rem;
      }

      .way-score {
        position: absolute;
        right: 0;
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

    &.expanded {
      height: auto;
      max-height: none;
      padding-bottom: 0.06rem;
      &.five_minutes_wanfa {
        padding-bottom: 0.085rem;
      }
      &.bodan_wanfa{
        padding-bottom: 0.44rem!important;
      }
      &.bodan_wanfa_small{
        padding-bottom: 0.12rem!important;
      }
    }
  }
}
</style>
