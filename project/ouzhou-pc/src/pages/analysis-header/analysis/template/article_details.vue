<!--
 * @Date: 2022-07-06 18:31:56
 * @FilePath: /user-pc1/src/public/components/analysis/template/article_details.vue
 * @Description: 打开 猜你喜欢 文章
 * @Author: 
-->

<template>
  <div class="wrap relative-position">
    <q-scroll-area class="rule-scroll-area" :visible="true" :style="{height:'100%'}">
      <div class="article_detail">
        <p class="article_title">{{articleDetail.articleTittle}}</p>
        <p class="author">
          <span class="author_name">{{articleDetail.authorName}}</span>
          <span class="time">{{articleDetail.updateTime}}</span>
          <span class="read_count">{{articleDetail.readCounts}} 阅读</span>
        </p>
        <div class="article" v-html="articleDetail.articleContent"></div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { api_analysis } from 'src/api/index'
export default {
  data() {
    return {
      articleDetail: {}
    }
  },
  created() {    
    this.loadArticle()
    this.start_article_tiem = new Date().getTime()
    window.addEventListener('beforeunload',this.close_win)
  },
  methods: {
    /**
     * @Description 加载文章,优先读缓存
    */    
    loadArticle(){
      let articleCache = localStorage.getItem('_article_obj');
      if(articleCache){
        let article = JSON.parse(articleCache)
        if(article && article.id == this.$route.params.id){
          this.articleDetail = article
          this.setReadCounts()   
        }      
      }
      //无缓存则调用api
      if(!this.articleDetail.id){
        this.get_article()        
      }
    },
    /**
     * @Description 设置最新阅读数
    */    
    setReadCounts(){
      if(this.$route.params.count){
        let count = Number(this.$route.params.count)
        if(!count) return
        this.articleDetail.readCounts = this.$route.params.count;
      }
    },
    close_win(){
      if(this.articleDetail.id){
        let end_tiem = new Date().getTime()
        let info = {
            "文章ID":this.articleDetail.id,
            "页面停留时长": parseInt((end_tiem-this.start_article_tiem)/1000) 
          }
          window.opener.postMessage({name: 'close_win', info},'*')
          }
    },
    /**
     * @Description 获取文章详情
    */
    get_article(){
      // matchId文章id type2猜你喜欢详情
      const params = {
        matchId: this.$route.params.id,//Number(
        type: 2,
      }
      api_analysis.getArticlePB(params).then(res => {
        const _data = lodash.get(res, 'data.data');
        const _code = lodash.get(res, 'data.code');

        if(_code == 200 && !lodash.isEmpty(_data)){          
          let _item = typeof(_data) == 'string' ? JSON.parse(_data):lodash.cloneDeep(_data);     
          // 替换图片域名
          let domain = this.get_file_path('getArticle').replace('getArticle','')
          if(_item.articleContent){
            _item.articleContent = _item.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER\//g,domain)
          }
          // 格式化时间
          _item.updateTime = this.formatDate(_item.updateTime)
          document.getElementById('loading-root-ele').style.visibility = 'hidden';
          this.articleDetail = _item
          this.setReadCounts()          
        }else{console.debug('fail')}
      }).catch((e)=>{
        console.error(e)
      })     
    },
    /**
     * 处理时间戳
     */
    formatDate(date) {
      let _date = ''
      if(date) {
        if ((new Date() - parseInt(date)) >= 86400000) {
          _date = `${new Date(parseInt(date)).getMonth() + 1}月 ${new Date(parseInt(date)).getDate()}日`
        } else if ((new Date() - parseInt(date)) >= 3600000) {
          _date = `${Math.floor((new Date() - parseInt(date)) / 3600000)}小时前`
        } else {
          _date = `${Math.floor((new Date() - parseInt(date)) / 60000)}分钟前`
        }
      }
      return _date;
    },
  },
  destroyed() {
    window.removeEventListener('beforeunload',this.close_win)
  }
}
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
  background: var(--qq--analysis-bg-color-1);
  border: 1px solid var(--qq--analysis-bd-color-4);
  border-radius: 8px;
  height: 100%;
  padding: 15px 38px;
  margin-bottom: 20px;
  
  p {
    margin-bottom: 16px;
  }
  .article_title {
    font-size: 16px;
    color: var(--qq--analysis-text-color-10);
    font-weight: 600;
  }
  .author {
    color: var(--qq--analysis-text-color-11);
    .author_name {
      font-weight: 500;
    }
    .time {
      margin: 0 30px 0 10px;
    }
  }
  .article {
    :deep(*){
      max-width: 100%;
        color: var(--qq--analysis-text-color-10);
    }
    :deep(p){
      font-family: PingFangSC-Regular;
        font-size: 12px;
        color: var(--qq--analysis-text-color-2);
        letter-spacing: 0;
        text-align: justify;
        line-height: 24px;
    }
    :deep(img){
      max-width: 100%;
    }  
    
  }
}
/*  内容区 */
.rule-scroll-area {
  flex: 1;
}
</style>