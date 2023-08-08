/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 赛事盘口的mixins
 */
import template0 from "src/project/yabo/components/match_details/list/template0.vue";
import template1 from "src/project/yabo/components/match_details/list/template1.vue";
import template2 from "src/project/yabo/components/match_details/list/template2.vue";
import template3 from "src/project/yabo/components/match_details/list/template3.vue";
import template4 from "src/project/yabo/components/match_details/list/template4.vue";
import template5 from "src/project/yabo/components/match_details/list/template5.vue";
import template6 from "src/project/yabo/components/match_details/list/template6.vue";
import template7 from "src/project/yabo/components/match_details/list/template7.vue";
import template8 from "src/project/yabo/components/match_details/list/template8.vue";
import template9 from "src/project/yabo/components/match_details/list/template9.vue";
import template10 from "src/project/yabo/components/match_details/list/template10.vue";
import template11 from "src/project/yabo/components/match_details/list/template11.vue";
import template12 from "src/project/yabo/components/match_details/list/template12.vue";
import template18 from "src/project/yabo/components/match_details/list/template18.vue";
import go_top from "src/public/components/go_top/go_top.vue"

// 电竞玩法模板
import template51 from 'src/project/yabo/components/match_details/list/template51.vue';

import { api_details } from "src/public/api/index";
import { mapGetters, mapActions } from "vuex";
import format from "src/project/yabo/mixins/match_details/index";
import time_format_mixin from "src/public/mixins/common/time_format";


export default {
  mixins: [format, time_format_mixin ],
  components: {
    template0,
    template1,
    template2,
    template3,
    template4,
    template5,
    template6,
    template7,
    template8,
    template9,
    template10,
    template11,
    template12,
    template18,
    "go-top": go_top,
    template51
  },
  data() {
    return {
      sportId: null,
      details_data: [], //拼接数据
      reset_toggle: 0,
      // 当前 loading 状态
      load_detail_statu: "loading",
      layout_statu: true, // 单双列样式
      waterfall: [], // 单双列数据
      // 是否开了滚球盘
      had_play_handicap: true,
      // 玩法展开状态
      panel_status: "default",
      has_thumb:false,//是否有滚动条
      handle_: [], // 用户操作过的数据
    };
  },
  props: {
    // 详情数据
    match_info: Object,
    //页面展开的对象
    is_list: Boolean,
    //玩法集
    category_list: Array,
    //盘口详情
    match_details: Array,
    // 关闭全部玩法
    close_all_handicap: Boolean,
    // 数据加载状态
    handicap_state: String,
    refs_tabs_bar: HTMLDivElement,
    // 组件加载类型
    load_type: String,
    // 选中玩法集的盘口玩法集
    plays_list: Array,
    // 电竞当前回合
    currentRound: {
        type: [Object, Number]
    }
  },
  
  computed: {
    ...mapGetters({
      // 获取用户uid
      get_uid: "get_uid",
      // 获取指定的玩法id
      get_top_id: "get_top_id",
      // 获取页面宽高信息 --可以废弃，废弃改动较大
      get_layout_list_size: "get_layout_list_size",
      // 详情页玩法列表单双列 0单列， 1双列
      get_layout_statu: "get_layout_statu",
      // 获取当前页路由信息
      vx_layout_cur_page: "get_layout_cur_page",
      // 右侧布局布局 大或小  ---未使用
      get_right_zoom: "get_right_zoom",
      // 当前所选择的玩法集子项
      get_tabs_active_id: "get_tabs_active_id",
    }),
    current_list() {
        let list = []
        this.plays_list.forEach(element => {
            list.push(element+'-'+this.currentRound)
        })
        return list;
      }
  },

  watch: {
    get_layout_list_size() {
      if (this.get_layout_statu) {
        this.set_waterfall(this.details_data);
      } else {
        this.waterfall = [this.details_data];
      }
      this.int_is_show()
      this.set_go_top_show()
    },
    get_right_zoom() {
      this.wrap_tabs_width = this.$refs.warp.offsetWidth
    },
    // 监听关闭全部玩法
    close_all_handicap: {
      handler(res) {
        if (res) {
          if(this.load_type == 'details'){
            this.$emit('set_handicap_state','empty')
          }else{
            this.load_detail_statu = "empty"
          }
        }
      },
      immediate: true
    },
    "match_info.mmp": {
      handler(cur) {
        if(cur == '999'){
          if(this.load_type == 'details'){
            this.$emit('set_handicap_state','empty')
          }else{
            this.load_detail_statu = "empty"
          }
        }
      },
      immediate: true
    },
    // 加载状态
    handicap_state: {
      handler(n) {
        this.load_detail_statu = n;
      }
    },
    match_details: {
      handler(res) {
        this.load_detail_statu = this.handicap_state

        if(this.handicap_state != "data") {
          this.details_data = [];
          this.waterfall = [[]];
          return false
        }

        /*hl级关锁盘 || 赛事级关锁盘
          参考文档 src/public/mixins/details/README.md
          赛事级封关锁
        */
        if(this.match_info.mhs){
          let status = 1
          switch (this.match_info.mhs){
            case 1 : status = 2;break;
            case 2 : status = 3;break;
            case 11 : status = 4;break;
          }

          res.forEach(item => {
            item.hl.forEach(list => {
              list.ol.forEach(j => {
                if(j._hs == 11){
                  j.os == 1? j.os = status : ''
                } else {
                  j.os = status
                }
              })
            })
          })
        } else {
          res.forEach(item => {
            item.hl.forEach(list => {
              if(list.hs){
                let status = 1
                switch (list.hs){
                  case 1 : status = 2;break;
                  case 2 : status = 3;break;
                  case 11 : status = 4;break;
                }
                list.ol.forEach(j => {
                  if(j._hs == 11){
                    j.os == 1? j.os = status : ''
                  } else {
                    j.os = status
                  }
                })
              }
            })
          })
        }
        // 详情和虚拟详情页计算单双列
        if (["details","virtual_details"].includes(this.$route.name)) {
          if (this.get_layout_statu) {
            this.set_waterfall(res);
          } else {
            this.waterfall = [res];
          }
        } else {
          this.waterfall = [res];
        }
        this.details_data = res;
        this.set_go_top_show()
        this.int_is_show()
      },
      immediate: true,
      deep: true
    },
    /**
     * @Description:监听玩法是否展开
     * @return {undefined} undefined
     */
    panel_status(res){
      switch (res) {
        case "open":
          this.set_is_show_all(true)
          break;
        case "hide":
          this.set_is_show_all(false)
          break;
      }
    },
  },

  methods: {
    ...mapActions({
      set_top_id: "set_top_id",//设置置顶的玩法id
      set_layout_statu: "set_layout_statu"//设置玩法列表单双列 0单列， 1双列
    }),

    /**
    * @description: 盘口级别状态转换投注项级别状态
    * 参考文档 src/public/mixins/details/README.md
    * @param {String} hs 盘口级别状态
    */
    transfer_status(status){
      let transfer = 1
      switch (status){
        case 1 : transfer = 2;break;
        case 2 : transfer = 3;break;
        case 11 : transfer = 4;break;
      }
      return transfer
    },

    /**
     * @Description:初始化玩法是否展开
     * @return {undefined} undefined
     */
    int_is_show(){
      // let show_title = "hide"
      this.waterfall.forEach( list => {
        list.forEach( item => {
          //是否有附加盘
          if(item.hmm == 1 && _.get(item,'hl.length') > 1){
            item.has_plus = true
          }else{
            item.has_plus = false
          }
          item.is_show = this.panel_status == 'hide' ? false : true
          item.is_show_plus = this.panel_status == 'hide' ? false : true
        })
      })
    },
    /**
     * @Description:设置玩法是否展开
     * @return {undefined} undefined
     */
    set_panel_status(isHandle = null){
      let status = false
      this.waterfall && this.waterfall.forEach( list => {
        list.forEach( item => {
          if(item.is_show){
            status = true
          }
          //是否有附加盘
          if(item.has_plus && item.is_show_plus){
            status = true
          }
        })
      })
      // 接收用户点击的玩法的状态
      if (isHandle) {
        this.userHandleStatus({id: isHandle.handle.topKey, hshow: isHandle.handle.hshow});
      }
      //所有玩法都已收起
      if(!status){
        this.panel_status = 'hide'
      }else{
        this.panel_status = 'default'
      }
      // 储存用户操作后的玩法状态，静态刷新后需要保持该状态
      window.sessionStorage.setItem('handle_state', JSON.stringify(this.handle_));
    },
    /**
     * 接收用户点击的玩法的状态保存或移除
     * 移除或存储用户点击的玩法
     * @param {Object} item 用户点击的玩法
     */
    userHandleStatus(handle) {
      if (this.handle_) {
        // 如果缓存里已有该 id 就移除，否则就保存
        let flag = this.handle_.findIndex(i => i.id == handle.id);
        if (flag != -1) {
          this.handle_.splice(flag, 1);
        } else {
          this.handle_.push({id: handle.id, hshow: handle.hshow});
        }
      }
    },
    /**
     * @Description:设置所有玩法集是否展开
     * @param {boolean} status 设置的状态
     * @return {undefined} undefined
     */
    set_is_show_all(status){
      this.waterfall.forEach( list => {
        list.forEach( item => {
          item.is_show = status
          item.is_show_plus = status
        })
      })
    },
    /**
     * 展开|收起投注列表
     * @return {undefined} undefined
     */
    toggle_panel() {
      (this.panel_status == 'open' || this.panel_status == 'default') ? this.panel_status = 'hide' : this.panel_status = 'open'
      this.set_go_top_show()
    },

    /**
     * 详情页玩法展示单双列切换
     * @return {undefined} undefined
     */
    toggele_layout(statu) {
      if(statu == this.get_layout_statu){
        return false
      }

      this.set_layout_statu(statu);//设置玩法列表单双列 0单列， 1双列
      this.layout_statu = statu ? true : false;
      if (statu) {
        this.set_waterfall(this.details_data);
      } else {
        this.waterfall = [this.details_data];
      }
      // 判断是否显示【返回顶部】按钮
      this.set_go_top_show()
      // 设置玩法展开和折叠状态
      this.int_is_show()
    },

    /**
     * 玩法集瀑布流，设置单列或双列的数据[[]] / [[],[]]
     * @return {undefined} undefined
     *
     * is_hide_panel 判断列表是否是全部展开或收起状态
     * 如果是全部收起，就直接把玩法左右各放一半
     * 如果不是，就左右各放一个然后计算高度栏判断放在哪一边
     */
    set_waterfall(res, is_hide_panel) {
      if (!res.length) return;
      // 双列左边
      let left_array = [];
      // 双列右边
      let right_array = [];
      // 左侧玩法个数
      let left_row = 0;
      // 右侧玩法个数
      let right_row = 0;
      //收起状态
      if (is_hide_panel) {
        res.forEach((item, index) => {
          if (index % 2) {
            right_array.push(item);
          } else {
            left_array.push(item);
          }
        })
      } else {//展开状态
        res.forEach((item, index) => {
          if (index == 0) {
            //第一条数据插入左边
            left_array.push(item);
            left_row = this.get_play_rows(item);
          } else if (index == 1) {
            //第二条数据插入右边
            right_array.push(item);
            right_row += this.get_play_rows(item);
          } else {
            //从第三条开始计算左右总高度，判断插入
            if (left_row <= right_row) {
              left_row += this.get_play_rows(item);
              left_array.push(item);
            } else {
              right_row += this.get_play_rows(item);
              right_array.push(item);
            }
          }
        });
      }
      this.waterfall = [left_array, right_array];
    },
    /**
     * 获取单个玩法的行数
     * @return {undefined} undefined
     */
    get_play_rows(data) {
      let num = 0; //玩法条数
      let row = 0; //玩法显示的行数
      data.hl.forEach(item => {
        if (item && item.ol) {
          num += item.ol.length;
        }
      });
      /*
      [0, 2, 3, 5, 6].includes(data.hpt)//2
      [1, 4, 7, 8, 10].includes(data.hpt)//3
      [9].includes(data.hpt)//5
      */
      if ([0, 2, 3, 5, 6].includes(data.hpt)) {
        [5, 6].includes(data.hpt) ? row = Math.ceil(num / 2) + 1 : row = Math.ceil(num / 2)
      } else if ([1, 4, 7, 8, 10].includes(data.hpt)) {
        [4, 8].includes(data.hpt) ? row = Math.ceil(num / 3) + 1 : row = Math.ceil(num / 3)
      } else if ([9].includes(data.hpt)) {
        row = Math.ceil(num / 5) + 1;
      }
      return row;
    },


    /**
     * 玩法置顶排序
     * @return {undefined} undefined
     */
    sort_index(titleData) {
      let type = titleData[0];// true取消置顶, false置顶
      let index = titleData[1];
      let handicap = this.details_data;
      let params = {
        cuid: this.get_uid,
        playId: handicap[index].hpid,
        matchId: handicap[index].mid,
        topKey: handicap[index].topKey,
        status: type ? 1 : 0
      };
      api_details.set_playTop(params).then(res => {
        const code = _.get(res, "data.code");
        if (code == 200) {
          if (!params.status) {
            //置顶
            if (handicap[index].hton == "0") {
              handicap[index].hton = new Date().getTime() + "";
            }
            handicap.unshift(handicap.splice(index, 1)[0]);
          } else {
            //取消置顶
            handicap[index].hton = "0";
            let arr = []; //暂存置顶的数据
            for (var i = 0; i < handicap.length; i++) {
              if (handicap[i].hton != "0") {
                arr.unshift(handicap.splice(i, 1)[0]);
                i--
              }
            }
            //根据hpon排序
            handicap.sort(function (a, b) {
              return a.hpon - b.hpon;
            });
            //插入置顶的数据
            for (var i in arr) {
              handicap.unshift(arr[i]);
            }
          }
          // 保存置顶玩法的 id
          this.set_top_id({
            id: params.topKey,
            type: !params.status
          });
          this.set_current_index(handicap);
          // 计算单双列玩法
          this.set_waterfall(handicap);
        }
      });
    },
    /**
     * 设置渲染模板单个玩法的index，用于置顶
     * @return {undefined} undefined
     */
    set_current_index(handicap) {
      handicap.forEach((item, index) => {
        item.index = index;
      });
      this.details_data = handicap;
    },
    /**
     * 一栏/两栏布局按钮在页面宽度 < 1680 不显示
     * @return {undefined} undefined
     */
    check_half() {
      if((this.$route.name == "details" && this.get_layout_list_size.width >= 1680) || (this.$route.name == "virtual_details" && this.match_info.csid == '1001')){
        return true
      } else {
        return false
      }
    },

    /**
    * @Description:返回顶部
    * @return {Undefined} Undefined
    */
    on_go_top() {
      this.$emit('on_go_top')
    },
    /**
    * @Description:设置是否显示返回按钮
    * @return {Undefined} Undefined
    */
    set_go_top_show() {
      this.$nextTick(()=>{
        let obj = document.querySelector('.details .v-scrollarea .scroll') || document.querySelector('.virtual_details .v-scrollarea .scroll');
        if(obj){
          this.has_thumb = obj.scrollHeight > obj.clientHeight
        }
      })

    },
    /**
     * @Description 获取当前选中详情玩法集
     * @param {undefined} undefined
    */
    get_active_details_play_tab(callback){
      let item = this.category_list.filter(item => this.get_tabs_active_id == item.id)[0]
      callback(item)
    },
    /**
     * @Description 设置数据加载状态
     * @param {undefined} undefined
    */
    set_load_state(data){
      let statu
      if(typeof(data)=='object'){
        if(data.mid==this.match_info.mid){
          statu = data.status;
        }
      } else {
        statu = data;
      }
      if(!statu){
        return
      }

      if(this.load_type == 'details'){
        this.$emit('set_handicap_state',statu)
      }else{
        this.load_detail_statu = statu
      }
    },
    is_component_show(item) {
        // 电竞赛事第几局
        if(this.$utils.is_eports_csid(this.sportId)&&!!this.currentRound) {
            return this.current_list.includes(String(item.chpid))
        } else {
            // 常规赛事或电竞非局数
            return this.plays_list.includes(item.hpid/1);
        }
    }
  },
  created() {
    let { csid: sportId } = this.$route.params;
    this.sportId = sportId
    // 设置玩法集 tab_hover 防抖
    this.tabs_hover = this.debounce(this.tabs_hover, 100)
    this.reset_toggle = Math.random();
    this.toggle_play = this.throttle(this.toggle_play, 500);
    // 监听数据加载状态
    this.$root.$on('set_match_detail_load_state',this.set_load_state)

    // 监听用户点击玩法   折叠或收起
    this.$root.$on("set_panel_status", this.set_panel_status)
    this.$root.$on('get_active_details_play_tab',this.get_active_details_play_tab)
  },
  destroyed(){
    this.$root.$off('set_match_detail_load_state',this.set_load_state)
    this.$root.$off('get_active_details_play_tab',this.get_active_details_play_tab)
    this.debounce_throttle_cancel(this.toggle_play);
    this.debounce_throttle_cancel(this.tabs_hover);
    this.$root.$off("set_panel_status", this.set_panel_status)
    this.handle_ = null;
    // this.offsetTop = null;
    this.waterfall = null;
    this.details_data = null;
  },
  mounted() {
    this.$emit("set_handicap_this", this)
  },

  filters: {
    template_id(num) {
      switch (num) {
        case 0:
          return "0";
        case 1:
          return "1";
        case 2:
          return "0";
        case 3:
          return "3";
        case 4:
          return "4";
        case 5:
          return "1";
        case undefined:
          return "2";
        default:
          return "";
      }
    }
  },

};
