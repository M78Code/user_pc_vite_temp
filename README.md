# 客户端模块化+SDK版本

## 组件目录规范

示例：list-temp-1

入口 ：单一入口只是把 最终版本 换名输出 

| index.js                             |      |      |
| ------------------------------------ | ---- | ---- |
| ./list-temp-1-1/index.vue            |      |      |
| ./list-temp-1-1/list-temp-1-1.doc.js |      |      |
| ./list-temp-1-1/list-temp-1-1.scss   |      |      |



## 核心说明：src/core

 每一个里面都要有一个基本的文档

| 入口目录       | 入口说明     | 备注                                                         | 整理人                           |
| -------------- | ------------ | ------------------------------------------------------------ | -------------------------------- |
| standard-key   | 标准键       | 标准键定义  symbol                                           | nico                             |
| domain         | 域名计算     | 含OSS逻辑，url 参数逻辑  ，其他 域名处理                     | lane                             |
| enter-params   | 进入页面参数 | 对接三方进入页面参数分流整理,页面跳转，刷新重进 ，视频参数   | tyrone                           |
| mitt           | 全局事件管理 | 事件定义 symbol                                              | nico                             |
| http           | http         | axios-wapper ， debounce ，节流 ，消峰 ，埋点 ，错误上报，其他中间件 ,错误处理 ，循环请求 | jinnian                          |
| ws             | ws           | 分流 ， 消峰                                                 | lockie                           |
| theme          | 主题计算     | 理论上不在需要                                               | dolphin                          |
| sdk-config     | 模块化配置   | 我们自己的项目本身也当做一个商户去对接 ，自己设置一套配置，从这里计算自己所需结果 | copper                           |
| user-config    | 用户配置     | 商户用户的配置                                               | gamer                            |
| log            | 日志插件     |                                                              | malick                           |
| project-config | 项目配置     | 项目打包外层 植入内容                                        | malick                           |
| pb-decode      | pb解密       |                                                              | lampson                          |
| file-path      | 文件路径     | 图片域名 地址问题                                            | lane                             |
| media          | 音频         | 视频动画音频 ，                                              | tyrone                           |
| formart        | 格式化       | 时间格式化   赔率格式化 ，赛事阶段 ，赛事状态 计算 等 格式化 | nico                             |
| uuid           | 唯一id       | 盘口的 唯一 id 算法  和解析                                  | lane                             |
| menu           | 菜单         | 菜单映射 算法关系                                            | lane                             |
| match-list     | 赛事列表     | 源数据 ，模板计算  ， 高度计算 ，滚动逻辑  ，列表参数计算  ，冠军算法，全局热门赛事 | lockie/dolphin                   |
| match-detail   | 赛事详情     | 赛事详情  ，玩法集  ， 玩法过滤，注意列表 和右测同步问题 ，以右侧详情为主 | cooper/gamer                     |
| bet            | 投注，注单   | 投注 ，注单列表 ，提前结算                                   | lane/lampson                     |
| vr-sport       | 虚拟体育     | 虚拟体育一些通用层                                           | lockie/dolphin<br />cooper/gamer |
| dj-sport       | 电竞体育     | 电竞 一些通用层                                              | lockie/dolphin<br />cooper/gamer |
| z-index        | 层级界定备份 |                                                              | malick                           |
|                |              |                                                              |                                  |




## 入口 说明  ：entries

#####  每一个里面都要有一个基本的文档

| 入口目录            | 入口说明                  | 类型 | 备注                             | 核心差异                                                     |
| ------------------- | ------------------------- | ---- | -------------------------------- | ------------------------------------------------------------ |
| self-use-version    | 自用版本项目              | 项目 | 常规开发 ，生产自用项目打包 入口 | 默认组件，支持配置合并，<br />不支持同功能性组件其他版本切换 |
| custom-version      | 定制化版本项目            | 项目 | 商户定制化                       | 支持根据选择的组件定制化输出 zip                             |
| custom-sdk          | 定制化版本 打包sdk        | 脚本 | 构建出 es 和 umd 版本的 sdk      | 全量版本：用于对接文档内调试<br />定制版本：用于商户引入使用 |
| check-sdk-es        | 自测检查sdk  es 版本      | 项目 | 需要适配：  全量/定制化 （cli）  | 全量版本：自测+对接文档内用<br />定制版本：用于商户对接demo演示 |
| check-sdk-umd       | 自测检查sdk umd 版本      | 项目 | 需要适配：  全量/定制化（cli）   | 全量版本：自测+对接文档内用<br />定制版本：用于商户对接demo演示 |
| check-sdk-umd-html  | 自测检查sdk umd 版本 html | 项目 | 需要适配：  全量/定制化(html)    | 全量版本：自测+对接文档内用<br />定制版本：用于商户对接demo演示 |
| components-document | 组件内部文档              | 项目 | 根据组件配置自动生成内部文档     | 需要支持对比线上旧版差异<br />需要支持配置字段上报对接文档   |
| postmessage-test    | 在线调试，消息通讯自测    | 项目 | 在线调试工具的自测版本           | 消息通讯自测验证辅助工具<br />定义消息通讯规范格式和主题     |
| developer-guideline | 项目开发规范文档          | 项目 | 一些规范定义，和文档参照指引     | 项目目标解释、架构、规范、技术选型                           |
| config-middleware   | 配置中间件                | 脚本 | 配置集散                         | 商户配置，环境配置，上报配置                                 |

