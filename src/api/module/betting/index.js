/*
 * @Author: sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 押注API接口定义
 */
import {http} from "src/core/http/index.js";
const { API_PREFIX = {}} = window.BUILDIN_CONFIG;
const { API_PREFIX_JOB:prefix,API_PREFIX_USER:prefix2,API_PREFIX_BAT:prefix3 } = API_PREFIX;

// 获取押注列表最新数据（valar）
/* export const post_verify_odds_before = (params, config={}, url = "/v1/betOrder/verifyOddsBeforeBet") => http.post(`${prefix}${url}`, params, config); */

// 押注项提交接口
export const post_submit_Bet_list = (params, config={}, url = "/v1/betOrder/betPB") => http.post(`${prefix}${url}`, params, config);

// 订单记录页面接口
export const post_getOrderList = (params, config={}, url = "/order/betRecord/getOrderList") => http.post(`${prefix2}${url}`, params, config);
//H5订单记录页面接口
export const post_getH5OrderList = (params, config={}, url = "/order/betRecord/getH5OrderList") => http.post(`${prefix2}${url}`, params, config)

// 获取赛事是否存在赛果接口
export const get_exist_match_result = (params, config={}, url = "/order/betRecord/existMatchResult") =>  http.get(`${prefix}${url}`, params, config);

// 获取未结算注单统计
export const get_unsettle_tickets_count = (params, config={}, url = "/order/betRecord/countUnsettleTickets") =>  http.get(`${prefix}${url}`, params, config);

// 获取最大值和最小值接口
export const post_getBetMinAndMaxMoney = (params, config={}, url = "/v1/betOrder/queryMarketMaxMinBetMoney") => http.post(`${prefix}${url}`, params, config);

// 投注模块-统计串关数
export const get_seriesCountJointNumbe = (params, config={}, url = "/v1/betOrder/countJointNumber") => http.get(`${prefix}${url}`, params, config);

//详情页面注单数量接口
/* export const post_queryCountOrderDetail = (params, config={}, url = "/betOrder/queryCountOrderDetail") => http.post(`${prefix}${url}`, params, config); */
// //查询串关规则列表接口
export const fetch_mix_bet_rules = (params, config={}, url = "/v1/betOrder/querySeriesRuleList") => http.get(`${prefix}${url}`, params, config);
//获取订单状态和最新赔率最高可盈
export const query_order_status = (params, config={}, url = "/v1/betOrder/queryOrderStatus") => http.get(`${prefix}${url}`, params, config);
// 查询最新的盘口数据 /v1/betOrder/queryLatestMarketInfo
export const query_last_market_info = (params, config={}, url = "/v1/betOrder/queryLatestMarketInfoPB") => http.post(`${prefix}${url}`, params, config);
//获取额度接口合并
export const query_bet_amount = (params, config={}, url = "/v1/betOrder/queryBetAmountPB") => http.post(`${prefix}${url}`, params, config);

//获取预约额度接口合并
export const query_pre_bet_amount = (params, config={}, url = "/v1/betOrder/queryPreBetAmountPB") => http.post(`${prefix}${url}`, params, config);


// 用户偏好设置
export const record_user_preference = (params, config={}, url = "/v1/betOrder/recordUserPreference") => http.post(`${prefix}${url}`, params, config);

// 虚拟赛事投注模块-投注项最大最小金额
/* export const virtual_query_max_min_money = (params, config={}, url = "/v1/betOrder/virtualQueryMarketMaxMinBetMoney") => http.post(`${prefix}${url}`, params, config); */

// 虚拟体育投注接口
/* export const post_submit_virtual_bet_list = (params, config={}, url = "/v1/betOrder/virtualBet") => http.post(`${prefix}${url}`, params, config); */

//投注记录（ 新  带提前结算相关字段）
export const post_order_list = (params, config={}, url = "/order/betRecord/getOrderListPB") => http.post(`${prefix2}${url}`, params, config);
//提前结算
export const post_pre_bet_order = (params, config={}, url = "/v1/betOrder/orderPreSettle") => http.post(`${prefix}${url}`, params, config);
//预投住注单记录
export const post_book_list = (params, config={}, url = "/order/betRecord/getPreBetOrderlist") => http.post(`${prefix}${url}`, params, config);
// 5秒预约投注拉单
export const get_book_status_record = (params, config={}, url = "/order/betRecord/getPreOrderStatus") => http.post(`${prefix}${url}`, params, config);
//预约投注拉单,预约注单状态
export const get_book_status_list = (params, config={}, url = "/order/betRecord/getH5PreBetOrderlist") => http.post(`${prefix}${url}`, params, config);
//预投投注取消
export const cancel_book_order = (params, config={}, url = "/v1/betOrder/cancelPreBetOrder") => http.get(`${prefix}${url}`, params, config);
//查询提前结算详情
/* export const get_pre_bet_order_info = (params, config={}, url = "/v1/betOrder/orderPreSettleList") => http.get(`${prefix}${url}`, params, config); */

// 查询提前结算订单记录
export const get_pre_settle_order_detail = (params, config={}, url = "/order/betRecord/getPreSettleOrderDetail") => http.get(`${prefix}${url}`, params, config);

// 提前结算实时查询最高返还批量,每5秒请求一次
export const get_cashout_max_amount_list = (params, config={}, url = "/order/betRecord/getCashoutMaxAmountList") => http.get(`${prefix}${url}`, params, config);

// 查询提前结算单状态 该接口当发起请求之后310s之内没有收到推送状态还在转圈时，请求一次
/* export const query_pre_settle_order_status = (params, config={}, url = "/v1/betOrder/queryPreSettleOrderStatus") => http.get(`${prefix}${url}`, params, config); */
// 查询待确认中的提前结算单
export const query_order_pre_settle_confirm = (params, config={}, url = "/v1/betOrder/queryOrderPreSettleConfirm") => http.get(`${prefix}${url}`, params, config);



 
 
//查询串关规则列表接口
export const get_rules = (params, config, url = "/v1/betOrder/querySeriesRuleList") => http.get(`${prefix}${url}`, params, config)
// 获取最大值和最小值接口
export const post_maxminmoney = (params, config, url = "/v1/betOrder/queryMarketMaxMinBetMoney") => http.post(`${prefix}${url}`, params, config)
// 押注项提交
export const post_submitbetlist = (params, config, url = "/v1/betOrder/betPB") => http.post(`${prefix}${url}`, params, config)
// 投注前注单信息校验
export const post_verify_odds_before = (params, config, url = "/v1/betOrder/queryLatestMarketInfoPB") => http.post(`${prefix}${url}`, params, config)
// 轮询获取订单状态和最新赔率最高可盈（joken）
export const get_orderstatus = (params, config, url = "/v1/betOrder/queryOrderStatus") => http.get(`${prefix}${url}`, params, config)
 
// 查询提前结算订单记录(valar)
export const getPreSettleOrderDetail = (params, config, url = "/order/betRecord/getPreSettleOrderDetail") => http.get(`${prefix}${url}`, params, config)
// 提交提前结算接口（joken）
export const orderPreSettle = (params, config, url = "/v1/betOrder/orderPreSettle") => http.post(`${prefix}${url}`, params, config)
// 查询待确认中的提前结算单（joken）
export const queryOrderPreSettleConfirm = (params, config, url = "/v1/betOrder/queryOrderPreSettleConfirm") => http.get(`${prefix}${url}`, params, config)
// 获取额度接口合并（joken）
export const queryBetAmount = (params, config, url = "/v1/betOrder/queryBetAmountPB") => http.post(`${prefix}${url}`, params, config)
//获取预约限额接口（david）
export const queryPreBetAmount = (params, config, url = "/v1/betOrder/queryPreBetAmountPB") => http.post(`${prefix}${url}`, params, config)
// 获取提前结算金额（valar）
export const oderPreSettleMoney = (params, config, url = "/order/betRecord/getCashoutMaxAmountList") => http.get(`${prefix}${url}`, params, config)
// 获取预约投注列表（david）
export const get_preOrderList = (params, config, url = "/order/betRecord/getPreBetOrderlist") => http.post(`${prefix}${url}`, params, config)
// 获取预约投注列表2（david）
export const get_preOrderList_news = (params, config, url = "/order/betRecord/getH5PreBetOrderlist") => http.post(`${prefix3}${url}`, params, config)
// 取消预约投注单（david）
export const cancle_pre_order = (params, config, url = "/v1/betOrder/cancelPreBetOrder") => http.get(`${prefix}${url}`, params, config)

export const get_pre_status = (params, config, url = "/order/betRecord/getPreOrderStatus") => http.post(`${prefix}${url}`, params, config)
