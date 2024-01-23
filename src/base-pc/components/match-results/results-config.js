/*
 **注释的代码后期改造
 **
 */
import {
  reactive,
  ref,
  toRefs,
  onUnmounted,
  computed,
  onMounted,
  watch,
  nextTick
} from "vue";
import { api_common, api_analysis } from "src/api/";
import lodash from "lodash";
////import store from "src/store-redux/index.js";
import { useRoute, useRouter } from "vue-router";
import { format_day, is_eports_csid } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
// import { axios_loop } from "src/core/http/index.js";
// import menu_config from "src/core/menu-pc/menu-data-class.js";
// import { pre_load_video } from "src/core/pre-load/index";
import {
  i18n_t,
  useMittEmit,
  useMittEmitterGenerator,
  formatTime,
  MITT_TYPES,
} from "src/output/index.js";
import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";
const { IS_FOR_NEIBU_TEST } = BUILD_VERSION_CONFIG;
export const useGetResultConfig = () => {
  const route = useRoute();
  const router = useRouter();
  const sport = ref(null); //体育下拉框选中项
  // const store_state = store.getState();
  const state = reactive({
    model: {
      from: formatTime(new Date(new Date() - 86400000), "yyyy/MM/dd"),
      to: formatTime(new Date(), "yyyy/MM/dd"),
    }, // 日期选择器的所选时间范围
    select_icon_sport: "icon-triangle1", //体育下拉框收起 向下箭头
    select_icon_league: "icon-triangle1", //联赛下拉框收起 向下箭头
    load_data_state: "loading",
    details_load: "loading",
    results_checkbox_style: {
      //单选框样式
      borderColor: "#d0d8de",
    },
    results_table_style: {
      //分页组件自定义样式
      justifyContent: "center",
      padding: "0",
    },
    is_show: false, //显示说明开关
    sport_type: [], //体育下拉框选项名称
    api_sport_type: [], //联赛下拉框请求数据
    league: null, //联赛下拉框选中项
    league_type: [], //联赛下拉框选项名称
    api_league_type: [], //联赛请求数据
    is_bowls: false, //是否勾选滚球
    is_highlights: false, //是否勾选精彩回放筛选
    change_runninBar: false, //滚球单选框是否改变
    startTimeShow: false, //日历开始时间
    // endTimeShow: false, //日历结束时间
    startDateSearch: "", //服务器时间-日历开始时间
    endDateSearch: "", //服务器时间-日历结束时间
    year: null, //服务器时间-年
    mouth: null, //服务器时间-月
    day: null, //服务器时间-日
    results_data: {}, //赛果详细信息
    results_list: [], //赛果表格
    results_params: {
      //表格入参
      tournamentId: "", //联赛id
      runningBar: "0", //是否包含滚球 1：包含，0：不包含，默认是0
      isPlayBack: 0, //是否包含精彩回放 1：包含，0：不包含，默认是0
      orderBy: 0, //赛事时间排序 1：升序，0：降续，默认是1
      sportType: "1", //球类id
      startTime: "", //开始时间,毫秒时间戳
      endTime: "", //结束时间,毫秒时间戳
      langType: "zh",
      page: {
        //分页
        size: 50, //每页条数
        current: 1, //当前第几页
      },
      isVirtualSport: "", // 是否是虚拟赛事
      matchNameStr: "",
    },
    pournament_params: {
      //联赛入参
      sportType: "", //球类id
      startTime: "", //开始时间,毫秒时间戳
      endTime: "", //结束时间,毫秒时间戳
      langType: "zh",
      nameStr: "", //模糊查询字符串
      hot: null, //是否热门
      isVirtualSport: "",
    },
    activeIndex: -1, //查看表格内详细的index
    is_sortUp: false, //是否升序
    results_order_list: [], //点击行赛事的投注项详情
    results_playback_list: [], //点击行赛事的精彩回放数据
    sport_id: "1", //球类id
    tips: {
      //自定义提示
      statu: false, //显隐
      message: "",
    },
    reset_pagination: 1, //重置分页
    pre_random: 1, //记录球种、联赛更改随机数
    page_random: 1, //球种、联赛更改新随机数,
    init: true, //是否联赛筛选
    refresh_finish: false, //重载完成
    champion_sport: null, // 冠军赛种下拉框选中项
    champion_sport_type: [], // 冠军赛种下拉框选项
    current_sport_id: null, // 体育下拉框当前选中项 id
    filterOptions: [], // 过滤后的冠军球种下拉框列表
    is_first_load: false, // 是否为第一次加载
    isSelectConfirmed: false, // 联赛选择框是否已经点了确认
    cancel: 0, // 此值变化的时候隐藏联赛选择框
    timer: null, //定时器
    showSelectTime: null, // 日期选择框内计算后的日期
    _date: null, // 根据服务器时间计算的日期
    // 日期控件多语言配置
    locale: {
      days: i18n_t("time.time_date_week"),
      daysShort: i18n_t("time.time_date_week"),
      months: [
        i18n_t("time.month_1"),
        i18n_t("time.month_2"),
        i18n_t("time.month_3"),
        i18n_t("time.month_4"),
        i18n_t("time.month_5"),
        i18n_t("time.month_6"),
        i18n_t("time.month_7"),
        i18n_t("time.month_8"),
        i18n_t("time.month_9"),
        i18n_t("time.month_10"),
        i18n_t("time.month_11"),
        i18n_t("time.month_12"),
      ],
      monthsShort: [
        i18n_t("time.month_1"),
        i18n_t("time.month_2"),
        i18n_t("time.month_3"),
        i18n_t("time.month_4"),
        i18n_t("time.month_5"),
        i18n_t("time.month_6"),
        i18n_t("time.month_7"),
        i18n_t("time.month_8"),
        i18n_t("time.month_9"),
        i18n_t("time.month_10"),
        i18n_t("time.month_11"),
        i18n_t("time.month_12"),
      ],
      // 每周的第一天
      firstDayOfWeek: 7,
    },
    timeChanged: false, // 两次请求联赛列表时间区间是否有变
    hasSelectedMatch: " ", // 当前是否有选中联赛
    hotIsNull: false, // 热门联赛列表是否为空
    paramsVideo: {}, //精彩回放参数
    is_need_request:true,//是否需要请求
  });

  const test = ref(100)

  onMounted(() => {
    // 从链接获取参数
    let { csid, matchEnd } = route.query;
    // 球种
    if (csid) {
      state.sport_id = csid;
    }
    // 是否选中滚球 matchEnd: false 选中滚球
    if (!lodash.isUndefined(matchEnd) && !JSON.parse(matchEnd)) {
      input_radio();
    }
    state.is_first_load = true;
    // get_serverTime(); //获取服务器时间
  });

  onUnmounted(() => {
    //移除相应监听事件 //视图销毁钩子函数内执行
    /**清除定时器 */
    clearTimeout(state.timer);
    // state.timer = null;
    // state.results_checkbox_style = null;
    // state.results_table_style = null;
    // state.sport_type = null;
    // state.sport = null;
    // state.api_sport_type = null;
    // state.league_type = null;
    // state.league = null;
    // state.results_data = null;
    // state.results_list = null;
    // state.results_params = null;
    // state.pournament_params = null;
    // state.results_order_list = null;
    // state.results_playback_list = null;
    // state.tips = null;
    // state.champion_sport_type = null;
    // state.champion_sport = null;
    // state.filterOptions = null;
  });
  /**
   * 隐藏日期选择组件
   */
  const hideSelect = (value) => {
    state.startTimeShow = false;
    if (value) {
      showDate(value.from, value.to);
    }
  };
  // 隐藏冠军赛种输入框内文字
  const input_focus = () => {
    document
      .querySelector(".ball-games")
      .querySelector(".q-field__native")
      .querySelector("span").style.visibility = "hidden";
  };
  // 显示冠军赛种输入框内文字
  const input_blur = () => {
    document
      .querySelector(".ball-games")
      .querySelector(".q-field__native")
      .querySelector("span").style.visibility = "visible";
  };
  // 冠军赛种下拉框内容筛选
  const champion_sport_type_filter = (val, update) => {
    update(() => {
      if (val === "") {
        state.filterOptions = state.champion_sport_type;
      } else {
        const needle = val.toLowerCase();
        state.filterOptions = state.champion_sport_type.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      }
    });
  };

  /**
   * @description: 获取服务器时间
   */
  const get_serverTime = () => {
    api_common.get_time_server().then((res) => {
      let code = lodash.get(res, "code");
      if (code == 200) {
        state.day_time = parseInt(lodash.get(res, "data")) - 1000 * 60 * 60 * 24;
        state._date = new Date(state.day_time);
        state.year = state._date.getFullYear();
        state.mouth = state._date.getMonth() + 1;
        state.day = state._date.getDate();

        showDate(null, null);
        get_sportType(); //获取球种
      } else {
        state.load_data_state = "empty";
      }
    });
  };
  /**
   * 计算要展示的时间，越南语格式单独区分
   * @param start 开始时间
   * @param end 结束时间
   */
  const showDate = (start, end) => {
    let _start = start || format_day(state._date.getTime());
    let _end = end || format_day(state._date.getTime() + 1000 * 60 * 60 * 24);
    // 越南语时间格式和其他语言不同
    if (["vi", "th", "en", "ms", "ad"].includes(UserCtr.lang)) {
      // 初始化时直接使用服务器时间计算的值
      // 非初始化时需要格式化
      if (start && end) {
        // 范围日期
        if (state.model.from) {
          state.model.from = _start;
          state.model.to = _end;
        } else {
          // 单天
          state.startDateSearch = formatTime(
            new Date(state.model).getTime(),
            "yyyy/mm/dd"
          );
          state.endDateSearch = formatTime(
            new Date(state.model).getTime(),
            "yyyy/mm/dd"
          );
          state.showSelectTime = `${formatTime(
            new Date(state.model).getTime(),
            "dd/mm/yyyy"
          )} - ${formatTime(
            new Date(state.model).getTime(),
            "dd/mm/yyyy"
          )}`;
          return;
        }
      } else {
        if (state.model.from) {
          state.model.from = formatTime(
            new Date(_start).getTime(),
            "yyyy/mm/dd"
          );
          state.model.to = formatTime(
            new Date(_end).getTime(),
            "yyyy/mm/dd"
          );
        }
      }
      state.startDateSearch = formatTime(
        new Date(_start).getTime(),
        "yyyy/mm/dd"
      );
      state.endDateSearch = formatTime(
        new Date(_end).getTime(),
        "yyyy/mm/dd"
      );
      state.showSelectTime = `${formatTime(
        new Date(_start).getTime(),
        "dd/mm/yyyy"
      )} - ${formatTime(new Date(_end).getTime(), "dd/mm/yyyy")}`;
    } else {
      state.startDateSearch = _start;
      state.endDateSearch = _end;
      // 判断是单日期还是范围日期
      if (state.model.from) {
        state.model.from = _start;
        state.model.to = _end;
        state.showSelectTime = `${_start} - ${_end}`;
      } else {
        state.showSelectTime = `${state.model} - ${state.model}`;
      }
    }
  };
  /**
   * @description: 获取球种
   */
  const get_sportType = () => {
    let params = {
      langType: "zh", //默认zh
      showem: 1, // 电子赛事
    };
    api_analysis
      .get_sportType(params)
      .then((res) => {
        const code = lodash.get(res, "code");
        const data = lodash.get(res, "data");
        if (code == 200 && data.length) {
          //当前只展示 足篮网羽斯乒
          for (var i = 0; i < data.length; i++) {
            // 加上 虚拟足球[1001] 虚拟赛狗[1002] 虚拟赛马 [1011] 20210428 by Echo
            // 18-娱乐,28-高尔夫,29-自行车,33-赛车运动
            if (
              [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 90, 91, 1001,
                1004, 1002, 1011, 1010, 1009, 18, 28, 29, 33,
              ].includes(data[i].id * 1) ||
              is_eports_csid(data[i].id * 1)
            ) {
              // 18-娱乐,28-高尔夫,29-自行车,33-赛车运动
              if ([18, 28, 29, 33].includes(data[i].id * 1)) {
                state.sport_type.push(""); //撑住位置,保证数据长度不变
              } else {
                //欧洲版屏蔽4期电竞vr
                if(IS_FOR_NEIBU_TEST || (!IS_FOR_NEIBU_TEST && +data[i].id < 100)){
                  state.sport_type.push(data[i].name);
                }
                // state.sport_type.push(data[i].name);
              }
              // 冠军球种剔除【冠军】选项,增加[全部球种],剔除虚拟赛种
              if (
                ![0, 1001, 1002, 1004, 1011, 1010, 1009].includes(
                  data[i].id * 1
                ) &&
                !is_eports_csid(data[i].id * 1)
              ) {
                state.champion_sport_type.push(data[i].name);
              }
              data[i].label = data[i].name;
            } else {
              data.splice(i, 1);
              i--;
            }
          }
          // 添加【全部】选项
          state.champion_sport_type.unshift(i18n_t("select.all"));
          state.api_sport_type = data;
          // console.log(state.api_sport_type,'state.api_sport_type');
          const _name = i18n_t("select.all");
          // 如果求种id存在，则显示对应的求种id
          if (state.sport_id) {
            let sport_obj = lodash.find(
              data,
              (item) => item.id == state.sport_id
            );
            sport.value = sport_obj.name;
            state.champion_sport = _name;
            // 冠军赛种默认查询全部赛种
            if (state.sport_id == "0") {
              state.pournament_params.sportType = "";
              state.results_params.sportType = "";
            } else {
              state.pournament_params.sportType = state.sport_id;
              state.results_params.sportType = state.sport_id;
            }
          } else {
            sport.value = data[0].name;
            state.champion_sport = data[data.length - 1].name;
            // 冠军赛种默认查询全部赛种
            if (state.champion_sport == _name) {
              state.pournament_params.sportType = "";
              state.results_params.sportType = "";
            } else {
              state.pournament_params.sportType = data[0].id;
              state.results_params.sportType = data[0].id;
            }
          }
          //获取联赛数据
          get_pournament();
        } else {
          state.load_data_state = "empty";
        }
      })
      .catch((err) => {
        // 接口报错时页面展示为空
        state.load_data_state = "empty";
      });

  };

  /**
   * @description: 获取联赛数据
   */
  /**
   * @description: 获取联赛列表
   * @param {*} type 1 切换球种 0 联赛下拉框内的【热门】选项被勾选 2联赛下拉框展开时
   * @return {*}
   */
  const get_pournament = (type) => {
    // 判断两次请求之间，选择的时间范围是否有变化
    if (
      state.pournament_params.startTime !=
      new Date(state.startDateSearch).getTime() ||
      state.pournament_params.endTime !=
      new Date(`${state.endDateSearch} 23:59:59`).getTime()
    ) {
      state.timeChanged = true;
    } else {
      state.timeChanged = false;
    }
    state.pournament_params.startTime = new Date(
      state.startDateSearch
    ).getTime();
    state.pournament_params.endTime = new Date(
      `${state.endDateSearch} 23:59:59`
    ).getTime();
    state.pournament_params.runningBar = state.is_bowls ? "1" : "0";
    state.pournament_params.champion = state.current_sport_id == "0" ? 1 : 0;
    state.pournament_params['showem'] = 1;
    state.league_type = [];
    if (!test_time()) {
      state.cancel = new Date().getTime();
      return;
    }
    api_analysis
      .post_results_pournament(state.pournament_params)
      .then((res) => {
        const code = lodash.get(res, "code");
        const data = lodash.get(res, "data");
        // 从链接获取联赛 id
        let { tid } = route.query ?? null;
        if (code == 200 && data.length) {
          data.sort((a, b) => {
            return a.tournamentName.localeCompare(b.tournamentName, "zh");
          });
          let ids = "";
          data.forEach((item) => {
            // 如果参数存在并且不是在切换球种，获取联赛id并设置联赛名称
            if (tid && type != 1) {
              if (tid == item.id) {
                state.league = item.tournamentName;
                state.results_params.tournamentId = item.id;
              }
            }
            state.league_type.push(item.tournamentName);
            ids += `${item.id},`;
          });
          // 如果是由联赛框触发的就不处理
          if (type != 2) {
            state.results_params.tournamentId = ids.substr(0, ids.length - 1);
          }
        } else {
          // 如果请求的是 热门 并且没有数据
          if (state.pournament_params.hot == 1 && data.length == 0) {
            state.hotIsNull = true;
          }
          state.results_params.tournamentId = "";
          // 如果联赛查询结果为空就置空当前联赛列表
          if (state.pournament_params.nameStr && data.length == 0) {
            state.api_league_type = data;
            return;
          }
        }
        state.api_league_type = data;
        if (state.init && (!tid || type == 1)) {
            get_results(); //获取表格数据
          state.init = false;
          let timer = null
          clearTimeout(timer);
          timer = setTimeout(() => {
            state.is_need_request = true
          }, 300);
        } else {
          // 联赛下拉框点【取消】的时候赛果列表继续展示 暂无数据
          if (state.isSelectConfirmed != 0) {
            state.load_data_state = "empty";
          }
        }
      });
  };

  /**
   * @description: 获取表格数据
   */
  const get_results = () => {
    // 赛果输入框点击确认的时候，如果联赛列表查询为空则不处理，并且把当前赛果列表置空
    if (state.pournament_params.nameStr && state.api_league_type.length == 0) {
      state.load_data_state = "empty";
      return;
    }
    state.load_data_state = "loading";
    state.activeIndex = -1;
    // 如果当前体育下拉框选中项为【冠军】，赛果列表就要用冠军模板
    if (state.current_sport_id == "0") {
      state.sport_id = "0";
    } else {
      state.sport_id = state.results_params.sportType;
    }
    state.results_params.startTime = new Date(state.startDateSearch).getTime();
    state.results_params.endTime = new Date(
      `${state.endDateSearch} 23:59:59`
    ).getTime();
    // 虚拟赛事需要加上该参数
    if (
      ["1001", "1002", "1011", "1004", "1010", "1009"].includes(
        state.results_params.sportType
      )
    ) {
      state.results_params.isVirtualSport = 1;
    } else {
      state.results_params.isVirtualSport = "";
    }
    // 判断是否是冠军赛事
    state.results_params.champion = state.sport_id == "0" ? 1 : 0;
    // 第一次加载的时候通过参数进行查找
    if (state.is_first_load) {
      state.is_first_load = false;
      // 通过链接获取主客队名字
      let { homeName, awayName, lang } = route.query;
      if (
        !lodash.isEmpty(homeName) &&
        !lodash.isEmpty(awayName) &&
        UserCtr.lang == lang
      ) {
        state.results_params.matchNameStr = `${homeName} VS ${awayName}`;
      }
    }
    state.results_params.matchNameStr =
      state.results_params.matchNameStr.trim();
    // 判断是否是电竞
    if (is_eports_csid(state.sport_id)) {
      state.results_params.isESport = "1";
    } else {
      state.results_params.isESport = "";
    }
    if (!state.league_type.length) {
      state.league_type = [i18n_t("common.all")];
      state.league = i18n_t("common.all");
    }
    api_common.get_virtual_result(state.results_params).then((res) => {
      const code = lodash.get(res, "code");
      const data = lodash.get(res, "data");
      state.refresh_finish = true;

      if (code == 200 && data.records.length) {
        let results = data.records;
        state.load_data_state = "data";
        // 虚拟赛事不需要格式化  虚拟足球 篮球除外
        if (
          !["1002", "1011", "1010", "1004", "1001"].includes(
            results[0].sportId
          ) &&
          state.current_sport_id != "0"
        ) {
          // 格式化比分 msc: '["S1|48:52"]' => msc: {S1:{home: 48,away: 52}}
          for (let i in results) {
            let scoreResult_data = results[i].scoreResult.replace(
              /\[|]|"/g,
              ""
            );
            let obj = {};
            if (scoreResult_data) {
              let format = scoreResult_data.split(",");
              format.forEach((item) => {
                let home, away;
                let [key, value] = item.split("|");
                if (!value) {
                  [home, away] = ["", ""];
                } else {
                  [home, away] = value.split(":");
                }

                obj[key] = {
                  // 如果有为 null 的情况直接替换为空值
                  home: ["null"].includes(home) ? "" : home,
                  away: ["null"].includes(away) ? "" : away,
                };
              });
              results[i].scoreResult = obj;
            }
          }
        }
        state.results_data = data;
        state.results_list = results;

        // 展开定位到的赛事
        nextTick(() => {
          let { matchId } = route.query;
          // 展开具体的联赛
          if (matchId) {
            let index = lodash.findIndex(
              results,
              (item) => item.tournamentName == state.league
            );
            get_tr_detail([route.query, index]);
          }
        });
        // state.league_type = Array.from(new Set(tournament));
      } else {
        state.results_data = [];
        state.results_list = [];
        state.load_data_state = "empty";
      }
    }).catch(err=>{
      console.error('errerrerr',err)
    })
  };

  /**
   * @description: 获取点击行赛事的投注项赛果详情
   * @param {Array} data 球种模板传过来的值
   */
  const get_tr_detail = (data) => {
    state.details_load = "loading";
    let item = data[0];
    let index = data[1];
    let params = {
      langType: "zh", //默认zs
      matchId: item.matchId, //赛事id
      homeName: item.homeName, //主队名
      awayName: item.awayName, //客队名
    };
    // 赛事回放参数
    state.paramsVideo = {
      device: "PC",
      mid: item.matchId, //赛事id
      eventCode: 0,
    };
    // 如果当前是电竞,就增加对应的请求参数
    if (is_eports_csid(state.current_sport_id)) {
      params.isESport = "1";
    }
    // 清空上一次的请求结果
    state.results_order_list = [];
    // 清空上一次的精彩回放详情请求结果
    state.results_playback_list = [];
    // 取消赛果列表里上一次展开的那一项
    if (state.activeIndex == index) {
      state.activeIndex = -1;
    } else {
      // 展开新的赛果项
      state.activeIndex = index;
      api_analysis
        .post_results_order(params)
        .then((res) => {
          const code = lodash.get(res, "code");
          const data = lodash.get(res, "data");

          if (code == 200 && data.length) {
            data.forEach((item) => {
              if (item && item.posrList && item.posrList.length > 0) {
                /**
                 * @只展示 走水、赢、赢半、输半的盘口
                 * 2-走水  3-输 4-赢 5-赢一半 6-输一半 7-赛事取消 8-赛事延期 11-比赛延迟 12-比赛中断 13-未知 15-比赛放弃 16-异常盘口
                 */
                for (var i = 0; i < item.posrList.length; i++) {
                  if (
                    !["2", "4", "5", "6"].includes(item.posrList[i].scoreResult)
                  ) {
                    item.posrList.splice(i, 1);
                    i--;
                  } else {
                    item.posrList[i] = Object.freeze(item.posrList[i]);
                  }
                }
                let default_obj = {
                  playOptionId: "",
                  playOptionName: "",
                  scoreResult: "",
                };
                if ([367, 368, 369].includes(Number(item.playId))) {
                  item.posrList = sort_plays_data(
                    item.posrList,
                    default_obj
                  );
                }
                // 玩法数量为奇数时补空
                if (item.posrList.length % 2) {
                  item.posrList.push(Object.freeze({ ...default_obj }));
                }
              } else {
                item.posrList = [];
              }
            });
            // 电竞赛事不展示输的详情，返回数据不同
            if (is_eports_csid(state.current_sport_id)) {
              // 判断赛果详情里是否有空数据
              let notEmpty = data.some((i) => i.posrList.length > 0);
              if (!notEmpty) {
                state.details_load = "empty";
                state.results_order_list = [];
              } else {
                state.results_order_list = data;
                state.details_load = "data";
              }
            } else {
              // 常规赛种的赛果直接展示
              state.results_order_list = data;
              state.details_load = "data";
            }
          } else {
            state.details_load = "empty";
          }
        })
        .catch((err) => {
          state.details_load = "empty";
        });
      // state.$refs.result_ref&&state.$refs.result_ref.change_current_events_type();
      state?.$refs?.result_ref?.change_current_events_type();
      change_playback_type();
    }
  };
  /**
   * @description: 获取点击当前tab的精彩回放视频数据
   * @param {Array} data 足球种模板当前tab切换的值
   */
  const change_playback_type = (data = {}) => {
    if (data && data.code) {
      state.paramsVideo.eventCode = data.code - 0;
    }
    api_analysis
      .post_playback_video_url(state.paramsVideo)
      .then((res) => {
        const code = lodash.get(res, "code");
        const data = lodash.get(res, "data");
        if (code == 200 && data) {
          if (data.eventList && data.eventList.length) {
            state.results_playback_list = data.eventList;
          } else {
            state.results_playback_list = [];
          }
          state.results_playback_list.sort((a, b) => {
            if (b.secondsFromStart < a.secondsFromStart) {
              return 1;
            } else if (b.secondsFromStart > a.secondsFromStart) {
              return -1;
            }
            if (b.t1 + b.t2 < a.t1 + a.t2) {
              return 1;
            } else if (b.t1 + b.t2 > a.t1 + a.t2) {
              return -1;
            }
            return 0;
          });
        } else {
          state.results_playback_list;
        }
      })
      .catch((err) => { });
  };
  /**
   * @description:排序赛果
   * @param {Array} plays 玩法下的赛果集合
   * @param {Array} default_obj 默认赛果
   */
  const sort_plays_data = (plays, default_obj) => {
    let cur_score = [];
    let { left_data, right_data } = assort_data(plays);
    let max_length = Math.max(left_data.length, right_data.length);
    for (let i = 0; i < max_length; i++) {
      cur_score.push(
        left_data[i] || Object.freeze({ ...default_obj }),
        right_data[i] || Object.freeze({ ...default_obj })
      );
    }
    return cur_score;
  };
  /**
   * @description:(分割:主,客,平,其他) 再合并左右两列
   * @param {Array} list 玩法下的赛果集合
   */
  const assort_data = (plays) => {
    let main_win = [],
      guest_win = [],
      flat = [],
      other = [];
    plays.forEach((item) => {
      let [home, away] = (item.sportManNameAndS1 || "").split(":");
      if (away && home) {
        if (home > away) {
          main_win.push(item);
        } else if (home < away) {
          guest_win.push(item);
        } else {
          flat.push(item);
        }
      } else {
        other.push(item);
      }
    });
    return {
      left_data: [
        ...sort_score(main_win),
        ...sort_score(flat, 2),
        ...other,
      ],
      right_data: sort_score(guest_win, 1),
    };
  };
  /**
   * @description: 比分排序
   * @param {Array} list 主,客,平,其他，下的赛果集合
   * @param {Number} type (1:客胜,2:平局,默认主胜)
   */
  const sort_score = (list, type) => {
    list.sort((a, b) => {
      let [home, away] = a.sportManNameAndS1.split(":");
      let [home1, away1] = b.sportManNameAndS1.split(":");
      let asc = true;
      if (type === 1) {
        if (away !== away1) {
          asc = false;
        }
      } else {
        if (home === home1) {
          asc = false;
        }
      }
      return asc ? home - home1 : away - away1;
    });
    return list;
  };
  /**
   * @description: 下拉框选择球种
   * @param {n} 0 体育下拉框 1 冠军球种
   */
  const choose_sport = (n = 0) => {
    state.is_need_request = false
    // 如果查询的时间不在支持查询的时间区间内
    if (!test_time()) {
      return;
    }
    // 重置分页组件
    state.reset_pagination = Math.random();
    // 切换球种时让联赛选择框清除选中热门
    useMittEmit(MITT_TYPES.EMIT_INIT_SELECT, 1);
    state.results_params.matchNameStr = "";
    state.results_params.tournamentId = "";
    let index;
    let id,
      _name = i18n_t("select.all"); // 全部
    // 0体育下拉框 1冠军球种下拉框
    if (n == 0) {
      index = state.sport_type.indexOf(sport.value);
      // 记录体育下拉框当前的选项 id
      state.current_sport_id = state.api_sport_type[index].id;
      // 如果当前体育下拉框选项为冠军，就用冠军球种 id 去查询
      if (index == state.sport_type.length - 1) {
        index = state.champion_sport_type.indexOf(state.champion_sport);
      }
      // 当前选中的球种为冠军且为冠军球种的【全部】时，id 传空查询全部冠军球种，否则传对应 id
      if (
        state.champion_sport == _name &&
        index == state.champion_sport_type.indexOf(state.champion_sport) &&
        state.current_sport_id == "0"
      ) {
        id = "";
      } else {
        id = state.api_sport_type[index].id;
      }
    } else {
      // 如果当前冠军赛种下拉框的选项是 全部
      if (state.champion_sport == _name) {
        index = state.champion_sport_type.indexOf(state.champion_sport);
      } else {
        index = state.sport_type.indexOf(state.champion_sport);
      }
      // 当前选中的球种为冠军且为冠军球种的【全部】时，id 传空查询全部冠军球种，否则传对应 id
      if (
        state.champion_sport == _name &&
        index == state.champion_sport_type.indexOf(state.champion_sport) &&
        state.current_sport_id == "0"
      ) {
        id = "";
      } else {
        // 找到菜单对象,获取里面的id值
        id = lodash.get(
          lodash.find(state.api_sport_type, { name: state.champion_sport }),
          "id"
        );
      }
    }
    state.pournament_params.sportType = id;
    // 清空参数
    state.pournament_params.tournamentId = "";
    // 初始化联赛筛选框的参数
    state.pournament_params.nameStr = "";
    state.pournament_params.hot = 0;

    // 合并请求参数
    Object.assign(state.results_params, {
      sportType: id,
      tournamentId: "",
      champion: state.current_sport_id == "0" ? 1 : 0,
    });
    state.page_random = Math.random();
    state.league_type = [i18n_t("common.all")]; // 全部
    state.league = i18n_t("common.all"); // 全部
    //重置筛选条件
    state.pournament_params.tournamentId = "";
    state.pournament_params.nameStr = "";
    state.init = true; //查询赛事
    get_pournament(1); //联动调取联赛数据
  };

  /**
   * @description: 下拉框选择联赛
   * 选择联赛之后，调用赛果接口查询已选联赛的赛事
   */
  const select_submit = (data) => {
    // 选择联赛的时候也要检查时间
    if (!test_time()) {
      return;
    }
    state.hasSelectedMatch = data.ids;
    // 如果没有选中的联赛，或者当前联赛列表选中的是热门并且联赛列表为空就不处理，并且在空白的赛果列表处展示暂无数据
    if (data.ids == "" || (state.hotIsNull && data.ids == "")) {
      state.load_data_state = "empty";
      return;
    }
    // 已选中的联赛 id
    state.results_params.tournamentId = data.ids.join(",");
    state.pournament_params.hot = data.isHot;
    Object.assign(state.results_params, {
      page: {
        current: 1,
        size: 50,
      },
    });
    get_results();
  };
  /**
   * @description: 热门筛选
   * @param {}
   * @return {}
   */
  const search_hot = (data) => {
    state.pournament_params.hot = data;
    get_pournament(0);
  };

  /**
   * @description: 模糊搜索
   * @param {String} data 输入框的值
   */
  const ipt_search = (data) => {
    state.pournament_params.nameStr = data[0];
    state.pournament_params.hot = data[1];
    get_pournament(2);
  };
  /**
   * @description: 开始日期选择
   */
  const startTimeShowFunc = (type) => {
    useMittEmit(MITT_TYPES.EMIT_SHOW_SELECT);
    // 体育下拉框展开时判断日期选择框是否展开
    if (type.type == "close") {
      if (state.startTimeShow == true) {
        state.startTimeShow = false;
        return;
      } else {
        return;
      }
    }
    state.startTimeShow = !state.startTimeShow;
    if (state.startTimeShow == true) {
      useMittEmit(MITT_TYPES.EMIT_HIDE_SPORT_SElECT, "close");
    }
  };
  /**
   * @description: 开始日期改变
   */
  const startchange = (val) => {
    state.startDateSearch = val;
    state.showDate(val, state.endDateSearch);
  };

  /**
   * @description: 结束日期改变
   */
  const endchange = (val) => {
    state.endDateSearch = val;
    state.showDate(state.startDateSearch, val);
  };

  /**
   * @description: 勾选滚球
   *
   */
  const input_radio = () => {
    // 勾选滚球时隐藏联赛下拉框
    state.cancel = new Date().getTime();
    state.is_bowls = !state.is_bowls;
    state.results_params.runningBar = state.is_bowls ? "1" : "0";
    state.change_runninBar = !state.change_runninBar;
  };

  /**
   * @description: 勾选精彩回放
   *
   */
  const highlights_input_radio = () => {
    // 勾选精彩回放时
    // state.cancel = new Date().getTime();
    state.is_highlights = !state.is_highlights;
    state.results_params.isPlayBack = state.is_highlights ? 1 : 0;
    // state.is_highlights = !state.is_highlights;
  };

  /**
   * @description: 搜索
   */
  const sub_search = () => {
    state.cancel = new Date().getTime();
    if (!test_time()) {
      return;
    }
    // 如果没有已选中联赛就不发起请求，并且展示暂无数据
    if (!state.hasSelectedMatch.length) {
      state.load_data_state = "empty";
      return;
    }
    let is_change =
      new Date(state.startDateSearch).getTime() !=
      state.pournament_params.startTime ||
      new Date(`${state.endDateSearch} 23:59:59`).getTime() !=
      state.pournament_params.endTime ||
      state.change_runninBar;
    if (state.results_params.sportType == "1" && state.is_highlights) {
      state.results_params.isPlayBack = 1;
    } else {
      state.results_params.isPlayBack = 0;
    }
    if (is_change) {
      Object.assign(state.results_params, {
        page: {
          current: 1,
          size: 50,
        },
      });

      state.init = true;
      get_pournament();
      state.change_runninBar = false;
      state.reset_pagination = Math.random();
    } else {
      if (state.page_random != state.pre_random) {
        state.reset_pagination = Math.random();
        state.pre_random = state.page_random;
      }
      get_results();
    }
  };

  /**
   * @description: 检查所选时间是否在符合条件的范围内
   */
  const test_time = () => {
    let statu = true;
    const start_day = new Date(`${state.startDateSearch} 00:00:00`).getTime(); //开始时间
    const end_day = new Date(`${state.endDateSearch} 23:59:59`).getTime(); //结束时间
    const current = new Date(
      `${state.year}/${state.mouth}/${state.day}`
    ).getTime(); //当时间

    if (end_day - start_day > 86400000 * 7) {
      toast(i18n_t("results.error_time")); //日期区间最多跨度为7天
      statu = false;
      return statu;
    }

    if (end_day < start_day) {
      toast(i18n_t("results.early_time")); //请选择晚于开始的结束时间
      statu = false;
      return statu;
    }

    if (start_day > end_day) {
      toast(i18n_t("results.late_time")); //请选择早于结束的开始时间
      statu = false;
      return statu;
    }

    if (current - start_day > 86400000 * 35) {
      toast(i18n_t("results.max_time")); //最多可以查询近35天的历史比赛
      statu = false;
      return statu;
    }
    return statu;
  };

  /**
   * @description: 自定义提示
   * @param {String} message 提示语
   */
  const toast = (message) => {
    /**清除定时器 */
    clearTimeout(state.timer);
    state.timer = null;
    state.tips = {
      statu: true,
      message: message,
    };
    state.timer = setTimeout(() => {
      state.tips.statu = false;
    }, 2000);
  };

  /**
   * @description: 页码变化
   * @param {Array} tableData 分页组件传过来的值
   */
  const changePage = (v) => {
    state.results_params.page.current = v.current;
      if (state.is_need_request){
        get_results(); //获取表格数据
      }
  }
  /**
   * @description: 去那页
   * @param {Array} tableData 分页组件传过来的值
   */
  const goPageChange = (v) => {
    state.results_params.page.current = v
    get_results();
  }
  /**
   * @description: 每页多少条
   * @param {Array} tableData 分页组件传过来的值
   */
  const pageSizeChange = (v) => {
    state.results_params.page.size = v.value
    get_results();
  }
  /**
   * @description: 日期升降序
   *
   */
  const change_sort = () => {
    state.is_sortUp = !state.is_sortUp;
    state.results_params.orderBy = state.is_sortUp ? 1 : 0;
    get_results();
  };
  /**
   * @description 联赛选择框是否点击了确认
   *  new_ 1确认 0取消
   */
  const isSelectConfirm = (new_) => {
    state.isSelectConfirmed = new_;
    if (new_ == 1) {
      if (!test_time()) {
        return;
      }
    }
  };
  /**
   * 修改当前选中的赛种名字
   */
  const setSport = ({ currentItem, isChampion }) => {
    state.is_highlights = false;
    if (state.results_params.sportType == "1" && state.is_highlights) {
      state.results_params.isPlayBack = 1;
    } else {
      state.results_params.isPlayBack = 0;
    }
    if (isChampion == 1) {
      state.champion_sport = currentItem;
    } else {
      sport.value = currentItem;
      let index = state.sport_type.indexOf(currentItem);
      state.current_sport_id = state.api_sport_type[index].id;
    }
  };
  //生成事件监听
  const { emitters_off } = useMittEmitterGenerator([
    // 球种下拉框更新选中球种
    { type: MITT_TYPES.EMIT_CHANGE_SPORT, callback: setSport },
    // 下拉框选择球种
    { type: MITT_TYPES.EMIT_SElECT_SPORT, callback: choose_sport },
    // 监听是否关闭日期选择器
    { type: MITT_TYPES.EMIT_STARTTIME_SHOWFUNC, callback: startTimeShowFunc },
  ]);
  onUnmounted(emitters_off);
  //赛果页面比分展示为 “-”说明
  const click_popup = () => {
    state.is_show = true;
  };
  //移出说明图标
  const img_mouseleave = () => {
    state.is_show = false;
  };
  return {
    ...toRefs(state),
    sport,
    get_serverTime,
    test,
    startTimeShowFunc,
    isSelectConfirm,
    ipt_search,
    changePage,
    goPageChange,
    pageSizeChange,
    input_radio,
    sub_search,
    hideSelect,
    input_focus,
    input_blur,
    champion_sport_type_filter,
    select_submit,
    search_hot,
    highlights_input_radio,
    change_sort,
    get_tr_detail,
    click_popup,
    img_mouseleave
  };
};
