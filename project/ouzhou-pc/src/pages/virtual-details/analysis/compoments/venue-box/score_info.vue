<!--
 * @Author: cooper
 * @Date: 2023-07-07 17:13:55
 * @Description: 赛事分析页赛事比分
-->
<template>
  <div class="box-bc">
    <q-table
      :rows="data"
      separator="none"
      :columns="columns"
      row-key="name"
      hide-pagination
      :no-data-label="i18n_t('match_info.no_score_data')"
      :table-header-style="{
        backgroundColor: '#F1F1F1',
        height: '28px',
        color: '#8A8986',
        fontSize: '13px',
        fontWeight: 500,
      }"
    >
      <!-- 头部插槽 足球用 -->
      <template v-slot:header="props">
        <q-tr :props="props" style="background-color: #f5f5f5">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <div>
              <div v-if="!col.icon">
                <span
                  v-if="col.field !== 'name'"
                  :class="
                    course === col.label || course === col.course
                      ? 'heightLight'
                      : ''
                  "
                  :style="{
                    'line-height': '30px',
                    color: ['p', 't'].includes(col.field)
                      ? '#ff7000'
                      : '#8A8986',
                  }"
                >
                  {{ col.language ? i18n_t(col.language) : col.label }}
                </span>
                <div
                  v-else
                  style="color: #8a8986; display: flex; align-items: center"
                >
                  <!-- 倒/正计时组件 -->
                  <div style="margin-right: 25px">
                    <match-process
                      :match="detail_info"
                      show_page="match-list"
                      :rows="1"
                    />
                  </div>
                  <img
                    :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/neutral.png`"
                    alt=""
                    srcset=""
                    style="margin: 0 10px; height: 14px"
                    v-if="detail_info.mng"
                  />
                </div>
              </div>

              <div v-else>
                <img :src="get_icon(col.icon)" alt="" class="top-icon" />
                <q-tooltip v-if="col.tooltip">
                  {{ col.tooltip }}
                </q-tooltip>
              </div>
            </div>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            <span
              class="table-name"
              :class="{
                [`csid_${lodash.get(detail_info, 'csid')}`]: true,
              }"
            >
              <!-- 发球方小圆点 -->
              <span
                class="round"
                v-if="
                  lodash.get(detail_info, 'mmp') != 0 &&
                  lodash.get(detail_info, 'csid') != '4' &&
                  ((lodash.get(detail_info, 'mat') == 'away' &&
                    props.rowIndex === 1) ||
                    (lodash.get(detail_info, 'mat') == 'home' &&
                      props.rowIndex === 0))
                "
              >
              </span>
              <span v-else style="margin-right: 6px"></span>
              <span class="txt">{{ props.row.name }}</span>
            </span>
          </q-td>
          <q-td key="q1" :props="props">
            <span
              :class="[course === props.cols[1]?.course ? 'heightLight' : '']"
              >{{ props.row.q1 }}</span
            >
          </q-td>
          <q-td key="q2" :props="props">
            <span
              :class="[course === props.cols[2]?.course ? 'heightLight' : '']"
              >{{ props.row.q2 }}</span
            >
          </q-td>
          <q-td key="ht" :props="props">
            <span :class="[course === 'HT' ? 'heightLight' : '']">{{
              props.row.ht
            }}</span>
          </q-td>
          <q-td key="q3" :props="props">
            <span
              :class="[
                course === props.cols[csid == 2 ? 4 : 3]?.course
                  ? 'heightLight'
                  : '',
              ]"
              >{{ props.row.q3 }}</span
            >
          </q-td>
          <q-td key="q4" :props="props">
            <span
              :class="[
                course === props.cols[csid == 2 ? 5 : 4]?.course
                  ? 'heightLight'
                  : '',
              ]"
              >{{ props.row.q4 }}</span
            >
          </q-td>
          <q-td key="q5" :props="props">
            <span
              :class="[
                course === props.cols[csid == 2 ? 6 : 5]?.course
                  ? 'heightLight'
                  : '',
              ]"
              >{{ props.row.q5 }}</span
            >
          </q-td>
          <!--新增加时赛比分和点球大战比分 end-->
          <q-td key="set" :props="props">
            <span>{{ props.row.set }}</span>
          </q-td>
          <q-td key="t" :props="props">
            <span style="font-weight: 500; color: #ff7000">{{
              props.row.t
            }}</span>
          </q-td>
          <q-td key="p" :props="props">
            <span style="font-weight: 500; color: #ff7000">{{
              props.row.p
            }}</span>
          </q-td>
          <!--新增加时赛比分和点球大战比分 start-->
          <q-td key="x" :props="props">
            <span :class="[course === 'x' ? 'heightLight' : '']">{{
              props.row.x
            }}</span>
          </q-td>
          <q-td key="y" :props="props">
            <span :class="[course === 'y' ? 'heightLight' : '']">{{
              props.row.y
            }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { sport_columns, socre_dict } from "./score_config";
import {
  i18n_t,
  LOCAL_PROJECT_FILE_PREFIX,
} from "src/output/index.js";
import { MatchProcessFullVersionWapper as matchProcess } from "src/components/match-process/index.js";
import { handle_course_data } from "src/core/utils/matches_list.js";
// import _ from "lodash";
// import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';

const props = defineProps({
  detail_info: {
    // 赛事详情
    type: Object,
    default: () => {},
  },
  score_list: {
    // 赛事详情
    type: Object,
    default: () => {},
  },
});

const data = ref([]);

const padding_value = ref("1px 0px 1px 6px");

const columns = ref([]);

const course = computed(() => {
  return handle_course_data(props.detail_info);
});

const csid = computed(() => {
  return props.detail_info.csid;
});

//   足球篮球
const get_base_data = (val) => {
  const detail_info = props.detail_info;
  const list = [
    { name: detail_info["mhn"], key: "home" },
    { name: detail_info["man"], key: "away" },
  ];
  let res = "";
  if (!lodash.isEmpty(val) && ["1", "2", "3"].includes(String(detail_info.csid))) {
    res = get_score_result(list, val);
  } else {
    //   篮球 赛前无数据
    if (detail_info.csid == 2) {
      res = list.map((item) => {
        return {
          name: item.name,
          q1: "", //
          q2: "", //
          ht: "", //
          q3: "", //
          q4: "", //
          t: "", //
        };
      });
    }
  }
  data.value = res || [];
};

/*
 * 数据：
 * 角球总比分 S5
 * 黄牌总比分 S12
 * 红牌总比分 S11
 * 点球总比分 S10
 * 半场总比分 S2
 * 全场总比分 S1
 * 加时赛比分 S7
 * 点球大战 S170
 * */
const get_score_result = (list, val) => {
  const msc_obj = val.msc_obj;

  let result = [];
  const detail_info = props.detail_info;
  const {cds} = detail_info
  result = list.map((item) => {
    if (detail_info.csid == 1 || detail_info.csid == 3) {
      //  如果是C01数据，隐藏角球黄牌红牌点球
      if (cds=='C01') {
        return {
        name: item.name,
        q1: '', // 角球
        q2: '', // 黄牌
        ht:'', // 红牌
        q3: '', // 点球
        q4: msc_obj && msc_obj.S2 ? msc_obj.S2[item.key] : 0, // 半场
        t: msc_obj && msc_obj.S1 ? msc_obj.S1[item.key] : 0, // 全场
        x: msc_obj && msc_obj.S7 ? msc_obj.S7[item.key] : 0, // 加时赛比分
        y: msc_obj && msc_obj.S170 ? msc_obj.S170[item.key] : 0, // 点球大战
      };
        
      }else{
        return {
        name: item.name,
        q1: msc_obj && msc_obj["S5"] ? msc_obj["S5"][item.key] : 0, // 角球
        q2: msc_obj && msc_obj.S12 ? msc_obj.S12[item.key] : 0, // 黄牌
        ht: msc_obj && msc_obj.S11 ? msc_obj.S11[item.key] : 0, // 红牌
        q3: msc_obj && msc_obj.S10 ? msc_obj.S10[item.key] : 0, // 点球
        q4: msc_obj && msc_obj.S2 ? msc_obj.S2[item.key] : 0, // 半场
        t: msc_obj && msc_obj.S1 ? msc_obj.S1[item.key] : 0, // 全场
        x: msc_obj && msc_obj.S7 ? msc_obj.S7[item.key] : 0, // 加时赛比分
        y: msc_obj && msc_obj.S170 ? msc_obj.S170[item.key] : 0, // 点球大战
      };

      }
    } else if (detail_info.csid == 2) {
      // 48282 【SIT】【欧洲版二期】【PC】篮球详情页比分版未到的赛事阶段比分不需要展示
      return {
        name: item.name,
        q1: msc_obj && msc_obj.S19 ? msc_obj.S19[item.key] : "", // Q1
        q2: msc_obj && msc_obj.S20 ? msc_obj.S20[item.key] : "", // Q2
        ht: msc_obj && msc_obj.S2 ? msc_obj.S2[item.key] : "", // 半场
        q3: msc_obj && msc_obj.S21 ? msc_obj.S21[item.key] : "", //Q3
        q4: msc_obj && msc_obj.S22 ? msc_obj.S22[item.key] : "", // Q4
        t: msc_obj && msc_obj.S1 ? msc_obj.S1[item.key] : "", // 全场
      };
    } else {
      return {};
    }
  });
  return result;
};

const get_msc_data = (msc_data, current_data) => {
  const detail_info = props.detail_info;
  const score_list = props.score_list;
  let res = "";
  const list = [
    {
      name: detail_info["mhn"],
      key: "home",
    },
    {
      name: detail_info["man"],
      key: "away",
    },
  ];
  if (msc_data.length > 0) {
    //   网球 羽毛球
    if (["5", "10"].includes(detail_info.csid + "")) {
      res = list.map((item) => {
        return {
          name: item.name,
          q1: msc_data[0][item.key], //
          q2: msc_data[1][item.key],
          q3: msc_data[2][item.key],
          set: score_list.S1 ? score_list?.S1[item.key] : 0, //
          p: current_data[item.key], //
        };
      });
    }
    //乒乓球
    if (["7", "8", "9"].includes(detail_info.csid + "")) {
      res = list.map((item) => {
        return {
          name: item.name,
          q1: msc_data[0] ? msc_data[0][item.key] : "", //
          q2: msc_data[1] ? msc_data[1][item.key] : "",
          q3: msc_data[2] ? msc_data[2][item.key] : "",
          q4: msc_data[3] ? msc_data[3][item.key] : "",
          q5: msc_data[4] ? msc_data[4][item.key] : "",
          set: score_list.S1 ? score_list?.S1[item.key] : 0, //
          p: current_data[item.key], //
        };
      });
    }
  }
  data.value = res || [];
};

/**
 * @description: 比分排序、添加0:0、添加横向滚动条件
 * @param {Object} detials 赛事详情
 * @return {undefined} undefined
 */
const format_msc = (detials) => {
  /**
   * csid 比赛阶段的对象变量名
   * msc比分数据
   * mmp 赛事阶段
   * mft 比赛总局数|总盘数
   * mct 当前第几局
   * mat 发球方
   */
  let { csid, mmp, mft, mct, mat } = detials;

  let msc_data = [];
  let msc = props.score_list;
  const current_data = computed_score(detials); // 计算总分

  csid == "4" && (mft = mft || 3);
  let dict = socre_dict(csid);
  //斯诺比赛阶段字段为mct，其他球种为mmp
  let is_sinuoke = csid == "7";
  mmp = parseInt(is_sinuoke ? mct : mmp);
  for (var k in dict) {
    if (!msc[dict[k]] && k <= mft && is_sinuoke) {
      msc[dict[k]] = { home: "", away: "" };
    }
    if (k == mmp && !msc[dict[k]]) {
      msc[dict[k]] = { home: 0, away: 0 };
    }
  }

  let both_data = [];
  Object.keys(msc)
    .sort()
    .map((key) => {
      both_data[key] = msc[key];
    });
  for (let i in both_data) {
    let item = parseInt(i.replace("S", ""));
    if (item >= 120 && item < 160) {
      // 羽毛球、乒乓球、斯洛克，排球，冰球，棒球，沙滩排球 会出现不返回某一局比分的情况，所以手动计算排序
      // http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=12817576       S120-S159 所对应的比分阶段是连续的，所以允许这样处理
      both_data[item - 120] = msc[i];
      // both_data.push(msc[i]);
    }
  }
  if (mft) {
    let num_title = [];
    for (var i = 0; i < mft; i++) {
      num_title.push(i + 1);
      // 补全比分和总盘数|总局数的列数
      if (both_data.length - 1 < i) {
        both_data.push({ home: "", away: "" });
      }
    }
  }

  msc_data = both_data;
  get_msc_data(msc_data, current_data);
};

/**
 * @description: 计算总分
 * @param {}
 * @return {undefined} undefined
 */
const computed_score = (res) => {
  let score = props.score_list;
  let current_data = {
    home: 0,
    away: 0,
  };
  if (!Object.keys(score).length) {
    current_data = {
      home: 0,
      away: 0,
    };
    return false;
  }
  for (var i in score) {
    if (["S120", "S121", "S122", "S123", "S124", "S125", "S126"].includes(i)) {
      current_data.home += parseInt(score[i].home || 0);
      current_data.away += parseInt(score[i].away || 0);
    }
  }
  return current_data;
};

const get_icon = (icon) => {
  return new URL(
    `${LOCAL_PROJECT_FILE_PREFIX}/image/details/${icon}.png`,
    import.meta.url
  ).href;
};

watch(
  () => props.detail_info,
  (res) => {
    if (res.csid == 1) {
      padding_value.value = "1px 0px 1px 6px";
    } else {
      padding_value.value = "1px 0px 1px 0px";
    }
    const msc_data = [];
    // let active_index = "";
    let current_data = { home: 0, away: 0 };
    if (res.ms != 0 && res.mmp == "0") {
      Object.assign(res, {
        mmp: "8",
        mct: 1,
      });
    }
    if (res.csid == "5") {
      //网球
      let dict = socre_dict(5);
      let msc = props.score_list;
      for (var k in dict) {
        if (msc[dict[k]]) {
          msc_data.push(msc[dict[k]]);
        } else if (k == parseInt(res.mmp) && !msc[dict[k]]) {
          msc_data.push({
            home: 0,
            away: 0,
          });
        } else if (
          ["8", "9", "10", "11", "12"].includes(res.mmp) &&
          k < parseInt(res.mmp) &&
          !msc[dict[k]]
        ) {
          msc_data.push({
            home: "",
            away: "",
          });
        }
      }

      if (msc_data.length > res.mft) {
        msc_data.splice(res.mft, msc_data.length);
      }

      let num_title = [];
      for (let i = 0; i < res.mft; i++) {
        num_title.push(i + 1);
      }
      //   this.num_title = num_title;

      // 补全比分和总盘数|总局数的列数
      for (var i = 0; i < res.mft; i++) {
        if (msc_data.length - 1 < i) {
          msc_data.push({
            home: "",
            away: "",
          });
        }
      }

      //   active_index = this.stage_dict(res.csid, res.mmp, res.mct) - 1
      if (props.score_list.S103) {
        current_data = props.score_list.S103;
      }
      get_msc_data(msc_data, current_data);
    } else {
      // 其他球种
      if (!["1", "2", "3"].includes(res.csid + "")) {
        format_msc(res);
      }
    }
    
    if (["1", "2", "3"].includes(res.csid + "")) {
      get_base_data(res);
    }
    // get_base_data(res);
  },
  { immediate: false, deep: true }
);

const insetColumnTooltip = () => {
  const mapping = {
    q1: i18n_t("icon_tips.corner"),
    q2: i18n_t("icon_tips.yellow_card"),
    ht: i18n_t("icon_tips.red_card"),
    q3: i18n_t("icon_tips.penalty_kick"),
    q4: i18n_t("icon_tips.half_1"),
    t: i18n_t("icon_tips.overall"),
    x: i18n_t("icon_tips.S7"),
    y: i18n_t("icon_tips.S170"),
  };
  columns.value = columns.value.map((v) => {
    return {
      ...v,
      tooltip: mapping[v.name] || "",
    };
  });
};
watch(
  () => props.score_list,
  (val) => {
    const detail_info = props.detail_info;
    columns.value = [];
    columns.value = JSON.parse(JSON.stringify(sport_columns[detail_info.csid]));

    //加时赛
    if (["32", "41", "33", "42", "110"].includes(detail_info.mmp)) {
      //  加时赛
      columns.value.push({
        name: "x",
        align: "left",
        label: "T",
        field: "x",
        icon: "jiashi",
        headerStyle: { width: "33px", color: "#ff7000" },
      });
    }
    //点球大战,点球大战一定会有加时赛
    if (["34", "50", "120"].includes(detail_info.mmp)) {
      columns.value.push({
        name: "x",
        align: "left",
        label: "T",
        field: "x",
        icon: "jiashi",
        headerStyle: { width: "33px", color: "#ff7000" },
      });
      columns.value.push({
        name: "y",
        align: "left",
        label: "Y",
        field: "y",
        icon: "detail_point",
        headerStyle: { width: "33px", color: "#ff7000" },
      });
    }
    const {cds,csid} = detail_info
    //  如果是C01数据，隐藏角球黄牌红牌点球  cds=='C01'&&
    if (cds=='C01'&&[1,3].includes(Number(csid))) {
      columns.value[1].icon = '1'
      columns.value[2].icon = '1'
      columns.value[3].icon = '1'
      columns.value[4].icon = '1' 
    }

    insetColumnTooltip();
  },
  { immediate: false, deep: true }
);
</script>

<style lang="scss" scoped>
.box-bc {
  background: var(--q-gb-bg-c-4);
  margin-bottom: 10px;

  &:deep(.q-table) {
    padding-bottom: 10px !important;
  }

  &:deep(.q-table th) {
    padding: 1px 0px !important;
  }

  &:deep(.q-table td) {
    padding: v-bind("padding_value") !important;
  }

  &:deep(.q-table tbody td) {
    height: 30px !important;
  }

  &:deep(.q-table thead tr) {
    height: 30px !important;
  }

  :deep(.q-table__card) {
    box-shadow: none;
  }
}

.top-icon {
  height: 16px;
  margin-top: 4px;
}
.table-name {
  margin-left: 15px;
  width: 180px;
  overflow: hidden;
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  &.csid_1 {
    margin-left: 4px;
  }
  &.csid_2 {
    margin-left: 8px;
  }
}

.heightLight {
  color: rgb(255, 112, 0) !important;
}

.round {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 8px;
  background-color: var(--q-gb-bg-c-1);
  margin-right: 4px;
}

//.stage-13,.stage-14,.stage-15,
//.stage-302,.stage-16,.stage-303{
//  //color: var(--qq--yb-text-color1) !important;
//  color: rgb(255, 112, 0) !important;
//}
</style>