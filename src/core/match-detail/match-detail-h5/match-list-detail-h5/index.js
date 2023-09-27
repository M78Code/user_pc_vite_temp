







import PageSourceData  from  "src/core/page-source/page-source.js"

/**
 * H5   列表 和 详情  之间的 数据中间件 
 * 
 * 1. 列表跳转 详情的 ：
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






class  MatchListDetailMiddleware{


    constructor(){
 

    }

 
}