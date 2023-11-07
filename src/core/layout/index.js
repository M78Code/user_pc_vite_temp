import { ref } from "vue";
import { project_name } from 'src/core'
import PageSourceData from "src/core/page-source/page-source.js";
const { page_source } = PageSourceData;
// 浏览器高度
let client_height = Math.max(
  document.body.clientHeight,
  document.documentElement.clientHeight
);
// 浏览器宽度
let client_width = Math.max(
  document.body.clientWidth,
  document.documentElement.clientWidth
);

//这里是不同版本的 布局配置
const different_version_config = {
  'yazhou-pc': {
    left_width: 234,
    right_width: 441,
  },
  'ouzhou-pc': {
    left_width: 240,
    right_width: 400,
  },
}

class LayOutMain {
  /**
   * @Description 构造函数
   * @param {undefined} undefined
   */
  constructor() {
      // 是否内嵌
    this.is_iframe = window.frames.length != parent.frames.length
    // 主内容最小宽度出现滚动条
    this.layout_min_width = 1440
    // 左侧菜单宽度
    this.layout_left_width = 0
    // 左侧菜单宽度 mini
    // this.layout_left_width_mini = 64
    // 右侧区域宽度
    this.layout_right_width = 0
    // 头部高度
    this.layout_top_height = 96
    // 头部导航高度
    this.layout_nav_height = 60
    //公告高度
    this.layout_notice_height = 36
    //是否展示右侧
    this.layout_right_status = true
    //左侧列表显示形式 normal：展开 mini：收起  mini-normal手动展开
    this.layout_left_menu_status = 'normal'
    // 页面中间内容高度
    this.layout_content_height = 0
    // 页面中间内容宽度
    this.layout_content_width = 1440
    // 布局更新
    this.layout_version = ref(0)
    /** 主内容宽度 */
    this.layout_main_width = 1440
    /** 搜索框宽度 */
    this.layout_search_width = 0
    // 当前页面 home：赛事列表  details：详情
    this.layout_current_path = { cur: "", from: "" }
    // 左侧菜单显示 menu bet history
    this.layout_left_show = 'menu'
    // 左侧菜单顶部距离 内嵌为 0 
    this.layout_left_top = '80px'
    //老项目废弃的字段  zoom
    this.zoom = true
     // 当前展开区块  match-list:赛事列表 match-detail:赛事详情
    this.cur_expand_layout = "match-list"
    //是否展开多列玩法
    this.is_unfold_multi_column = false; 
  }

  // 初始化
  init(){
    this.set_layout_left_config()
    this.set_layout_right_config()
    this.set_layout_content_config()
    this.set_layout_left_menu_status()
    this.set_layout_main_width()
    this.set_layout_search_width()
  }

  // 设置 中间内容区域 宽度 高度
  set_layout_content_config(){
    this.layout_content_height = client_height - this.layout_nav_height - this.layout_notice_height
    this.layout_content_width = client_width - this.layout_left_width - this.layout_right_width
    this.set_layout_version()
  }
 
  // 设置 左侧列表显示形式
  set_layout_left_menu_status(){
     //小于最小宽度
    if (client_width <= this.layout_min_width) {
      //"mini-normal" 自己展开的 不做操作
      if ("normal" == this.layout_left_menu_status) {
        this.layout_left_menu_status = "mini";
      }
    } else {
      if ("mini" == this.layout_left_menu_status) {
        //通知菜单变展开normal
        this.layout_left_menu_status = "normal";
      }
    }
    // 设置 左侧菜单宽度
    this.layout_left_width = (this.layout_left_menu_status == 'mini' ?  64 : 234 ) + 'px'
    this.set_layout_version()
  }

  // 设置页面布局更新
  set_layout_version(){
    this.layout_version.value = Date.now()
  }

  /** 设置主内容宽度 */
  set_layout_main_width() {
    // 浏览器宽度
    const inner_width = window.innerWidth
    this.layout_main_width = Math.max(inner_width, this.layout_min_width)
  }

  /** 计算搜索框宽度 */
  set_layout_search_width() {
    this.layout_search_width = parseInt(this.layout_main_width * 0.3)
    if(this.is_iframe) {
      this.layout_search_width = 390
    }
  }
  /** 设置当前路由页面 */
  set_layout_current_path(route) {
    this.layout_current_path = route
    this.set_layout_version()
  }

  // 设置左侧显示内容
  set_layout_left_show(val){
    this.layout_left_show = val
    this.set_layout_version()
  }
  // 左侧菜单顶部距离 内嵌为 0 
  set_layout_left_top(val){
    if(this.is_iframe){
      this.layout_left_top = 0
    }else{
      this.layout_left_top = val
    }
    this.set_layout_version()
  }
  /**
 * @description: 设置是否展开多列玩法
 * @param {boolean} val 
 * @return {*}
 */
  set_unfold_multi_column(val){
    this.is_unfold_multi_column = val
    if(!val){
    this.layout_right_width = 441
    this.layout_content_width -= 441
    }else{
    this.layout_right_width = 0
    this.layout_content_width += 441
    }
    this.set_layout_version()
  }
  get_is_unfold_multi_column() {
    return this.is_unfold_multi_column
  }
  /**
   * @description 设置左侧配置
   */
  set_layout_left_config() {
    this.layout_left_width = different_version_config[project_name].left_width
  }
  /**
   * @description 设置右侧配置
   */
  set_layout_right_config() {
    this.layout_right_width = different_version_config[project_name].right_width
    // 如果是主页的话 是没有右侧详情的
    if (page_source == 'ouzhou-home') {
      this.layout_right_width = 0
    }
  }
}

export default new LayOutMain();