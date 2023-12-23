<!--
 * @Description: API配置文档
 * @FilePath: \user-pc-vite\entries\development-document\src\components\user_doc.vue
 * @Date: 2023-08-04 16:08:04
-->

<template>
  <div class="user-doc">
    <q-card class="q-my-md" flat bordered>
      <!-- 顶部菜单 -->
      <q-tabs
        class="header-tabs"
        v-model="active_headKey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        :breakpoint="0"
      >
        <q-tab
          v-for="tab in header_menu"
          :key="`tab-${tab}`"
          :name="tab.name"
          class="header-btn"
        >
          <div class="row no-wrap items-center">
            <span class="q-mr-xs text-capitalize">{{ tab.name }}</span>
            <q-badge v-if="tab.menuLen" :label="tab.menuLen" />
          </div>
        </q-tab>
      </q-tabs>
      <q-separator />
      <!-- 内容 -->
      <q-tab-panels v-model="active_headKey" animated>
        <q-tab-panel
          :name="hand.name"
          v-for="(hand, id) in header_menu"
          :key="id"
          class="q-pa-none"
        >
          <!-- 右边展示 -->
          <template v-if="['props'].includes(active_headKey)">
            <div class="user-doc-container row no-wrap">
              <div class="col-auto">
                <q-tabs
                  style="width: 100%"
                  class="header-tabs user-doc-subtabs"
                  v-model="active_leftKey"
                  active-color="primary"
                  indicator-color="primary"
                  :breakpoint="0"
                  vertical
                  dense
                  shrink
                >
                  <q-tab
                    style="width: 100%"
                    class="user-doc-subtabs-item header-btn"
                    v-for="innerTab in props_left_menu"
                    :key="`inner-tab-${innerTab.name}`"
                    :name="innerTab.name"
                  >
                    <div
                      class="row no-wrap items-center self-stretch q-pl-sm"
                      style="width: 100%"
                    >
                      <span class="q-mr-xs text-capitalize">{{
                        innerTab.name
                      }}</span>
                      <div class="col" />
                      <q-badge v-if="innerTab.len" :label="innerTab.len" />
                    </div>
                  </q-tab>
                </q-tabs>
              </div>
              <q-separator vertical />

              <q-tab-panels
                class="col"
                v-model="active_leftKey"
                animated
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel
                  class="user-doc-entrys q-pa-none"
                  v-for="innerTab in props_left_menu"
                  :name="innerTab.name"
                  :key="innerTab.name"
                >
                  <div
                    v-for="(item, index) in table_data[active_headKey][
                      active_leftKey
                    ]"
                    :key="index"
                    class="user-doc-entry"
                  >
                    <!-- 标题/type类型 -->
                    <div
                      class="user-doc-entry-item col-xs-12 col-sm-12 row items-center"
                    >
                      <q-badge
                        class="user-doc-entry-pill"
                        :label="item.title"
                        :color="item.bcolor"
                      />
                      <div class="user-doc-entry-type q-ml-xs">
                        ：{{ item.type }}
                      </div>
                    </div>
                    <!-- 内容 -->
                    <div class="user-doc-entry-item col-xs-12 col-sm-12">
                      <div class="entry-item-row-type q-mt-xs" v-if="item.desc">
                        <div>描述</div>
                        <div class="item-desc">{{ item.desc }}</div>
                      </div>
                      <div
                        class="entry-item-row-type q-mt-xs"
                        v-if="item.default"
                      >
                        <div>默认值</div>
                        <div class="q-ml-md row">
                          <div class="item-examples">{{ item.default }}</div>
                        </div>
                      </div>
                      <div
                        class="entry-item-row-type q-mt-xs"
                        v-if="item.values"
                      >
                        <div>接受的值</div>
                        <div class="q-ml-md row">
                          <div
                            class="item-examples"
                            v-for="(value, id) in item.values"
                            :key="id"
                          >
                            {{ value }}
                          </div>
                        </div>
                      </div>
                      <!-- 属性 -->
                      <div
                        class="entry-item-row-type q-mt-xs"
                        v-if="item.definition"
                      >
                        <div>属性</div>
                        <div class="q-ml-md">
                          <div
                            v-for="(defin, idx) in item.definition"
                            :key="idx"
                          >
                            <userProps :userData="defin"></userProps>
                          </div>
                        </div>
                      </div>
                      <!-- 参数 -->
                      <div
                        class="entry-item-row-type q-mt-xs"
                        v-if="item.params"
                      >
                        <div>参数</div>
                        <div class="q-ml-md">
                          <div v-for="(parms, x) in item.params" :key="x">
                            <userProps :userData="parms"></userProps>
                          </div>
                        </div>
                      </div>

                      <!-- 返回 -->
                      <div
                        class="entry-item-row-type q-mt-xs"
                        v-if="item.returns"
                      >
                        <div>
                          返回 &nbsp;&lt;{{ item.returns.type }}&gt;&nbsp;
                        </div>
                        <div class="q-ml-md">
                          <div class="item-definition">
                            <div class="item-definition-content">
                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="item.returns.desc"
                              >
                                <div>描述</div>
                                <div class="item-desc">
                                  {{ item.returns.desc }}
                                </div>
                              </div>
                              <div>
                                <div
                                  class="entry-item-row-type q-mt-xs"
                                  v-if="item.returns.examples"
                                >
                                  <div>例子</div>
                                  <div class="q-ml-md row">
                                    <div
                                      class="item-examples"
                                      v-for="(ex, d) in item.returns.examples"
                                      :key="d"
                                    >
                                      {{ ex }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 例子 -->
                      <div
                        class="entry-item-row-type q-mt-xs"
                        v-if="item.examples"
                      >
                        <div>例子</div>
                        <div class="q-ml-md row">
                          <div
                            class="item-examples"
                            v-for="(ples, i) in item.examples"
                            :key="i"
                          >
                            {{ ples }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </template>

          <!-- 不展示右边 -->
          <template v-else>
            <div class="user-doc-entrys user-doc-container">
              <div
                v-for="(eslots, i) in table_data[active_headKey]"
                :key="i"
                class="user-doc-entry"
              >
                <div
                  class="col-xs-12 col-sm-12 row items-center item-definition-title"
                >
                  <q-badge
                    class="item-definition-title-pill"
                    :label="eslots.title"
                    :color="eslots.bcolor"
                  />
                  <div
                    class="item-definition-title-type q-ml-xs"
                    v-if="eslots.type"
                  >
                    ：{{ eslots.type }}
                  </div>
                </div>
                <div class="item-definition-content">
                  <div class="entry-item-row-type q-mt-xs" v-if="eslots.desc">
                    <div>描述</div>
                    <div class="text-black">{{ eslots.desc }}</div>
                  </div>
                </div>
                <div class="item-definition-content">
                  <div class="entry-item-row-type q-mt-xs" v-if="eslots.scope">
                    <div>范围</div>
                    <div v-for="(data, ids) in eslots.scope" :key="ids">
                      <userProps :userData="data"></userProps>
                    </div>
                  </div>
                </div>
                <div class="item-definition-content">
                  <div class="entry-item-row-type q-mt-xs" v-if="eslots.params">
                    <div>参数</div>
                    <div v-for="(data, idx) in eslots.params" :key="idx">
                      <userProps :userData="data"></userProps>
                    </div>
                  </div>
                </div>
                <div
                  class="item-definition-content q-mt-xs"
                  v-if="eslots.examples"
                >
                  <div>例子</div>
                  <div class="q-ml-md row">
                    <div
                      class="item-examples"
                      v-for="(xples, i) in eslots.examples"
                      :key="i"
                    >
                      {{ xples }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import userProps from "basesrc/components/user_props.vue"; // API文档展示卡片
const props = defineProps({
  docData: {
    type: Array,
    default: () => [],
  },
});
// 顶部菜单
const header_menu = ref([]);
// table数据 {props:{category: []}, slots: [{}]}
const table_data = ref({});
// props右边菜单
const props_left_menu = ref([]);
// 顶部选中的key
const active_headKey = ref("props");
// props 右侧选中的key
const active_leftKey = ref("");
// badge颜色
const badge_color = [
  "orange-8",
  "blue-5",
  "green-5",
  "purple-5",
  "cyan-5",
  "teal-5",
  "indigo-5",
];

// 初始化
const init_doc = (docdata) => {
  header_menu.value = [];
  table_data.value = {};
  docdata?.forEach((objs) => {
    for (const key in objs) {
      if (!["leftmenu", "mixins", "meta"].includes(key)) {
        header_menu.value.push({
          name: key,
          menuLen: Object.keys(objs[key]).length,
        });
        table_data.value[key] = deepObjsArray(objs[key], key);
      }
    }
  });
  console.log("----table_data----", table_data.value);
};

/**
 * 对象数据处理
 * @param {Object} objs
 * @param {Object} keytype  分类
 * @param {Object} depidx  层级
 * @returns {Object|Array}
 */
function deepObjsArray(objs, keytype, depidx = 0) {
  const isObj = typeof objs === "object" && objs !== null;
  const isProps = keytype === "props";
  let arrList = [];
  if (isObj && !isProps) {
    for (let [key, val] of Object.entries(objs)) {
      // definition:属性  params:参数		scope:范围
      const isdeep = Object.keys(val)?.some((v) =>
        ["params", "definition", "scope"].includes(v)
      );
      let obj = {};
      if (isdeep) {
        Object.keys(val).forEach((item) => {
          if (["params", "definition", "scope"].includes(item)) {
            obj = {
              ...val,
              bcolor: badge_color[depidx],
              index: depidx,
              title: keytype == "events" && depidx == 0 ? `@${key}` : key,
              [item]: deepObjsArray(val[item], keytype, depidx + 1),
              type: type_text(val, keytype),
            };
          }
        });
      } else {
        obj = {
          ...val,
          title: keytype == "events" && depidx == 0 ? `@${key}` : key,
          bcolor: badge_color[depidx],
          index: depidx,
          type: type_text(val, keytype),
        };
      }
      arrList.push(obj);
    }
    return arrList;
  } else {
    if (isProps) {
      // Props数据 根据category分类     "category": "virtual-scroll|behavior"
      return Object.entries(objs)?.reduce((prev, [key, cur]) => {
        const cats = cur.category?.split("|");
        cats?.forEach((item) => {
          const curs = {
            ...cur,
            title: key,
            bcolor: badge_color[0],
            index: 0,
            type: type_text(cur, keytype),
            definition: deep_props_params(cur.definition, keytype),
            params: deep_props_params(cur.params, keytype),
          };
          if (prev[item]) {
            prev[item].push(curs);
          } else {
            prev[item] = [curs];
          }
        });
        return prev;
      }, {});
    }
  }
}

/**
 * 类型type展示处理
 * @param {Object} objs
 * @param {String} key  分类
 * @returns {String}
 */
function type_text(objs, key) {
  // events/methods 首个type显示为函数   slots首个type不显示
  const isFun = objs.type == "Function";
  const isType = ["events", "methods"].includes(key);
  // 类型是Function  || 是events/methods && 不设置type
  if (isFun || (isType && !objs.type)) {
    // (rows, terms, cols, getCellValue) => Array - required!  (required!)表示参数必填
    return `(${
      (objs.params && Object.keys(objs.params)?.join(", ")) ?? ""
    }) => ${objs.returns?.type ?? "void 0"} ${
      objs.required ? " - required!" : ""
    }`;
  } else {
    // slots 第一层不显示type
    if (!objs.type) {
      return "";
    }
    // Element | String - required!
    return Array.isArray(objs.type)
      ? objs.type?.join(" | ") + (objs.required ? " - required!" : "")
      : objs.type + (objs.required ? " - required!" : "");
  }
}

/**
 * 处理props数据
 * @param {Object} paramData
 * @param {String} keytype 分类
 * @param {Number} depidx 层级
 * @returns {Array}
 */
function deep_props_params(paramData, keytype, depidx = 1) {
  if (!paramData) {
    return;
  }
  const isObj = typeof paramData === "object" && paramData !== null;
  let dataList = [];
  if (isObj) {
    for (let [key, val] of Object.entries(paramData)) {
      let paramObj = {};
      // 参数
      if (val.params && Object.keys(val.params).length) {
        paramObj = {
          title: key,
          ...val,
          bcolor: badge_color[depidx],
          index: depidx,
          params: deep_props_params(val.params, keytype, depidx + 1),
          type: type_text(val, keytype),
        };
        // 属性
      } else if (val.definition && Object.keys(val.definition).length) {
        paramObj = {
          ...val,
          bcolor: badge_color[depidx],
          index: depidx,
          definition: deep_props_params(val.definition, keytype, depidx + 1),
          title: key,
          type: type_text(val, keytype),
        };
      } else {
        paramObj = {
          ...val,
          title: key,
          bcolor: badge_color[depidx],
          index: depidx,
          type: type_text(val, keytype),
        };
      }
      dataList.push(paramObj);
    }
  }
  return dataList;
}

/**
 * Props左边数据
 * @param {String} key 分类
 * @returns {undefined}
 */
const props_left = (key) => {
  for (let k in table_data.value[key]) {
    let Obj = {
      len: Object.keys(table_data.value[key][k])?.length || 0,
      name: k,
    };
    props_left_menu.value.push(Obj);
  }
  props_left_menu.value.sort((a, b) => a.name.localeCompare(b.name));
  active_leftKey.value = props_left_menu.value[0]?.name;
};

watch(
  () => props.docData,
  (docval) => {
    props_left_menu.value = [];
    init_doc(docval);
    props_left("props");
    active_headKey.value = "props";
  },
  { immediate: true }
);

watch(
  active_headKey,
  (handkey) => {
    props_left_menu.value = [];
    if (handkey == "props") {
      props_left(handkey);
    }
  },
  { immediate: true }
);

watch(active_leftKey, (val) => {
  active_leftKey.value = val;
});
</script>

<!-- <style lang="scss" src="basesrc/styles/common.scss" scoped /> -->
<style lang="scss" scoped>
.user-doc {
  width: 60vw;
  &-container {
    max-height: 600px;
  }

  &-subtabs {
    padding: 8px 0;
  }
  &-subtabs-item {
    justify-content: left;
    min-height: 36px !important;
    :deep(.q-tab__content) {
      width: 100%;
    }
  }
  &-entry {
    padding: 16px;
    color: #9e9e9e;
    font-size: 16px;
    &-item {
      min-height: 25px;
      .item-examples {
        background-color: #eee;
        border: 1px solid #ddd;
        color: #000;
        margin: 4px;
        padding: 2px 4px;
        border-radius: 4px;
      }
      .item-desc {
        color: #000;
      }
    }
    &-pill {
      font-size: 15px;
      letter-spacing: 0.7px;
      line-height: 1.4em;
    }
    &-type {
      line-height: 24px;
      color: #000;
    }
  }
  &-entry:not(:first-child) {
    border-top: 1px solid #ddd;
  }
  // 属性参数
  .item-definition {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.12);
    padding: 16px;
    margin-top: 5px;
    border-radius: 5px;
    &-title {
      min-height: 25px;
      &-pill {
        font-size: 15px;
        letter-spacing: 0.7px;
        line-height: 1.4em;
        color: #fff;
      }
      &-type {
        line-height: 24px;
        color: #000;
      }
    }
    &-content {
      .item-examples {
        background-color: #eee;
        border: 1px solid #ddd;
        color: #000;
        margin: 4px;
        padding: 2px 4px;
        border-radius: 4px;
      }
    }
  }
}
</style>