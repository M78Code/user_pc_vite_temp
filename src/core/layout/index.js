import { ref } from "vue";
import { useRoute } from "vue-router";
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

class LayOutMain {
  /**
   * @Description 构造函数
   * @param {undefined} undefined
   */
  constructor() {
      // 是否内嵌
    this.is_iframe = window.frames.length != parent.frames.length,
    // 主内容最小宽度出现滚动条
    this.layout_min_width = 1440
    // 左侧菜单宽度
    this.layout_left_width = 234
    // 左侧菜单宽度mini
    // this.layout_left_width_mini = 64
    // 右侧区域宽度
    this.layout_right_width = 441
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
    // 来源 当前路由
    this.layout_current_path = ''
    // 左侧菜单显示 menu bet history
    this.layout_left_show = 'menu'
  }

  // 初始化
  init(){
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
  set_layout_current_path() {
    const route = useRoute();
    this.layout_current_path = route.name
    this.set_layout_version()
  }

  // 设置左侧显示内容
  set_layout_left_show(val){
    this.layout_left_show = val
    this.set_layout_version()
  }

}

export default new LayOutMain();