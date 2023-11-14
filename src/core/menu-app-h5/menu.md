#  头部菜单

##  球种分类
```javascript
//常规球类 id    csid为id-100
101: "足球"  
102: "篮球"
103: "棒球"
104: "冰球"
105: "网球"
106: "美式足球"
107: "斯诺克"
108: "乒乓球"
109: "排球"
110: "羽毛球"
111: "手球"
112: "拳击/格斗"
113: "沙滩排球"
114: "橄榄球"
115: "曲棍球"
116: "水球"
118: "娱乐"
190: "电子足球"
191: "电子篮球"

//一级菜单
1:"滚球" 
2:"今日"
3:"早盘"
4:"冠军" //特殊用处
5:"即将开赛"
6："串关"
300:"VR体育"
400:"冠军"
2000:"电竞" 
5000："热门赛种"
50000:"收藏" 
28:"赛果" 
```

## 球种关联
#### 映射 (yewu11/v3/menu/loadMapping => Object.h)
* 今日2 滚球1 早盘3 串关6 即将开赛5
    ######  生成唯一id 
    ` ${常规球类}${一级菜单} `

------------
* 冠军 电竞 热门赛种 收藏 vr体育
    ######  取id对应sl
    `电竞2000+ 3000-`

* 赛果
    ######  取常规球种 一级id28

## 方法调用 
#### MatchMeta
```javascript

// 清除赛事折叠信息  前置
 MatchDataBaseH5.init()
 MatchFold.clear_fold_info()

// 冠军拉取旧接口； 待 元数据提供 冠军赛事后 再删除
MatchMeta.get_champion_match()
// 赛果
MatchMeta.get_results_match()
// 电竞
 MatchMeta.get_esports_match()
//收藏 
MatchMeta.get_collect_match()
//热门赛种 csid 原始id 101=>1
MatchMeta.get_top_events_match(item.csid)
// 今日  滚球 早盘 串关  走元数据
MatchMeta.set_origin_match_data()
MatchMeta.filter_match_by_time(item.val)//时间筛选
```
#### MenuData

```javascript
//一级菜单
this.current_lv_1_menu_i = 2; //今日
//二级菜单 ${球种id}${一级菜单}
this.current_lv_2_menu_i = 1012; //今日足球

```













