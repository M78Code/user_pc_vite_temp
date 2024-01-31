<script setup name="maylike">
import AnalysisCard from "../AnalysisCard.vue"
import { get_server_file_path } from "src/core/file-path/file-path.js"
import { formete_date } from 'src/output/index';

const props = defineProps({
    favorite_article_data: {
        type: Array,
        default: () => []
    },
    // 弹框里面展示的文章的文章id
    dialog_article_id: {
        type: String,
        default: '',
    }
})

const show_details = function(index){
    this.$emit('maylike_click', index)
}

const img_src = function(val) {
    let src = (val || '').split(';')[0]
    return get_server_file_path(src)
}
const handle_img_load_error = function(e) {
    e.target.hidden = true
    e.target.onerror = null
}
</script>

<template>
    <AnalysisCard :title="i18n_t('home_popular.you_may_also_like')">
        <template #body>
            <div class="maylike" v-for="(item,index) of favorite_article_data" :key="index" @click="show_details(index)">
                <div class="maylike--left">
                    <p class="top">
                        <span class="label" v-if="item.tagName" :style="{'background-color': item.tagColor}">{{item.tagName}}</span>
                        <span>{{item.articleTittle}}</span>
                    </p>
                    <p class="bottom">
                        <span class="author-name ellipsis">{{item.authorName}}</span>
                        <span class="yb_ml6">{{item.readCounts}}{{ i18n_t('ouzhou.detail.read') }}</span>
                        <span style="margin-left: auto;">{{ formete_date(item.updateTime) }}</span>
                    </p>
                </div>
                <div class="maylike--right">
                    <img :src="img_src(item.thumbnails)" alt="" @error="handle_img_load_error">
                </div>
            </div>
        </template>
    </AnalysisCard>
</template>

<style scoped lang="scss">
.maylike{
    width: 100%;
    padding: .12rem .08rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 104px;
    &--left{
        flex-basis: 65%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top{
            color: #1A1A1A;
            font-size: .12rem;
            font-weight: 600;
            .label{
                padding: .02rem .04rem;
                border-radius: .04rem;
                color: #fff;
                margin-right: .04rem;
            }
        }
        .bottom{
            display: flex;
            justify-content: space-between;
            color: #8A8986;
        }
    }
    &--right{
        flex-basis: 35%;
        height: 100%;
        margin-left: .08rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
}

</style>