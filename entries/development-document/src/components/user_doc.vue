<!--
 * @Description: API配置文档
 * @FilePath: \user-pc-vite\entries\development-document\src\components\user_doc.vue
 * @Date: 2023-08-04 16:08:04
-->

<template>
  <div class="user-doc">
    <q-card class="q-my-md" flat bordered>
      <q-tabs
        class="header-tabs"
        v-model="active_headKey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        :breakpoint="0"
      >
        <q-tab
          v-for="tab in headerKey"
          :key="`tab-${tab}`"
          :name="tab.tabName"
          class="header-btn"
        >
          <div class="row no-wrap items-center">
            <span class="q-mr-xs text-capitalize">{{ tab.tabName }}</span>
            <q-badge v-if="tab.sunLen" :label="tab.sunLen" />
          </div>
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="active_headKey" animated>
        <q-tab-panel
          :name="hand.tabName"
          v-for="(hand, id) in headerKey"
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
                    v-for="innerTab in leftKey_data"
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
                  v-for="innerTab in leftKey_data"
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
                    <div
                      class="user-doc-entry-item col-xs-12 col-sm-12 row items-center"
                    >
                      <q-badge
                        class="user-doc-entry-pill"
                        :label="item.title"
                        color="orange"
                      />
                      <div class="user-doc-entry-type q-ml-xs">
                        ：{{ item.type }}
                      </div>
                    </div>
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
                            class="item-definition"
                            v-for="(defin, idx) in item.definition"
                            :key="idx"
                          >
                            <div
                              class="col-xs-12 col-sm-12 row items-center item-definition-title"
                            >
                              <q-badge
                                class="item-definition-title-pill"
                                :label="defin.key"
                                color="secondary"
                              />
                              <div class="item-definition-title-type q-ml-xs">
                                ：{{ defin.type }}
                              </div>
                            </div>
                            <div class="item-definition-content">
                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="defin.desc"
                              >
                                <div>描述</div>
                                <div class="item-desc">{{ defin.desc }}</div>
                              </div>
                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="defin.default"
                              >
                                <div>默认值</div>
                                <div class="q-ml-md row">
                                  <div class="item-examples">
                                    {{ defin.default }}
                                  </div>
                                </div>
                              </div>
                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="defin.values"
                              >
                                <div>接受的值</div>
                                <div class="q-ml-md row">
                                  <div
                                    class="item-examples"
                                    v-for="(vals, i) in defin.values"
                                    :key="i"
                                  >
                                    {{ vals }}
                                  </div>
                                </div>
                              </div>

                              <!-- 属性-参数 -->
                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="defin.params"
                              >
                                <div>参数</div>
                                <div class="q-ml-md">
                                  <div
                                    class="item-definition"
                                    v-for="(dparms, x) in defin.params"
                                    :key="x"
                                  >
                                    <div
                                      class="col-xs-12 col-sm-12 row items-center item-definition-title"
                                    >
                                      <q-badge
                                        class="item-definition-title-pill"
                                        :label="dparms.key"
                                        color="orange"
                                      />
                                      <div
                                        class="item-definition-title-type q-ml-xs"
                                      >
                                        ：{{ dparms.type }}
                                      </div>
                                    </div>
                                    <div class="item-definition-content">
                                      <div
                                        class="entry-item-row-type q-mt-xs"
                                        v-if="dparms.desc"
                                      >
                                        <div>描述</div>
                                        <div class="item-desc">
                                          {{ dparms.desc }}
                                        </div>
                                      </div>
                                      <div>
                                        <div
                                          class="entry-item-row-type q-mt-xs"
                                          v-if="dparms.examples"
                                        >
                                          <div>例子</div>
                                          <div class="q-ml-md row">
                                            <div
                                              class="item-examples"
                                              v-for="(m, i) in dparms.examples"
                                              :key="i"
                                            >
                                              {{ m }}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <!-- 属性-返回 -->
                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="defin.returns"
                              >
                                <div>
                                  返回 &nbsp;&lt;{{
                                    defin.returns.type
                                  }}&gt;&nbsp;
                                </div>
                                <div class="q-ml-md">
                                  <div class="item-definition">
                                    <div class="item-definition-content">
                                      <div
                                        class="entry-item-row-type q-mt-xs"
                                        v-if="defin.returns.desc"
                                      >
                                        <div>描述</div>
                                        <div class="item-desc">
                                          {{ defin.returns.desc }}
                                        </div>
                                      </div>
                                      <div
                                        class="entry-item-row-type q-mt-xs"
                                        v-if="defin.returns.examples"
                                      >
                                        <div>例子</div>
                                        <div class="q-ml-md row">
                                          <div
                                            class="item-examples"
                                            v-for="(detx, di) in defin.returns
                                              .examples"
                                            :key="di"
                                          >
                                            {{ detx }}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="defin.examples"
                              >
                                <div>例子</div>
                                <div class="q-ml-md row">
                                  <div
                                    class="item-examples"
                                    v-for="(dples, ix) in defin.examples"
                                    :key="ix"
                                  >
                                    {{ dples }}
                                  </div>
                                </div>
                              </div>
                            </div>
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
                          <div
                            class="item-definition"
                            v-for="(parms, x) in item.params"
                            :key="x"
                          >
                            <div
                              class="col-xs-12 col-sm-12 row items-center item-definition-title"
                            >
                              <q-badge
                                class="item-definition-title-pill"
                                :label="parms.key"
                                color="accent"
                              />
                              <div class="item-definition-title-type q-ml-xs">
                                ：{{ parms.type }}
                              </div>
                            </div>
                            <div class="item-definition-content">
                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="parms.desc"
                              >
                                <div>描述</div>
                                <div class="item-desc">{{ parms.desc }}</div>
                              </div>

                              <!-- 参数-参数 -->
                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="parms.params"
                              >
                                <div>参数</div>
                                <div class="q-ml-md">
                                  <div
                                    class="item-definition"
                                    v-for="(pps, x) in parms.params"
                                    :key="x"
                                  >
                                    <div
                                      class="col-xs-12 col-sm-12 row items-center item-definition-title"
                                    >
                                      <q-badge
                                        class="item-definition-title-pill"
                                        :label="pps.key"
                                        color="secondary"
                                      />
                                      <div
                                        class="item-definition-title-type q-ml-xs"
                                      >
                                        ：{{ pps.type }}
                                      </div>
                                    </div>
                                    <div class="item-definition-content">
                                      <div
                                        class="entry-item-row-type q-mt-xs"
                                        v-if="pps.desc"
                                      >
                                        <div>描述</div>
                                        <div class="item-desc">
                                          {{ pps.desc }}
                                        </div>
                                      </div>
                                      <div>
                                        <div
                                          class="entry-item-row-type q-mt-xs"
                                          v-if="pps.examples"
                                        >
                                          <div>例子</div>
                                          <div class="q-ml-md row">
                                            <div
                                              class="item-examples"
                                              v-for="(pms, i) in pps.examples"
                                              :key="i"
                                            >
                                              {{ pms }}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <!-- 参数-返回 -->
                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="parms.returns"
                              >
                                <div>
                                  返回 &nbsp;&lt;{{
                                    parms.returns.type
                                  }}&gt;&nbsp;
                                </div>
                                <div class="q-ml-md">
                                  <div class="item-definition">
                                    <div class="item-definition-content">
                                      <div
                                        class="entry-item-row-type q-mt-xs"
                                        v-if="parms.returns.desc"
                                      >
                                        <div>描述</div>
                                        <div class="item-desc">
                                          {{ parms.returns.desc }}
                                        </div>
                                      </div>
                                      <div>
                                        <div
                                          class="entry-item-row-type q-mt-xs"
                                          v-if="parms.returns.examples"
                                        >
                                          <div>例子</div>
                                          <div class="q-ml-md row">
                                            <div
                                              class="item-examples"
                                              v-for="(dex, di) in parms.returns
                                                .examples"
                                              :key="di"
                                            >
                                              {{ dex }}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div
                                class="entry-item-row-type q-mt-xs"
                                v-if="parms.examples"
                              >
                                <div>例子</div>
                                <div class="q-ml-md row">
                                  <div
                                    class="item-examples"
                                    v-for="(m, i) in parms.examples"
                                    :key="i"
                                  >
                                    {{ m }}
                                  </div>
                                </div>
                              </div>
                            </div>
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
                    color="orange"
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
import { ref, computed, watch } from "vue";
import userProps from "basesrc/components/user_props.vue"; // API文档展示卡片
const props = defineProps({
  docData: {
    type: Array,
    default: () => [],
  },
});
// 顶部key
const headerKey = ref([]);
// 数据源
const table_data = ref({});
// props左边分类
const leftKey_data = ref([]);
// 顶部选中的key
const active_headKey = ref("props");
const active_leftKey = ref("");

const init_doc = (docdata) => {
  headerKey.value = [];
  table_data.value = {};
  docdata?.forEach((docdata) => {
    for (let key in docdata) {
      let keyObjData = [];
      // 排除
      if (!["file_path", "meta", "leftmenu", "mixins"].includes(key)) {
        for (let k in docdata[key]) {
          const obj = {
            title: key == "events" ? `@${k}` : k,
            ...docdata[key][k],
          };
          keyObjData.push(obj);
        }
        // header数据
        const keysObj = {
          tabName: key,
          sunLen: keyObjData?.length || 0,
        };
        headerKey.value.push(keysObj);
        table_data.value[key] = table_filter(key, keyObjData);
      }
    }
    console.log("--table_data---", table_data.value);
  });
};

/**
 * 对象数据处理
 * @param {Object} objs
 * @returns {Object|Array}
 */
function definition_filter(objs, istype = "params") {
  const isObj = typeof objs === "object" && objs !== null;
  let objData = [];
  if (isObj) {
    for (let [key, val] of Object.entries(objs)) {
      const isFun = val.type == "Function";
      if (isFun) {
        istype = "params";
      }
      let obj = {
        ...val,
        key,
        type: type_text(val),
        params: definition_filter(val[istype]),
      };
      // delete obj[istype];
      objData.push(obj);
    }
    return objData;
  } else {
    return objs;
  }
}

/**
 * 类型type展示处理
 * @param {Object} objs
 * @param {Boolean} isBoolean
 * @returns {String}
 */
function type_text(objs, isBoolean = false) {
  const isFun = objs.type == "Function";
  // 类型是Function
  if (isFun || isBoolean) {
    // (rows, terms, cols, getCellValue) => Array - required!
    return `(${
      (objs.params && Object.keys(objs?.params).join(", ")) ?? ""
    }) => ${objs.returns?.type ?? "void 0"} ${
      objs.required ? " - required!" : ""
    }`;
  } else {
    // Element | String - required! (required!)表示参数必填
    return Array.isArray(objs.type)
      ? objs.type?.join(" | ") + (objs.required ? " - required!" : "")
      : objs.type + (objs.required ? " - required!" : "");
  }
}

/**
 * 表格数据处理
 * @param {String} keys  菜单键
 * @param {Array} datas
 * @returns {Array|Object}
 */
function table_filter(keys, datas) {
  const arrobj = keys == "props" ? {} : [];
  return datas.reduce((prev, cur) => {
    // props 处理
    if (["props"].includes(keys)) {
      const categorys = cur.category?.split("|");
      categorys?.map((v) => {
        const obj1 = {
          ...cur,
          type: type_text(cur),
          params: definition_filter(cur.params),
          definition: definition_filter(cur.definition),
        };
        if (prev[v]) {
          prev[v].push(obj1);
        } else {
          prev[v] = [obj1];
        }
      });
    } else {
      let scopes = {};
      if (keys == "slots") {
        scopes = {
          ...cur,
          scope: definition_filter(cur.scope, "definition"),
        };
      } else if (keys == "events") {
        scopes = {
          ...cur,
          type: type_text(cur, keys, true),
          params: definition_filter(cur.params, "definition"),
        };
      } else if (keys == "methods") {
        scopes = {
          ...cur,
          type: type_text(cur, keys, true),
          params: definition_filter(cur.params, "definition"),
        };
      } else {
        scopes = {
          ...cur,
          params: definition_filter(cur.params, "definition"),
        };
      }
      prev.push(scopes);
    }
    return prev;
  }, arrobj);
}

const props_left = (key) => {
  for (let k in table_data.value[key]) {
    let Obj = {
      len: Object.keys(table_data.value[key][k])?.length || 0,
      name: k,
    };
    leftKey_data.value.push(Obj);
  }
  leftKey_data.value.sort((a, b) => a.name.localeCompare(b.name));
  active_leftKey.value = leftKey_data.value[0]?.name;
};

watch(
  () => props.docData,
  (docval) => {
    leftKey_data.value = [];
    init_doc(docval);
    props_left("props");
    active_headKey.value = "props";
  },
  { immediate: true }
);

watch(
  active_headKey,
  (handkey) => {
    leftKey_data.value = [];
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