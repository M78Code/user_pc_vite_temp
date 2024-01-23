
import lodash from 'lodash'
import { defineComponent } from 'vue'
import { i18n_t } from "src/boot/i18n.js";
import TabMove from "src/core/tab-move/tab-move.js";
import { play_title } from 'src/core/utils/common/module/play-title.js'
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt"
import { format_msc } from "src/core/format/project/module/format-msc.js"
import { UserCtr, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/output/index.js"
import PageSourceData  from  "src/core/page-source/page-source.js";
import MatchListClass from 'src/core/match-list-h5/match-class/match-list.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { menu_type } from 'src/base-h5/mixin/menu.js'

import MatchFold from 'src/core/match-fold/index.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';

export default defineComponent({
  props:{
    match: Object,  // 赛事数据
    i: Number, // 所在位置
  },
  data(){
    return{
      is_show_tree_line:'all',
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
      tab_list:[],
      // 当前打开的玩法名称
      mmp_map_title:'',
      // 波胆玩法数据
      bold_all_list:[{hl:[{}]},{hl:[{}]}],
      five_minutes_all_list:{hl:[{}]}, // 5分钟玩法数据
      bold_gaodu_css: 3,
      emitters: {},
      init_tab_timer: null,
      standard_odd_status: PageSourceData.standard_odd_status.value
    }
  },
  mounted(){

    //用户改变展开折叠状态时钟
    this.init_tab_timer = null;
    this.compute_list_dom_time = null;
    this.tab_list = play_title()

    if(!["virtual_sports","category"].includes(this.$route.name)) {
      // mmp映射赛事阶段名，国际化语言
      this.update_mmp_map_title();

      //自动展开次要玩法
      this.init_unfold_play_way('mounted');
      this.on_listeners();

      // 足球进行到加时赛及以后阶段不显示加时赛玩法
      this.not_show_overtime_play()
      // 足球之外调用此方法，通过折叠状态
      this.change_status_by_any_unfold();
    }
  },
  methods:{
    show_more_status_flg(type){
      this.is_show_tree_line=type;
      this.init_unfold_play_way('mounted');
    },
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
          MatchResponsive.set_secondary_unfold_map(unfold_map);
          this.tab_list.filter(t => t.id == 4)[0].unfold = false;
        }
      }
    },
    // 罚牌玩法描述显示
    fapai_way_tips_status_change_h(flag){
      this.show_tips = flag;
    },
    // 存储次要玩法  赛事id  展开/折叠  状态
    save_second_play_mid_map_unfold_status(item, bold_list, five_minutes_list){
      let unfold_map = lodash.cloneDeep(this.get_secondary_unfold_map);
      unfold_map[this.match.mid] = `${item.id}-${item.unfold}`;
      // 如果是波胆玩法开
      if(item.id == 18){
        // 最终 的波胆列表长度     波胆的高度      默认三行
        let finall = [], bold_gaodu = 3, ol_list = [{placeholder:1},{placeholder:1},{placeholder:1}];
        if(lodash.size(bold_list)){
          for (let m =0, hps_length = bold_list.length; m < hps_length; m++){
            if(lodash.get(bold_list[m], 'hl[0].ol')) {
              ol_list = bold_list[m].hl[0].ol
              finall.push(ol_list.filter(tab => tab.otd == 1).length)
              finall.push(ol_list.filter(tab => tab.otd == 0).length)
              finall.push(ol_list.filter(tab => tab.otd == 2).length)
            }
          }
          if(lodash.size(finall)){
            // 波胆 动态高度
            bold_gaodu = Math.max(...finall) + 1
          }
        }
        // if(this.is_show_tree_line){
        //   bold_gaodu=3
        // }
        if(bold_gaodu > 3){
         this.bold_gaodu_css = bold_gaodu
        }else{
          this.bold_gaodu_css = 3
        }
        unfold_map[this.match.mid] = `${item.id}-${item.unfold}-${bold_gaodu}-${this.is_show_tree_line}`;
      }// 如果是5分钟玩法
      else if (item.id == 19){
        let five_height = 3, ol_list = [{placeholder:1}];
        if(lodash.get(five_minutes_list, 'hl[0].ol')) {
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
      MatchResponsive.set_secondary_unfold_map(unfold_map);
    },
    /**
     * 初始化展开玩法展开优先级 , 加时赛>点球大战>晋
     * 级>角球>罚牌 todo 前面设置为0 都是因为这些没必要自动展开属于垃圾代码,测试一段时间没问题后删除
     */
    init_unfold_play_way(type_way = 'is-auto'){
      //足球
      if(this.match.csid == 1){
        let unfold_map = lodash.cloneDeep(this.get_secondary_unfold_map);
        if(this.match.mid in unfold_map){
          let [id,status] = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-');
          unfold_map[this.match.mid] = `${id}-${status}`;
          let second_hps = this.tab_list.filter(tab => tab.id == id)[0];
          this.overtime_tab_handle(second_hps,status,type_way);
        }
      }
      // 非足球展开默认
      if(this.match.csid != 1){
         let tab_id = this.get_tabid_by_csid(), init_und = 1;
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
        11:"hpsCompose",
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
    async overtime_tab_handle(item, unfold, operate_type, sub_i){
      if(['category','virtual_sports'].includes(this.$route.name) || 900 == menu_type.value || !item){
        return;
      }
      // 重置所选的更多玩法选项
      this.select_second_item = {}
      

      // 滚动次要玩法选中项到屏幕显示区域
      // this.$nextTick(()=>{
      //   TabMove.tab_move(sub_i, this.$refs.sub_play_scroller, this.$refs.sub_play_scroll_item)
      // })
      
      if(item && item.title && item.id && operate_type !=='is-auto') {   // 解决bug 24153
        this.current_tab_item.title = item.title
        this.current_tab_item.id = item.id
      }
      // 重置其他 tab 项
      this.tab_list.forEach((t) => {
        if (item.id !== t.id) t.unfold = 0
      })
      if(unfold){
        item.unfold = unfold
      } else{
        item.unfold = !item.unfold ? 1 : 0
      }
      //检测到当前赛事无展开的次要玩法时移除vuex中的赛事/展开状态映射key
      this.any_unfold = this.tab_list.filter(t => t.unfold == 1).length;
      //  如果没有展开的选项，则所有都折叠
      if(!this.any_unfold){
        let unfold_map = lodash.cloneDeep(this.get_secondary_unfold_map);
        if(this.match.mid in unfold_map){
          let id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
          let status = 0;
          unfold_map[this.match.mid] = `${id}-${status}`;
        }
        MatchResponsive.set_secondary_unfold_map(unfold_map);
      }
      //隐藏次要玩法描述弹层
      useMittEmit(MITT_TYPES.EMIT_INFO_ICON_CLICK, null);
      //先用本地数据填充次要玩法投注项,避免拉取接口过程中的模板不完整， 获取 key （如：hpsAdd, hps15Minutes）
      // 展开次要玩法
      if(item.unfold == 1){
        //自动展开次要玩法无需拉取新数据
        if(operate_type == 'is-auto') {
          this.save_second_play_mid_map_unfold_status(item);
          return;
        }
        //拉接口更新数据
        if(operate_type == 'is-user' || operate_type == 'mounted'){
          await MatchMeta.get_match_base_hps_by_mids({ mids: this.match.mid, other: {
            pids:item.pids,
            inner_param: 'is_by_mids',
            playId:item.play_id,
            is_user: operate_type,
            device: 'v2_h5_st' ,
            sort:1,//排序	 int 类型 1 按热门排序 2 按时间排序
          }})
          this.update_match_data(item)
        }
      }
      if(item.id==17){
        this.apply_15min_title();// 15分钟 次要玩法模块  左下角的 小标题
      }
      //次要玩法展开或者关闭通知列表页重新计算dom高度
      // this.$root.$emit(this.emit_cmd.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, 'ciyao_bold');
    },
    /**
     * @description 更新赛事数据
     */
    update_match_data (item) {
      let o_hps_key = this.get_hps_key_by(this.current_tab_item);
      if(this.match[o_hps_key]){
        // 根据业务需求，修改冠军小节玩法  1585 单对应
        const hps = lodash.get(this.match, `${o_hps_key}`)
        const id = +lodash.get(this.current_tab_item, 'id')
        this.current_tab_item.hps = hps
        if([18].includes(id)){
          // 波胆玩法 数据加工处理
          this.bold_all_list = this.corrective_action_data_processing(hps, this.match )
        }else if([19].includes(id)){
          // 5分钟 玩法 数据加工处理
          this.five_minutes_all_list = this.five_minutes_gameplay_data_processing(hps, this.match )
        } else if ([17].includes(id)) {
          // 15分钟 数据处理
          if (!hps || hps.length < 1) return
          const hps_data = lodash.cloneDeep(hps).sort((a, b) => +a.hSpecial - +b.hSpecial)
          this.current_tab_item.hps = hps_data
        }
        this.current_hps_key = o_hps_key;
      }
      //次要玩法展开或者关闭通知列表页重新计算dom高度
      this.save_second_play_mid_map_unfold_status(item, this.bold_all_list, this.five_minutes_all_list);
      if(item.id==17){
        this.apply_15min_title(); // 15分钟 次要玩法模块  左下角的 小标题
      }
    },
    //玩法说明图标点击
    // $event 时间对象 mid 赛事id
    info_icon_click($event,mid){
      useMittEmit(MITT_TYPES.EMIT_INFO_ICON_CLICK, {
        e: $event, 
        mid, 
        item: this.current_tab_item
      });
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
      this.init_tab_show();
    },
    /**
     * 初始化次要玩法tab显示  两个功能
     *  1.标题列表：this.tab_list   tab列表的 （show_tab 是否为true， title 标题名称）
     *  2. this.any_unfold  次要玩法 整块区域是否展开
     * @param {Boolean} is_change_match 有值时， 收起所有tab
     */
    init_tab_show(is_change_match,show_tab_by_data){
      if (!this.show_tab_by_data) return
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
          '4':match.cosOvertime,
          '18':match.cosBold,
          '11':match.compose,
          '5':match.cosPunish
        };
        this.tab_list.forEach((tab,i) => {
          // 5分钟赛前阶段，小节名称：5分钟
          // 滚球阶段，小节名称：下一个进球
          if (tab.id === 19) {
            if ([1,2,7,10].includes(+match.ms)) {
              this.tab_list[i].title = i18n_t('football_playing_way.hps_next_goal')
            } else {
              this.tab_list[i].title = i18n_t('football_playing_way.hps5Minutes')
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
      this.update_mmp_map_title();
      if(match.csid != 1){
        this.tab_list.forEach(tab => {
          if([6,7,8,9].includes(+tab.id)){
            this.update_mmp_map_title();
            tab.title = this.mmp_map_title;
          }
        });
      }
      //检测到有一个tab是展开的,就显示次要玩法投注项
      if(!show_tab_by_data){
        this.any_unfold = this.tab_list.filter(t => t.unfold == 1).length;
      }
    },
    // 更新赛事阶段
    update_mmp_map_title () {
      this.mmp_map_title = MatchListClass.match_period_map(this.match, 'replace');
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
          // quater_tab_item.title = i18n_t('basketball_playing_way.quarter');
        }
        //当收到16阶段(第四节)时，移除‘小节’玩法TAB以及对应的玩法赔率行，仅展示全场玩法数据
        else if([31,16,100,1001,1002].includes(+mmp)){
          quater_tab_item.show_tab = false;
          this.any_unfold = false;
          let unfold_map = lodash.cloneDeep(this.get_secondary_unfold_map);
          if(this.match.mid in unfold_map){
            let id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
            unfold_map[this.match.mid] = `${id}-0`;
          }
          MatchResponsive.set_secondary_unfold_map(unfold_map);
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
                let sliced = format_msc(f_score);
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
              let sliced = format_msc(f_score);
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
          MatchResponsive.set_secondary_unfold_map(set_dict);
        } else{
          let v_k = {};
          let unfold_map = lodash.cloneDeep(this.get_secondary_unfold_map);
          if(this.match.mid in unfold_map){
            let id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
            v_k[this.match.mid] = `${id}-0`;
          }
          MatchResponsive.set_secondary_unfold_map(unfold_map);
        }
      }
    },
    // 15分钟 次要玩法模块  左下角的 小标题
    apply_15min_title(){
      const standard_odd_status = PageSourceData.standard_odd_status.value
      if(this.current_tab_item.id==17){
        // 如果是15分钟玩法下展示玩法时段 ,如果没有滑动取最小值(因为在更新时已经进行了排序因此第一个为最小值),如果滑动到第二个tab取+1值
        let hSpecial=lodash.get(this.match.hps15Minutes,'[0].hSpecial',1) - 1;
        if(standard_odd_status==1 && lodash.get(this.match,'hps15Minutes',[]).length == 6){ // 翻转后取第二个值
          hSpecial=lodash.get(this.match.hps15Minutes,'[3].hSpecial',1)-1;
        }
        if(hSpecial>4){
          hSpecial=4; //容错 下标不能大于4 最大特5
        }
        if(hSpecial<0){
          hSpecial = 0
        }
        this.current_tab_item.title =  i18n_t(`football_playing_way.hps15_title[${hSpecial}]`)
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
            if(lodash.get(first_half1,'[0].hl[0].ol')){
              arr.push(...first_half1)
            }else if (lodash.get(first_half,'[0].hl[0].ol')){
              arr.push(...first_half)
            }else{
              arr.push({hl:[{}]})
            }
        }else{    // 如果是下半场，就取下半场的数据           先取 342         再取  74
          let second_half1 = data.filter((x,i) =>  x.hpid == 342), second_half = data.filter((x,i) => x.hpid == 74)
          // 如果 玩法id 341 没数据，再取 hpid 20 的
          if(lodash.get(second_half1,'[0].hl[0].ol')){
            arr.push(...second_half1)
          }else if (lodash.get(second_half,'[0].hl[0].ol')){
            arr.push(...second_half)
          }else{
            arr.push({hl:[{}]})
          }
        }
      }
      if(lodash.size(arr) < 2){
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
      if(!lodash.size(arr)){
        arr = [{hl:[{}]}]
      }
      return arr[0]
    },
    on_listeners() {
      //WS 对应事件
      // c105  盘口/投注项
      // c303  滚球新赛事通知
      // c305  赛事订阅(C8)-玩法tab(C305)
      this.emitters = {
        // 封盘事件
        emitter_1: useMittOn(MITT_TYPES.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE, this.fapai_way_tips_status_change_h).off,
      }
    },
    off_listeners() {
      Object.values(this.emitters).map((x) => x());
    },
    on_update_standard (val) {
      this.apply_15min_title();// 15分钟 次要玩法模块  左下角的 小标题
    }
  },
  computed:{
    get_secondary_unfold_map () {
      return MatchResponsive.secondary_unfold_map.value;
    },
    // 判断是否显示tab栏
    show_tab_by_data(){
      
      const key = MatchFold.get_match_fold_key(this.match)
      const flag = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_tab`, true)

      // let{cosCorner,cosOvertime,cosBold,cosPenalty,cosPromotion, cosOutright ,cosPunish,hpsAdd,cos15Minutes,compose,cds,mbmty} = this.match;
      // let flag = cos15Minutes || cosCorner || cosOvertime|| cosBold || cosPenalty || cosPromotion || cosOutright || cosPunish || compose || (hpsAdd && hpsAdd.length > 0)

      // 电子篮球 不显示次要玩法 对应 BUG 44554
      // if (['B03', 'BE'].includes(cds) && mbmty === 2) {
      //   flag = false
      // }
      // 如果没有 玩法时
      if(!flag ){
        let unfold_map = _.cloneDeep(this.get_secondary_unfold_map);
        let status_id = '';
        if(this.match.mid in unfold_map){
          status_id = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[0];
          unfold_map[this.match.mid] = `${status_id}-0`;
          // 如果没有 玩法时,则隐藏次要玩法整个模块
          MatchResponsive.set_secondary_unfold_map(unfold_map);
        }
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
      this.init_tab_async_show()
      if(this.current_hps_key){
        const id = +lodash.get(this.current_tab_item, 'id')
        const hps = lodash.get(this.current_tab_item, 'hps')
        // 如果是波胆 和 5分钟玩法
        if([18].includes(id)){
          // 波胆玩法 数据加工处理
          this.bold_all_list = this.corrective_action_data_processing(hps, this.match )
        }else if([19].includes(id)){
          // 5分钟 玩法 数据加工处理
          this.five_minutes_all_list = this.five_minutes_gameplay_data_processing(hps, this.match )
        } else if ([17].includes(id)) {
          // 15分钟 数据处理
          if (!hps || hps.length < 1) return
          const hps_data = lodash.cloneDeep(hps).sort((a, b) => +a.hSpecial - +b.hSpecial)
          this.current_tab_item.hps = hps_data
        }
      }
    },
    // 是否至少存在一个展开tab状态变化,tab展开 属于唯一有用的方法之一
    any_unfold(){
      // debugger
      let any_unfold = 0;
      let unfold_map = lodash.cloneDeep(this.get_secondary_unfold_map);
      if(this.match.mid in unfold_map){
        let u_status = unfold_map[this.match.mid] && unfold_map[this.match.mid].split('-')[1];
        any_unfold = +u_status;
      } else{
        any_unfold = +this.any_unfold;
      }
      this.change_status_by_any_unfold(any_unfold);
    },
    'match.mmp'(curr){
      //足球进行到加时赛及以后阶段不显示加时赛玩法
      this.not_show_overtime_play()
      //篮球赛事阶段变化处理
      this.basketball_mmp_change(curr);
      this.update_mmp_map_title();
    },
    // 一级菜单切换，次要玩法，默认折叠
    menu_type(){
      this.tab_list.forEach(t => {
        t.unfold = 0;
      });
    },
  },
  destroyed(){
    this.clear_timer()
    this.off_listeners()
  },
  deactivated() {
    this.clear_timer()
    this.off_listeners()
  }
})