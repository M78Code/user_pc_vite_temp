<template>
  <div class="news">
    <load-data :state="state" :style="{ 'margin-top': (articleDetail && articleDetail.articleContent) ? 0 : '10%' }"
      :no_data_msg="i18n_t('common.empty_data')">
      <div class="article_detail">
        <p class="article_title">{{ articleDetail.articleTittle }}</p>
        <p class="author">
          <span class="author_name">{{ articleDetail.authorName }}</span>
          <span class="time">{{ formatDate(articleDetail.updateTime) }}</span>
          <span class="read_count">{{ articleDetail.readCounts }} 阅读</span>
        </p>
        <div class="article" v-html="articleDetail.articleContent"></div>
      </div>
      <div class="favorite_list_title">
        猜你喜欢
      </div>
      <load-data :state="showEmpty" :class="[showEmpty && 'empty_data_padding_b']"
        :no_data_msg="i18n_t('common.empty_data')">
        <ul class="favorite_list" v-if="articleList.length > 0">
          <li v-for="(item, i) in articleList" :key="item.id" @click="showArticle(item)">
            <div class="wrap" v-if="i < 3">
              <!-- 封面图片 -->
              <p class="img"
                :style="{ background: `url('${get_server_file_path(item.thumbnails.split(';')[0]) || '/image/yabo/png/article_list_img.png'}') no-repeat left center` }">
              </p>



              <div class="article_info">
                <p class="title ellipsis">
                  <!-- 标签 tagColor: "#399FC8" -->
                  <span v-if="item.tagName" class="tag"
                    :style="{ 'background': `${item.tagColor}` }">{{ item.tagName }}</span>
                  {{ item.articleTittle }}
                </p>
                <!-- 摘要内容 -->
                <p class="detail ellipsis" v-html="item.summary || item.articleContent.replace(/<[^>]+>/gim, '')"></p>
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

<script setup>

// import analysisData  from 'src/public/mixins/analysis/analysis'
// mixins: [analysisData],
import loadData from "src/base-pc/components/load-data/load-data.vue";
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
import { api_analysis, api_common } from 'src/api/index'
import { formatDate } from 'src/output/index.js'
import { get_server_file_path } from 'src/core/file-path/file-path.js'
import { i18n_t } from "src/boot/i18n.js"
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
const props = defineProps(['mid'])
const router = useRouter();
const articleDetail = ref({});
const articleList = ref([]);
const showEmpty = ref('data');
const state = ref('loading');
const openArticle = ref(null);
const start_article_time = ref(0)
const is_send = ref(false) //?

getArticle()
start_article_time.value = new Date().getTime()
window.addEventListener('beforeunload', close_win)
window.addEventListener("message", receipt_data)

function receipt_data ({ data: { name, info } }) {
  if (name == 'close_win') {
    close_win(info, 1)
  }
}

function close_win(info, type) {
  let message = {}
  let name = 'PC_赛事文章_页面停留'
  if (type) {
    message = { name: 'close_win', obj: { name, info } }
  } else if (!is_send.value) {
    let end_tiem = new Date().getTime()
    let obj = {
      "文章ID": articleDetail.value.id,
      "页面停留时长": parseInt((end_tiem - start_article_time.value) / 1000)
    }
    is_send.value = true
    message = { name: 'close_win', obj: { name, info: obj } }
  }
  if (message.name && articleDetail.value.id) {
    window.opener.postMessage(message, '*')
  }
}

/**
 * 获取赛事文章
 */

function getArticle() {
  // matchId赛事id type1文章详情
  const params = {
    matchId: props.mid,
    type: 1,
  }
  api_analysis.getArticlePB(params).then(res => {
    let _data = lodash.get(res, 'data');
    let _code = lodash.get(res, 'code');

    if (_data&&_code == 200) {
      let _item = typeof (_data) == 'string' ? JSON.parse(_data) : lodash.cloneDeep(_data);
      // 替换图片域名
      let domain = get_server_file_path('getArticle').replace('getArticle', '')
      if (_item.articleContent) {
        _item.articleContent = _item.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER\//g, domain)
      }
      articleDetail.value = _item;
      atrticleReadCount(articleDetail.value.id);
      getArticleFavoriteList()
      state.value = 'data'
    } else {
      articleDetail.value = {};
      state.value = 'empty'
    }
  }).catch(() => {
    state.value = 'empty'
  })
}

/**
 * 猜你喜欢 列表
 */
function getArticleFavoriteList() {
  const params = {
    id: articleDetail.value.id,
    matchId: props.mid,
  }
  api_common.getFavoriteArticle(params).then(res => {
    let list = lodash.get(res, 'data');
    if (lodash.get(list, 'length') > 0) {
      if (list.length == 1 && articleDetail.value.id == list[0].id) {
        articleList.value = [];
        showEmpty.value = 'empty';
      } else {
        list.forEach((item, i) => {
          if (item.id == articleDetail.value.id) {
            list.splice(i, 1)
          }
        })
        articleList.value = list;
        showEmpty.value = 'data';
      }
    } else {
      articleList.value = [];
      showEmpty.value = 'empty';
    }
  })
}

/**
 * 文章阅读数
 */
function atrticleReadCount(id) {
  api_common.addArticleCount({ id: id }).then(res => {
    let count = lodash.get(res, 'data.data');
    if (Number(count)) {
      //更新列表阅读数
      articleDetail.value.readCounts = count
    }
  })
}

/**
 * 在新的窗口展示 猜你喜欢 文章
 */
function showArticle(item) {
  openArticle.value = item
  setArticleCache(item.id)
  close_win()

  let url = router.resolve({ path: '/article_details/' + item.id }).href
  url = '/' + url.substr(url.indexOf('#/'))
  let features = `height=700, width=800, top=${(screen.height - 700) / 2}, left=${(screen.width - 800) / 2}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
  //设置默认值
  let strCount = '/0';
  //更新阅读数
  api_common.addArticleCount({ id: item.id }).then(res => {
    let count = lodash.get(res, 'data.data');
    if (Number(count)) {
      //更新列表阅读数
      this.openArticle.readCounts = count
      strCount = `/${count}`
    }
    window.open(url + strCount, '', features)
  }).catch(() => {
    url += strCount;
    window.open(url, '', features)
  })
}

/**
 * @Description 设置文章本地缓存
 * @param {id} 文章id
*/

function setArticleCache(id) {
  // matchId文章id type2猜你喜欢详情
  const params = {
    matchId: id,
    type: 2,
  }
  api_analysis.getArticlePB(params).then(res => {
    const _data = lodash.get(res, 'data.data');
    const _code = lodash.get(res, 'data.code');

    if (_code == 200 && !lodash.isEmpty(_data)) {
      let _item = typeof (_data) == 'string' ? JSON.parse(_data) : lodash.cloneDeep(_data);
      // 替换图片域名
      let domain = get_server_file_path('getArticle').replace('getArticle', '')
      if (_item.articleContent) {
        _item.articleContent = _item.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER\//g, domain)
      }
      // 格式化时间
      _item.updateTime = formatDate(_item.updateTime)
      localStorage.setItem('_article_obj', JSON.stringify(_item))
    }
  })
}


onUnmounted(() => {
  close_win()
  window.removeEventListener('beforeunload', close_win)
  window.removeEventListener("message", receipt_data)
})
</script>

<style lang="scss" scoped>
.news {
  .author {
    font-size: 12px;
    color: var(--q-analysis-color-11);
    font-weight: 400;

    .time {
      margin: 0 50px 0 20px;
    }
  }

  .article_detail {
    background: var(--q-analysis-color-16);
    border: 1px solid var(--q-analysis-color-10);
    border-radius: 8px;
    height: 100%;
    padding: 15px 38px 38px;
    margin: 0 20px;

    p {
      margin-bottom: 16px;
    }

    .article_title {
      font-size: 16px;
      color: var(--q-analysis-color-10);
      font-weight: 600;
    }

    :deep(.article) {
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
          color: var(--q-analysis-color-5);
          letter-spacing: 0;
          text-align: justify;
          line-height: 24px;
        }

        img {
          max-width: 100%;
        }
      

    }
  }

  .favorite_list_title {
    background-image: var(--q-analysis-bg-gradient-4);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.20);
    border-radius: 8px;
    height: 48px;
    line-height: 48px;
    padding-left: 30px;
    font-size: 16px;
    color: var(--q-analysis-color-1);
    font-weight: 500;
    position: relative;
    margin: 20px 20px 30px;

    &:after {
      content: '';
      display: block;
      width: 3px;
      height: 16px;
      background: var(--q-analysis-color-14);
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
        border-bottom: 1px solid var(--q-analysis-color-10);
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
          color: var(--q-analysis-color-10);
          font-weight: 600;
          width: 100%;

          .tag {
            border-radius: 3px;
            font-size: 14px;
            color: var(--q-analysis-color-13);
            letter-spacing: 0;
            text-align: center;
            // line-height: 12px;
            font-weight: 600;
            padding: 3px 10px;
          }
        }

        .detail {
          font-size: 16px;
          color: var(--q-analysis-color-5);
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

  :deep(.load-data-wrap) {
    .empty-wrap {
      .text-center {
        color: var(--q-analysis-color-10);
      }
    }

    &.empty_data_padding_b {
      padding-bottom: 20px;
    }
  }
}</style>