#  头部菜单

##  球种分类
```javascript
//常规球类 id csid
1: "足球"  
2: "篮球"
3: "棒球"
4: "冰球"
5: "网球"
6: "美式足球"
7: "斯诺克"
8: "乒乓球"
9: "排球"
10: "羽毛球"
11: "手球"
12: "拳击/格斗"
13: "沙滩排球"
14: "橄榄球"
15: "曲棍球"
16: "水球"
17: "田径"
18: "娱乐"
19: "游泳"
20:"体操"
21:"跳水"
22:"射击"
23:'举重'
24:'射箭'
25:'击剑'
26: "冰壶",
27: "跆拳道"
28: "高尔夫"
29: "自行车"
30: "赛马"
31: "帆船"
32: "划船"
33: "赛车"
34: "柔道"
35: "空手道"
36: "摔跤"
37: "板球"
38: "飞镖"
39: "沙滩足球"
40: "其他"
50:"趣味 "
//电子球类 csid
90: "电子足球"
91: "电子篮球"
//Vr球种 全id
31001:"VR足球"
31002:"VR赛狗"
31004:"VR篮球"
31009:"VR泥地摩托车"
31010:"VR摩托车"
31011:"VR赛马"
//电子竞技 全id
2100:"英雄联盟"
2101:"Dota2"
2102:"CS:GO/CS2"
2103:"王者荣耀"


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













