/*
 * @Author: Sword
 * @Date: 2020-08-04 17:14:24
 * @Description: 需要引入的所有的vuex对象文件
 */
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      // 单关部分 是否为串关
      vx_is_bet_single: 'is_bet_single',
      // 单关投注对象
      vx_get_bet_single_obj: 'get_bet_single_obj',
      // 单关投注列表
      vx_get_bet_single_list: 'get_bet_single_list',
      // 单关是否正在处理中
      vx_get_is_single_handle: 'get_is_single_handle',
      // 串关部分 串关列表
      vx_get_bet_list: 'get_bet_list',
      // 串关投注对象
      vx_get_bet_obj: 'get_bet_obj',
      // 串关输入列表对象
      vx_get_bet_s_list: 'get_bet_s_list',
      vx_get_bet_s_obj: 'get_bet_s_obj',
      // 串关是否正在处理中
      vx_get_is_handle: "get_is_handle",

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
      // 投注模式
      vx_get_bet_mode: "get_bet_mode",
      // 投注项锁获取
      vx_get_bet_item_lock: "get_bet_item_lock",
      // 左侧菜单切换
      vx_get_left_menu_toggle: 'get_left_menu_toggle',
      // 获取是否合并的标致
      vx_get_is_bet_merge: "get_is_bet_merge",
      // 获取用户token
      vx_get_user_token: "get_user_token",
      vx_main_menu_toggle: "get_main_menu_toggle",
      // 最小串关数
      vx_get_mix_min_count: "get_mix_min_count",
      // 最大串关数
      vx_get_mix_max_count: "get_mix_max_count",
      // 获取预约投注项
      vx_get_bet_appoint_obj: "get_bet_appoint_obj"
    })
  },
  methods: {
    ...mapActions({
      // 设置投注模式 (单关/串关)
      vx_set_is_bet_single: 'set_is_bet_single',
      // 设置单关列表
      vx_set_bet_single_list: 'set_bet_single_list',
      // 移除单关列表
      vx_bet_single_list_remove: 'bet_single_list_remove',
       // 单关部分 清除单关对象
      vx_bet_single_clear: 'bet_single_clear',
      // 设置单关投注对象的某个或者某些属性值
      vx_bet_single_obj_attr: 'bet_single_obj_attr',
      // 添加单关列表数据
      vx_bet_single_list_push: 'bet_single_list_push',
      // 设置移除单关投注对象的某个或者某些属性值
      vx_bet_single_obj_remove_attr: 'bet_single_obj_remove_attr',
      // 设置单关是否正在投注处理中
      vx_set_is_single_handle: 'set_is_single_handle',

      // 设置串关列表
      vx_set_bet_list: 'set_bet_list',
      // 移除串关列表
      vx_bet_list_remove: 'bet_list_remove',
      // 添加串关列表数据
      vx_bet_list_push: 'bet_list_push',
      // 设置串关对象的某个或者某些属性的值
      vx_bet_obj_add_attr: 'bet_obj_add_attr',
      // 设置串关对象的某个或者某些属性的值
      vx_bet_obj_remove_attr: 'bet_obj_remove_attr',
      // 设置串关输入对象
      vx_bet_s_obj: 'bet_s_obj',
      // 设置输入对象的一个对象
      vx_bet_s_obj_add_attr: 'bet_s_obj_add_attr',
      // 设置串关是否正在处理
      vx_set_is_handle: 'set_is_handle',

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
      vx_set_error_data: 'set_error_data',
      // 投注模式设置
      vx_set_bet_mode: "set_bet_mode",
      // 投注项是否锁住设置
      vx_set_bet_item_lock: 'set_bet_item_lock',
      // 设置账户金额
      vx_set_user_balance: "set_user_balance",
      // 设置用户信息
      vx_set_user: "set_user",
      vx_set_is_bet_merge: "set_is_bet_merge",
      // 设置最小串关数
      vx_set_mix_min_count: "set_mix_min_count",
      // 设置最大串关数
      vx_set_mix_max_count: "set_mix_max_count",
      // 设置预约投注项
      vx_set_bet_appoint_obj: "set_bet_appoint_obj"
    })
  }
}