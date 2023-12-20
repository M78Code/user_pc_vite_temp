<!--
 * @Author:
 * @Description: 赛事分析页文章页面（目前只有足蓝球有）
-->
<template>
 <div class="article-main">
    <template v-if="lodash.isEmpty(article_detail) && !is_loading">
      <no-data which='noMatch' height='500' />
    </template>
    <template v-else-if="article_detail.articleTittle">
      <article-content :article_detail="article_detail"/>
      <article-maylike @maylike_click="maylike_click" :favorite_article_data="favorite_article_data" />
    </template>

    <!-- 弹出框 -->
    <q-dialog v-model="is_show_dialog" content-class="article-dialog" position="bottom" @hide="handle_hide_dialog">
      <div class="dialog-title yb_px12 yb_fontsize16" @click="back"><i class="back yb_mr8"></i>返回</div>
      <div class="dialog-content">
        <template v-if="article_detail2.articleTittle">
          <article-content :article_detail="article_detail2" />
          <article-maylike @maylike_click="maylike_click"  :favorite_article_data="favorite_article_data" :dialog_article_id="article_detail2.id"/>
        </template>
        <template v-else>
          <no-data which='noMatch' height='500' />
        </template>
      </div>
    </q-dialog>

   <!-- 加载中icon -->
   <!-- <loading v-if="is_loading" :top="top" @touchmove.prevent></loading> -->
 </div>
</template>

<script setup>
// import { mapGetters } from "vuex";
import { api_common } from "src/api/index.js";
import noData from "src/base-h5/components/common/no-data.vue";
import articleContent from "src/base-h5/components/details/analysis-matches/article/article-content.vue";
import articleMaylike from "src/base-h5/components/details/analysis-matches/article/article-maylike.vue";
// 加载中
// import loading from "src/base-h5/components/common/loading.vue";
import { onMounted, onUnmounted, watch, ref } from "vue";
import { useRoute } from 'vue-router'
import lodash from 'lodash'
import UserCtr from "src/core/user-config/user-ctr.js";
import { get_server_file_path } from "src/core/file-path/file-path.js"
import ZHUGE from "src/core/http/zhuge-tag";

  // 弹框是否显示
  let is_show_dialog = ref(false)
  // 详情页文章标签下的文章详情
  let article_detail = ref({})
  // 详情页弹框里面的文章详情
  let article_detail2 = ref({})
  // 猜你喜欢
  let favorite_article_data = ref([])
  // 记录点击过的赛事id
  let matchids = ref([])
  // 内容加载中？
  let is_loading = ref(true)
  // 进入文章页面时间
  let enter_article_time = ref(0)
  let route = useRoute()
  let top = ref('58%')


  onMounted(() => {
    get_article(route.params.mid)
  })

  watch(() => is_show_dialog.value, (newValue) => {
    if (newValue) {
        lodash.delay(calc_height, 100)
      } else {
        matchids.value.length = 0
      }
  })


  /**
   * 高度计算，初始化滚动高度
   */
const calc_height = () => {
    let ele = document.querySelector('.article-dialog .q-dialog__inner .dialog-content')
    if (!ele) return
    ele.scrollTop = 0
    if (!ele.style.height) {
      // TODO: 后续修改调整  $utils
      ele.style.height = window.innerHeight - rem(0.92) + 'px'
      ele.style.maxHeight = 'unset'
    }
  }
  /**
   * 文章猜你喜欢
   */
const get_favorite_article = () => {
    api_common.getFavoriteArticle({
      id: article_detail.value.id,
      matchId: route.params.mid
    }).then(reslut => {
      let res = ''
      if (lodash.get(reslut, 'status')) {
        res = reslut.data
      } else {
        res = reslut
      }
      if (res.code == 200 && res.data) {

        favorite_article_data.value = res.data.filter(item => {
          return item.id != article_detail.value.id
        }).slice(0, 3)
      }
    }).catch(err => {
      console.error(err);
    })
  }
  /**
   * 获取文章详情,并且将调用记录添加到后端
   * @param {String} matchId 赛事id
   */
const get_article = (matchId) => {
    // type 1-matchId是赛事id 2-matchId是文章id
    api_common.getArticle({ matchId, type: 1 }).then(reslut => {
      let res = ''
      if (lodash.get(reslut, 'status')) {
        res = reslut.data
      } else {
        res = reslut
      }
      if (res.code == 200 && res.data) {
        // 替换图片域名
        let domain = get_server_file_path('getArticle').replace('getArticle','')
        if(res.data.articleContent){
          res.data.articleContent = res.data.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER/g,domain)
        }
        article_detail.value = res.data
        get_favorite_article()
        add_article_count(article_detail.value.id)

        // 记录进入文章时间
        enter_article_time.value = Date.now()
      }
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      is_loading.value = false
    })
  }
  /**
   * 文章猜你喜欢点击, 调接口获取文章详情
   * @param {Number} index 数组下标
   */
const maylike_click = (index) => {
    const item = favorite_article_data.value[index]
    if (!item) return
    const articleid = item.id

    const articleContent = item.articleContent
    // 有文章内容时就不用调用接口
    const api_fn = articleContent
      ? Promise.resolve({
        code: 200,
        data: Object.assign(item, { articleContent })
      })
      : api_common.getArticle({
        // type 1-matchId是赛事id 2-matchId是文章id
        matchId: articleid,
        type: 2
      })
      api_fn.then(reslut => {
        let res = ''
      if (lodash.get(reslut, 'status')) {
        res = reslut.data
      } else {
        res = reslut
      }
      if (res.code == 200 && res.data) {
        // 替换图片域名
        let domain = get_server_file_path('getArticle').replace('getArticle','')
        if(res.data.articleContent){
          res.data.articleContent = res.data.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER/g,domain)
        }
        article_detail2.value = res.data
        favorite_article_data.value[index].articleContent = res.data.articleContent

        add_article_count(res.data.id)
        matchids.value.push(index)
        matchids.value.last_click = true
        calc_height()

        // 触发停留时长埋点
        const article_id = matchids.value.length === 1 ? article_detail.value.id : favorite_article_data.value[matchids.value.length - 2].id
        handle_stay_duration(article_id)
      }
      is_show_dialog.value = true
    }).catch(err => {
      console.error(err);
    })
  }
  /**
   * 返回按钮点击
   */
const back = () => {
    handle_stay_duration(article_detail2.value.id)

    if (matchids.value.last_click) {
      matchids.value.last_click = false
      matchids.value.pop()
    }
    if (matchids.value.length) {
      article_detail2.value = favorite_article_data.value[matchids.value.pop()]
    } else {
      is_show_dialog.value = false
      matchids.value.length = 0
    }
    calc_height()
  }
  /**
   * 增加一次阅读数
   * @param {string} id 文章id
   */
const add_article_count = (id) => {
    id = Number(id)
    api_common.addArticleCount({ id }).catch()
  }
  /**
   * 诸葛埋点——文章停留时长
   */
const handle_stay_duration = (article_id) => {
    const EVENT_NAME = 'H5_赛事文章_页面停留'
    const stay_duration = parseInt((Date.now() - enter_article_time.value) / 1000)
    const zhuge_obj = {
      "页面停留时长": stay_duration,
      "文章ID": article_id
    }

    // 若文章不存在或停留时长为0，则不发送埋点数据
    if (!article_id || !stay_duration) {
      return
    }
    // TODO: $utils 后续修改调整
    ZHUGE.send_zhuge_event(EVENT_NAME, UserCtr, zhuge_obj)
    enter_article_time.value = Date.now()
  }
  /**
   * 点击顶部遮罩 退出 猜你喜欢 时触发埋点
   * @param e
   */
const handle_hide_dialog = (e) => {
    handle_stay_duration(article_detail2.value.id)
  }
  onUnmounted(() => {
    handle_stay_duration(article_detail.value.id)
  })
  // beforeUnmount() {
  //   handle_stay_duration(article_detail.id)
  // }
</script>

<style scoped lang="scss">
.article-dialog {
  .dialog-title {
    height: 0.48rem;
    width: 3.75rem;
    margin: 0 -0.16rem;
    line-height: 0.48rem;
  }
  .back {
    display: inline-block;
    transform: translateY(0.02rem);

    width: 0.1rem;
    height: 0.18rem;
    background: var(--q-color-com-img-bg-3) no-repeat center / 96% 96%;
    background-size: 100% 100%;
  }
}
</style>

<style>
/* ************** 弹框内的样式写到全局才生效 **************  */
.article-dialog .q-dialog__inner {
  border-radius: 0.2rem 0.2rem 0 0;
}
.article-dialog .q-dialog__inner > div {
  box-shadow: unset;
}
</style>