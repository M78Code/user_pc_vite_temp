<!--
 * @Description: API配置文档
 * @FilePath: \user-pc-vite\entries\development-document\src\components\user_doc.vue
 * @Date: 2023-08-04 16:08:04
-->

<template>
  <div class="user-doc">
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
        :key="`api-tab-${tab}`"
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
                  :key="`api-inner-tab-${innerTab.name}`"
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
                    <div class="entry-item-row-type q-mt-xs" v-if="item.values">
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
                          <div class="col-xs-12 col-sm-12 row items-center">
                            <q-badge
                              class="item-definition-pill"
                              :label="defin.key"
                              color="orange"
                            />
                            <div class="item-definition-type q-ml-xs">
                              ：{{ defin.type }}
                            </div>
                          </div>
                          <div class="">

                          </div>
                        </div>
                      </div>
                    </div>

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
          <div class="user-doc-entrys">
            <div
              v-for="(item, i) in table_data[active_headKey]"
              :key="i"
              class="user-doc-entry"
            >
              <div style="font-size: 15px" class="bg-orange-8">
                {{ item.title }}
              </div>
              <div>描述：{{ item.desc }}</div>
            </div>
          </div>
        </template>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";

const props = defineProps({
  docData: {
    type: Array,
    default: () => [],
  },
});
const splitterModel = ref(12);
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
            title: k,
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

function definition_filter(objs) {
  const isObj = typeof objs === "object" && objs !== null;
  let objData = [];
  if (isObj) {
    for (let [key, val] of Object.entries(objs)) {
      let obj = {
        ...val,
        key,
        type: Array.isArray(val.type)
          ? val.type?.join(" | ") + (val.required ? "- required!" : "")
          : val.type + (val.required ? "- required!" : ""),
      };
      objData.push(obj);
    }
    return objData;
  } else {
    return objs;
  }
}

function table_filter(keys, datas) {
  const arrobj = keys == "props" ? {} : [];
  return datas.reduce((prev, cur) => {
    // props 处理
    if (["props"].includes(keys)) {
      const categorys = cur.category?.split("|");
      categorys?.map((v) => {
        const obj1 = {
          ...cur,
          type: Array.isArray(cur.type) ? cur.type.join(" | ") : cur.type,
          definition: definition_filter(cur.definition),
        };
        if (prev[v]) {
          prev[v].push(obj1);
        } else {
          prev[v] = [obj1];
        }
      });
    } else {
      prev.push(cur);
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

<style lang="scss" scoped>
.user-doc {
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
      .item-definition {
        width: 100%;
        &-pill{
          font-size: 15px;
          letter-spacing: 0.7px;
          line-height: 1.4em;
        }
      }
    }
  }
  &-entry:not(:first-child) {
    border-top: 1px solid #ddd;
  }
  .badge-right {
    position: absolute;
    right: -30px;
    background-color: var(--q-primary);
    color: #fff;
    border-radius: 4px;
    padding: 2px 6px;
    line-height: 12px;
    min-height: 12px;
    font-weight: normal;
  }
}
</style>