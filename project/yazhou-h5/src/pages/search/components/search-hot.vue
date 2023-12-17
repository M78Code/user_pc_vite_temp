<!--
 * @Author: ledron
 * @Date: 2020-11-10 11:09:47
 * @Description: 搜索页面的热门搜索模块
 * @FilePath: /user-h5/src/project/pages/search/components/search_hot.vue
-->

<template>
  <div class='searchHot'>
    <div class="q-mx-md">
      <div class="text-bol half-border-bottom">
        <!-- 热门搜索 -->
        {{ i18n_t('search.search_hot') }}
      </div>
      <!-- 热门内容 -->
      <div class="row">
        <div class="col-6 hotItem" v-for="(item, index) in hot_list" :key="index" @click="hotItem_click(item.keyWord)">
          <span class="defaultText" :class="{ redText: index <= 2, 'normal-1': index > 2 }">
            {{ index + 1 }}.
          </span>
          <span class="q-ml-sm" :class="{ keyWordText: index <= 2 }">{{ item.keyWord }}</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { SearchData } from "src/output/index.js";

export default {
  name: 'searchHot',
  props: {
    // 热门数据源
    hot_list: {
      type: Array
    }
  },
  methods: {
    // 点击调用模糊搜索接口
    hotItem_click(text) {
      //TODO
      SearchData.set_search_txt(text);
      this.$emit('get_search_result', true);
    }
  },
  destroyed() {
    // 清除数据
    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
}
</script>
<style lang="scss" scoped>
.searchHot {
  width: 96%;
  min-height: 1.83rem;
  margin: 0 auto 0.18rem;
  font-size: 0.14rem;
  border-radius: 0.15rem;

  .text-bol {
    font-size: 0.14rem;
    height: 0.4rem;
    line-height: 0.4rem;
  }

  .hotItem {
    height: 0.44rem;
    line-height: 0.44rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.15rem;

    .defaultText {


      letter-spacing: 0;
      font-size: 0.14rem;

      &.normal-1 {

        font-weight: bold;
      }
    }

    .redText {
      font-weight: bold;
    }

    .q-ml-sm {
      font-size: 0.16rem;

      &.keyWordText {
        font-weight: bold;
      }
    }
  }
}
</style>