<!--

* @Author: Supermark
* @Date: 2021-08-28 14:44:47
* @Description: 详情模块文档说明
  -->

路由文件路径:src/project/router/routes.js

1.details.vue ---- 详情页最外层父组件 单独由路由控制											

2.result_details.vue ---- 详情赛果 单独由路由控制     											

3.virtual_sports_details.vue ---- 虚拟体育详情页  单独由路由控制									

4.children ---- 子组件集合

4.1 category.vue -- 标准赛事玩法模板父组件								
4.2 virtual_basketball.vue -- 虚拟篮球详情页视频区域赛事(进行中+完赛)组件				
4.3 virtual_sports_category.vue -- 虚拟体育玩法模板父组件										

5.components ---- 详情组件目录

5.1 details_match_results -- 详情赛果分析页组件集合	
5.1.1 match_results_header_top.vue -- 整个赛果详情页的上部比分   详情头部 中间部分
5.1.2 match_results_stage.vue -- 赛果详情 事件 组件					
5.1.3 match_results.vue -- 赛果详情 赛况统计 和 事件						
5.1.4 mathc_results_visuals.vue -- 赛果详情 统计图形表							
5.1.5 my_note_sheet.vue -- 赛果详情 我的注单									
5.1.5 results_footer.vue -- 赛果详情 底部图标说明									
5.1.5 time_line.vue -- 赛果详情 赛果详情 事件 组件												

5.2.1 change_header.vue -- 详情页下拉置顶title(返回按钮+联赛名+比分+赛事阶段+赛事时间)	
5.2.2 header_bottom.vue -- 详情页视频区域(视频+动画按钮)+底部(赛事比分或者是足球犯规显示)		
5.2.2 header_top.vue -- 详情页视频区域中部(主副队logo+主副队名+赛事[阶段+时间+比分])					

5.3 tournament_play ---- 详情玩法组件集合

```
5.3.1 template -- 玩法模板集合
  5.3.1.1 temp0.vue ~ temp15.vue -- 0号模板到15号模板			

5.3.2 unit
  5.3.2.1 odds_new.vue -- 红升绿降的展示						

5.3.4 play_name.vue -- 玩法集的单个玩法title栏						

5.3.5 tournament_play_new.vue -- 玩法集列表展示模板1-模板15					
```

5.4 detail_match_list.vue -- 详情页精选赛事列表						

5.5 details_header.vue -- 整个详情页的上部视频区域  					

5.6 details_tab.vue -- 详情页中部玩法集tab							

5.7 info_rules.vue -- 视频info说明弹框								

5.8 result_details_tab.vue -- 详情赛果tab区域							

5.9 result_fat_tab.vue -- 赛果详情bottom区域组价分离					

6.0 result_header.vue -- 赛果详情页头部区域     						

6.0.1  common_header.vue -- 赛果详情头部置顶title					

6.0.2  seamless_marquee.vue -- `详情页头部置顶title  			   `

6.1 videos.vue -- 详情页视频+动画直播								

6.2 virtual_match_statistic.vue -- 虚拟体育详情页赛事统计				

6.3 virtual_sports_tab.vue -- 虚拟体育中部期数+轮次tab(列表+详情共用)	

6.4 virtual_sports_videos.vue -- 虚拟体育详情页头部区域				

6.5 virtual_sports_stage.vue -- 虚拟体育详情头部视频区域				

6.6 virtual_sports_timer.vue -- 虚拟体育时钟							

6.7 settle_dialog.vue -- 虚拟体育注单记录
