#### z-index统计
###### TODO 类名及层级值暂时仅供参考，待实际开发后同步修改
|区域|作用|类名|层级值|备注|
|----|----|----|----|----|
|全局(global)|||-1到-10(隐藏)，层级值最高为2000|
|    |提示信息| .tip-message  | 2000|
|    |全局loading|.loading| 1999|
|    |全局弹窗|.global-popup| 1998|
|    |全局遮罩|   | 1997|
| 赛果       | 【赛果2.0】展开一场赛事，比分栏会遮盖滚动条                  | .select-content                                | 2         |
| 主列表菜单 | 蒙层                                                         | .cathectic-shade                               | 1000      |
| 主列表菜单 | 真实滚动条的 拖动条                                          | .q-scrollarea__thumb                           | 200       |
| 主列表菜单 | 顶部时间组件 列表性能优化                                    | .show-date                                     | 90        |
| 主列表菜单 | 屏幕自适应分辨率与左侧栏位及投注栏位展示                     | .menu_toggle-btn                               | 400       |
| 顶部菜单   | 任务中心前端需求-UI对应 站点页站点页眉                       | .activity_header                               | 9999      |
| 顶部菜单   | 站点页眉                                                     | .header-item .item2                            | 2000     |
| 顶部菜单   | 站点页眉                                                     | .header-item .item1                            | 1999     |
| 顶部菜单   | 修复搜索相关样式                                             | .popup-wrap                                    | 302       |
| 主列表     | 筛选项img                                                    | .checked-icon-t1                               | 2         |
| 主列表     | 筛选项img                                                    | .checked-icon-t2                               | 1         |
| 主列表     | 修改列表底部样式                                             | .suck-down                                     | 20        |
| 主列表     | 虚拟体育主列表                                               | .fixed_league_rank_title                       | 1         |
| 主列表     | 筛选内容 -S修改联赛排序弹层                                  | .filter-content                                | 503       |
| 主列表     | 赛事列表头部——滚球——联赛信息 定位                            | .no-sticky                                     | 1         |
| 主列表     | 吸顶样式                                                     | .sticky-wrap                                   | 200       |
| 主列表     | loading遮罩                                                  | .refresh-mask                                  | 1998      |
| 主列表     | 滚球虚拟足球赛事玩法栏底部漏光                               | .leagues-tabs                                  | 200       |
| 主列表     | 搜索列表 自动刷新 拉取右侧显示赛事时 没有拿到 keyword        | \#match-list-scroll                            | 1998      |
| 主列表     | 搜索                                                         | .serach-wrap                                   | 999       |
| 主列表     | 需注意是否被滚球倒计时遮挡                                   | .sports-tab                                    | 999       |
| 主列表     | 列表滚动条                                                   | .list-scrollbar                                | 2         |
| 主列表     | 罚牌提示图标层级                                             | .tips-icon                                     | 2         |
| 主列表     | 罚牌提示箭头                                                 | .direction:after                               | 1001      |
| 主列表     | 罚牌提示说明容器                                             | .tips-box                                      | 1000      |
| 主列表     | 赛马——统计信息展示                                           | .c-match-startisti                             | 1000      |
| 主列表     | 底部分页                                                     | .bottom-page                                   | 999       |
| 主列表     | 弹层选择页数                                                 | .select-wrap                                   | 200       |
| 区域       | 作用  未知                                                   | 类名&.outer-wrap                               | 层级值100 |
| 公共       | 全局气泡框容器                                               | \#v-tooltip                                    | 2000  |
| 公共       | 弹窗遮罩                                                     | .fullscreen                                    | 2000     |
| 公共       | hover悬浮气泡                                                | .q-tooltip                                     | 2000     |
| 公共       | 模拟垂直滚动条                                               | .v-scroll-area:after                           | 99        |
| 公共       | 真实滚动条的                                                 | .q-scrollarea__bar                             | 500       |
| 公共       | 真实滚动条的 拖动条                                          | .q-scrollarea__thumb                           | 501       |
| 公共       | 下拉框组件重写                                               | .select-content                                | 1         |
| 公共       | 页面整体 中                                                  | .page-center                                   | 51        |
| 公共       | 页面整体 右                                                  | .page-right                                    | 52        |
| 公共       | 页面整体 左                                                  | .page-left                                     | 100       |
| 公共       | 全局loadding                                                 | .loading                                       | 2000     |
| 赛果       | 【赛果2.0】展开一场赛事，比分栏会遮盖滚动条                  | .select-content                                | 2         |
| 主列表菜单 | 蒙层                                                         | .cathectic-shade                               | 1000      |
| 主列表菜单 | 真实滚动条的 拖动条                                          | .q-scrollarea__thumb                           | 200       |
| 主列表菜单 | 顶部时间组件 列表性能优化                                    | .show-date                                     | 90        |
| 主列表菜单 | 屏幕自适应分辨率与左侧栏位及投注栏位展示                     | .menu_toggle-btn                               | 400       |
| 顶部菜单   | 任务中心前端需求-UI对应 站点页站点页眉                       | .activity_header                               | 1998      |
| 顶部菜单   | 站点页眉                                                     | .header-item .item2                            | 1999     |
| 顶部菜单   | 站点页眉                                                     | .header-item .item1                            | 2000     |
| 顶部菜单   | 修复搜索相关样式                                             | .popup-wrap                                    | 302       |
| 主列表     | 筛选项img                                                    | .checked-icon-t1                               | 2         |
| 主列表     | 筛选项img                                                    | .checked-icon-t2                               | 1         |
| 主列表     | 修改列表底部样式                                             | .suck-down                                     | 20        |
| 主列表     | 虚拟体育主列表                                               | .fixed_league_rank_title                       | 1         |
| 主列表     | 筛选内容 -S修改联赛排序弹层                                  | .filter-content                                | 503       |
| 主列表     | 赛事列表头部——滚球——联赛信息 定位                            | .no-sticky                                     | 1         |
| 主列表     | 吸顶样式                                                     | .sticky-wrap                                   | 200       |
| 主列表     | loading遮罩                                                  | .refresh-mask                                  | 1998      |
| 主列表     | 滚球虚拟足球赛事玩法栏底部漏光                               | .leagues-tabs                                  | 200       |
| 主列表     | 搜索列表 自动刷新 拉取右侧显示赛事时 没有拿到 keyword        | \#match-list-scroll                            | 1998      |
| 主列表     | 搜索                                                         | .serach-wrap                                   | 999       |
| 主列表     | 需注意是否被滚球倒计时遮挡                                   | .sports-tab                                    | 999       |
| 主列表     | 列表滚动条                                                   | .list-scrollbar                                | 2         |
| 主列表     | 罚牌提示图标层级                                             | .tips-icon                                     | 2         |
| 主列表     | 罚牌提示箭头                                                 | .direction:after                               | 1001      |
| 主列表     | 罚牌提示说明容器                                             | .tips-box                                      | 1000      |
| 主列表     | 赛马——统计信息展示                                           | .c-match-startisti                             | 1000      |
| 主列表     | 底部分页                                                     | .bottom-page                                   | 999       |
| 主列表     | 弹层选择页数                                                 | .select-wrap                                   | 200       |
| 主列表     | 未知                                                         | &.outer-wrap                                   | 100       |
| 主列表     | 未知                                                         | &.inner-wrap                                   | 110       |
| 主列表     | 侧边分页                                                     | .slide-pager                                   | 200       |
| 主列表     | 事件标题穿透列表，与其他标题重叠                             | .item-wrap                                     | 99        |
| 主列表     | 左右切换按钮 -S 修复tab按钮层级                              | .btn                                           | 100       |
| 详情       | 详情页 loading                                               | .details_data_load                             | 1         |
| 详情       | 玩法模板6调整、网羽斯乒滚球未产生比分前阶段补充比分、投注记录无数据展示分页条bug解决 | .tabs-bar                                      | 1         |
| 详情       | 法集左右滚动 icon 玩法模板6调整、网羽斯乒滚球未产生比分前阶段补充比分、投注记录无数据展示 | .tabs-icons                                    | 20        |
| 详情       | 羽斯乒滚球未产生比分前阶段补充比分、投注记录无数据展示分页条 | .right-icons                                   | 2         |
| 详情       | 赛事列表一键展开收起                                         | .right-icons                                   | 2         |
| 详情       | 菜单与右侧滚动条通屏                                         | .tabs-bar                                      | 1         |
| 详情       | 玩法说明                                                     | .tabs-icons                                    | 20        |
| 详情       | 浮层和右侧对阵信息                                           | .absolute-wrap                                 | 1         |
| 详情       | 赛事视频列表提示                                             | .tip-content                                   | 10        |
| 详情       | 视频大屏版播放器组件                                         | .info-icon                                     | 1         |
| 详情       | 视频大屏版播放器组件                                         | .match-wrap                                    | 1         |
| 详情       | 视频未登录背景                                               | .no-video-bg                                   | 2         |
| 详情       | 提示内容 虚拟体育右侧                                        | .tip-content                                   | 2000     |
| 详情       | 专业版虚拟体育右侧 足球比分                                  | .score-wrap                                    | 100       |
| 详情       | 虚拟体育视频遮罩层                                           | .mask                                          | 100       |
| 详情       | 赛事列表页向下滑动，展示重叠                                 | .match_list_hot                                | 5         |
| 详情       | 未知                                                         | .info-upd                                      | 90        |
| 详情       | 修复罚牌玩法标题提示 icon 层级超出 loading                   | .details_loading                               | 5         |
| 详情       | loading 遮罩                                                 | .details_data_load                             | 4         |
| 详情       | 事列表页向下滑动，展示重叠                                   | .wrap-total, .wrap-hot, .wrap-recents          | 10        |
| 详情       | 左侧头部                                                     | .right_header_wrap                             | 1         |
| 活动       | 任务中心前端需求                                             | .close                                         | 99        |
| 活动       | 任务中心前端需求                                             | .close                                         | 1         |
| 活动       | 803活动页                                                    | .activity                                      | 999       |
| 活动       | 803活动界面标准版                                            | .model                                         | 2000     |
| 投注       | 串关说明弹出框滚动条 夜间版/日间版                           | .q-scrollarea__thumb                           | 2         |
| 投注       | 内嵌版投注框的层级                                           | .cathectic-shade                               | 1000      |
| 投注       | 内嵌版投注框的层级                                           | .cathectic-shade2                              | 1000      |
| 投注       | 投注记录页码下拉条数不显示问题 .                             | .q-menu--square                                | 2002      |
| 投注       | 投注记录页码下拉条数不显示问题 .                             | .q-scrollarea__bar--h, .q-scrollarea__thumb--h | 50        |
| 投注       | 垂直滚动固定头                                               | .scroll-fixed-header                           | 500       |
| 投注       | MAX 几串样式 pC 基础版框架修正                               | .bet-max-btn                                   | 9         |
| 投注       | 蒙层样式                                                     | .cathectic-shade                               | 10        |
| 投注       | 新手版投注项失效的样式                                       | .bet-info                                      | 20        |
| 投注       | 删除按钮 修改新手版投注项失效的样式                          | .bet-del                                       | 20        |
| 投注       | 请求接口中蒙层                                               | .cathectic-shade, .disable-shade               | 1000      |
| 投注       | 复制弹出框                                                   | .toast                                         | 3         |
| 赛果       | 日期组件                                                     | .q-date                                        | 1         |
| 赛果       | 注单历史已结算设置结束日期早于开始日期没有相应的提示         | .tips                                          | 9999      |
| 赛果       | 日历组件                                                     | .calendar-wrap                                 | 999       |
| 赛果       |                                                              | .horn                                          | 1         |
| 赛果       |                                                              | .horn2                                         | 2         |
| 赛果       | tab 区 足球赛事分析 赛况、情报                               | .tab                                           | 1         |
| 赛果       |                                                              | .item                                          | 2         |
| 赛果       | 赛事分析筛选优化                                             | .select-page                                   | 1         |
| 赛果       | 棒球数据联调                                                 | .q-scrollarea__thumb                           | 1000      |
| 赛果       | 滚动条样式                                                   | \>>>.q-scrollarea__thumb                       | 2         |
| 赛果       | 赛果2.0排冰棒美足球种模板                                    | .active                                        | 1         |
| 赛果       | 赛果 dota2 手球 斯诺克 PC端赛果                              | .tabs-icons                                    | 1         |
| 赛果       | 赛果球种下拉滚动条优化                                       | .opitons-wrap                                  | 1         |