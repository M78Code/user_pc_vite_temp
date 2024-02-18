<!--
 * @Author: rise
 * @Date: 2023-10-25 15:56:18
 * @LastEditors: rise
 * @LastEditTime: 2023-10-25 16:39:11
 * @Description:  
-->
# 各个拆分
```javascript
import { DataTab,SearchTab,Tabbar,ScrollMenu,TopMenu,SwiperWap,SwiperNav,SwitchWap,SwitchNav } from 'src/base-h5/components/menu/app-h5-menu/index';

    DateTab, //时间tab
    SearchTab, //首页足球比赛tab
    Tabbar, //底部菜单
    ScrollMenu, //二级菜单 滚球
    TopMenu, //顶部菜单
    SwiperWap,//首页轮播组合
    SwiperNav, //单个轮播
    SwitchWap, //首页按钮切换switch
    SwitchNav //单个switch
```
# 时间tab

####     DateTab

###### src\base-h5\components\menu\app-h5-menu\tab\date-tab.vue

```javascript
//用法  defaultVal默认0 index
<DataTab :dataList="dataList"  @changeTab="changeTabEmit"/>


//script
//---------------------早盘------------------------//
import { DataTab } from 'src/base-h5/components/menu/app-h5-menu/index';
import { dateTabList } from "src/base-h5/components/menu/app-h5-menu/utils";

const dataList = dateTabList(new Date());

//---------------------电竞------------------------//
import { DataTab } from 'src/base-h5/components/menu/app-h5-menu/index';
import { dateTabList } from "src/base-h5/components/menu/app-h5-menu/utils";

const dataList = dateTabList(new Date(),{name:"所有日期",val:""});

//---------------------串关------------------------//
import { DataTab } from 'src/base-h5/components/menu/app-h5-menu/index';
import { dateTabList } from "src/base-h5/components/menu/app-h5-menu/utils";

const dataList = dateTabList(new Date(new Date().getTime()+24*60*60*1000),{name:"今日",val:new Date()});

//---------------------普通赛果------------------------//
import { DataTab } from 'src/base-h5/components/menu/app-h5-menu/index';
import { dateWeekFormat } from "src/base-h5/components/menu/app-h5-menu/utils";

const dataList = dateWeekFormat(new Date()).reverse();


//callback
const changeTabEmit = (val) =>{
    console.log(val);//日期格式val
}
```