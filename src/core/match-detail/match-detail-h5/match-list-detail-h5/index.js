import PageSourceData  from  "src/core/page-source/page-source.js"
import { MatchDataWarehouse_H5_List_Common as MatchListData, MatchDataWarehouse_H5_Detail_Common as MatchDetailData } from "src/core/index.js";
import { useRoute } from "vue-router"
import baseData from "src/core/base-data/base-data.js"

/**
 * H5   列表 和 详情  之间的 数据中间件 
 * 
 * 1. 列表跳转详情的 ：
 *   ==》跳转详情之前 
 *   ==》调用列表数据仓库 读取当前mid 的 mid_obj
 *   ==》直接设置 详情数据仓库 set_list([obj])
 *   ==》跳转详情
 * 
 * 
 * 2.  详情跳转列表 
 *          赛事已结束： {
 *          ==> 拉取一次元数据 ，菜单和 列表队列映射关系  
 *          }
 *          赛事没有结束：{
 *            不用去数据同步
 *            ===》读取之前存的 来源菜单 来源页面 
 *            ===》调用菜单那边的方法  设置 要用的菜单 
 *            ===》切路由 
 *            ===》列表走自己的 整体逻辑
 *           
 *          }
 *  
 * 需要存储：
 *  1. 从哪里来  ， （为了 知道 往哪里返回）  
 * 
 * 
 */






export default class  MatchListDetailMiddleware{


    constructor(){
        this.route = useRoute()
        // 来源页面  source_page
    }
    /**
     * 进入详情页面前获取列表数据仓库mid_obj数据
     */
    get_match_list_mid_obj(mid) {
        // 获取列表
       let mid_data =  MatchListData.list_to_obj.mid_obj[`${mid}_`]
       MatchDetailData.set_match_details(mid_data)
    }
     /**
      * 详情跳列表逻辑
      */
    go_to_match_list_page(mid) {
        //赛事是否结束  ms: 0:未开始 1:进行中 2:暂停 3:结束 4:关闭
        let ms = MatchDetailData.list_to_obj.mid_obj[`${mid}_`].ms
        if (ms == 3) {
            // 赛事已结束
            // 拉取元数据
            baseData.init_base_data()
        } else {
            // 赛事未结束
        }
    }
    /**
     * 详情返回上一页逻辑
     */
    // TODO: this.get_is_banner_jump  this.get_is_close_video this.get_golistpage  this.get_godetailpage  this.set_godetailpage  待确认
    go_to_back() {
        // 从视频直播进来返回时
        if (this.get_is_banner_jump) {    
            // 返回到视频直播页   
            this.route.push({name: 'home'});      
        } 
        else if (
            // 从规则页返回到虚拟体育页时，再点击返回要返回到列表页
            this.route.query.from == 'rule_description' ||
            // 如果赛事关闭
            this.get_is_close_video || 
            // 赛果页返回
            ['result_details', 'match_result'].includes(this.route.name) ||
            // 如果商户要求不要首页
            this.get_golistpage
        ) {
            // 返回列表页
            this.route.push({name: 'matchList'});     
        }
        else if(this.get_godetailpage){  
            //如果商户是直接从外面跳到的详情页
            this.route.push({name: 'matchList'});
            // 重置数据
            this.set_godetailpage(false); 
        }
        else{
            // 返回上一级菜单
            this.route.go(-1);             
        }
      }
}