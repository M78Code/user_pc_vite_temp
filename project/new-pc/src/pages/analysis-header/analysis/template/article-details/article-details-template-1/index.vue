<template>
  <div class="wrap relative-position">
    <q-scroll-area class="rule-scroll-area" :visible="true" :style="{ height: '100%' }">
      <div class="article_detail">
        <p class="article_title">{{ articleDetail.articleTittle }}</p>
        <p class="author">
          <span class="author_name">{{ articleDetail.authorName }}</span>
          <span class="time">{{ articleDetail.updateTime }}</span>
          <span class="read_count">{{ articleDetail.readCounts }} 阅读</span>
        </p>
        <div class="article" v-html="articleDetail.articleContent"></div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>

import { ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
import { api_analysis } from 'src/api/index'
import { formatDate } from 'src/output/index.js'
const route = useRoute();
const articleDetail = ref({});
const start_article_tiem = ref(new Date().getTime());

loadArticle()
window.addEventListener('beforeunload', close_win)

/**
 * @Description 加载文章,优先读缓存
*/
const loadArticle = () => {
  let articleCache = localStorage.getItem('_article_obj');
  if (articleCache) {
    let article = JSON.parse(articleCache)
    if (article && article.id == route.params.id) {
      articleDetail.value = article
      setReadCounts.value()
    }
  }
  //无缓存则调用api
  if (!articleDetail.value.id) {
    get_article()
  }
}
/**
 * @Description 设置最新阅读数
*/
const setReadCounts = () => {
  if (route.params.count) {
    let count = Number(route.params.count)
    if (!count) return
    articleDetail.value.readCounts = route.params.count;
  }
}
const close_win = () => {
  if (articleDetail.value.id) {
    let end_tiem = new Date().getTime()
    let info = {
      "文章ID": articleDetail.value.id,
      "页面停留时长": parseInt((end_tiem - start_article_tiem.value) / 1000)
    }
    window.opener.postMessage({ name: 'close_win', info }, '*')
  }
}
/**
 * @Description 获取文章详情
*/
const get_article = () => {
  // matchId文章id type2猜你喜欢详情
  const params = {
    matchId: route.params.id,//Number(
    type: 2,
  }
  api_analysis.getArticlePB(params).then(res => {
    const _data = _.get(res, 'data.data');
    const _code = _.get(res, 'data.code');

    if (_code == 200 && !_.isEmpty(_data)) {
      let _item = typeof (_data) == 'string' ? JSON.parse(_data) : _.cloneDeep(_data);
      // 替换图片域名
      let domain = this.get_server_file_path('getArticle').replace('getArticle', '')
      if (_item.articleContent) {
        _item.articleContent = _item.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER\//g, domain)
      }
      // 格式化时间
      _item.updateTime = formatDate(_item.updateTime)
      document.getElementById('loading-root-ele').style.visibility = 'hidden';
      articleDetail.value = _item
      setReadCounts()
    } else { console.debug('fail') }
  }).catch((e) => {
    console.error(e)
  })
}

onUnmounted(() => {
  window.removeEventListener('beforeunload', close_win)
})

</script>

<style lang="scss" scoped>
.wrap {
  margin: 20px;
  display: flex;
  justify-content: center;
  height: 100vh;
  padding-bottom: 20px;
}

.article_detail {
  background: var(--q-analysis-color-16);
  border: 1px solid #DEE4F2;
  border-radius: 8px;
  height: 100%;
  padding: 15px 38px;
  margin-bottom: 20px;

  p {
    margin-bottom: 16px;
  }

  .article_title {
    font-size: 16px;
    color: #DEE4F2;
    font-weight: 600;
  }

  .author {
    color: var(--q-analysis-color-11);

    .author_name {
      font-weight: 500;
    }

    .time {
      margin: 0 30px 0 10px;
    }
  }

  :deep(.article) {
      * {
        max-width: 100%;
        color: #DEE4F2;
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

/*  内容区 */
.rule-scroll-area {
  flex: 1;
}</style>