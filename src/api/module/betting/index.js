/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-06-30 11:28:37
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-09 15:46:47
 * @FilePath       : \user-pc-vue3\src\api\module\betting\index.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: cooper
 * @Date: 2023-06-27 17:13:55
 * @Description: 押注API接口定义
 */
import axios from "src/api/common/axios.wapper.js";


//投注记录（ 新  带提前结算相关字段）
export const post_order_list = (params, config={}, url = "/yewu12/order/betRecord/getOrderList") => axios.post(url, params);

//获取额度接口合并
export const query_bet_amount = (params, config={}, url = "/yewu13/v1/betOrder/queryBetAmount") =>axios.post(url, params);


// 押注项提交接口
export const post_submit_Bet_list = (params, config={}, url = "/yewu13/v1/betOrder/bet") =>axios.post(url, params);