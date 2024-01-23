

<template>
    <nav class="search-wapper" ref="searchWapperRef" :key="SearchWapperRefKey">
        <span v-show="false">{{ SearchPCClass.update_time }}</span>
        <div class="search-placeholder-box cursorPointer" v-if="!SearchPCClass.search_isShow" @click.stop="ShowSearch(true)">
            <p>请输入联赛名或球队名....</p>
            <icon-wapper class="icon" :name="!['theme01_y0', 'theme02_y0'].includes(UserCtr.theme) ? `img:${img_search_icon}` : `img:${img_search_icon_y0}`" size="14px"></icon-wapper>
        </div>
        <div ref="refSearchWapper" class="search-history-box" v-else>
            <div class="inputBox" :style="{ width: LayOutMain_pc.layout_content_width + 219 + 'px' }">
                <icon-wapper class="icon" :name="`img:${img_search_icon_y0}`" size="14px"></icon-wapper>
                <input type="text" placeholder="请输入联赛名或球队名" v-model="SearchPCClass.keyword" @keyup.enter="_addSearchHistory(SearchPCClass.keyword)"/>
                <p class="cursorPointer search-close" @click.self.stop="ShowSearch(false)">关闭</p>
            </div>
            <div class="historyBox" :style="{ width: LayOutMain_pc.layout_content_width +  219 + 'px' }">
                <!--  @onclick="tab_click" :hasActivity="hasActivity" -->
                <div class="historyBoxTab">
                    <TabWapper :list="SearchPCClass.sportList" :is_show_line="true" :line_width="40" :is_show_btn="true" tab_name_key="sportName" :padding="10" @onclick="set_sports_tab_index" :currentIndex="current_index" ref="tab" />
                </div>
                
                <!-- <Tab :list="nav_list" @onclick="tab_click" is_show_line :currentIndex="current_index" :padding="15"
                        :hasActivity="hasActivity" :line_width="36" /> -->
                <bevisSearchList v-show="(SearchPCClass?.searchHistory || []).length" kind="history"
                                    :list="SearchPCClass?.searchHistory ?? []" @Delete="_deleteSearchHistory" />
                <bevisSearchList kind="hot" :list="SearchPCClass?.hotSearchList ?? []" @Search="_addSearchHistory" />
            </div>
            <div class="maskBox" @click.stop="ShowSearch(false)" :style="{ width: LayOutMain_pc.layout_content_width + 219 + 'px' }"></div>
        </div>
    </nav>
</template>
<script setup name="bevis-header-search">
import {IconWapper} from 'src/components/icon/index.js'
import { TabWapper } from "src/components/common/tab"
// import { TabWapper as Tab } from "src/components/common/tab"
// import Tab from 'src/components/common/tab/tab-1/index.vue'
import bevisSearchList from "./bevis-search-list.vue"

import { get_hot_search, get_hot_push, get_search_sport, get_history_search, insert_history,
    get_delete_history_search, get_search_result } from "src/api/module/search"

import { ref, onMounted, provide ,onUnmounted} from "vue"
import {compute_local_project_file_path, LayOutMain_pc} from 'src/output/index.js'

import UserCtr from "src/core/user-config/user-ctr.js"
import {SearchPCClass} from 'src/output/project/index.js'

const img_search_icon = compute_local_project_file_path('/image/svg/search-icon.svg')
const img_search_icon_y0 = compute_local_project_file_path('/image/svg/y0-search-icon.svg')

const SearchWapperRef = ref(null)
const SearchWapperRefKey = ref(0)

const current_index = ref(0)
const refSearchWapper = ref(null);
const set_sports_tab_index = ({index = 0}) =>{
    current_index.value = index;
}

const ShowSearch = function (toggle){
    SearchPCClass.set_search_isShow(toggle)
    if(toggle) initData();
    ++SearchWapperRefKey.value
}
const ChangeShowHotListData = function (){
    SearchPCClass.changeHotListKind()
}
/**
 * @_getHotSearch 热门搜索
 * @_getHotPush 热门推荐
 * */
const _getHotSearch = function (){
    get_hot_search().then(({data})=>{
        SearchPCClass.set_search_hotList(data)
    })
}
const _getHotPush = function (){
    get_hot_push().then(({data})=>{
        SearchPCClass.set_search_pushList(data)
    })
}
const _getSportList = function (){
    get_search_sport().then(({data})=>{
        SearchPCClass.set_search_sport(data)
    })
}

/**
 * 以下搜索历史记录相关
 * @_addSearchHistory 增加搜索历史记录
 * @_deleteSearchHistory 删除单条历史记录
 * @_clearSearchHistory 清空历史记录
 *
 * */

const _getSearchHistory = function (){
    get_history_search({
        cuid: UserCtr.get_uid(),
        isPc: 1
    }).then(({data})=>{
        SearchPCClass.set_search_history(data)
    })
}
const _addSearchHistory = function (keyword){
    insert_history({
        keyword,
        cuid: UserCtr.get_uid(),
        pageNumber: 1,
        rows: 200,
        isPc: true,
        searchSportType: 1
    }).then(()=>{
        SearchPCClass.add_history({
            cuid: UserCtr.get_uid(),
            id: "",
            isPc: null,
            keyword
        })
    })

    _querySearchResults()
}
const _deleteSearchHistory = function (keyword){
    get_delete_history_search({
        keyword,
        cuid: UserCtr.get_uid()
    }).then(()=>{
        SearchPCClass.deletion_history_one(keyword)
    })
}
const _clearSearchHistory = function (){
    get_delete_history_search().then(()=>{
        SearchPCClass.clear_history()
    })
}
const _querySearchResults = function (keyword){
    get_search_result({
        keyword,
        cuid: UserCtr.get_uid(),
        pageNumber: 1,
        rows: 200,
        isPc: true,
        searchSportType: 1
    }).then(()=>{

    })
}
/**
 * 初始化数据
 */
const initData = () =>{
    _getSearchHistory()
    _getSportList()
    _getHotSearch()
    _getHotPush()
}
provide('ClearHistories',_clearSearchHistory)
provide('ChangeShowHotListData',ChangeShowHotListData)

onMounted(()=>{
    initData()
})
onUnmounted(() => {
})
</script>
<style scoped lang="scss">
.cursorPointer{
    cursor: pointer;
}
.search-close {
    position: relative;
    padding-left: 24px;
    display: flex;
    align-items: center;
    &::before {
        content: ' ';
        height: 20px;
        width: 1px;
        display: block;
        background-color: #DEE4F2;
        position: absolute;
        left: 0;
    }
}
p{
    margin: 0;
    padding: 0;
}
.search-wapper {
    width: 220px;
    height: 100%;
    position: relative;

    .search-placeholder-box {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(--q-site-header-color-9);
        padding: 0 16px;
        box-sizing: border-box;

        > p {
            margin: 0;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .search-history-box{
        position: relative;
        height: 100%;
        .inputBox{
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #E9F0FF;
            z-index: 999;
            padding: 0 24px;
            box-sizing: border-box;
            >input{
                flex: 1;
                margin: 0 16px;
                border: none;
                background: #E9F0FF;
                height: 80%;
                &:focus-visible{
                    outline: none;
                }
            }
            >p{
                margin: 0;
            }
        }
        .maskBox {
            background: rgb(0, 0, 0, .2);
            height: 100vh;
        }
        .historyBox{
            min-height: 320px;
            position: absolute;
            background: #F6F9FF;
            top: calc(100% + 6px);
            left: 0;
            z-index: 999;
            padding: 0 12px 12px;
            box-sizing: border-box;
            .historyBoxTab{
                height:44px;
                :deep(.tab-wrap) {
                    width: 100%
                }
                :deep(.line-wrap){
                    transform: translateY(0);
                }
            }
        }
    }
}
</style>