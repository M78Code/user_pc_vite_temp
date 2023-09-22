<!--
 * @Author: ledron
 * @Date: 2020-11-10 11:09:47
 * @Description: 搜索页
-->
<template>
  <div :style="{height:show_tab == 'saiguo_xunitiyu'? 'unset':'1rem'}">
    <div class='searchTop' id="sport_menu2" :style="{height:show_tab == 'saiguo_xunitiyu'? 'unset':'1rem'}">
      <!-- 搜索头部骨架屏 -->
      <SSearch  v-if="!skeleton_loading"/>
      <div class="searchGroup">
        <div>
          <!-- 搜索input 输入框 -->
          <q-input
              class="quasar_input"
              maxlength="15" borderless  outlined
              v-model="text"
              :input-class="{ 'search-keyword-input': true }"
              type="search"
              @keydown.stop="key_down($event)"
              :placeholder="show_tab=='saiguo_xunitiyu' ?$t('search.search_qihao') :(details_search && details_search.word ?
              details_search.word :
             $t('search.search_title_bw3'))"
              @keyup.enter="changeStr"
              @focus="search_input_focus_or_blur($event, true)"
              @blur="search_input_focus_or_blur"
          >
            <!-- 输入框的扩大镜图片 -->
            <template v-slot:append>
              <img  src="image/wwwassets/bw3/svg/delete.svg" alt="" class="icon-delete" @click.stop.prevent.self="clear_search" v-show="text.length > 0">
              <span :class="[`icon-search ${get_y0_suffix}`, {'input-without-word': !text.length}]" @click.stop.prevent.self="go_to_details"></span>
            </template>
          </q-input>
          <!--取消按钮 -->
          <span class="cancleBtn" @click="cancle_btn()">{{$t('common.cancel')}}</span>
        </div>
      </div>
      <!-- 球类tab 选项卡 -->
      <div class="row balls" ref="scrollBox" v-if="show_tab != 'saiguo_xunitiyu'">
        <div class="ball_son"
             ref="scrollItem"
             :class="{checked_ball_son: index_num == index}"
             v-for="(item,index) of sport_list"
             :key="index"
             @click="change_record(index)"
        >
          <span>{{item.sportName}}</span>
        </div>
        <div style="width:0.09rem;flex-shrink:0;margin-left: 0.1rem;"></div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters, mapMutations } from "vuex"
import utils from "src/public/utils/utils";
import {get_hot_push, get_sport} from 'src/project/api/module/search/search_api.js'
import SSearch from "src/project/components/skeleton/search"
export default {
  name: 'searchTop',
  props:{
    show_tab: String
  },
  data () {
    return {
      // 输入框输入的文字
      text:'',
      index_num: 0, // 下标
      is_hot_history: false, // 代表的是 点击 历史搜索 和 热门搜索的模块
      details_search: null, // 搜索占位符
      sport_list:[],  //搜索下面的球种+球类ID
      skeleton_loading:false,  //搜索数据是否加载中
      // dom 操作
      dom_box: null,
      // 页面初始高度
      originHeight: 0,
      get_y0_suffix: utils.get_y0_suffix()
    }
  },
  components:{
    SSearch
  },
  computed: {
    ...mapGetters([
      'get_search_txt',
      'get_search_term',
      'get_current_menu',
      'get_cur_csid',
      'get_curr_sub_menu_type',
      'get_menu_type',
      'get_useid_ievname'
    ]),
    // 是赛果虚拟体育赛事
    results_of_the_virtual_display() {
      return ([1001, 1002, 1004, 1010, 1011, 1009].includes(this.get_curr_sub_menu_type) && this.get_menu_type == 28)
    }
  },
  watch: {
    text (newV, oldV) {
      this.set_search_txt(newV);
      this.debounce(this.changeStr,this.is_hot_history ? 0 : 1000);
      if(!newV.length) this.clear_search()
      this.details_search = null
    },
    'get_search_txt' (newV, oldV) {
      this.text = this.get_search_txt;
    }
  },
  created() {
    this.text = this.get_search_txt;
    this.get_hot_push()
    this.get_sport_list();
    this.text = this.get_search_term;
    this.$root.$on(this.emit_cmd.EMIT_SET_IS_HOT_HISTORY,this.set_hot_history_handle);
  },
  mounted() {
    this.dom_box = this.$refs.scrollBox
    this.originHeight = document.querySelector('.select-dia').clientHeight

    // 监听手机键盘弹出，收起高度变化
    window.addEventListener('resize', this.resizeHandler)
  },
  methods: {
    ...mapMutations([
      'set_search_txt',
      'set_show_match_filter',
      'set_cur_csid',
      'set_goto_detail_matchid',
      'set_details_item',
      'set_search_term',
    ]),
    set_hot_history_handle(){
      this.is_hot_history = true
    },
    // 获取搜索球类
    get_sport_list(){
      let params = {}
      this.skeleton_loading = false
      // 如果是赛果
      const menu_type =  _.get(this.get_current_menu, 'main')||this.get_menu_type
      if(menu_type =='28'){
        // 增加参数：分球类搜索
        params.from = 2;
      }
      get_sport(params).then(({data}) => {
        this.skeleton_loading = true
        this.sport_list = data;
        this.List_econdary_menu(data)
      }).catch((err)=>{
        console.error(err);
        this.skeleton_loading = true
      })
    },
    // 列表页二级菜单 对应 搜索头部的 球类二级菜单
    List_econdary_menu(data) {

      // menuType 5 足球， 7 篮球， 13 网球， 14 斯诺克， 15 羽毛球， 16 乒乓球，  17 排球，  18 冰球，  19 棒球， 20 美式足球

      if(this.get_current_menu && this.get_current_menu.sub){
        // 赛果使用get_current_menu中二级菜单数据，其他则使用get_useid_ievname
        let usid_type = this.get_menu_type == 28 ? this.get_current_menu.sub : Math.abs(this.get_useid_ievname)

        if(this.get_search_term && this.get_cur_csid ){
          data.forEach((item, index, arr) => {
            if(this.get_cur_csid == item.id){
              this.index_num = index
              // 存储列表页二级菜单 球类id
              this.set_cur_csid(this.get_cur_csid);
              this.$nextTick(() => {
                utils.tab_move2(index, this.dom_box,true)
              })
              return
            }
          })
          return
        }
        // 默认选中对应二级菜单赛种
        let index = data.findIndex(item => item.id == usid_type)
        if( index < 0 ) index = 0
        // 选中下标
        this.index_num = index
        // 赛种id储存
        this.set_cur_csid(data[index].id);
        // 赛种滚动条
        this.$nextTick(() => {
          utils.tab_move2(index, this.dom_box,true)
        })
        // data.forEach((item, index, arr) => {
        //   if(usid_type == item.id || this.get_current_menu.sub.sportId == item.id){
        //     this.index_num = index
        //     // 存储列表页二级菜单 球类id
        //     this.set_cur_csid(data[this.index_num].id);
        //     this.$nextTick(() => {
        //       utils.tab_move2(index, this.dom_box,true)
        //     })
        //     return
        //   }
        // })
      }else{
        // 存储 球类id
        this.set_cur_csid(data[0].id);
      }
    },
    // 获取搜索占位符字段
    get_hot_push() {
      get_hot_push().then(({code, data}) => {
        if (code === 200 && data != null) {
          data.word.length > 0 ? this.details_search = data : ''
        }
      }).catch((err) =>{
        console.error(err);
      })
    },
    // 跳转到赛事详情
    go_to_details() {
      if (this.details_search != null && this.details_search.word.length> 0) {
        // 如果是冠军，跳转到冠军的列表页面
        if(this.details_search.isChampion == 1){
          this.set_show_match_filter(false)
          // this.$root.$emit(this.emit_cmd.EMIT_SEARCH_GOTO_BY_MAIN_SPORT, this.details_search.h5MenuId.slice(-2));
          this.$root.$emit(this.emit_cmd.EMIT_SEARCH_GOTO_BY_MAIN_SPORT, this.details_search.menuId.slice(-2));
        }else{
          this.goto_details(this.details_search)
        }
      }
      if(this.results_of_the_virtual_display){
        console.log('是赛果的虚拟体育');
        //  调用列表页接口
        this.$root.$emit(this.emit_cmd.EMIT_TAB_HOT_CHANGING);
        this.$root.$emit(this.emit_cmd.EMIT_HID_SEARCH_DIA)
        clearTimeout(this.timer00);
        this.timer00 = setTimeout(()=>{
          this.set_search_txt('')
        },300)
      }
    },
    /**
     * @description: 跳转至详情
     * @param {Object} match 赛事
     * @return {String}
     */
    goto_details(match) {
      if ( !match || !match.matchId ) return;

      this.set_goto_detail_matchid(match.matchId);
      this.set_details_item(0);
      this.$router.push({name:'category', params: {mid: match.matchId, csid: match.csid}});
      this.set_search_term(this.get_search_txt)
    },
    // 点击球种调用搜索接口
    change_record(val){
      this.index_num = val;
      utils.tab_move2(val, this.dom_box)
      // 点击球种更换球类ID
      this.set_cur_csid(this.sport_list[val].id);
      // 点击球种,搜索框内容不为空时,调用搜索接口
      if(this.get_search_txt.length > 0 ){
        this.$emit('get_search_result')
      }
    },
    // 输入框去抖动
    debounce:function(fn,wait){
      if (this.fun!==null){
        clearTimeout(this.fun)
      }
      this.fun = setTimeout(fn,wait)
    },
    // 键入回车换行
    key_down(event) {
      event = event || window.event;
      if (event.keyCode == 13) {
        event.returnValue = false;
      }
    },
    changeStr:function(evt){
      this.is_hot_history = false
      if(evt && evt.keyCode == 13){
        if (this.details_search != null && this.details_search.word.length> 0 && !this.get_search_term) {
          this.goto_details(this.details_search)
        }
      }else{
        this.$emit('get_suggestion_list',evt)
      }
    },
    search_input_focus_or_blur(e, event_handle) {
      let selectDialog = document.querySelector('.select-dia')
      selectDialog.style.display = 'none'

      this.$nextTick(() => {
        selectDialog.style.display = 'block'
      })

      // 搜索弹窗 滚动区域 聚焦时 滚动到顶部
      if (event_handle) {
        clearTimeout(this.event_handle_timer)
        this.event_handle_timer = setTimeout(() => {
          selectDialog.scrollTop = 0
        }, 200)
      }
    },
    // 清除相关定时器
    clear_timer() {
      const timer_arr = [
          'cancleTimer',
          'event_handle_timer',
          'timer00',
          'fun',
      ]

      for (const timer of timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }
    },
    //搜索逻辑
    cancle_btn(){
      if (this.searchInputFocusin) {
        // 延迟隐藏，满足动画效果
        clearTimeout(this.cancleTimer)
        this.cancleTimer = setTimeout(() => {
          this.$emit('change_show_content',this.text);
          this.set_search_term('')
          this.text = '';
          this.$root.$emit(this.emit_cmd.EMIT_HID_SEARCH_DIA)
        }, 300)
      } else {
        this.$emit('change_show_content',this.text);
        this.set_search_term('')
        this.text = '';
        this.$root.$emit(this.emit_cmd.EMIT_HID_SEARCH_DIA)
      }
    },
    clear_search(){
      this.$emit('change_show_content',this.text);
      this.set_search_term('')
      this.text = '';
    },
    resizeHandler() {
      let selectDialog = document.querySelector('.select-dia')
      const resizeHeight = selectDialog.clientHeight
      const activeElement = document.activeElement

      // 输入框高度变化(小于初始高度，则为弹出键盘，大于初始高度则为收起键盘)
      if (resizeHeight < this.originHeight) {
        // 键盘弹起后逻辑
        if (activeElement && (activeElement.tagName === 'INPUT')) {
          selectDialog.scrollTop = 1000
          this.searchInputFocusin = true
        }
      } else {
        selectDialog.scrollTop = 0
        this.searchInputFocusin = false
      }
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler)
    this.$root.$off(this.emit_cmd.EMIT_SET_IS_HOT_HISTORY,this.set_hot_history_handle)
    this.clear_timer()

    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
}
</script>
<style lang="scss" scoped>
.searchTop {
  position: fixed;
  width: 100%;
  max-width: 7.68rem;

  z-index: 999;

  .balls {
    width: 100%;
    position: absolute;
    margin-left: 0.2rem;
    overflow-x: auto;
    overflow-y: hidden;

    flex-wrap: nowrap;
    font-weight: 540;
    z-index: 999;
    scrollbar-width: none; /*  去除滚动条火狐浏览器兼容性问题 */
  }

  .ball_son {
    flex-shrink: 0;
    letter-spacing: 0;
    text-align: center;
    margin: 0.09rem 0.15rem;

    span {

      font-size: 0.14rem;
    }

    &:nth-child(1) {
      margin-left: 0.08rem;
    }

    &.checked_ball_son {
      span {


        font-weight: bold;
      }
    }
  }

  ::v-deep input {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  @Supports (-webkit-mask: none) and ( not (caret-color: red)) {
    input {
      color: #FFB001;
    }
    input::first-line {
      color: #FFB001;
      width: 0.03rem;
    }
  }

  .title {
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.16rem;

    span {
      display: inline-block;

      &:nth-child(2) {
        width: 100%;
        text-align: center;
      }
    }

    .go {
      height: 0.28rem;
      line-height: 0.28rem;
      transform: rotateZ(90deg);
      position: absolute;
      top: 0.06rem;

      &:before {
        font-size: 0.14rem;
      }
    }

    .searchBtn {
      position: absolute;
      right: 0.16rem;
      color: #D2B79C;
      display: none;
    }
  }

  .searchGroup {
    position: relative;
    padding: 0.08rem 0 0.08rem 0.15rem;

    > div {
      display: flex;
    }

    .quasar_input {
      width: 2.88rem;
      height: 0.4rem;
      vertical-align: middle;

      border-radius: 0.5rem;

      &.q-field--focused {
        ::v-deep.q-field__control:after {
          border-width: 1px;
        }

        .icon-search {
          background-image:  var(--q-color-img-bg-93);

          /*&:before {*/
          /*  color: #FFB001;*/
          /*}*/

          /*&:after {*/
          /*  background: #FFB001;*/
          /*}*/

          // 由于使用了变量，这个代码无效，对应的js也要优化。
          &._y0 {
						/*  在search_top中设置无效 原因暂不明 因此在此处添加类 */
            // background-image: url('~public/image/wwwassets/bw3/svg/search3_y0.svg');

            &:before {
              color: #569FFD;
            }

            &:after {
              background: var(--q-color-page-bg-color-63);
            }
          }
        }
      }

      ::v-deep .q-field__control {
        height: 100%;
        border-radius: .5rem;
        &::after {
          border-width: 1px;
        }
      }

      ::v-deep .q-field__marginal {
        height: 100%;
      }
    }

    .icon-search {
      display: inline-block;
      width: 0.2rem;
      height: 0.2rem;

      position: relative;
      background: var(--q-color-com-img-bg-113) no-repeat  center / 100% 100%;
      transition: all 0.3s ease-in-out;

      &.input-without-word {
        position: absolute;
        right: .12rem;
      }

      // &:after {
      //   content: "";
      //   width: 0.01rem;
      //   height: 0.14rem;
      //   position: absolute;
      //   left: -0.06rem;
      //   top: 0.03rem;
      //   border-radius: 0.015rem;
      //   transition: all 0.3s ease-in-out;
      // }
    }

    .icon-delete {

      width: 0.32rem;
      height: 0.32rem;
      padding: 0.1rem;
    }

    .cancleBtn {


      display: inline-block;
      margin: 0 auto;
      line-height: 0.4rem;
      font-size: 0.16rem;
    }
  }

  /*******兼容部分ios下输入框背景色等样式异常情况 开始*******/
  ::v-deep.search-keyword-input {
    -webkit-appearance: none;
    border-radius: 0;
    outline: 0;
    background: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &::-webkit-input-placeholder {


      font-size: 0.14rem;
    }

    &:-moz-placeholder {


      font-size: 0.14rem;
    }

    &::-moz-placeholder {


      font-size: 0.14rem;
    }

    &:-ms-input-placeholder {


      font-size: 0.14rem;
    }

    &:-webkit-autofill {
      transition: background-color 5s ease-in-out;
    }
  }

  /*******兼容部分ios下输入框背景色等样式异常情况 结束*******/
  ::v-deep.q-placeholder {
    height: 0.4rem;
    vertical-align: middle;
    font-size: 0.16rem;
    min-height: unset;
  }

  ::v-deep .q-field__control, ::v-deep .q-field__prepend, ::v-deep.q-field__append {
    height: 0.4rem;
    vertical-align: middle;
  }

  ::v-deep .q-field__control-container, ::v-deep.q-field__native {
    height: 0.38rem;
    background: transparent;
  }

  ::v-deep.q-field__control {


    border-radius: 0.5rem;
    min-height: unset;
    align-items: center;
  }
}
</style>
