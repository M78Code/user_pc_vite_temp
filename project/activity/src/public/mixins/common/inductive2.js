/*
 * @Author: Sword
 * @Date: 2020-08-04 17:14:24
 * @Description: 需要引入的所有的vuex对象文件(虚拟投注使用)
 */
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      // 是否为虚拟体育投注
      vx_get_is_virtual_bet: "get_is_virtual_bet",
      // 虚拟投注列表
      vx_get_virtual_bet_list: "get_virtual_bet_list",
      // 虚拟投注列表对象
      vx_get_virtual_bet_obj: "get_virtual_bet_obj",
      // 虚拟投注是否正在进行
      vx_get_is_virtual_handle: "get_is_virtual_handle",
      // 获取虚拟投注列表输入部分列表
      vx_get_virtual_bet_s_list: "get_virtual_bet_s_list",
      // 获取虚拟体育投注输入部分对象
      vx_get_virtual_bet_s_obj: "get_virtual_bet_s_obj",

      // 公共部分
      // 当前盘口类型
      vx_get_cur_odd: "get_cur_odd",
      // 投注底部菜单对象
      vx_get_menu_obj: "get_menu_obj",
      // 个人喜好的类型
      vx_cur_menu_type: 'get_cur_menu_type',
      // 用户信息
      vx_get_user: "get_user",
      // 用户的uuid
      vx_get_uuid: "get_uuid",
      // 用户登录信息
      vx_get_uid: "get_uid",
      // 赔率映射表
      vx_odds_coversion_map: 'get_odds_coversion_map',
      // 左侧菜单切换
      vx_get_left_menu_toggle: 'get_left_menu_toggle',
      // 电竞单关串关模式
      vx_cur_esports_mode: "get_cur_esports_mode",
      // 获取投注类别
      vx_get_bet_category: "get_bet_category"
    })
  },
  methods: {
    ...mapActions({     
      // 虚拟体育投注部分
      // 设置虚拟投注是否正在进行
      vx_set_is_virtual_bet: "set_is_virtual_bet",
      // 投注模式
      vx_set_virtual_bet_mode: "set_virtual_bet_mode",
      vx_set_is_virtual_handle: "set_is_virtual_handle",
      // 设置虚拟投注列表
      vx_set_virtual_bet_list: "set_virtual_bet_list",
      // 删除虚拟投注列表
      vx_virtual_bet_list_del: "virtual_bet_list_del",
      // 添加虚拟投注对象
      vx_virtual_bet_obj_add: "virtual_bet_obj_add",
      // 删除虚拟投注对象
      vx_virtual_bet_obj_del: "virtual_bet_obj_del",
      // 设置虚拟投注列表
      vx_virtual_bet_list_push: "virtual_bet_list_push",
      // 添加虚拟体育投注输入对象
      vx_virtual_bet_s_obj_add: "virtual_bet_s_obj_add",

      vx_virtual_bet_clear: "virtual_bet_clear",

      //其他公共
      // 设置左侧布局是否显示
      vx_set_layout_left_show: "set_layout_left_show",
      // 设置是否显示投注记录
      vx_set_show_record: "set_show_record",
      // 将http拉取到的请求数据设置到vuex中
      vx_http_upd_data: 'http_upd_data',
      // 设置布局列表的类型
      vx_set_layout_list_type: "set_layout_list_type",
      // 设置当前选中的菜单类型
      vx_set_cur_menu_type: "set_cur_menu_type",
      // 设置赛事详情的请求参数
      vx_set_match_details_params: "set_match_details_params",
      // 设置删除的条件
      vx_set_remove_filter_condition: "set_remove_filter_condition",
      // 弹出框设置
      vx_set_show_filter_popup: "set_show_filter_popup",
      // 错误消息设置
      vx_set_error_data: 'set_error_data'
    })
  }
}