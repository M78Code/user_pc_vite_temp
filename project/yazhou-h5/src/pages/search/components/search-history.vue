<template>
  <div class='searchHistory'>
    <div class="q-mx-md">
      <div class="text-bol half-border-bottom">
        <!-- 搜索历史 -->
        {{ i18n_t('search.search_history') }}
      </div>
      <!-- h5的搜索历史记录只显示3个，做兜底处理，免得后台返回多了，样式错乱，编辑器报错不用管 -->
      <div v-for="(item, index) in history_list" :key="index" class="historyItem half-border-bottom" v-show="index <= 2">
        <div @click="item_click(item.keyword)">
          <span class="color-000000">{{ item.keyword }}</span>
        </div>

        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/delete4.svg`" alt="" style="width:0.12rem" class="float-right"
          @click="remove_history_item(item)">
      </div>
      <div class="text-center clear-all remove-history-item" @click="remove_history_item('')">
        <!-- 清除搜索记录 -->
        {{ i18n_t('search.clear_search_history') }}
      </div>
    </div>
  </div>
</template>

<script>
import { SearchData,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
export default {
  name: 'searchHistory',
  props: {
    // 搜索历史数据源
    history_list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      LOCAL_PROJECT_FILE_PREFIX
    }
  },

  methods: {
    // 点击调用模糊搜索接口，
    item_click(val) {
      //TODO
      SearchData.set_search_txt(val);
      this.$emit('get_search_result', true);
    },
    // 去除当前点击的历史记录
    remove_history_item(item) {
      this.$emit('delete_history', item)
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
.searchHistory {
  width: 96%;
  margin: 0 auto;

  border-radius: 0.15rem;
  font-size: 0.14rem;
  margin-bottom: 0.1rem;

  .text-bol {
    font-size: 0.14rem;

    height: 0.4rem;
    line-height: 0.4rem;
    // position: relative;

    // &:after {
    //   content: '';
    //   position: absolute;
    //   left: 50%;
    //   transform: translateX(-50%);
    //   width: 3.45rem;
    //   bottom: 0;
    //   height: 0.01rem;


    //   border-radius: 8px;
    // }
  }

  .historyItem {
    height: 0.4rem;
    line-height: 0.4rem;

    // position: relative;

    // &:after {
    //   content: '';
    //   position: absolute;
    //   left: 50%;
    //   transform: translateX(-50%);
    //   width: 3.45rem;
    //   bottom: 0;
    //   height: 0.01rem;


    //   border-radius: 8px;
    // }

    >div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .access_time {
      margin-top: -2px;
    }

    .color-000000 {

      font-family: PingFangSC-Regular;
      font-size: 0.16rem;
    }

    i {}

    .float-right {
      height: 44px;
      line-height: 44px;
      margin-top: -44px;
      padding-left: 2px;
    }
  }

  .clear-all {
    height: 0.44rem;
    line-height: 0.44rem;

    font-size: 0.13rem;
  }
}
</style>