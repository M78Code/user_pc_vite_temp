<!--
 * @Date: 2022-06-24 16:28:09
 * @FilePath: /user-pc1/src/public/components/analysis/template/tab_news.vue
 * @Description: 咨询
 * @Author:

-->
<template>
  <div class="news">
    <load-data
      :state="state"
      :style="{
        'margin-top': articleDetail && articleDetail.articleContent ? 0 : '10%',
      }"
      :no_data_msg="i18n_t('common.empty_data')"
    >
      <div class="article_detail">
        <p class="article_title">{{ articleDetail.articleTittle }}</p>
        <p class="author">
          <span class="author_name">{{ articleDetail.authorName }}</span>
          <span class="time">{{ formatDate(articleDetail.updateTime) }}</span>
          <span class="read_count">{{ articleDetail.readCounts }} 阅读</span>
        </p>
        <div class="article" v-html="articleDetail.articleContent"></div>
      </div>
      <div class="favorite_list_title">猜你喜欢</div>
      <load-data
        :state="showEmpty"
        :class="[showEmpty && 'empty_data_padding_b']"
        :no_data_msg="i18n_t('common.empty_data')"
      >
        <ul class="favorite_list" v-if="articleList.length > 0">
          <li
            v-for="(item, i) in articleList"
            :key="item.id"
            @click="showArticle(item)"
          >
            <div class="wrap" v-if="i < 3">
              <!-- 封面图片 -->
              <p
                class="img"
                :style="{
                  background: `url('${
                    get_server_file_path(item.thumbnails.split(';')[0]) ||
                    '/image/yabo/png/article_list_img.png'
                  }') no-repeat left center`,
                }"
              ></p>

              <div class="article_info">
                <p class="title ellipsis">
                  <!-- 标签 tagColor: "#399FC8" -->
                  <span
                    v-if="item.tagName"
                    class="tag"
                    :style="{ background: `${item.tagColor}` }"
                    >{{ item.tagName }}</span
                  >
                  {{ item.articleTittle }}
                </p>
                <!-- 摘要内容 -->
                <p
                  class="detail ellipsis"
                  v-html="
                    item.summary ||
                    item.articleContent.replace(/<[^>]+>/gim, '')
                  "
                ></p>
                <p class="author">
                  <!-- 作者 -->
                  <span class="author_name">{{ item.authorName }}</span>
                  <!-- 更新时间 -->
                  <span class="time">{{ formatDate(item.updateTime) }}</span>
                  <span class="read_count">{{ item.readCounts }} 阅读</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </load-data>
    </load-data>
  </div>
</template>
<script>
import loadData from "src/base-pc/components/load-data/load-data.vue";
import { api_analysis, api_common } from "src/api/index";
import analysisData from "./analysis";
import { formatDate } from "src/output/index.js";
import { get_server_file_path } from "src/core/file-path/file-path.js";
export default {
  mixins: [analysisData],
  props: {
    mid: Number | String,
  },
  components: { loadData },
  data() {
    return {
      // 文章
      articleDetail: {},
      // 猜你喜欢
      articleList: [],
      showEmpty: "data",
      // 数据加载状态
      state: "loading",
      //打开的文章
      openArticle: null,
      formatDate,
      get_server_file_path,
    };
  },
  created() {
    this.getArticle();
    this.start_article_tiem = new Date().getTime();
    window.addEventListener("beforeunload", this.close_win);
    window.addEventListener("message", this.receipt_data);
  },
  methods: {
    receipt_data({ data: { name, info } }) {
      if (name == "close_win") {
        this.close_win(info, 1);
      }
    },
    close_win(info, type) {
      let message = {};
      let name = "PC_赛事文章_页面停留";
      if (type) {
        message = { name: "close_win", obj: { name, info } };
      } else if (!this.is_send) {
        let end_tiem = new Date().getTime();
        let obj = {
          文章ID: this.articleDetail.id,
          页面停留时长: parseInt((end_tiem - this.start_article_tiem) / 1000),
        };
        this.is_send = true;
        message = { name: "close_win", obj: { name, info: obj } };
      }
      if (message.name && this.articleDetail.id) {
        window.opener.postMessage(message, "*");
      }
    },
    /**
     * 获取赛事文章
     */
    getArticle() {
      // matchId赛事id type1文章详情
      const params = {
        matchId: this.mid,
        type: 1,
      };
      api_analysis
        .getArticlePB(params)
        .then((res) => {
          let _data = lodash.get(res, "data.data");
          let _code = lodash.get(res, "data.code");
          if (_data && _code == 200) {
            let _item =
              typeof _data == "string"
                ? JSON.parse(_data)
                : lodash.cloneDeep(_data);
            // 替换图片域名
            let domain = this.get_file_path("getArticle").replace(
              "getArticle",
              ""
            );
            if (_item.articleContent) {
              _item.articleContent = _item.articleContent.replace(
                /IMAGE_DOMAIN_YUNYING_PLACEHOLDER\//g,
                domain
              );
            }
            this.articleDetail = _item;
            this.atrticleReadCount(this.articleDetail.id);
            this.getArticleFavoriteList();
            this.state = "data";
          } else {
            this.articleDetail = {};
            this.state = "empty";
          }
        })
        .catch(() => {
          this.state = "empty";
        });
    },
    /**
     * 猜你喜欢 列表
     */
    getArticleFavoriteList() {
      const params = {
        id: this.articleDetail.id,
        matchId: this.mid,
      };
      api_analysis.get_favorite_article(params).then((res) => {
        let list = lodash.get(res, "data.data");
        if (lodash.get(list, "length") > 0) {
          if (list.length == 1 && this.articleDetail.id == list[0].id) {
            this.articleList = [];
            this.showEmpty = "empty";
          } else {
            list.forEach((item, i) => {
              if (item.id == this.articleDetail.id) {
                list.splice(i, 1);
              }
            });
            this.articleList = list;
            this.showEmpty = "data";
          }
        } else {
          this.articleList = [];
          this.showEmpty = "empty";
        }
      });
    },
    /**
     * 文章阅读数
     */
    atrticleReadCount(id) {
      api_analysis.get_article_count({ id: id }).then((res) => {
        let count = lodash.get(res, "data.data");
        if (Number(count)) {
          //更新列表阅读数
          this.articleDetail.readCounts = count;
        }
      });
    },
    /**
     * 在新的窗口展示 猜你喜欢 文章
     */
    showArticle(item) {
      this.openArticle = item;
      this.setArticleCache(item.id);
      this.close_win();

      let url = this.$router.resolve({
        path: "/article_details/" + item.id,
      }).href;
      url = "/" + url.substr(url.indexOf("#/"));
      let features = `height=700, width=800, top=${
        (screen.height - 700) / 2
      }, left=${
        (screen.width - 800) / 2
      }, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`;
      //设置默认值
      let strCount = "/0";
      //更新阅读数
      api_analysis
        .get_article_count({ id: item.id })
        .then((res) => {
          let count = lodash.get(res, "data.data");
          if (Number(count)) {
            //更新列表阅读数
            this.openArticle.readCounts = count;
            strCount = `/${count}`;
          }
          window.open(url + strCount, "", features);
        })
        .catch(() => {
          url += strCount;
          window.open(url, "", features);
        });
    },
    /**
     * @Description 设置文章本地缓存
     * @param {id} 文章id
     */
    setArticleCache(id) {
      // matchId文章id type2猜你喜欢详情
      const params = {
        matchId: id,
        type: 2,
      };
      api_analysis.getArticlePB(params).then((res) => {
        const _data = lodash.get(res, "data.data");
        const _code = lodash.get(res, "data.code");

        if (_code == 200 && !lodash.isEmpty(_data)) {
          let _item =
            typeof _data == "string"
              ? JSON.parse(_data)
              : lodash.cloneDeep(_data);
          // 替换图片域名
          let domain = this.get_file_path("getArticle").replace(
            "getArticle",
            ""
          );
          if (_item.articleContent) {
            _item.articleContent = _item.articleContent.replace(
              /IMAGE_DOMAIN_YUNYING_PLACEHOLDER\//g,
              domain
            );
          }
          // 格式化时间
          _item.updateTime = this.formatDate(_item.updateTime);
          localStorage.setItem("_article_obj", JSON.stringify(_item));
        }
      });
    },
  },

  destroyed() {
    this.close_win();
    window.removeEventListener("beforeunload", this.close_win);
    window.removeEventListener("message", this.receipt_data);
  },
};
</script>
<style lang="scss" scoped>
.news {
  .author {
    font-size: 12px;
    color: var(--qq--analysis-text-color-11);
    font-weight: 400;
    .time {
      margin: 0 50px 0 20px;
    }
  }
  .article_detail {
    background: var(--qq--analysis-bg-color-1);
    border: 1px solid var(--qq--analysis-bd-color-4);
    border-radius: 8px;
    height: 100%;
    padding: 15px 38px 38px;
    margin: 0 20px;
    p {
      margin-bottom: 16px;
    }
    .article_title {
      font-size: 16px;
      color: var(--qq--analysis-text-color-10);
      font-weight: 600;
    }
    .article {
      ::v-deep {
        * {
          max-width: 100%;
        }
        .ql-font-serif {
          font-family: Georgia, Times New Roman, serif;
        }
        // Quill 富文本插件 monospace字体样式
        .ql-font-monospace {
          font-family: Monaco, Courier New, monospace;
        }
        .ql-font-sans-serif {
          font-family: sans-serif;
        }
        p {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: var(--qq--analysis-text-color-2);
          letter-spacing: 0;
          text-align: justify;
          line-height: 24px;
        }
        img {
          max-width: 100%;
        }
      }
    }
  }
  .favorite_list_title {
    background-image: var(--qq--analysis-bg-gradient-4);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    height: 48px;
    line-height: 48px;
    padding-left: 30px;
    font-size: 16px;
    color: var(--qq--analysis-text-color-1);
    font-weight: 500;
    position: relative;
    margin: 20px 20px 30px;
    &:after {
      content: "";
      display: block;
      width: 3px;
      height: 16px;
      background: var(--qq--analysis-bg-color-15);
      border-radius: 1.5px;
      position: absolute;
      top: 16px;
      left: 15px;
    }
  }
  // 猜你喜欢 列表
  .favorite_list {
    margin: 0;
    padding: 0 20px;
    list-style: none;
    width: 100vw;
    li {
      .wrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid var(--qq--analysis-bd-color-4);
        padding: 20px 0;
        cursor: pointer;
      }
      .img {
        width: 180px;
        height: 110px;
        margin-right: 24px;
        display: inline-block;
        background-size: 100% !important;
        margin-bottom: 0;
        border-radius: 5px;
      }
      .article_info {
        display: inline-block;
        width: calc(100% - 180px - 24px);
        p:not(:last-child) {
          margin-bottom: 20px;
        }
        .title {
          font-size: 20px;
          color: var(--qq--analysis-text-color-10);
          font-weight: 600;
          width: 100%;
          .tag {
            border-radius: 3px;
            font-size: 14px;
            color: var(--qq--analysis-text-color-13);
            letter-spacing: 0;
            text-align: center;
            // line-height: 12px;
            font-weight: 600;
            padding: 3px 10px;
          }
        }
        .detail {
          font-size: 16px;
          color: var(--qq--analysis-text-color-2);
          line-height: 16px;
          font-weight: 400;
        }
        .author {
          margin-bottom: 0;
          .author_name {
            font-weight: 500;
          }
          .time {
            margin: 0 30px 0 10px;
          }
        }
      }
    }
  }

  :deep(.load-data-wrap){
    .empty-wrap {
      .text-center {
        color: var(--qq--wrap-hot-text-color);
      }
    }
    &.empty_data_padding_b {
      padding-bottom: 20px;
    }
  }
}
</style>
