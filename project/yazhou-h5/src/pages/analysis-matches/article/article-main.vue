<!--
 * @Author: Router
 * @Description: 赛事分析页文章页面（目前只有足蓝球有）
-->
<template>
 <div class="article-main">
    <template v-if="_.isEmpty(article_detail) && !is_loading">
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
   <loading v-if="is_loading" top="58%" @touchmove.prevent></loading>
 </div>
</template>

<script>
import { mapGetters } from "vuex";
import { api_common } from "src/project/api/index.js";
import noData from "src/project/components/common/no_data.vue";
import articleContent from "src/project/pages/details/analysis-matches/article/article_content.vue";
import articleMaylike from "src/project/pages/details/analysis-matches/article/article_maylike.vue";
import loading from "src/project/components/common/loading";  // 加载中
export default {
  name: 'article-main',
  data() {
    return {
      is_show_dialog: false, // 弹框是否显示
      article_detail: {},    // 详情页文章标签下的文章详情
      article_detail2: {},   // 详情页弹框里面的文章详情
      favorite_article_data: [],  // 猜你喜欢
      matchids: [], // 记录点击过的赛事id
      is_loading: true, // 内容加载中？
      enter_article_time: 0 // 进入文章页面时间
    };
  },
  components: {
    articleMaylike,
    articleContent,
    noData,
    loading,
  },
  mounted() {
    this.get_article(this.$route.params.mid)
  },
  watch: {
    is_show_dialog(newValue) {
      if (newValue) {
        _.delay(this.calc_height, 100)
      } else {
        this.matchids.length = 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'get_user',
    ]),
  },

  methods: {
    /**
     * 高度计算，初始化滚动高度
     */
    calc_height() {
      let ele = document.querySelector('.article-dialog .q-dialog__inner .dialog-content')
      if (!ele) return
      ele.scrollTop = 0
      if (!ele.style.height) {
        ele.style.height = window.innerHeight - this.$utils.rem(0.92) + 'px'
        ele.style.maxHeight = 'unset'
      }
    },
    /**
     * 文章猜你喜欢
     */
    get_favorite_article() {
      api_common.getFavoriteArticle({
        id: this.article_detail.id,
        matchId: this.$route.params.mid
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.favorite_article_data = res.data.filter(item => {
            return item.id != this.article_detail.id
          }).slice(0, 3)
        }
      }).catch(err => {
        console.error(err);
      })
    },
    /**
     * 获取文章详情,并且将调用记录添加到后端
     * @param {String} matchId 赛事id
     */
    get_article(matchId) {
      // type 1-matchId是赛事id 2-matchId是文章id
      api_common.getArticle({ matchId, type: 1 }).then(res => {
        if (res.code == 200 && res.data) {
          // 替换图片域名
          let domain = this.get_file_path('getArticle').replace('getArticle','')
          if(res.data.articleContent){
            res.data.articleContent = res.data.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER/g,domain)
          }
          this.article_detail = res.data
          this.get_favorite_article()
          this.add_article_count(this.article_detail.id)

          // 记录进入文章时间
          this.enter_article_time = Date.now()
        }
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        this.is_loading = false
      })
    },
    /**
     * 文章猜你喜欢点击, 调接口获取文章详情
     * @param {Number} index 数组下标
     */
    maylike_click(index) {
      const item = this.favorite_article_data[index]
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
          matchId: articleid, type: 2
        })
        api_fn.then(res => {
        if (res.code == 200 && res.data) {
          // 替换图片域名
          let domain = this.get_file_path('getArticle').replace('getArticle','')
          if(res.data.articleContent){
            res.data.articleContent = res.data.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER/g,domain)
          }
          this.article_detail2 = res.data
          this.favorite_article_data[index].articleContent = res.data.articleContent

          this.add_article_count(res.data.id)
          this.matchids.push(index)
          this.matchids.last_click = true
          this.calc_height()

          // 触发停留时长埋点
          const article_id = this.matchids.length === 1 ? this.article_detail.id : this.favorite_article_data[this.matchids.length - 2].id
          this.handle_stay_duration(article_id)
        }
        this.is_show_dialog = true
      }).catch(err => {
        console.error(err);
      })
    },
    /**
     * 返回按钮点击
     */
    back() {
      this.handle_stay_duration(this.article_detail2.id)

      if (this.matchids.last_click) {
        this.matchids.last_click = false
        this.matchids.pop()
      }
      if (this.matchids.length) {
        this.article_detail2 = this.favorite_article_data[this.matchids.pop()]
      } else {
        this.is_show_dialog = false
        this.matchids.length = 0
      }
      this.calc_height()
    },
    /**
     * 增加一次阅读数
     * @param {string} id 文章id
     */
    add_article_count(id) {
      id = Number(id)
      api_common.addArticleCount({ id }).catch()
    },
    /**
     * 诸葛埋点——文章停留时长
     */
    handle_stay_duration(article_id) {
      const EVENT_NAME = 'H5_赛事文章_页面停留'
      const stay_duration = parseInt((Date.now() - this.enter_article_time) / 1000)
      const zhuge_obj = {
        "页面停留时长": stay_duration,
        "文章ID": article_id
      }

      // 若文章不存在或停留时长为0，则不发送埋点数据
      if (!article_id || !stay_duration) {
        return
      }

      this.$utils.zhuge_event_send(EVENT_NAME, this.get_user, zhuge_obj)
      this.enter_article_time = Date.now()
    },
    /**
     * 点击顶部遮罩 退出 猜你喜欢 时触发埋点
     * @param e
     */
    handle_hide_dialog(e) {
      this.handle_stay_duration(this.article_detail2.id)
    },
  },
  destroyed() {
    this.handle_stay_duration(this.article_detail.id)
  }
}

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
