<!--
 * @Author: Supermark
 * @Date: 2020-11-14 14:18:34
 * @Description: 筛选+搜索
-->
<template>
  <div class="select-dia" :style="bounced_high">
    <div style="height:.5rem">
      <div class="select-box">
        <div class="row items-center justify-center composite">
          <div class="filter-trn"
               v-for="(item_name,index) in search_tab"
               :key="index"
               @click="change_record(index)"
               v-show="index == 0 || index != 0 && get_menu_type != 100"
               :class="get_search_for_choose == index ? 't_color':''"
               :style="{visibility:`${is_search_hide(index)?'hidden':'visible'}`}"
          >
            {{item_name}}
          </div>
        </div>
      </div>
    </div>
    <template v-if="change_show && _.get(get_access_config,'filterSwitch')">
      <filter_old v-if="_.get(get_current_menu,'main.menuType')==1 && get_sport_all_selected"/>
      <filter_new v-else/>
    </template>
    <search v-if="!change_show && _.get(get_access_config,'searchSwitch')"></search>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import filter_i from 'src/project/pages/match_filter/index.vue'
import filter_i_old from 'src/project/pages/match_filter/index_old.vue'
import search_ from 'src/project/pages/search/search_.vue'

export default {
  name: 'select_dia',
  data(){
    return {
      change_show: true,
      //筛选和搜索
      search_tab: [this.$root.$t('footer_menu.filter'), this.$root.$t('search.search_title')],
    }
  },
  props: ['detail_data'],
  components:{
    filter_new:filter_i,
    filter_old:filter_i_old,
    search: search_
  },
  created(){
    // 默认选中筛选
    this.change_record(this.get_search_for_choose)
    // 如果是冠军，则默认展示筛选
    if(this.get_current_menu && this.get_current_menu.main && this.get_current_menu.main.menuType == 100) {
      this.change_record(0)
    }
    // 如果是赛果虚拟体育赛事，则显示 筛选
    if(this.results_of_the_virtual_display){
      this.search_tab = [this.$root.$t('search.search_title')]
      this.change_show = false
    }
    // 筛选
    if(!_.get(this.get_access_config,'filterSwitch')) {
      this.search_tab = [this.$root.$t('search.search_title')]
      this.change_show = false
    }
    // 搜索
    if(!_.get(this.get_access_config,'searchSwitch')) {
      this.search_tab = [this.$root.$t('footer_menu.filter')]
      this.change_show = true
    }
  },
  computed: {
    ...mapGetters([
      'get_search_for_choose', 'get_search_term', 
      'get_curr_sub_menu_type', 'get_access_config',
      'get_menu_type',
      'get_current_menu',
      'get_sport_all_selected',
    ]),
    // 弹框的高度
    bounced_high() {
      let rem_1 = window.innerWidth * 100 / 375;
      return {height : window.innerHeight - rem_1 + 50 + 'px !important'}
    },
    // 是赛果虚拟体育赛事
    results_of_the_virtual_display() {
      return ([1001,1002,1004,1010,1011,1009].includes(this.get_curr_sub_menu_type) && this.get_menu_type == 28)
    }
  },
  watch: {
    // 监听 get_curr_sub_menu_type，如果 是在赛果下边的 虚拟赛事，就默认是 筛选弹出
    'get_curr_sub_menu_type':{
      handler(n, o){
        if([1001,1002,1004,1010,1011,1009].includes(+n) && this.get_menu_type == 28){
          this.change_record(0)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(["set_search_for_choose", "set_search_term"]),
    change_record(key) {
      // 搜索返回时，保持搜索原来的页面
      key == 0 && this.get_search_term && this.set_search_term('')
      this.set_search_for_choose(key);
      if(key === 1) {// 赛事搜索页
        this.change_show = false
      } else {
        this.change_show = true
      }
    },
    is_search_hide(i){
      let f = false;
      if(i == 1){
        if([1001,1002,1011,1004,1010,1009].includes(this.get_curr_sub_menu_type)){
          f = true;
        }
      }
      return f;
    }
  },
  // 组件销毁时默认选中筛选按钮
  // destroyed(){
  //   this.set_search_for_choose(0);
  // }
}

</script>

<style lang="scss" scoped>
.select-dia {
  width: 100%;
  max-width: unset !important;
  /*  兼容性问题,高度的调整影响到安卓手机的软键盘弹出 */
  max-height: calc(var(--vh, 1vh) * 100 - 80px) !important;
  border-radius: 0.16rem 0.16rem 0 0;
  position: absolute;
  bottom: 0;

  .select-box {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 999;
    border-radius: 0.16rem 0.16rem 0 0;

    .composite {
      width: 60%;
      height: 0.5rem;
      margin: 0 auto;

      .filter-trn {
        margin-right: 0.2rem;
        font-size: 0.16rem;
        font-weight: 300;

        &:last-child {
          margin-right: 0;
        }

        &.t_color {
          position: relative;
          letter-spacing: 0;
          font-weight: bold;

          &:after {
            content: '';
            display: block;
            position: absolute;
            width: 0.18rem;
            height: 0.03rem;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 0.65rem;
          }
        }
      }
    }
  }
}
</style>
