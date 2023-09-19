<!--
 * @Author: ledron
 * @Date: 2020-08-20 18:35:53
 * @Description: 搜索页
-->
<template>
  <div class='search-container'>
    <template v-if="!results_of_the_virtual_display">
       <!-- 搜索头部 -->
      <search-top
        @get_suggestion_list="get_suggestion_list"
        @get_search_result="get_search_result"
        @change_show_content="change_show_content"
      />

      <div class="search" ref="search">
        <!-- 搜索页面骨架屏 -->
        <SSearch v-show="show_suggestion && loading" :loading_body="show_suggestion"/>

        <!-- 搜索联想框 -->
        <i-suggestion
            :suggestion_list="suggestion_list"
            v-if="show_suggestion && !loading"
        />
        <!-- 搜索历史 -->
        <search-history
            v-if="history_list.length > 0 && !show_suggestion "
            :history_list="history_list"
            @get_search_result="get_search_result"
            @delete_history="delete_history"
        />

        <!-- 热门搜索 -->
        <search-hot
            v-if='hot_list.length > 0 && !show_suggestion '
            :hot_list="hot_list"
            @get_search_result='get_search_result'
        />
      </div>
    </template>
    <template v-if="results_of_the_virtual_display">
      <!-- 搜索头部 -->
      <search-top
        @get_suggestion_list="get_suggestion_list"
        show_tab="saiguo_xunitiyu"
      />
    </template>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex"
  import {get_fetch_search_history, get_remove_search_history, get_fetch_hot_search, get_hotselect3} from 'src/project/api/module/search/search_api.js'
  import searchTop from './components/search_top.vue'
  import searchHot from './components/search_hot.vue'
  import searchHistory from './components/search_history.vue'
  import iSuggestion from './components/i_suggestion.vue'
  import noData from 'project_path/src/components/common/no-data.vue'
  import SSearch from "project_path/src/components/skeleton/search"
  
  export default {
    name: 'search',
    computed: {
      ...mapGetters([
        'get_search_txt', // 上一次搜索文本
        'get_uid', // userId
        'get_cur_csid', // 联赛的id
        'get_current_menu', // 当前选中的一级菜单, 二级菜单, 三级菜单
        'get_search_term',  // 搜索 去到 详情页的记录
        'get_curr_sub_menu_type', // 当前选中的二级菜单menu_type
        'get_menu_type', // 当前选中的主菜单菜单menu_type
        'get_newer_standard_edition' // 1新手版 2标准版
      ]),
      // 是赛果虚拟体育赛事
      results_of_the_virtual_display() {
        return ([1001, 1002, 1004, 1010, 1011, 1009].includes(this.get_curr_sub_menu_type) && this.get_menu_type == 28)
      }
    },
    data () {
      return {
        history_list:[],  //搜索历史记录list
        params : {    //查询搜索历史记录的入参
          cuid:''
        },
        suggestion_list: [],  //搜索建议列表
        show_suggestion:false,  //是否显示搜索建议
        hot_list: [],   //热门搜索列表
        container_height:0, //内容区域高度
        loading: true, // 加载动画
        skeleton_load: false, // 返回时的加载动画
      }
    },
    components: {
      searchTop, // 搜索头部组件
      searchHot, // 搜索热门
      searchHistory, // 搜索历史
      iSuggestion, // 搜索联想建议
      noData, // 无数据组件
      SSearch // 骨架屏
    },
    created() {
      // 用户的userid
      this.params.cuid = this.get_uid;
      // 标准版或者新手标
      this.params.device = this.get_newer_standard_edition == 2 ? 'v2_h5_st' : 'v2_h5';
      // 获取历史记录数据
      this.get_history();
      // 获取热门记录数据
      this.get_hot_search();

      if (sessionStorage.getItem('from') == 'category'){
        this.get_search_result()
      }else {
        this.set_search_txt('');
      }
      // 如果vuex里边 有搜索的记录
      if (this.get_search_term.length>0){
        // 展示联想建议页面
        this.show_suggestion = true
      }else{
        // 隐藏联想建议页面
        this.show_suggestion = false
      }
    },
    mounted() {
      if (this.$refs.search) {
        this.$refs.search.style.height = window.innerHeight - this.$refs.search.getBoundingClientRect().top + 'px'
      }
    },
    methods: {
      ...mapMutations(['set_search_txt','set_toast']),
      // 获取历史记录接口
      get_history(){
        get_fetch_search_history({cuid:this.get_uid}).then(({data}) => {
          this.history_list = data || [];
        })
      },
      // 删除历史记录
      delete_history(item){
        let params = {
          cuid:this.get_uid,
          keyword:item ? item.keyword : '',
        };
        // 删除搜索历史
        get_remove_search_history(params).then(({data}) => {
          let found_i = -1;
          // 历史记录数据源
          this.history_list.forEach((li,i) => {
            if(li.id == item.id){
              found_i = i;
            }
          });
          if(found_i > -1){
            this.history_list.splice(found_i,1);
          }else{
            this.history_list = [];
          }
        }).catch((err) =>{
          console.error(err);
        })

      },
      // 获取数据 搜索结果接口
      get_search_result(skt_upd){
        // 如果没有搜索文字，则弹框
        if(!this.get_search_txt || !this.get_search_txt.trim()){
          this.set_toast({ 'txt': this.$root.$t('search.keyword_is_empty'), hide_time:3000 });
          return;
        }
        // 代表的是 点击 历史搜索 和 热门搜索的模块
        if(skt_upd) {
          this.$root.$emit(this.emit_cmd.EMIT_SET_IS_HOT_HISTORY, true)
        }else{
          // 请求联想接口数据
          this.get_suggestion_list()
        }
      },
      change_show_content($event){
        this.get_history();
        this.show_suggestion = false;
      },

      // 请求模糊搜索 接口数据
      get_suggestion_list(evt){
        if(!this.get_search_txt || !this.get_search_txt.trim()) {
          this.suggestion_list = [];
          return;
        }
        // 展示骨架屏
        this.loading = true
        // 展示模糊搜索页面
        this.show_suggestion = true
        this.params.keyword = this.get_search_txt;
        // 增加参数：分球类搜索
        this.params.searchSportType = this.get_cur_csid;
        // 如果是赛果 增加参数：分球类搜索
        const menu_type =  _.get(this.get_current_menu, 'main')||this.get_menu_type
        if(menu_type =='28') {this.params.from = 2;}
        get_hotselect3(this.params).then(({code, data}) => {
          this.loading = false
          if (code === 200 && data != null) {
            // 改变里边的 msc 比分
            data.data.bowling && data.data.bowling.forEach( (item) => {
              this.transform_score(item)
            })
            // 改变里边的 msc 比分
            data.data.league && data.data.league.forEach( (item) => {
              item.matchList.forEach ( (main) => {
                this.transform_score(main)
              })
            })
            // 改变里边的 msc 比分
            data.data.teamH5 && data.data.teamH5.forEach( (item) => {
              this.transform_score(item)
            })
            // 模糊搜索里边的数据源
            this.suggestion_list = data.data || [];
          }
        }).catch((err) => {
          this.loading = false
          console.error(err);
        })
      },
      // 获取热门搜索
      get_hot_search(){
        get_fetch_hot_search().then( ({data}) =>{
          this.hot_list = data || [];
        })
      },
      /**
       *@description msc比分数组转化为对象
       *@param {Undefined}  val 赛事对象
       *@return {Undefined} undefined
       */
      transform_score(val) {
        if(!val.msc) return;
          let api_msc = val.msc, obj = {};
          if(api_msc.length > 0){
            for (let i in api_msc) {
              let format = api_msc[i].split("|");
              if(format[1] && format[1].split(":")) {
                obj[format[0]] = {
                  home: format[1].split(":")[0],// 获取主队比分
                  away: format[1].split(":")[1],// 获取客队比分
                };
              }
            }
          }
          val.msc = obj
      },
    },
    destroyed() {
      // 离开页面，清除内存
      for (const key in this.$data) {
        this.$data[key] = null
      }
    }
  }
</script>
<style lang="scss" scoped>
.search {
  max-width: 768px;
  margin: auto;
  //height: 5.37rem;
  height: 4.37rem;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

