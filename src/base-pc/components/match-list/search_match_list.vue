<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:02
 * @Description: 赛事搜索结果列表页
-->
<template>
  <div class="yb-match-list column match-tpl99 relative-position">
    <div class="scroll-fixed-header">
       <!-- 列表头 -->
      <list-header class="relative-position" :collect_count="collect_count">
        <template v-slot:refresh_icon>
          <refresh :loaded="load_data_state!='loading'" @click="on_refresh" />
        </template>
      </list-header>
    </div>
     <!-- 列表容器 -->
    <load-data :state="load_data_state">
      <scroll-list
      >
        <template v-slot:before>
          <div class="scroll-before" :style="{height:fixed_header_height}"></div>
        </template>

        <template>
          <match-list-card
            v-for="card_key in match_list_card.match_list_card_key_arr" 
            :key="card_key+match_list_card.match_list_render_key" 
            :card_key="card_key"
          />
        </template>

        <template v-slot:after>
          <div style="height:15px"></div>
          <!-- 底部分页 -->
          <div class="pager-wrap row justify-end">
            <div class="go-top-btn yb-flex-center" @click="on_go_top">
              <icon-wapper name="icon-go_top" size="14px" />
              <div class="msg">{{ i18n_t("common.back_top") || "" }}</div>
            </div>
          </div>
        </template>
      </scroll-list>
    </load-data>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { api_match } from "src/api/index.js";
import match_list_version_mixin from "src/project/yabo/mixins/match_list/match_list_version_mixin.js";
import skt_data_list from "src/public/mixins/websocket/data/skt_data_list_new_data.js";// 发送websocket命令时使用
import { IconWapper } from 'src/components/icon'
export default {
  name: "SearchMatchList",

  mixins: [match_list_version_mixin,skt_data_list],
  data() {
    return {
      // 是否首次加载
      first_loaded: false,
      socket_name: "search_match_list"
    };
  },

  computed: {
    ...mapGetters({
      // 搜索关键字
      vx_search_keyword: "get_search_keyword",
      // 搜索的联赛名称
      search_league_name: "get_search_league_name",
    }),
  },

  watch: {
    "$route.params": {
      handler() {
        this.search_type = "";

        this.fetch_search_match_list();
      },
      immediate: true,
    },
  },

  created() {
    this.first_loaded = true;
  },
  methods: {
      /***
       * 搜索类型
        */
    on_search(search_type) {
      //设置搜索类型
      this.search_type = search_type;
      //请求数据
      this.fetch_search_match_list();
    },

    /**
     * 搜索相关列表数据
     * @return {undefined} undefined
     */
    fetch_search_match_list(is_socket = false) {


      is_socket || (this.load_data_state = "loading");
      let keyword = this.$route.params.keyword || ''
      if(!is_socket){
        this.match_list_data.init()
      }
      let params = {
        device: "PC",
        cuid: UserCtr.get_uid(),
        keyword: keyword.replace(/_g_/g, "/"),
        searchSportType: this.$route.query.csid,
      };

      api_match.post_search_match(params).then(({ data }) => {
        //保存数据到数据仓库
        this.mx_use_list_res(data, is_socket,true);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.yb-match-list {
  /*  重写背景色 */
  :deep(.q-table__card) {
    box-shadow: none;
    background: transparent;
    .q-virtual-scroll__content {
      background: transparent;
    }
  }

  :deep(.data_layout) {
    z-index: 10;
  }
}

#match-list-scroll {
  position: absolute;
  z-index: 9999;
  border: 1px solid red;
  right: 0;
}
.dir-wrap {
  margin-left: 6px;
  width: 8px;
  height: 8px;
  position: relative;
  &:before,
  &:after {
    content: " ";
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  &:after {
    background: #272a33;
    left: -1px;
    top: -3px;
    height: 15px;
    width: 5px;
  }
  &:before {
    border: 1px solid #595f73;
    transform: rotateZ(45deg);
  }
}
.search-title {
  margin-left: 12px;
}
.search-type-wrap {
  margin-left: 50px;
  .item {
    margin-right: 10px;
    padding: 7px 12px;
    background: #3c3f4c;
    border-radius: 2px;
    color: var(--q-gb-t-c-1);
    line-height: 12px;
    &.active {
      background: var(--qq--yb-text-color1);
      color: #272a33;
    }
  }
}

.list-footer {
  padding: 30px 17px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .pager-wrap {
    color: var(--q-gb-t-c-1);
    :deep(.q-pagination) {
      .q-btn {
        margin: 0 5px;
        color: #999 !important;
        font-size: 12px;
      }
      .bg-primary {
        background: #a5a097 !important;
        border-radius: 4px !important;
        color: #111 !important;
      }
    }
  }
  .footer-wrap {
    padding: 0 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    .no-more-wrap {
      padding: 20px 0;
      .msg {
        margin-left: 5px;
        color: rgba(255, 255, 255, 0.1);
      }
    }
    .go-top-btn {
      margin-left: 25px;
      padding: 0 24px;
      height: 24px;
      line-height: 24px;
      background: #a5a097;
      border-radius: 4px;
      color: #000;
    }
  }
}
</style>
