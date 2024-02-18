<!--篮球资讯组件-->
<script setup name="Information">
import { api_analysis, api_common } from "src/api/index";
import { onBeforeMount, reactive, inject } from "vue";
import articleContent from "./content.vue";
import maylike from "./maylike.vue";
import NoData from "../NoData.vue";

import { get_server_file_path } from "src/core/file-path/file-path.js"

/* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue */
const match_detail = inject("match_detail");

const State = reactive({
    is_show_dialog: false, // 弹框是否显示
    articleDetail: {}, // 详情页文章标签下的文章详情
    articleDetail2: {}, // 详情页弹框里面的文章详情
    favoriteArticleData: [], // 猜你喜欢
    matchids: [], // 记录点击过的赛事id
    loading: true, // 内容加载中？
    enterArticleTime: 0, // 进入文章页面时间
});

/* 增加一次阅读 */
const _addArticleReadCount = function(id){
    api_common.addArticleCount({ id: +id })
}

/* 获取文章 猜你喜欢 */ 
const _getFavoriteArticle = function(){
    api_common.getFavoriteArticle({
        id: State.articleDetail.id,
        matchId: match_detail.value.mid
    }).then(res => {
        if (res.code == 200 && res.data) {
            State.favoriteArticleData = res.data.filter(item => {
                return item.id != State.articleDetail.id
            }).slice(0, 3)
        }
    }).catch(err => {
        console.error(err);
    })
}

/* 逐个埋点——文章停留时长 */
const handle_stay_duration = function(article_id) {
    const EVENT_NAME = 'H5_赛事文章_页面停留'
    const stay_duration = parseInt((Date.now() - this.enter_article_time) / 1000)
    const zhuge_obj = {
        "页面停留时长": stay_duration,
        "文章ID": article_id
    }

    // 若文章不存在或停留时长为0，则不发送埋点数据
    if (!article_id || !stay_duration) return

    this.$utils.zhuge_event_send(EVENT_NAME, this.get_user, zhuge_obj)
    this.enter_article_time = Date.now()
}

const calc_height = () => {
    let ele = document.querySelector('.article-dialog .q-dialog__inner .dialog-content')
    if (!ele) return
    ele.scrollTop = 0
    if (!ele.style.height) {
        // TODO: 后续修改调整  $utils
        ele.style.height = window.innerHeight - rem(0.92) + 'px'
        console.log(window.innerHeight - rem(0.92) + 'px','px');
        ele.style.maxHeight = 'unset'
    }
}

/*
    替换富文本返回无用图片域名 
    IMAGE_DOMAIN_YUNYING_PLACEHOLDER 固定值
    get_server_file_path 会拼接传入图片地址并且获得完整路径
    这边随便传入参数然后替换 以获得 图片域名
*/ 
const replaceImageDomain = function(content){
    if(!!content){
        const domain = get_server_file_path('getArticle').replace('getArticle', '');
        return content.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER/g, domain);
    }else{
        return content
    }
}

// const maylike_click = (index) => {
//     const item = State.favoriteArticleData[index]
//     if (!item) return
//     const { id:articleid, articleContent } = item

//     // 有文章内容时就不用调用接口
//     const api_fn = articleContent ? Promise.resolve({ code: 200, data: Object.assign(item, { articleContent }) })
//         : api_common.getArticle({
//             // type 1-matchId是赛事id 2-matchId是文章id
//             matchId: articleid,
//             type: 2
//         })
//         api_fn.then(reslut => {
//             let res = ''
//         if (lodash.get(reslut, 'status')) {
//             res = reslut.data
//         } else {
//             res = reslut
//         }
//         if (res.code == 200 && res.data) {
//             // 替换图片域名
//             let domain = get_server_file_path('getArticle').replace('getArticle','')
//             if(res.data.articleContent){
//             res.data.articleContent = res.data.articleContent.replace(/IMAGE_DOMAIN_YUNYING_PLACEHOLDER/g,domain)
//             }
//             article_detail2.value = res.data
//             favorite_article_data.value[index].articleContent = res.data.articleContent

//             add_article_count(res.data.id)
//             matchids.value.push(index)
//             matchids.value.last_click = true
//             calc_height()
//             // 触发停留时长埋点
//             const article_id = matchids.value.length === 1 ? article_detail.value.id : favorite_article_data.value[matchids.value.length - 2].id
//             handle_stay_duration(article_id)
//         }
//         is_show_dialog.value = true
//     }).catch(err => {
//         console.error(err);
//     })
// }

const maylike_click = async (index) => {
    const item = State.favoriteArticleData[index];

    if (!item) return;

    const { id:articleid, articleContent } = item

    try {
        const reslut = articleContent
        ? { code: 200, data: { ...item, articleContent } }
        : await api_common.getArticle({ matchId: articleid, type: 2 });

        const res = lodash.get(reslut, 'status') ? reslut.data : reslut;
        if(res.code !== 200 || lodash.isEmpty(res.data)) throw new err('暂时没有数据')
            
        res.data.articleContent = replaceImageDomain(res.data.articleContent)

        State.articleDetail2 = res.data;
        State.favoriteArticleData[index].articleContent = res.data.articleContent

        _addArticleReadCount(res.data.id);
        matchids.value.push(index);
        matchids.value.last_click = true;
        calc_height();

        // 触发停留时长埋点
        const article_id = matchids.value.length === 1 ? article_detail.value.id : favorite_article_data.value[matchids.value.length - 2].id;
        handle_stay_duration(article_id);

        State.is_show_dialog = true;
    } catch (err) {
        console.error(err);
    }
};


/**
 * 点击顶部遮罩 退出 猜你喜欢 时触发埋点
 * @param e
 */
const handle_hide_dialog = function(e) {
    handle_stay_duration(State.articleDetail2.id)
}

/* 获取文章详情 */
const _getArticle = function () {
    api_analysis.getArticlePB({ 
        matchId: match_detail.value.mid,
        type: 1 
    }).then((res) => {
        State.loading = true
        if(res.code != 200 || lodash.isEmpty(res.data)) return
        
        res.data.articleContent = replaceImageDomain(res.data.articleContent)
        State.articleDetail = res.data;
        _getFavoriteArticle();
        if(State.articleDetail?.id){
            _addArticleReadCount(State.articleDetail.id);
        }

        // 记录进入文章时间
        State.enterArticleTime = Date.now();
    }).finally(() => {
        State.loading = false;
    });
};

onBeforeMount(() => {
    _getArticle();
});
</script>

<template>
    <article class="analysisBasketball">
        <template v-if="lodash.isEmpty(State.articleDetail)">
            <NoData></NoData>
        </template>
        <template v-else>
            <articleContent :article_detail="State.articleDetail"></articleContent>
            <maylike @maylike_click="maylike_click" :favorite_article_data="State.favoriteArticleData"></maylike>
        </template>
    </article>

    <!-- 咨询弹窗 -->
    <q-dialog v-model="is_show_dialog"  content-class="article-dialog" position="bottom" @hide="handle_hide_dialog">
        <div class="dialog-title yb_px12 yb_fontsize16" @click="back"><i class="back yb_mr8"></i>返回</div>
        <div class="dialog-content">
            <template v-if="article_detail2.articleTittle">
                <articleContent :article_detail="article_detail2" />
            <article-maylike @maylike_click="maylike_click"  :favorite_article_data="favorite_article_data" :dialog_article_id="article_detail2.id"/>
            </template>
            <template v-else>
                <NoData which='noMatch' height='500' />
            </template>
        </div>
    </q-dialog>
</template>

<style lang="scss" scoped></style>