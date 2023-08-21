<!--
 * @
 * @Author: 
 * @Date: 2023-08-09 17:14:23
 * @Description: 赛果
-->
<template>
  <div class="wrap match_results">
    <!-- 视频画中画组件 -->
    <moveVideo></moveVideo>
    <p class="font_match_results">1</p>
    <simple-header @refresh="sub_search" :data_loaded="refresh_finish">
      <!-- 赛果 -->
      <span>{{ $root.$t("common.amidithion") }}</span>
    </simple-header>

    <!-- 中间内容 S-->
    <div class="main_wrap">
      <!-- 筛选条件 S-->
    <result-header></result-header>
      <!-- 筛选条件 E-->

      <!-- 各球类赛果表格 S-->
      <results
        :sportType="sport_id"
        :load_data_state="load_data_state"
        :details_load="details_load"
        :results_list="results_list"
        :results_order_list="results_order_list"
        :results_playback_list="results_playback_list"
        :is_sortUp="is_sortUp"
        :activeIndex="activeIndex"
        @get_tr_detail="get_tr_detail"
        @change_sort="change_sort"
        @change_playback_type="change_playback_type"
        versions="yabo"
        ref="result_ref"
      />
      <!-- 各球类赛果表格 E-->
    </div>
    <!-- 中间内容 E-->

    <!-- 底部分页条 S-->
    <div
      class="table-footer"
      v-if="results_data.total && load_data_state != 'empty'"
    >
      <Pagination
        :count="results_data.total"
        @pageChange="changePage(arguments)"
        :is_bet_record="false"
        :results_table="results_table_style"
        :reset_pagination="reset_pagination"
      ></Pagination>
    </div>
    <!-- 底部分页条 E-->
    <div class="tips" v-if="tips.statu">{{ tips.message }}</div>
  </div>
</template>

<script>
import results from "src/public/components/results/index.vue";
import simple_header from "src/project/yabo/components/site_header/simple_header";
import Pagination from "src/project/yabo/components/bet_record/Pagination";
import y_select from "src/public/components/select/y_select";
import normalSelect from "src/public/components/select/normal_select.vue";
import normalSelect2 from "src/public/components/select/normal_select.vue";
import Calendar from "src/project/yabo/components/bet_record/calendar.vue";
import formartmixin from "src/public/mixins/common/time_format";
import { api_common, api_results } from "src/public/api/index";
import fliter_checkbox from "src/project/yabo/components/match_list/filter_checkbox.vue";
import moveVideo from "project_path/src/components/video-replay/move_video.vue";
import resultHeader from './components/result-header.vue'
import { mapGetters } from "vuex";

export default {
  mixins: [formartmixin],
  components: {
    resultHeader,
    moveVideo,
    Calendar,
    Pagination,
    "simple-header": simple_header,
    results,
    "fliter-checkbox": fliter_checkbox,
    "y-select": y_select,
    "normal-select": normalSelect,
    "normal-select2": normalSelect2,
  },
  data() {
    return {
      model: {
        from: new Date(new Date() - 86400000).Format("yyyy/MM/dd"),
        to: new Date().Format("yyyy/MM/dd"),
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
      sport: null, //体育下拉框选中项
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
        hot: "", //是否热门
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
        days: this.$root.$t("time.time_date_week"),
        daysShort: this.$root.$t("time.time_date_week"),
        months: [
          this.$root.$t("time.month_1"),
          this.$root.$t("time.month_2"),
          this.$root.$t("time.month_3"),
          this.$root.$t("time.month_4"),
          this.$root.$t("time.month_5"),
          this.$root.$t("time.month_6"),
          this.$root.$t("time.month_7"),
          this.$root.$t("time.month_8"),
          this.$root.$t("time.month_9"),
          this.$root.$t("time.month_10"),
          this.$root.$t("time.month_11"),
          this.$root.$t("time.month_12"),
        ],
        monthsShort: [
          this.$root.$t("time.month_1"),
          this.$root.$t("time.month_2"),
          this.$root.$t("time.month_3"),
          this.$root.$t("time.month_4"),
          this.$root.$t("time.month_5"),
          this.$root.$t("time.month_6"),
          this.$root.$t("time.month_7"),
          this.$root.$t("time.month_8"),
          this.$root.$t("time.month_9"),
          this.$root.$t("time.month_10"),
          this.$root.$t("time.month_11"),
          this.$root.$t("time.month_12"),
        ],
        // 每周的第一天
        firstDayOfWeek: 7,
      },
      timeChanged: false, // 两次请求联赛列表时间区间是否有变
      hasSelectedMatch: " ", // 当前是否有选中联赛
      hotIsNull: false, // 热门联赛列表是否为空
      paramsVideo: {}, //精彩回放参数
    };
  },
  watch: {
    model: {
      handler(n) {
        if (n) {
          this.startTimeShow = false;
          // 判断是单日期还是范围日期
          if (n.from) {
            this.showDate(n.from, n.to);
          } else {
            this.showDate(n, n);
          }
        }
      },
    },
    get_global_click() {
      this.hideSelect();
    },
  },
  methods: {
    /**
     * 隐藏日期选择组件
     */
    hideSelect() {
      this.startTimeShow = false;
    },
    // 隐藏冠军赛种输入框内文字
    input_focus() {
      document
        .querySelector(".ball-games")
        .querySelector(".q-field__native")
        .querySelector("span").style.visibility = "hidden";
    },
    // 显示冠军赛种输入框内文字
    input_blur() {
      document
        .querySelector(".ball-games")
        .querySelector(".q-field__native")
        .querySelector("span").style.visibility = "visible";
    },
    // 冠军赛种下拉框内容筛选
    champion_sport_type_filter(val, update) {
      update(() => {
        if (val === "") {
          this.filterOptions = this.champion_sport_type;
        } else {
          const needle = val.toLowerCase();
          this.filterOptions = this.champion_sport_type.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    /**
     * @description: 获取服务器时间
     */
    get_serverTime() {
      api_common.get_server_time().then((res) => {
        let code = _.get(res, "data.code");
        if (code == 200) {
          this.day_time =
            parseInt(_.get(res, "data.data")) - 1000 * 60 * 60 * 24;
          this._date = new Date(this.day_time);
          this.year = this._date.getFullYear();
          this.mouth = this._date.getMonth() + 1;
          this.day = this._date.getDate();
          this.showDate(null, null);
          this.get_sportType(); //获取球种
        } else {
          this.load_data_state = "empty";
        }
      });
    },
    /**
     * 计算要展示的时间，越南语格式单独区分
     * @param start 开始时间
     * @param end 结束时间
     */
    showDate(start, end) {
      let _start = start || this.format_day(this._date.getTime());
      let _end =
        end || this.format_day(this._date.getTime() + 1000 * 60 * 60 * 24);
      // 越南语时间格式和其他语言不同
      if (["vi", "th", "en", "ms", "ad"].includes(this.lang)) {
        // 初始化时直接使用服务器时间计算的值
        // 非初始化时需要格式化
        if (start && end) {
          // 范围日期
          if (this.model.from) {
            this.model.from = _start;
            this.model.to = _end;
          } else {
            // 单天
            this.startDateSearch = this.formatTime(
              new Date(this.model).getTime(),
              "yyyy/mm/dd"
            );
            this.endDateSearch = this.formatTime(
              new Date(this.model).getTime(),
              "yyyy/mm/dd"
            );
            this.showSelectTime = `${this.formatTime(
              new Date(this.model).getTime(),
              "dd/mm/yyyy"
            )} - ${this.formatTime(
              new Date(this.model).getTime(),
              "dd/mm/yyyy"
            )}`;
            return;
          }
        } else {
          if (this.model.from) {
            this.model.from = this.formatTime(
              new Date(_start).getTime(),
              "yyyy/mm/dd"
            );
            this.model.to = this.formatTime(
              new Date(_end).getTime(),
              "yyyy/mm/dd"
            );
          }
        }
        this.startDateSearch = this.formatTime(
          new Date(_start).getTime(),
          "yyyy/mm/dd"
        );
        this.endDateSearch = this.formatTime(
          new Date(_end).getTime(),
          "yyyy/mm/dd"
        );
        this.showSelectTime = `${this.formatTime(
          new Date(_start).getTime(),
          "dd/mm/yyyy"
        )} - ${this.formatTime(new Date(_end).getTime(), "dd/mm/yyyy")}`;
      } else {
        this.startDateSearch = _start;
        this.endDateSearch = _end;
        // 判断是单日期还是范围日期
        if (this.model.from) {
          this.model.from = _start;
          this.model.to = _end;
          this.showSelectTime = `${_start} - ${_end}`;
        } else {
          this.showSelectTime = `${this.model} - ${this.model}`;
        }
      }
    },
    /**
     * @description: 获取球种
     */
    get_sportType() {
      let params = {
        langType: "zh", //默认zh
      };
      api_results
        .get_sportType(params)
        .then((res) => {
          const code = _.get(res, "data.code");
          const data = _.get(res, "data.data");
          if (code === 200 && data.length) {
            //当前只展示 足篮网羽斯乒
            for (var i = 0; i < data.length; i++) {
              // 加上 虚拟足球[1001] 虚拟赛狗[1002] 虚拟赛马 [1011] 20210428 by Echo
              // 18-娱乐,28-高尔夫,29-自行车,33-赛车运动
              if (
                [
                  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                  1001, 1004, 1002, 1011, 1010, 1009, 18, 28, 29, 33,
                ].includes(data[i].id * 1) ||
                this.$utils.is_eports_csid(data[i].id * 1)
              ) {
                // 18-娱乐,28-高尔夫,29-自行车,33-赛车运动
                if ([18, 28, 29, 33].includes(data[i].id * 1)) {
                  this.sport_type.push(""); //撑住位置,保证数据长度不变
                } else {
                  this.sport_type.push(data[i].name);
                }
                // 冠军球种剔除【冠军】选项,增加[全部球种],剔除虚拟赛种
                if (
                  ![0, 1001, 1002, 1004, 1011, 1010, 1009].includes(
                    data[i].id * 1
                  ) &&
                  !this.$utils.is_eports_csid(data[i].id * 1)
                ) {
                  this.champion_sport_type.push(data[i].name);
                }
                data[i].label = data[i].name;
              } else {
                data.splice(i, 1);
                i--;
              }
            }
            // 添加【全部】选项
            this.champion_sport_type.unshift(this.$root.$t("select.all"));
            this.api_sport_type = data;
            const _name = this.$root.$t("select.all");
            // 如果求种id存在，则显示对应的求种id
            if (this.sport_id) {
              let sport_obj = _.find(data, (item) => item.id == this.sport_id);
              this.sport = sport_obj.name;
              this.champion_sport = _name;
              // 冠军赛种默认查询全部赛种
              if (this.sport_id == "0") {
                this.pournament_params.sportType = "";
                this.results_params.sportType = "";
              } else {
                this.pournament_params.sportType = this.sport_id;
                this.results_params.sportType = this.sport_id;
              }
            } else {
              this.sport = data[0].name;
              this.champion_sport = data[data.length - 1].name;
              // 冠军赛种默认查询全部赛种
              if (this.champion_sport == _name) {
                this.pournament_params.sportType = "";
                this.results_params.sportType = "";
              } else {
                this.pournament_params.sportType = data[0].id;
                this.results_params.sportType = data[0].id;
              }
            }
            //获取联赛数据
            this.get_pournament();
          } else {
            this.load_data_state = "empty";
          }
        })
        .catch((err) => {
          // 接口报错时页面展示为空
          this.load_data_state = "empty";
        });
    },

    /**
     * @description: 获取联赛数据
     */
    /**
     * @description: 获取联赛列表
     * @param {*} type 1 切换球种 0 联赛下拉框内的【热门】选项被勾选 2联赛下拉框展开时
     * @return {*}
     */
    get_pournament(type) {
      // 判断两次请求之间，选择的时间范围是否有变化
      if (
        this.pournament_params.startTime !=
          new Date(this.startDateSearch).getTime() ||
        this.pournament_params.endTime !=
          new Date(`${this.endDateSearch} 23:59:59`).getTime()
      ) {
        this.timeChanged = true;
      } else {
        this.timeChanged = false;
      }
      this.pournament_params.startTime = new Date(
        this.startDateSearch
      ).getTime();
      this.pournament_params.endTime = new Date(
        `${this.endDateSearch} 23:59:59`
      ).getTime();
      this.pournament_params.runningBar = this.is_bowls ? "1" : "0";
      this.pournament_params.champion = this.current_sport_id == "0" ? 1 : 0;
      this.league_type = [];
      if (!this.test_time()) {
        this.cancel = new Date().getTime();
        return;
      }
      api_results
        .post_results_pournament(this.pournament_params)
        .then((res) => {
          const code = _.get(res, "data.code");
          const data = _.get(res, "data.data");
          // 从链接获取联赛 id
          let { tid } = this.$route.query;
          if (code == 200 && data.length) {
            data.sort((a, b) => {
              return a.tournamentName.localeCompare(b.tournamentName, "zh");
            });
            let ids = "";
            data.forEach((item) => {
              // 如果参数存在并且不是在切换球种，获取联赛id并设置联赛名称
              if (tid && type != 1) {
                if (tid == item.id) {
                  this.league = item.tournamentName;
                  this.results_params.tournamentId = item.id;
                }
              }
              this.league_type.push(item.tournamentName);
              ids += `${item.id},`;
            });
            // 如果是由联赛框触发的就不处理
            if (type != 2) {
              this.results_params.tournamentId = ids.substr(0, ids.length - 1);
            }
          } else {
            // 如果请求的是 热门 并且没有数据
            if (this.pournament_params.hot == 1 && data.length == 0) {
              this.hotIsNull = true;
            }
            this.results_params.tournamentId = "";
            // 如果联赛查询结果为空就置空当前联赛列表
            if (this.pournament_params.nameStr && data.length == 0) {
              this.api_league_type = data;
              return;
            }
          }
          this.api_league_type = data;
          if (this.init && (!tid || type == 1)) {
            this.get_results(); //获取表格数据
            this.init = false;
          } else {
            // 联赛下拉框点【取消】的时候赛果列表继续展示 暂无数据
            if (this.isSelectConfirmed != 0) {
              this.load_data_state = "empty";
            }
          }
        });
    },

    /**
     * @description: 获取表格数据
     */
    get_results() {
      // 赛果输入框点击确认的时候，如果联赛列表查询为空则不处理，并且把当前赛果列表置空
      if (this.pournament_params.nameStr && this.api_league_type.length == 0) {
        this.load_data_state = "empty";
        return;
      }
      this.load_data_state = "loading";
      this.activeIndex = -1;
      // 如果当前体育下拉框选中项为【冠军】，赛果列表就要用冠军模板
      if (this.current_sport_id == "0") {
        this.sport_id = "0";
      } else {
        this.sport_id = this.results_params.sportType;
      }
      this.results_params.startTime = new Date(this.startDateSearch).getTime();
      this.results_params.endTime = new Date(
        `${this.endDateSearch} 23:59:59`
      ).getTime();
      // 虚拟赛事需要加上该参数
      if (
        ["1001", "1002", "1011", "1004", "1010", "1009"].includes(
          this.results_params.sportType
        )
      ) {
        this.results_params.isVirtualSport = 1;
      } else {
        this.results_params.isVirtualSport = "";
      }
      // 判断是否是冠军赛事
      this.results_params.champion = this.sport_id == "0" ? 1 : 0;
      // 第一次加载的时候通过参数进行查找
      if (this.is_first_load) {
        this.is_first_load = false;
        // 通过链接获取主客队名字
        let { homeName, awayName, lang } = this.$route.query;
        if (!_.isEmpty(homeName) && !_.isEmpty(awayName) && this.lang == lang) {
          this.results_params.matchNameStr = `${homeName} VS ${awayName}`;
        }
      }
      this.results_params.matchNameStr =
        this.results_params.matchNameStr.trim();
      // 判断是否是电竞
      if (this.$utils.is_eports_csid(this.sport_id)) {
        this.results_params.isESport = "1";
      } else {
        this.results_params.isESport = "";
      }
      if (!this.league_type.length) {
        this.league_type = [this.$root.$t("common.all")];
        this.league = this.$root.$t("common.all");
      }
      api_results.post_results_list(this.results_params).then((res) => {
        const code = _.get(res, "data.code");
        const data = _.get(res, "data.data");
        this.refresh_finish = true;

        if (code === 200 && data.records.length) {
          var results = data.records;
          this.load_data_state = "data";
          // 虚拟赛事不需要格式化  虚拟足球 篮球除外
          if (
            !["1002", "1011", "1010", "1004", "1001"].includes(
              results[0].sportId
            ) &&
            this.current_sport_id != "0"
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
          this.results_data = data;
          this.results_list = results;

          // 展开定位到的赛事
          this.$nextTick(() => {
            let { matchId } = this.$route.query;
            // 展开具体的联赛
            if (matchId) {
              let index = _.findIndex(
                results,
                (item) => item.tournamentName == this.league
              );
              this.get_tr_detail([this.$route.query, index]);
            }
          });
          // this.league_type = Array.from(new Set(tournament));
        } else {
          this.results_data = [];
          this.results_list = {};
          this.load_data_state = "empty";
        }
      });
    },

    /**
     * @description: 获取点击行赛事的投注项赛果详情
     * @param {Array} data 球种模板传过来的值
     */
    get_tr_detail(data) {
      this.details_load = "loading";
      let item = data[0];
      let index = data[1];
      let params = {
        langType: "zh", //默认zs
        matchId: item.matchId, //赛事id
        homeName: item.homeName, //主队名
        awayName: item.awayName, //客队名
      };
      // 赛事回放参数
      this.paramsVideo = {
        device: "PC",
        mid: item.matchId, //赛事id
        eventCode: 0,
      };
      // 如果当前是电竞,就增加对应的请求参数
      if (this.$utils.is_eports_csid(this.current_sport_id)) {
        params.isESport = "1";
      }
      // 清空上一次的请求结果
      this.results_order_list = [];
      // 清空上一次的精彩回放详情请求结果
      this.results_playback_list = [];
      // 取消赛果列表里上一次展开的那一项
      if (this.activeIndex == index) {
        this.activeIndex = -1;
      } else {
        // 展开新的赛果项
        this.activeIndex = index;
        api_results
          .post_results_order(params)
          .then((res) => {
            const code = _.get(res, "data.code");
            const data = _.get(res, "data.data");
            if (code === 200 && data.length) {
              data.forEach((item) => {
                if (item.posrList) {
                  /**
                   * @只展示 走水、赢、赢半、输半的盘口
                   * 2-走水  3-输 4-赢 5-赢一半 6-输一半 7-赛事取消 8-赛事延期 11-比赛延迟 12-比赛中断 13-未知 15-比赛放弃 16-异常盘口
                   */
                  for (var i = 0; i < item.posrList.length; i++) {
                    if (
                      !["2", "4", "5", "6"].includes(
                        item.posrList[i].scoreResult
                      )
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
                  if ([367, 368, 369].includes(+item.playId)) {
                    item.posrList = this.sort_plays_data(
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
              if (this.$utils.is_eports_csid(this.current_sport_id)) {
                // 判断赛果详情里是否有空数据
                let notEmpty = data.some((i) => i.posrList.length > 0);
                if (!notEmpty) {
                  this.details_load = "empty";
                  this.results_order_list = [];
                } else {
                  this.results_order_list = data;
                  this.details_load = "data";
                }
              } else {
                // 常规赛种的赛果直接展示
                this.results_order_list = data;
                this.details_load = "data";
              }
            } else {
              this.details_load = "empty";
            }
          })
          .catch((err) => {
            this.details_load = "empty";
          });
        this.$refs.result_ref.change_current_events_type();
        this.change_playback_type();
      }
    },
    /**
     * @description: 获取点击当前tab的精彩回放视频数据
     * @param {Array} data 足球种模板当前tab切换的值
     */
    change_playback_type(data = {}) {
      if (data && data.code) {
        this.paramsVideo.eventCode = data.code - 0;
      }

      api_results
        .post_playback_video_url(this.paramsVideo)
        .then((res) => {
          const code = _.get(res, "data.code");
          const data = _.get(res, "data.data");
          if (code === 200 && data) {
            if (data.eventList && data.eventList.length) {
              this.results_playback_list = data.eventList;
            } else {
              this.results_playback_list = [];
            }
            this.results_playback_list.sort((a, b) => {
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
            this.results_playback_list;
          }
        })
        .catch((err) => {});
    },
    /**
     * @description:排序赛果
     * @param {Array} plays 玩法下的赛果集合
     * @param {Array} default_obj 默认赛果
     */
    sort_plays_data(plays, default_obj) {
      let cur_score = [];
      let { left_data, right_data } = this.assort_data(plays);
      let max_length = Math.max(left_data.length, right_data.length);
      for (let i = 0; i < max_length; i++) {
        cur_score.push(
          left_data[i] || Object.freeze({ ...default_obj }),
          right_data[i] || Object.freeze({ ...default_obj })
        );
      }
      return cur_score;
    },
    /**
     * @description:(分割:主,客,平,其他) 再合并左右两列
     * @param {Array} list 玩法下的赛果集合
     */
    assort_data(plays) {
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
          ...this.sort_score(main_win),
          ...this.sort_score(flat, 2),
          ...other,
        ],
        right_data: this.sort_score(guest_win, 1),
      };
    },
    /**
     * @description: 比分排序
     * @param {Array} list 主,客,平,其他，下的赛果集合
     * @param {Number} type (1:客胜,2:平局,默认主胜)
     */
    sort_score(list, type) {
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
    },
    /**
     * @description: 下拉框选择球种
     * @param {n} 0 体育下拉框 1 冠军球种
     */
    choose_sport(n = 0) {
      // 如果查询的时间不在支持查询的时间区间内
      if (!this.test_time()) {
        return;
      }
      // 重置分页组件
      this.reset_pagination = Math.random();
      // 切换球种时让联赛选择框清除选中热门
      this.$root.$emit("init_select", 1);
      this.results_params.matchNameStr = "";
      this.results_params.tournamentId = "";
      let index;
      let id,
        _name = this.$root.$t("select.all"); // 全部
      // 0体育下拉框 1冠军球种下拉框
      if (n == 0) {
        index = this.sport_type.indexOf(this.sport);
        // 记录体育下拉框当前的选项 id
        this.current_sport_id = this.api_sport_type[index].id;
        // 如果当前体育下拉框选项为冠军，就用冠军球种 id 去查询
        if (index == this.sport_type.length - 1) {
          index = this.champion_sport_type.indexOf(this.champion_sport);
        }
        // 当前选中的球种为冠军且为冠军球种的【全部】时，id 传空查询全部冠军球种，否则传对应 id
        if (
          this.champion_sport == _name &&
          index == this.champion_sport_type.indexOf(this.champion_sport) &&
          this.current_sport_id == "0"
        ) {
          id = "";
        } else {
          id = this.api_sport_type[index].id;
        }
      } else {
        // 如果当前冠军赛种下拉框的选项是 全部
        if (this.champion_sport == _name) {
          index = this.champion_sport_type.indexOf(this.champion_sport);
        } else {
          index = this.sport_type.indexOf(this.champion_sport);
        }
        // 当前选中的球种为冠军且为冠军球种的【全部】时，id 传空查询全部冠军球种，否则传对应 id
        if (
          this.champion_sport == _name &&
          index == this.champion_sport_type.indexOf(this.champion_sport) &&
          this.current_sport_id == "0"
        ) {
          id = "";
        } else {
          // 找到菜单对象,获取里面的id值
          id = _.get(
            _.find(this.api_sport_type, { name: this.champion_sport }),
            "id"
          );
        }
      }
      this.pournament_params.sportType = id;
      // 清空参数
      this.pournament_params.tournamentId = "";
      // 初始化联赛筛选框的参数
      this.pournament_params.nameStr = "";
      this.pournament_params.hot = 0;

      // 合并请求参数
      Object.assign(this.results_params, {
        sportType: id,
        tournamentId: "",
        champion: this.current_sport_id == "0" ? 1 : 0,
        page: {
          current: 1,
          size: 50,
        },
      });
      this.page_random = Math.random();
      this.league_type = [this.$root.$t("common.all")]; // 全部
      this.league = this.$root.$t("common.all"); // 全部
      //重置筛选条件
      this.pournament_params.tournamentId = "";
      this.pournament_params.nameStr = "";
      this.init = true; //查询赛事
      this.get_pournament(1); //联动调取联赛数据
    },

    /**
     * @description: 下拉框选择联赛
     * 选择联赛之后，调用赛果接口查询已选联赛的赛事
     */
    select_submit(data) {
      // 选择联赛的时候也要检查时间
      if (!this.test_time()) {
        return;
      }
      this.hasSelectedMatch = data.ids;
      // 如果没有选中的联赛，或者当前联赛列表选中的是热门并且联赛列表为空就不处理，并且在空白的赛果列表处展示暂无数据
      if (data.ids == "" || (this.hotIsNull && data.ids == "")) {
        this.load_data_state = "empty";
        return;
      }
      // 已选中的联赛 id
      this.results_params.tournamentId = data.ids.join(",");
      this.pournament_params.hot = data.isHot;
      Object.assign(this.results_params, {
        page: {
          current: 1,
          size: 50,
        },
      });
      this.get_results();
    },
    /**
     * @description: 热门筛选
     * @param {}
     * @return {}
     */
    search_hot(data) {
      this.pournament_params.hot = data;
      this.get_pournament(0);
    },

    /**
     * @description: 模糊搜索
     * @param {String} data 输入框的值
     */
    ipt_search(data) {
      this.pournament_params.nameStr = data[0];
      this.pournament_params.hot = data[1];
      this.get_pournament(2);
    },
    /**
     * @description: 开始日期选择
     */
    startTimeShowFunc(type) {
      this.$root.$emit("show_select");
      // 体育下拉框展开时判断日期选择框是否展开
      if (type == "close") {
        if (this.startTimeShow == true) {
          this.startTimeShow = false;
          return;
        } else {
          return;
        }
      }
      this.startTimeShow = !this.startTimeShow;
      if (this.startTimeShow == true) {
        this.$root.$emit("hideSportSelect", "close");
      }
    },
    /**
     * @description: 开始日期改变
     */
    startchange(val) {
      this.startDateSearch = val;
      this.showDate(val, this.endDateSearch);
    },

    /**
     * @description: 结束日期改变
     */
    endchange(val) {
      this.endDateSearch = val;
      this.showDate(this.startDateSearch, val);
    },

    /**
     * @description: 勾选滚球
     *
     */
    input_radio() {
      // 勾选滚球时隐藏联赛下拉框
      this.cancel = new Date().getTime();
      this.is_bowls = !this.is_bowls;
      this.results_params.runningBar = this.is_bowls ? "1" : "0";
      this.change_runninBar = !this.change_runninBar;
    },

    /**
     * @description: 勾选精彩回放
     *
     */
    highlights_input_radio() {
      // 勾选精彩回放时
      // this.cancel = new Date().getTime();
      this.is_highlights = !this.is_highlights;
      this.results_params.isPlayBack = this.is_highlights ? 1 : 0;
      // this.is_highlights = !this.is_highlights;
    },

    /**
     * @description: 搜索
     */
    sub_search() {
      this.cancel = new Date().getTime();
      if (!this.test_time()) {
        return;
      }
      // 如果没有已选中联赛就不发起请求，并且展示暂无数据
      if (!this.hasSelectedMatch.length) {
        this.load_data_state = "empty";
        return;
      }
      let is_change =
        new Date(this.startDateSearch).getTime() !=
          this.pournament_params.startTime ||
        new Date(`${this.endDateSearch} 23:59:59`).getTime() !=
          this.pournament_params.endTime ||
        this.change_runninBar;
      if (this.results_params.sportType == "1" && this.is_highlights) {
        this.results_params.isPlayBack = 1;
      } else {
        this.results_params.isPlayBack = 0;
      }
      if (is_change) {
        Object.assign(this.results_params, {
          page: {
            current: 1,
            size: 50,
          },
        });

        this.init = true;
        this.get_pournament();
        this.change_runninBar = false;
        this.reset_pagination = Math.random();
      } else {
        if (this.page_random != this.pre_random) {
          this.reset_pagination = Math.random();
          this.pre_random = this.page_random;
        }
        this.get_results();
      }
    },

    /**
     * @description: 检查所选时间是否在符合条件的范围内
     */
    test_time() {
      let statu = true;
      const start_day = new Date(`${this.startDateSearch} 00:00:00`).getTime(); //开始时间
      const end_day = new Date(`${this.endDateSearch} 23:59:59`).getTime(); //结束时间
      const current = new Date(
        `${this.year}/${this.mouth}/${this.day}`
      ).getTime(); //当时间

      if (end_day - start_day > 86400000 * 7) {
        this.toast(this.$root.$t("results.error_time")); //日期区间最多跨度为7天
        statu = false;
        return statu;
      }

      if (end_day < start_day) {
        this.toast(this.$root.$t("results.early_time")); //请选择晚于开始的结束时间
        statu = false;
        return statu;
      }

      if (start_day > end_day) {
        this.toast(this.$root.$t("results.late_time")); //请选择早于结束的开始时间
        statu = false;
        return statu;
      }

      if (current - start_day > 86400000 * 35) {
        this.toast(this.$root.$t("results.max_time")); //最多可以查询近35天的历史比赛
        statu = false;
        return statu;
      }
      return statu;
    },

    /**
     * @description: 自定义提示
     * @param {String} message 提示语
     */
    toast(message) {
      /**清除定时器 */
      clearTimeout(this.timer);
      this.timer = null;
      this.tips = {
        statu: true,
        message: message,
      };
      this.timer = setTimeout(() => {
        this.tips.statu = false;
      }, 2000);
    },

    /**
     * @description: 翻页
     * @param {Array} tableData 分页组件传过来的值
     */
    changePage(tableData) {
      this.results_params.page = {
        size: tableData[0], //每页条数
        current: tableData[2], //当前页码
      };
      this.get_results();
    },

    /**
     * @description: 日期升降序
     *
     */
    change_sort() {
      this.is_sortUp = !this.is_sortUp;
      this.results_params.orderBy = this.is_sortUp ? 1 : 0;
      this.get_results();
    },
    /**
     * @description 联赛选择框是否点击了确认
     *  new_ 1确认 0取消
     */
    isSelectConfirm(new_) {
      this.isSelectConfirmed = new_;
      if (new_ == 1) {
        if (!this.test_time()) {
          return;
        }
      }
    },
    /**
     * 修改当前选中的赛种名字
     */
    setSport({ currentItem, isChampion }) {
      this.is_highlights = false;
      if (this.results_params.sportType == "1" && this.is_highlights) {
        this.results_params.isPlayBack = 1;
      } else {
        this.results_params.isPlayBack = 0;
      }
      if (isChampion == 1) {
        this.champion_sport = currentItem;
      } else {
        this.sport = currentItem;
        let index = this.sport_type.indexOf(currentItem);
        this.current_sport_id = this.api_sport_type[index].id;
      }
    },
    //赛果页面比分展示为 “-”说明
    click_popup() {
      this.is_show = true;
    },
    //移出说明图标
    img_mouseleave() {
      this.is_show = false;
    },
  },
  computed: {
    ...mapGetters({
      lang: "get_lang",
      // 全局点击事件
      get_global_click: "get_global_click",
      vx_get_user: "get_user",
    }),
    show_play_back() {
      return !!(
        this.vx_get_user.merchantEventSwitchVO &&
        this.vx_get_user.merchantEventSwitchVO.eventSwitch
      );
    },
  },
  created() {
    // 从链接获取参数
    let { csid, matchEnd } = this.$route.query;
    // 球种
    if (csid) {
      this.sport_id = csid;
    }
    // 是否选中滚球 matchEnd: false 选中滚球
    if (!_.isUndefined(matchEnd) && !JSON.parse(matchEnd)) {
      this.input_radio();
    }
    this.is_first_load = true;
    this.get_serverTime(); //获取服务器时间
    // 球种下拉框更新选中球种
    this.$root.$on("change-sport", this.setSport);
    // 下拉框选择球种
    this.$root.$on("select-sport", this.choose_sport);
    // 监听是否关闭日期选择器
    this.$root.$on("startTimeShowFunc", this.startTimeShowFunc);
  },
  beforeUnmount() {
    this.$root.$off("change-sport", this.setSport);
    this.$root.$off("select-sport", this.choose_sport);
    this.$root.$off("startTimeShowFunc", this.startTimeShowFunc);
    /**清除定时器 */
    clearTimeout(this.timer);
    this.timer = null;
    this.results_checkbox_style = null;
    this.results_table_style = null;
    this.sport_type = null;
    this.sport = null;
    this.api_sport_type = null;
    this.league_type = null;
    this.league = null;
    this.results_data = null;
    this.results_list = null;
    this.results_params = null;
    this.pournament_params = null;
    this.results_order_list = null;
    this.results_playback_list = null;
    this.tips = null;
    this.champion_sport_type = null;
    this.champion_sport = null;
    this.filterOptions = null;
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url("~public/lib/font/roboto/v20/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2")
    format("woff2");
}
@import './index.scss'
</style>

<style lang="scss" >
 div.q-menu {
  border: 0 none !important;
}

div.select-item {
  border-left: 1px solid rgb(208, 216, 222);
  border-right: 1px solid rgb(208, 216, 222);

  &:first-child {
    border-top: 1px solid rgb(208, 216, 222);
  }

  &:last-child {
    border-bottom: 1px solid rgb(208, 216, 222);
  }
}
</style>