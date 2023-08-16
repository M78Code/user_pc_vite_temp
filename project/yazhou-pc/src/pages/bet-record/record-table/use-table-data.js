import { api_betting } from "src/api/index";
import { uid } from "quasar";
import {
  reactive,
  toRefs,
  onBeforeMount,
  watch,
  nextTick,
  getCurrentInstance,
} from "vue";
import { get_refs_info } from "src/core/common-helper/common.js";
import { order_pre_settle_confirm } from "src/core/bet/betting-pc.js";
import mathjs from "src/core/utils/mathjs.js";
import lodash from "lodash";
import store from "src/store-redux/index.js";
import { ITEM_STATUS, CANCEL_TYPE, ITEM_CLASS, ORDER_STATUS } from "./config";
export const useTableData = ({ props, emit }) => {
  const store_state = store.getState();
  // 用户信息
  const vx_get_user = store_state.userReducer.user_info;

  const state = reactive({
    toolIndex: 0,
    recordData: {},
    toolWords: [],
    current: 1,
    toPage: 1,
    selectOptions: [
      {
        label: "10",
        value: 10,
      },
      {
        label: "20",
        value: 20,
      },
      {
        label: "50",
        value: 50,
      },
    ],
    toast: false,
    color_list: [],
    isShow: true,
    timeout_toast: null, // 定时器
    early_settlement_data: [], // 用于提前结算的数据

    // more_wrap_data: {},//更多弹框数据
    // show_bet_order: {}, //是否查看提前结算
    pre_order_list_obj: {}, //查看提前结算详情
    cur_bet_pre: {},
    moreStyle: {
      left: 0,
      top: 0,
    },
    money_obj: {},
    setup_single_info: {},
    timer_obj: {},
    is_cancel: false, // 是否被拒单过（ws）
    show_score_info: false, //比分提示默认隐藏
  });

  //   ====================watch======================================

  watch(
    () => props.order_list,


    (val) => {
      let scroll_area = this.yabo_common.get_refs_info(
        "scrollArea",
        null,
        getCurrentInstance
      );
      if (scroll_area && scroll_area.setScrollPosition) {
        scroll_area.setScrollPosition(0);
      }
      state.recordData = val;
      init_data();
    },
    { immediate: true }
  );

  watch(
    () => props.orderNo_data_list,
    (val) => {
      if (val && val.length > 0) {
        // 提前结算实时查询 更新数据
        get_max_cashout();
      }
    }
  );

  //   ====================methods======================================
  /**
   * @description:盘口类型
   * @param {sting} type: records.marketType字段
   * @param {sting} langCode: 多语言 默认是中文
   * @return{string} 盘口类型
   */
  const marketType = (type, langCode = "zh") => {
    var res = "";
    const obj = {
      EU: this.$root.$t(`common_lang.${langCode}.odds.EU`), //"欧洲盘";
      HK: this.$root.$t(`common_lang.${langCode}.odds.HK`), //"欧洲盘";
      US: this.$root.$t(`common_lang.${langCode}.odds.US`), //"欧洲盘";
      ID: this.$root.$t(`common_lang.${langCode}.odds.ID`), //"欧洲盘";
      MY: this.$root.$t(`common_lang.${langCode}.odds.MY`), //"欧洲盘";
      GB: this.$root.$t(`common_lang.${langCode}.odds.GB`), //"欧洲盘";
    };
    if (type && langCode) {
      res = obj[type];
    }
    return res;
  };

  /**
   * @description:输赢状态
   * @param {srting} type: records.orderVOS.betResult
   * @return{string} 盘口类型
   */
  const item_status = (type) => {
    return ITEM_STATUS[type];
  };

  /**
   * @description: 取消原因
   * @param {srting} cancelType: 取消类型
   * @return {string}
   */
  const item_cancelType = (cancelType) => {
    if ([1, 2, 3, 4, 5, 6, 17, 20].includes(parseInt(cancelType))) {
      return CANCEL_TYPE[parseInt(cancelType)];
    } else {
      return this.$root.$t("bet.invalid"); //注单无效
    }
  };

  /**
   * @输赢状态calss
   * @param betResult: records.orderVOS.betResult
   */
  const item_class = (betResult) => {
    if (
      [2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 15, 16, 20].includes(
        parseInt(betResult)
      )
    ) {
      return ITEM_CLASS[parseInt(betResult)];
    } else {
      return ""; //注单无效
    }
  };

  /**
   * @订单状态
   * @param orderStatus: records.orderStatus
   */
  const order_status = (orderStatus) => {
    return ORDER_STATUS[parseInt(orderStatus)];
  };

  /**
   * @订单状态class
   * @param orderStatus: records.orderStatus
   */
  const status_class = (orderStatus) => {
    let str = "";
    if ([2, 4].includes(parseInt(orderStatus))) {
      str = "lose-color"; //"注单无效";
    } else {
      str = ""; //"投注成功";
    }
    return str;
  };

  /**
   * @下注赛事阶段
   * @param type: records.matchType
   */
  const matchType = (type, langCode = this.$i18n.locale) => {
    let res = "";
    if (type && langCode) {
      switch (parseInt(type)) {
        case 1:
          res = this.$root.$t(`common_lang.${langCode}.bet.morning_session`); //"早盘赛事";
          break;
        case 2:
          res = this.$root.$t(`common_lang.${langCode}.bet.bowls`); //"滚球盘赛事";
          break;
        case 3:
          res = this.$root.$t(`common_lang.${langCode}.bet.champion_handicap`); //"冠军盘赛事";
          break;
      }
    }
    return res;
  };

  /**
   * @翻页
   * @param data: 分页组件传值
   * size：每页条数
   * page：当前页码
   */
  const changePage = (data) => {
    emit("choosePage", data);
  };

  /**
   * @点击复制单号
   * @param data：单号
   */
  const copy = (data) => {
    let oInput = document.createElement("input");
    oInput.value = data;
    document.body.appendChild(oInput);
    oInput.select();
    state.toast = true;
    clearTimeout(this.timeout_toast);
    state.timeout_toast = setTimeout(() => {
      state.toast = false;
    }, 1500);
    document.execCommand("Copy");
    oInput.remove();
  };
  /**
   * @description: 展开调整结算金额滑动
   */
  const show_bet_pre = (data, index) => {
    // 如果当前是展开的则进行折叠设置
    if (lodash.get(state.cur_bet_pre, `${index}.show_operate`)) {
      state.cur_bet_pre[`${index}.show_operate`] = "";
      return false;
    }
    state.early_settlement_data[index].amount = 0;
    // 金额改变设置为true
    state.early_settlement_data[index].changeMoney = true;

    // 设置结算按钮
    state.cur_bet_pre[`${index}.show_operate`] = "bet_pre";

    // 当金额存在时无需重新设置值
    if (lodash.get(state.money_obj, `${index}.money`)) {
      nextTick(() => {
        let frontSettleAmount = lodash.get(
          state.early_settlement_data[index],
          "frontSettleAmount"
        );
        let slider = get_refs_info(
          `vue-slider-${index}`,
          null,
          getCurrentInstance
        );
        if (lodash.isArray(slider)) {
          // 滑块当前的所在节点
          let slider_index = slider[0].getIndex();
          // 最小结算金额获取
          let money = lodash.get(state.money_obj, `${index}.money`);
          let min_money = lodash.get(state.money_obj, `${index}.min_money`);
          // 最大结算金额获取
          let max_money = lodash.get(state.money_obj, `${index}.max_money`);
          // 如果滑块所在的index值为-1则需要对默认设置重新设置值
          // 根据金额算滑块的当前应该所处的比率
          let rat = (money / max_money) * 100;
          rat = Math.floor(rat); // 对所算的比率向下取整
          // 组件百分比和索引的映射关系
          let obj_index = {
            25: 1,
            50: 2,
            75: 3,
            100: 4,
          };
          let computed_bet_amount;
          if (obj_index[rat]) {
            slider_index = obj_index[rat];
            computed_bet_amount = (frontSettleAmount * rat) / 100;
          } else {
            slider_index = 0;
            computed_bet_amount = frontSettleAmount * (min_money / max_money);
          }
          state.early_settlement_data[index].computed_bet_amount =
            computed_bet_amount;

          // 设置组件默认选中的进度
          slider[0].setIndex(slider_index);
          slider = null;
        }
      });
      return false;
    }
    // 设置当前金额为的投注金额
    state.money_obj[`${index}.money`] = lodash.round(data.setBetAmount);
  };
  /**
   * 提前结算移入样式
   */
  const bet_pre_over = (index) => {
    // 设置提前结算移入样式
    state.early_settlement_data[index].mouseover_info = true;
  };
  /**
   * 提前结算移除样式
   */
  const bet_pre_out = (index) => {
    // 设置提前结算移除样式
    state.early_settlement_data[index].mouseover_info = false;
  };
  /**
   * @description: 滑动投注金额，计算结算金额
   * @param {}
   * @return {}
   */
  const change_slider = (val, index) => {
    // 获取最小结算金额
    let min_money = lodash.get(state.money_obj, `${index}.min_money`, 0);
    // 获取最大结算金额
    let max_money = lodash.get(state.money_obj, `${index}.max_money`, 0);
    // 当前提前结算对象
    let settlment_data = state.early_settlement_data[index];
    let frontSettleAmount = lodash.get(settlment_data, "frontSettleAmount");
    // 根据金额计算结算比率
    let rat = (val / _.get(state.money_obj, `${index}.max_money`)) * 100;
    // 对所算的比率向下取整
    rat = Math.floor(rat);
    nextTick(() => {
      let slider = get_refs_info(
        `vue-slider-${index}`,
        null,
        getCurrentInstance
      );
      if (slider && slider[0] && lodash.isFunction(slider[0].getIndex)) {
        // 获取当前滑块所在的节点
        let slider_index = slider[0].getIndex();
        // 未获取到滑块节点
        if (slider_index == -1) {
          // 组件百分比和索引的映射关系
          let obj_index = {
            25: 1,
            50: 2,
            75: 3,
            100: 4,
          };
          // 滑块的计算节点
          if (obj_index[rat]) {
            slider_index = obj_index[rat];
            settlment_data["computed_bet_amount"] =
              (frontSettleAmount * rat) / 100;
          } else {
            slider_index = 0;
            settlment_data["computed_bet_amount"] =
              frontSettleAmount * (min_money / max_money);
          }
          // 设置组件默认选中的进度
          slider[0].setIndex(slider_index);
        }
        // 存储滑块的选中节点
        state.money_obj[index].slider_index = slider_index;
      }
    });
    // 概率
    let computed_bet_amount = 0;
    if (
      val < min_money &&
      settlment_data.setBetAmount > min_money &&
      val != max_money
    ) {
      state.money_obj[`${index}.money`] = Math.round(min_money);
      computed_bet_amount = frontSettleAmount * (min_money / max_money);
    } else {
      state.money_obj[`${index}.money`] =
        rat === 100 ? max_money : Math.round(val);
      let money_ = lodash.get(state.money_obj, `${index}.money`);
      computed_bet_amount = get_btn_amount(
        rat,
        frontSettleAmount,
        settlment_data,
        money_
      );
    }
    // 设置当前的计算金额
    settlment_data["computed_bet_amount"] = computed_bet_amount;
  };
  /**
   * 按钮显示金额
   */
  const get_btn_amount = (ratio, frontSettleAmount, settlment_data, money_) => {
    if (ratio === 100) {
      return (frontSettleAmount * ratio) / 100;
    } else {
      let maxCashout = lodash.get(settlment_data, "maxCashout");
      let preSettleBetAmount = lodash.get(settlment_data, "preSettleBetAmount");
      let money = (money_ * maxCashout) / preSettleBetAmount;
      return money;
    }
  };
  /**
   * @description: 初次点击提前结算
   * @param {}
   * @return {}
   */
  const start_bet_pre = (index) => {
    // 设置按钮为开始结算按钮
    state.cur_bet_pre[`${index}.show_operate`] = "start_bet_pre";
    // 由于此时按钮处于开始结算状态，确认按钮设置默认状态为false
    state.early_settlement_data[index].bet_confirm = false;
    // 设置结算状态
    state.early_settlement_data[index].bet_status = "start_bet_pre";

    clearTimeout(state.timer_obj[`${index}_pre_timer`]);
    // 清除过滤未结算和是提前结算定时器
    emit("clear_timer_get_cashout");
    // 如果按钮指点过一次，一直处于开始结算状态，5s后恢复为结算按钮初态
    state.timer_obj[`${index}_pre_timer`] = setTimeout(() => {
      // 设置按钮为开始结算按钮
      state.cur_bet_pre[`${index}.show_operate`] = "";
      state.early_settlement_data[index].bet_status = "default";

      // 重置过滤未结算和是提前结算定时器
      emit("res_timer_get_cashout");
    }, 5000);
  };
  /**
   * @description: 确认提前结算
   * @return {}
   */
  const bet_handle = (index, orderNo) => {
    clearTimeout(state.timer_obj[`${index}_pre_timer`]);
    let selttle_data = state.early_settlement_data[index];
    // 如果当前结算状态处于确认中，那么按钮还是保持原状态(放置重复提交)
    if (selttle_data.bet_confirm) return;
    // 记录当前结算的订单号
    state.cur_bet_pre[`${index}.orderNo`] = orderNo;
    // 设置结算状态
    selttle_data["bet_confirm"] = true;
    // 清除过滤未结算和是提前结算定时器
    emit("clear_timer_get_cashout");
    // 结算状态为3:结算中
    selttle_data["settle_status"] = 3;
    let settleAmount = "0.00";
    // 如果结算金额没有改变则却默认的结算金额，如果有改变则从money_obj中取值
    if (lodash.get(selttle_data, "changeMoney", false)) {
      settleAmount = lodash.get(state.money_obj, `${index}.money`).toFixed(2);
    } else {
      settleAmount = lodash.get(selttle_data, "setBetAmount").toFixed(2);
    }
    // 设置提交金额
    selttle_data.submit_amount = settleAmount;
    let amount;
    // 计算金额
    if (selttle_data.computed_bet_amount) {
      amount = selttle_data.computed_bet_amount;
    }
    // 计算金额格式设置
    if (amount) {
      let _split = amount.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/);
      // 保留两位小数
      let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00";
      amount = _split[1] + "." + decimal;
    }
    // 提前结算接口请求参数
    let params = {
      orderNo,
      settleAmount,
      deviceType: 2,
      frontSettleAmount: amount,
    };
    // 设置按钮显示的金额
    state.early_settlement_data[index].frontSettleAmount = amount;

    // 调用提前结算接口
    post_pre_bet_order(params);
  };
  // 调用提前结算接口
  const post_pre_bet_order = () => {
    api_betting
      .post_pre_bet_order(params)
      .then((res) => {
        const code = lodash.get(res, "data.code");
        const data = lodash.get(res, "data.data");
        if (code == 200) {
          state.cur_bet_pre[`${index}.bet_pre_code`] = 1;
          // 确认按钮状态恢复
          state.early_settlement_data[index].bet_confirm = false;
          // 显示结算成功按钮
          state.early_settlement_data[index]["bet_status"] = "end_bet_pre";
          // 重置过滤未结算和是提前结算定时器
          emit("res_timer_get_cashout");
          show_bet_slide(index);
          re_settlement(code, orderNo);
        } else if (["0400500", "0400527", "0400537"].includes(code)) {
          state.cur_bet_pre[`${index}.bet_pre_code`] = code;
          // 确认按钮状态恢复
          state.early_settlement_data[index]["bet_confirm"] = false;

          // 恢复默认按钮状态
          state.early_settlement_data[index]["bet_status"] = "default";

          // 重置过滤未结算和是提前结算定时器
          emit("res_timer_get_cashout");
          if (code == "0400537" && data) {
            let computed_bet_amount = Number(data).toFixed(2);
            state.early_settlement_data[index]["computed_bet_amount"] =
              computed_bet_amount;
          }
          reset_bet_code(`${index}_bet_pre_${code}`);
        } else if (code !== "0400524") {
          state.cur_bet_pre[`${index}.bet_pre_code`] = code;
          // 恢复默认按钮状态
          state.early_settlement_data[index]["bet_status"] = "default";

          // 重置过滤未结算和是提前结算定时器
          emit("res_timer_get_cashout");
          // 确认按钮状态恢复
          state.early_settlement_data[index]["bet_confirm"] = false;
          reset_bet_code(`${index}_bet_pre_${code}`);
        }
        if (code == "0400524") {
          clearTimeout(state.timer_obj[`${index}_settle_status`]);
          // 提前结算接口如果超过310S后ws没有返回最终状态 拉取一次接口进行最终状态更改
          state.timer_obj[`${index}_settle_status`] = setTimeout(() => {
            order_pre_settle_confirm((code, data) => {
              let obj = lodash.find(data, (item) => item.orderNo == orderNo);
              if (obj) {
                if (obj.preSettleOrderStatus == 1) {
                  state.cur_bet_pre[`${index}.bet_pre_code`] = 1;
                  // 确认按钮状态恢复
                  state.early_settlement_data[index]["bet_confirm"] = false;
                  // 显示结算成功按钮
                  state.early_settlement_data[index]["bet_status"] =
                    "end_bet_pre";
                  // 重置过滤未结算和是提前结算定时器
                  emit("res_timer_get_cashout");
                  show_bet_slide(index);
                  re_settlement(code, orderNo);
                } else if (obj.preSettleOrderStatus == 2) {
                  // 拒单
                  state.is_cancel = true;
                  state.cur_bet_pre[`${index}.bet_pre_code`] = "0400500";

                  // 恢复默认按钮状态
                  state.early_settlement_data[index]["bet_status"] = "default";
                  // 确认按钮状态恢复
                  state.early_settlement_data[index]["bet_confirm"] = false;
                }
              }
            });
          }, 310 * 1000);
        }
      })
      .catch((err) => {
        // 提前结算code设置为 999
        state.cur_bet_pre[`${index}.bet_pre_code`] = 999;
        // 状态恢复
        state.early_settlement_data[index]["bet_status"] = "default";
        // 重置过滤未结算和是提前结算定时器
        emit("res_timer_get_cashout");
        // 恢复确认按钮状态
        state.early_settlement_data[index]["bet_confirm"] = false;
        // 恢复提前就是那code
        reset_bet_code(`${index}_bet_pre_error`);
        console.log(err);
      });
  };
  // 计算下拉icon是否显示
  const show_bet_slide = (index) => {
    let preSettleBetAmount =
      state.early_settlement_data[index].preSettleBetAmount;
    let money = state.money_obj[index].money;
    state.early_settlement_data[index]["pre_settle_bet_amount_2"] =
      mathjs.subtract(preSettleBetAmount, money || 0);
  };
  /**
   * 部分结算后显示提前结算详情
   */
  const show_bet_pre_info = (orderNo, index) => {
    // 提前结算详情折叠
    if (lodash.get(state.cur_bet_pre, `${index}.show_detail`, false)) {
      state.cur_bet_pre[`${index}.show_detail`] = false;
      return false;
    }
    // 展开提前结算详情
    get_info_data(orderNo, index);
  };
  /**
   * 获取提前结算详情数据
   */
  const get_info_data = (orderNo, index) => {
    api_betting.get_pre_settle_order_detail({ orderNo }).then((res) => {
      const code = lodash.get(res, "data.code");
      let result = lodash.get(res, "data.data");
      if (code == 200) {
        // 提前结算接口投注详情数据设置
        state.pre_order_list_obj[index] = result;
        // 设置显示提前结算详情
        state.cur_bet_pre[`${index}.show_detail`] = true;
      }
    });
  };
  /**
   * 提前结算状态更改
   */
  //   query_settle_status(orderNo, index) {
  //     api_betting.query_pre_settle_order_status({ orderNo }).then((res) => {
  //       const code = _.get(res, "data.code");
  //       // 回复按钮状态
  //       this.$set(this.early_settlement_data[index], "bet_status", "default");
  //       // 重置过滤未结算和是提前结算定时器
  //       this.$emit("res_timer_get_cashout");
  //       // 恢复确认按钮状态
  //       this.$set(this.early_settlement_data[index], "bet_confirm", false);
  //       // 设置结算状态码(页面会根据状态码显示对应的提示信息)
  //       if (code == 200) {
  //         // 设置提前结算code码
  //         this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, 1);
  //         // 设置按钮提前结算状态为结束提前结算
  //         this.$set(
  //           this.early_settlement_data[index],
  //           "bet_status",
  //           "end_bet_pre"
  //         );
  //         // 重置过滤未结算和是提前结算定时器
  //         this.$emit("res_timer_get_cashout");
  //         this.show_bet_slide(index);
  //         this.re_settlement(orderNo, index);
  //         // 拉取用户金额接口
  //         this.$root.$emit(this.emit_cmd.EMIT_GET_BALANCE_CMD);
  //       } else if (["0400525", "0400526"].includes(code)) {
  //         this.$set(this.cur_bet_pre, `${index}.bet_pre_code`, code);
  //         this.$set(this.early_settlement_data[index], "bet_status", "default");
  //         // 重置过滤未结算和是提前结算定时器
  //         this.$emit("res_timer_get_cashout");
  //       }
  //       // 调用回复状态码(5s后才会回复)
  //       reset_bet_code(`${index}_bet_pre_${code}`);
  //     });
  //   }
  /**
   * 初始化滑块以及提前结算数据
   */
  const init_data = () => {
    // 提前结算开关打开时处理
    if (props.tool_selected) {
      emit("clear_timer_get_cashout");
      this.get_init_data();
    } else if (props.tool_selected == 0 && vx_get_user.settleSwitch) {
      let param = {};
      let send_gcuuid = uid();
      param.gcuuid = send_gcuuid;
      // console.log('init_data====',JSON.stringify(param));

      //获取提前结算确认中的数据
      api_betting.query_order_pre_settle_confirm(param).then((res) => {
        // console.log('init_data====res===', this.send_gcuuid == res.config.gcuuid);
        // if(this.send_gcuuid != res.config.gcuuid) return;

        let gcuuid = lodash.get(res, "config.gcuuid");
        if (gcuuid && send_gcuuid != gcuuid) {
          return;
        }

        let code = lodash.get(res, "data.code");
        let confirm_data = {};
        if (code == 200) {
          let data = lodash.get(res, "data.data");
          if (lodash.isArray(data)) {
            lodash.forEach(data, (item) => {
              if (item && item.orderNo && item.frontSettleAmount) {
                // 提交数据按钮显示金额设置
                confirm_data[item.orderNo] = item;
              }
            });
          }
        }
        // 获取出初始化数据
        get_init_data(confirm_data);
      });
    } else {
      // 获取出初始化数据
      get_init_data();
    }
  };
  const get_init_data = (data) => {
    // 默认为10元
    let min_money = 10;
    if (lodash.isEmpty(state.setup_single_info)) {
      // 获取用户的配置
      state.setup_single_info = lodash.get(vx_get_user, "cvo.single");
    }
    // 从用户配置中获取配置的最小金额
    if (
      !lodash.isEmpty(state.setup_single_info) &&
      lodash.isPlainObject(state.setup_single_info)
    ) {
      min_money = state.setup_single_info.min;
    }
    // 提前结算数据获取
    state.early_settlement_data = lodash.get(state.recordData, "records", []);
    lodash.forEach(state.early_settlement_data, (item, index) => {
      // 总的投注金额
      let order_amount_total = item.orderAmountTotal;
      // 如果做过提前结算
      if (item.preBetAmount) {
        // 重新计算最新的可提前结算金额
        order_amount_total = item.orderAmountTotal - item.preBetAmount;
      }
      // 设置最新的投注额四舍五入保留两位小数
      item.setBetAmount = lodash.round(order_amount_total, 2);
      // 最新的可提前结算金额四舍五入保留两位小数
      order_amount_total = lodash.round(order_amount_total, 2);
      /* // 盘口类型获取
      let market_type = _.get(item,'orderVOS.0.marketType');
      // 欧洲盘赔率
      let odds_value = _.get(item,'orderVOS.0.oddFinally') * 1000;
      // 获取对应的欧赔
      let odd = market_type=='EU'? odds_value : (1000 + odds_value); */
      // 概率
      // let probabilities = _.get(item,'orderVOS.0.probabilities');
      let computed_bet_amount;
      computed_bet_amount = lodash.get(item, "maxCashout") || 0;
      item.settle_status = 0;
      // 结算状态 1:(AVAILABLE)可以正常提前结算 -1, UNAVAILABLE-2:CLOSE
      item.cash_out_status = 1;
      // 确认的数据存在
      if (data && data[item.orderNo]) {
        let confirm_obj = data[item.orderNo];
        if (confirm_obj.preSettleOrderStatus == 0) {
          // 设置状态为开始结算
          item.bet_status = "start_bet_pre";
          // 设置确认状态
          item.bet_confirm = true;
          // 清除过滤未结算和是提前结算定时器
          emit("clear_timer_get_cashout");
        } else if (confirm_obj.preSettleOrderStatus == 2) {
          item.bet_status = "default";
          item.bet_confirm = false;
        }
        item.pre_settle_order_status = confirm_obj.preSettleOrderStatus;
        if (
          confirm_obj.frontSettleAmount > 0 &&
          confirm_obj.preSettleOrderStatus != 1
        ) {
          // 上次按钮上的金额  提前结算状态为确认中或拒单才使用上次数据
          item.frontSettleAmount = confirm_obj.frontSettleAmount;
        } else {
          item.frontSettleAmount = computed_bet_amount || 0;
        }
      } else {
        item.frontSettleAmount = computed_bet_amount || 0;
      }
      // 计算金额
      item.computed_bet_amount = computed_bet_amount || 0;
      // 计算金额步长
      let step = order_amount_total / 4;
      //  滑块上五个点数据设置
      let bet_amount_data = [
        { id: 0, name: "0" },
        { id: step * 1, name: "25" },
        { id: step * 2, name: "50" },
        { id: step * 3, name: "75" },
        { id: step * 4, name: "100" },
      ];

      // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
      let money_obj_ = {
        min_money,
        max_money: order_amount_total,
        money: order_amount_total,
        step,
        bet_amount_data,
      };
      // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
      state.money_obj[`${index}`] = money_obj_;
    });
    // 重置显示操作
    reset_show_operate();
    if (state.early_settlement_data.length > 0) {
      // 设置页面加载状态
      prorps.data_state.load_data_state = "data";
    }
  };
  // 提前结算实时查询最高返还批量后初始化数据
  const get_init_cash_out_data = (num) => {
    // 默认为10元
    let min_money = 10;
    if (lodash.isEmpty(state.setup_single_info)) {
      // 获取用户的配置
      state.setup_single_info = lodash.get(vx_get_user, "cvo.single");
    }
    // 从用户配置中获取配置的最小金额
    if (
      !lodash.isEmpty(state.setup_single_info) &&
      lodash.isPlainObject(state.setup_single_info)
    ) {
      min_money = state.setup_single_info.min;
    }
    // 提前结算数据获取
    state.early_settlement_data = lodash.get(state.recordData, "records", []);
    let item = state.early_settlement_data[num];
    // 总的投注金额
    let order_amount_total = item.orderAmountTotal;
    // 如果做过提前结算
    if (item.preBetAmount) {
      // 重新计算最新的可提前结算金额
      order_amount_total = item.orderAmountTotal - item.preBetAmount;
    }
    // 设置最新的投注额四舍五入保留两位小数
    item.setBetAmount = lodash.round(order_amount_total, 2);
    // 最新的可提前结算金额四舍五入保留两位小数
    order_amount_total = lodash.round(order_amount_total, 2);
    let computed_bet_amount;
    computed_bet_amount = lodash.get(item, "maxCashout") || 0;
    item.settle_status = 0;
    // 结算状态 1:(AVAILABLE)可以正常提前结算 -1, UNAVAILABLE-2:CLOSE
    item.cash_out_status = 1;
    item.frontSettleAmount = computed_bet_amount || 0;
    // 计算金额
    item.computed_bet_amount = computed_bet_amount || 0;
    // 计算金额步长
    let step = order_amount_total / 4;
    //  滑块上五个点数据设置
    let bet_amount_data = [
      { id: 0, name: "0" },
      { id: step * 1, name: "25" },
      { id: step * 2, name: "50" },
      { id: step * 3, name: "75" },
      { id: step * 4, name: "100" },
    ];

    // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
    let money_obj_ = {
      min_money,
      max_money: order_amount_total,
      money: order_amount_total,
      step: state.money_obj[num].step,
      bet_amount_data,
    };
    // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
    state.money_obj[`${num}`] = money_obj_;
    // this.$forceUpdate();
  };
  /**
   * 推送后根据订单号设置提前结算按钮转台
   */
  const set_pre_order_status = ({ orderNo = "", settle_status = 0 }) => {
    if (orderNo) {
      let index = _.findIndex(
        state.early_settlement_data,
        (item) => item.orderNo == orderNo
      );
      if (index > -1) {
        // 设置确认状态默认false
        state.early_settlement_data[index]["bet_confirm"] = false;
        // 结算成功
        if (settle_status == 1) {
          clearTimeout(state.timer_obj[`${index}_settle_status`]);
          // 设置提前结算code码
          state.cur_bet_pre[`${index}.bet_pre_code`] = 1;
          // 设置结算状态
          state.early_settlement_data[index]["bet_status"] = "end_bet_pre";
          // 重置过滤未结算和是提前结算定时器
          emit("res_timer_get_cashout");
          show_bet_slide(index);
          // 重置提前结算数据
          re_settlement(orderNo, index);
        } else if (settle_status == 2) {
          clearTimeout(state.timer_obj[`${index}_settle_status`]);
          // 设置错误码
          state.cur_bet_pre[`${index}.bet_pre_code`] = 999;
          // 设置提前结算按钮状态
          state.early_settlement_data[index]["bet_status"] = "default";

          // 重置过滤未结算和是提前结算定时器
          emit("res_timer_get_cashout");
          // 恢复计算金额
          state.early_settlement_data[index]["frontSettleAmount"] = 0;
          // 提前结算单被拒
          state.is_cancel = true;
        }
        // 设置提前结算状态(推送状态)
        state.early_settlement_data[index]["settle_status"] = settle_status;

        // 获取提前结算code吗
        let code = lodash.get(state.cur_bet_pre, `${index}.bet_pre_code`);
        // 5S后恢复默认code
        this.reset_bet_code(index, `${index}_bet_pre_${code}`);
      }
    }
  };
  // 设置ws推送过来的消息
  const set_ws_info_data = (obj) => {
    if (!lodash.isEmpty(obj)) {
      for (let [orderNo, record] of Object.entries(obj)) {
        let index = lodash.findIndex(
          state.early_settlement_data,
          (item) => item.orderNo == orderNo
        );
        if (index > -1) {
          let early_obj = state.early_settlement_data[index];
          // 盘口id
          let hid = lodash.get(record, "orderVOS.0.marketId");
          // 投注项id
          let oid = lodash.get(record, "orderVOS.0.playOptionsId");
          // 订单上的概率
          // let probabilities = _.get(early_obj, 'orderVOS.0.probabilities');
          if (early_obj) {
            // 提前结算盘口id和投注项id
            let { marketId, playOptionsId } = early_obj.orderVOS[0];
            // 盘口匹配上则合并状态
            if (hid == marketId) {
              // cashOutStatus值合并
              early_obj.cash_out_status = record.cash_out_status;
              // 盘口状态合并
              early_obj.orderVOS[0].hs = record.hs;
            }
            // 设置提前结算开关状态
            if (!early_obj.enablePreSettle && record.cash_out_status == 1) {
              early_obj.enablePreSettle = true;
            }
            // 获取提前就是那按钮状态
            // let bet_status = early_obj.bet_status;
            // 订单总投注额
            let order_amount_total = early_obj.orderAmountTotal;
            early_obj.setBetAmount = order_amount_total;
          }
        }
      }
      //   this.$forceUpdate();
    }
  };
  /**
   * 恢复默认code
   */
  const reset_bet_code = (index, filed = "") => {
    // 清除定时器
    clearTimeout(state.timer_obj[filed]);
    // 设置定时器
    state.timer_obj[filed] = setTimeout(() => {
      state.cur_bet_pre[`${index}.bet_pre_code`] = 0;
    }, 5000);
  };
  /**
   * 恢复默认操作
   */
  const reset_show_operate = () => {
    // 当前操作做非空判断
    if (!lodash.isEmpty(state.cur_bet_pre)) {
      // 对所欲的操作进行充值
      for (let key of Object.keys(state.cur_bet_pre)) {
        if (key > -1) {
          // 显示操作复位
          state.cur_bet_pre[`${key}.show_operate`] = "";
          // 查看详情做复位
          state.cur_bet_pre[`${key}.show_detail`] = false;
        }
      }
    }
    // 当前提前结算对象初始化
    state.cur_bet_pre = {};
    // 提前结算订单列表初始化
    state.pre_order_list_obj = {};
  };
  /**
   * 重新结算
   * code 接口返回的状态码
   */
  const re_settlement = (orderNo, code) => {
    let index = -1;
    for (let key in Object.keys(state.cur_bet_pre)) {
      if (lodash.get(state.cur_bet_pre, `${key}.orderNo`) == orderNo) {
        index = key;
        break;
      }
    }
    if (index == -1) return;
    clearTimeout(state.timer_obj[`bet_pre_${code}`]);
    // 第一次部分结算后按钮回复出事状态
    let settlment_data = state.early_settlement_data[index];
    // 获取提前结算提交的金额
    let submit_amount = settlment_data.submit_amount;
    // 提前结算的金额
    let order_amount = settlment_data.setBetAmount;
    // 计算金额重置
    settlment_data["amount"] = "";
    // 金额变化 并且提交金额小于投注额 并且提前结算金额不为空
    if (
      lodash.get(settlment_data, "changeMoney", false) &&
      settlment_data.setBetAmount > submit_amount &&
      !settlment_data.preBetAmount
    ) {
      // 被ws推送拒单过，是二次结算，不走下面逻辑
      if (state.is_cancel || settlment_data.preBetAmount == 0) return;
      // 5S后回复出事状态
      state.timer_obj[`bet_pre_${code}`] = setTimeout(() => {
        // 重置提前结算code吗
        state.cur_bet_pre[`${index}.bet_pre_code`] = 0;
        // 重新计算剩余金额
        order_amount = order_amount - submit_amount;
        // 金额保留两位小数
        let money = lodash.round(order_amount, 2);
        // 提前结算计算金额
        let computed_bet_amount;
        // 获取提前结算概率
        computed_bet_amount =
          lodash.get(settlment_data, "maxCashout") -
          lodash.get(settlment_data, "computed_bet_amount");
        // 设置提前结算计算金额
        settlment_data["computed_bet_amount"] = computed_bet_amount;
        // 按钮显示金额
        settlment_data["frontSettleAmount"] = computed_bet_amount;
        // 提前结算类型设置为部分提前结算
        settlment_data["settleType"] = 4;
        // 提前结算金额设置为提交金额
        settlment_data["preBetAmount"] = submit_amount;
        // 提前结算状态设置为默认
        settlment_data["bet_status"] = "default";
        // 提前结算推送状态设置为默认
        settlment_data["settle_status"] = 0;
        // 组件步长金额的计算
        let step = lodash.round(money, 2) / 4;
        //  滑块上五个点数据设置
        let bet_amount_data = [
          { id: 0, name: "0" },
          { id: step * 1, name: "25" },
          { id: step * 2, name: "50" },
          { id: step * 3, name: "75" },
          { id: step * 4, name: "100" },
        ];
        // 金额对象组装
        let money_obj_ = {
          money,
          max_money: money,
          step,
          bet_amount_data,
        };
        // 金额对象更新
        Object.assign(state.money_obj[index], money_obj_);
        // 设置当前操作的金额
        state.money_obj[`${index}.money`] = money;
        // 设置当前操作的最大金额
        state.money_obj[`${index}.max_money`] = money;
        // 设置最新的步长值
        state.money_obj[`${index}.step`] = step;
        // 设置滑块数据对象
        state.money_obj[`${index}.bet_amount_data`] = bet_amount_data;
        // 重置显示的操作
        reset_show_operate();
      }, 5000);
    }
  };
  /**
   * 金额格式设置
   */
  const format_balance = (num) => {
    if (num) {
      let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/);
      // 保留两位小数
      let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00";
      let _num = _split[1] + "." + decimal;
      return _num.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }
    return "0.00";
  };
  /**
   * 提前结算按钮金额格式设置
   */
  const format_btn_balance = (num) => {
    if (num) {
      let _num = Number(num).toFixed(2);
      return _num.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }
    return "0.00";
  };
  /**
   * @description: 提前结算实时查询 更新数据
   */
  const get_max_cashout = () => {
    let list = state.early_settlement_data;
    lodash.forEach(list, (item, index) => {
      // 提前结算实时查询 是否包含该条数据
      let num = lodash.findIndex(props.orderNo_data_obj, {
        orderNo: item.orderNo,
      });
      let bet_status = lodash.get(
        state.early_settlement_data[index],
        "bet_status"
      );
      if (bet_status != "end_bet_pre") {
        if (num > -1) {
          let maxCashout =
            lodash.get(state.orderNo_data_obj, `${num}.preSettleMaxWin`) || 0;
          let preBetAmount = lodash.get(
            state.orderNo_data_obj,
            `${num}.preBetAmount`
          );
          let orderStatus = lodash.get(
            state.orderNo_data_obj,
            `${num}.orderStatus`
          );
          let preSettleBetAmount = lodash.get(
            state.early_settlement_data,
            `${index}.preSettleBetAmount`
          );
          let maxCashout_ = lodash.get(
            state.early_settlement_data,
            `${index}.maxCashout`
          );
          let preBetAmount_ = lodash.get(
            state.early_settlement_data,
            `${index}.preBetAmount`
          );
          let orderStatus_ = lodash.get(
            state.early_settlement_data,
            `${index}.orderStatus`
          );
          // 投注总金
          let orderAmountTotal = lodash.get(
            state.early_settlement_data,
            `${index}.orderAmountTotal`
          );
          // 数据是否有更新，有更新则替换数据
          if (
            maxCashout != maxCashout_ ||
            orderStatus != orderStatus_ ||
            preBetAmount != preBetAmount_
          ) {
            state.early_settlement_data[index].maxCashout = maxCashout;
            // 注单剩余本金
            state.early_settlement_data[index].preSettleBetAmount =
              mathjs.subtract(
                orderAmountTotal,
                preBetAmount_ || preBetAmount || 0
              );
            state.early_settlement_data[index]["preBetAmount"] = preBetAmount;
            state.early_settlement_data[index]["orderStatus"] = orderStatus;
            state.money_obj[`${index}.money`] = lodash.get(
              state.early_settlement_data,
              `${index}.preSettleBetAmount`
            );

            get_init_cash_out_data(index);
          }
        }
      }
    });
  };
  /**
   * @description: 提前结算可用次数
   */
  const betPreCount = (item, index) => {
    let min_money = lodash.get(state.money_obj, `${index}.min_money`);
    let preSettleBetAmount = item.preSettleBetAmount;
    if (preSettleBetAmount <= min_money) {
      return 1;
    } else {
      return item.preBetAmount ? 1 : 2;
    }
  };
  /**
   * @description: 单剩余本金
   */
  const betPreRemaining = (item) => {
    return mathjs.subtract(item.orderAmountTotal, item.preBetAmount || 0);
  };

  // mounted() {
  //   this.toolWords = this.$root.$t("time.time_date_list_1"); // ["今天", "昨天", "七天内", "一个月内"]
  // },
  // destroyed() {
  //   // 关闭设置提前结算状态事件
  //   this.$root.$off(
  //     this.emit_cmd.EMIT_SET_PRE_ORDER_STATUS_CMD,
  //     this.set_pre_order_status
  //   );
  //   // 关闭ws推送数据事件
  //   this.$root.$off(
  //     this.emit_cmd.EMIT_SET_WS_INFO_DATA_CMD,
  //     this.set_ws_info_data
  //   );
  //   // 清除定时器
  //   clearTimeout(this.timeout_toast);
  //   this.money_obj = {};
  //   for (let key in this.timer_obj) {
  //     clearTimeout(this.timer_obj[key]);
  //   }
  //   // 恢复提前结算订单对象
  //   this.pre_order_list_obj = {};
  //   // 恢复操作天前结算对象
  //   this.cur_bet_pre = {};
  //   // 恢复单关设置对象
  //   this.setup_single_info = {};
  //   // 恢复定时器对象
  //   this.timer_obj = {};
  //   this.color_list = null;
  //   // 恢复提前结算数据
  //   this.early_settlement_data = null;
  // },

  onBeforeMount(() => {
    this.recordData = this.order_list;
    // 提前结算订单设施
    this.$root.$on(
      this.emit_cmd.EMIT_SET_PRE_ORDER_STATUS_CMD,
      this.set_pre_order_status
    );
    // 提前结算ws推送的数据设置
    this.$root.$on(
      this.emit_cmd.EMIT_SET_WS_INFO_DATA_CMD,
      this.set_ws_info_data
    );
    // 统计未结算订单数量
    this.$root.$emit(this.emit_cmd.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
  });
  return {
    ...toRefs(state),
    vx_get_user,
    changePage,
    format_balance,
    copy,
    show_bet_pre_info,
    matchType,
    status_class,
    order_status,
    lodash
  };
};
