#### z-index统计
###### TODO 类名及层级值暂时仅供参考，待实际开发后同步修改
|区域|作用|类名|层级值|备注|
|----|----|----|----|----|
|全局(global)|||-1到-10(隐藏)，层级值最高为2000|
|    |提示信息| .tip-message  | 2000|
|    |全局loading|.loading| 1999|
|    |全局弹窗|.global-popup| 1998|
|    |全局遮罩|   | 1997|
|主列表菜单|遮挡 二级和三级菜单，滑动时，遮住二三级菜单|.main-wrap|2|
|主列表 |联赛展示|.is-hot-icon|1|
| |赔率容器 遮挡|.odd-list-container .icon-jiaoqiu&.selected|1,2|
| |比分区域 遮挡|.score-section|2|
| |滚动条遮罩层 遮挡|.scroll-cover-f|10|
| |玩法 层级|.team-title-container|75|
| |滑动赔率时遮挡赔率样式|.team-wrapper|75|
| |debugger 调试用|.debug-head|99|
| |骨架屏 遮挡|.skeleton-wrap|999|
|详情 |玩法集 遮挡滑动内容|.details-tab-wrap &.z-index0 &.z-index81|0, 81|
| |顶部视图区域 遮挡滑动内容|.header-fix|80|
| |滚动时置顶的悬浮条|.mini-header-container|85|
| |刷新按钮|.details-ref|90|
| |顶部视图区域 遮挡滑动内容 |.match-header-result|99|
| |赛事分析顶部header 遮挡滑动内容|.header, .heade-wrapper|100|
|活动 |标题 滑动时遮挡内容|.head|99|
| |可以设置全屏loading|.fullscreen_loading|99|
|投注|投注弹窗视图区域|.dele-left|2|
| |全屏横屏投注弹窗|.video-full-screen .play-wrapper|100|
| |投注弹窗遮罩|.bet-mix-box|541|
| | |.full-shadow|550|
| | |.content-box|600|
| | |.content-box-iphone|600|
| | |.full-shadow2|2000|
| | | | |
| | | | |
| | | | |