/*
 * @Author: Amor
 * @Date: 2020-09-09 12:29
 * @Description: 列表顶部菜单逻辑
 */
import { mapGetters,mapActions } from "vuex";
import sportIcon from "src/public/components/sport_icon/sport_icon.vue";
import Tab from "src/public/components/tab/tab.vue"
import dragScroll from "src/public/components/cus_scroll/drag_scroll.vue"

const list_filter = {

  name: "MatchListFilter",

  components: {
    sportIcon,
    Tab,
    dragScroll
  },
  inject:['match_list_data'],
  props: {
    // 数据请求状态
    load_data_state: String,
    // 收藏数量
    collect_count: Number,
  },

  data() {
    return {
      // 菜单数据
      menu_data: $menu.menu_data,
      // 菜单对象
      menu_obj: $menu.menu_obj,
      currentIndex: 0,
      timeout_obj:{} //定时器集合
    };
  },
  created () {
    // 显示部分dom ID
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
  },
  computed: {
    ...mapGetters({
      vx_cur_menu_type: "get_cur_menu_type", //选中菜单类型
       //获取当前主题
       get_theme: "get_theme",
       //全局开关
       get_global_switch:'get_global_switch'
    }),

  },

  destroyed() {
    /**清除定时器 */
    for (const key in this.timeout_obj) {
      clearTimeout(this.timeout_obj[key]);
    }
    //引用数据销毁
    this.timeout_obj = {};
  },
  methods: {
    ...mapActions({
      //设置选择的筛选数据
      vx_set_filter_select_obj: "set_filter_select_obj",
    }),
    get_menu_text(menu = {},type) {
      if(type ==1){
        return  !menu.field1 ? this.$root.$t('common.highlights') :menu.menuName
      }else{
        return  !menu.field1 ? this.$root.$t('common.all') :menu.menuName
      }
      
    },
    tab_click(obj) {
      if (this.load_data_state == 'loading') {
        return;
      }
      $menu.menu_change(4,obj.index)
    },
    /**
     * @Description:球种菜单切换
     * @param {object} menuId 菜单id
     * @return {undefined} undefined
     */
    on_sport_selected(menuId) {
      if(this.$refs.drag_scroll && this.$refs.drag_scroll.is_move()){
        return
      }
      if (this.load_data_state == 'loading') {
        return;
      }
      $menu.menu_change(2,menuId)
      //菜单切换是筛选数据置空
      this.vx_set_filter_select_obj([]);
    },
    /**
     * @Description:点击收藏
     * @return {undefined} undefined
     */
    collect_click(){
      if(!this.collect_count) return
      this.vx_set_layout_list_type('collect')
    },

  },
};

export default list_filter