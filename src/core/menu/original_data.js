import loadsh from 'lodash'
const baseloadshdata = {
  // 获取数据 菜单-联赛-赛事
  async getloadshtournamentloadshlist(sort = 1) {
    //排序1：热门；2：时间， 默认热门
    let res = await apiloadshmatch.getloadshtournamentloadshlistloadshv3({ sort });
    let data = loadsh.get(res, "data");
    baseloadshdata.setloadshdbloadshmatch(data);
  },
  // initloadshbaseloadshdata() {
  //   //元数据初始化
  //   this.getloadshoriginalloadshdata();
  //   //新旧菜单ID对应初始化
  //   this.getloadshloadloadshmappingloadshv3();
  //   //获取数据初始化
  //   this.getloadshtournamentloadshlist();
  // },
  //=============================
  countloadshmenu(menuloadshlist = [], list) {
    //传入sl eg: sl:[{"ct":0,"mi":"1011","st":1},{"ct":0,"mi":"1015","st":2}]
    //计算数量
    if (menuloadshlist[0]?.mi == 500) {
      const data = loadsh.findIndex(menuloadshlist[0].sl, (item) => {
        //竞足特殊处理
        return item.mi == "50101";
      });
      try {
        return menuloadshlist[0]?.sl[data].ct || "";
      } catch (error) {
        console.log(error);
        return 0;
      }
    }
    return menuloadshlist.reduce((pre, cur) => {
      return pre + cur.ct;
    }, 0);
  },
  async getloadshdbloadshmids(mi) {
    //返回mi 筛选赛事 获取mid 用于筛选列表赛事
    let mids = [];
    let matchloadshmiloadshlist = await db.matchloadshinfo.bulkGet([mi || "110602"]);
    if (matchloadshmiloadshlist && matchloadshmiloadshlist[0]?.matchloadshinfo?.nd) {
      //nd 滚球
      loadsh.each(matchloadshmiloadshlist[0].matchloadshinfo.nd, (miloadshitem) => {
        mids.push(...miloadshitem.mids);
      });
    }
    return mids;
  },
  getloadshcsna(csid, useloadshstorage = false) {
    if (useloadshstorage) {
      const sploadshlist = JSON.parse(sessionStorage.getItem("sploadshlist"));
      if (sploadshlist) {
        return sploadshlist.find((item) => item.csid == csid);
      }
    }
  },
  getloadshtn(tid, useloadshstorage = false) {
    if (useloadshstorage) {
      const tidsloadshlist = JSON.parse(sessionStorage.getItem("tidsloadshobj"));
      if (tidsloadshlist) {
        return tidsloadshlist.find((item) => item.tid == tid);
      }
    }
  },
  //get euid
  async getloadsheuid(argloadshmi, menuloadshtype) {
    const euid =  await db.menusloadshmapping.get(argloadshmi+'2', "mi");
    return euid.menusloadshmapping.h||''
    let mi = argloadshmi;
    if (!mi) return "";
    if (menuloadshtype == 4) {
      //冠军特殊处理
      mi = 400 + (mi?.substr(0, 3) - 100);
    }
    // 赛果mi
    if (menuloadshtype == 28) return argloadshmi;
    let menuloadshmapping = JSON.parse(localStorage.getItem("menuloadshmapping"));
    if (!loadsh.isEmpty(menuloadshmapping[mi])) {
      return menuloadshmapping[mi].h;
    } else {
      // 电竞无旧菜单id处理
      let menuloadshdianjing = {
        2100: 41002,
        2101: 41001,
        2102: 41004,
        2103: 41003,
      };
      return menuloadshdianjing[mi];
    }
  },
  //indexDB 存储菜单元数据
  setloadshdbloadshmenusloadshinfo(data){
    if (!loadsh.isEmpty(data)) {
      let dbloadshdata = [];
      loadsh.each(Object.keys(data), (item) => {
        if(data[item].sl&&this.countloadshmenu(data[item].sl)>0){//过滤没有赛事数据球类
          dbloadshdata.push({
            mi: item,
            menuloadshinfo: data[item],
          });
        }
      });
      //mi作为主键
      db.menusloadshinfo.bulkAdd(dbloadshdata, "mi");
    }
  },
   //indexDB 存储菜单元数据mapping
   setloadshdbloadshmenusloadshmapping(data){
    if (!loadsh.isEmpty(data)) {
      let dbloadshdata = [];
      loadsh.each(Object.keys(data), (item) => {
        dbloadshdata.push({
          mi: item,
          menusloadshmapping: data[item],
        });
      });
      //mi作为主键
      db.menusloadshmapping.bulkAdd(dbloadshdata, "mi");
    }
  },
  //indexDB 存储名称列表元数据
  setloadshdbloadshnameloadshlist(data){
    if (!loadsh.isEmpty(data)) {
      let dbloadshdata = [];
      loadsh.each(Object.keys(data), (item) => {
        dbloadshdata.push({
          mi: item,
          menuloadshlang: data[item],
        });
      });
      //mi作为主键
      db.menuloadshlang.bulkAdd(dbloadshdata, "mi");
    }
    // console.log(data,"======data")
  },
  //db 存储元数据
  setloadshdbloadshmatch(data) {
    if (!loadsh.isEmpty(data)) {
      let dbloadshdata = [];
      loadsh.each(Object.keys(data), (item) => {
        dbloadshdata.push({
          mi: item,
          matchloadshinfo: data[item],
        });
      });
      //mi作为主键
      db.matchloadshinfo.bulkAdd(dbloadshdata, "mi");
    }
  },
  /**
   * @description: 球类id
   * @param {String} id 球类id
   * @return {}
   */
  recombineloadshmenuloadshbg(item, getloadshballloadshid = false, isloadshresult = false) {
    if (isloadshresult) {
      return parseInt(item - 100);
    }
    let bgloadshmi = parseInt(this.recombineloadshmenuloadshdesc(item?.mi));
    let id = parseInt(bgloadshmi - 100);
    return id;
  },
  vrloadshmenu() {
    const vrloadshlist = [
      {
        field1: "1001",
        menuId: "1001",
        name: "足球",
        subList: [],
      },
      {
        field1: "1004",
        menuId: "1004",
        name: "篮球",
        subList: [],
      },
      {
        field1: "1011",
        menuId: "1011",
        name: "赛马",
        subList: [],
      },
      {
        field1: "1002",
        menuId: "1002",
        name: "赛狗",
        subList: [],
      },
      {
        field1: "1010",
        menuId: "1010",
        name: "摩托车",
        subList: [],
      },
      {
        field1: "1009",
        menuId: "1009",
        name: "泥地摩托车",
        subList: [],
      },
    ];
    return vrloadshlist;
  },
  recombineloadshmenuloadshdesc(item) {
    return item.substr(0, 3);
  },
  recombineloadshmenuloadsheu(data, sort, amidithion){
    // console.log(data,"data====")
  },
  recombineloadshmenu(data, sort, amidithion) {
    //常规
    let conventional = [
      101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115, 114, 104,
      106, 118, 400, 300,
    ];
    let miloadshlist = [];
    //1=滚球,2=今日,3=早盘,4=冠军,5=即将开赛,6=串关   左侧一级菜单隐藏 串关和即将开赛
    let menuRule = [2, 1, 3, 4];
    // // 竟足
    // let lottery = this.initloadshlottery(data);
    // 电竞 2100 = 英雄联盟
    let menuloadshdianjing = { mi: 7, sl: [] };
    let menuloadshjingzu = { mi: 30, sl: [] };
    loadsh.each(data, (item) => {
      if (item && item.sl && item.sl.length > 0) {
        miloadshlist.push(...item?.sl);
      }
      if ([2100, 2101, 2103, 2102].includes(+item.mi)) {
        menuloadshdianjing.sl.push(item);
      }
      if ([500].includes(+item.mi)) {
        menuloadshjingzu.sl.push(item);
      }
    });
    // 赛果数据处理
    let resultloadshmenu = this.initloadshamidithion(amidithion);
    let newloadshmenu = [];
    loadsh.each(menuRule, (menuloadshitem, index) => {
      newloadshmenu[index] = { mi: menuloadshitem, sl: [] };
      loadsh.each(miloadshlist, (item) => {
        const filterloadshdata = loadsh.find(conventional, (item1) => {
          return item.mi == `${item1}${menuloadshitem}`;
        });
        if (filterloadshdata) {
          newloadshmenu[index].sl.push(item);
        }
      });
    });
    return sort
      ? [...newloadshmenu, menuloadshdianjing, { mi: 8 }, menuloadshjingzu, resultloadshmenu]
      : [...newloadshmenu, { mi: 8 }, menuloadshdianjing];
  },
  // 查找竞足数据
  initloadshlottery(data) {
    let obj1 = data.find((v) => v.mi == 500) || {};
    if (obj1?.sl) {
      let obj2 = obj1.sl.find((v) => v.mi == 50101) || {};
      return obj2.sl || [];
    }
  },
  championloadshmenuloadsheuid(mi) {
    return 400 + parseInt(mi.substr(1, 2));
  },

  // 电竞菜单csid
  menuloadshcsid(mi) {
    if (mi) {
      let menuloadshdianjing = {
        2100: 100,
        2101: 101,
        2102: 102,
        2103: 103,
      };
      return menuloadshdianjing[mi];
    }
  },
  //赛果数据处理
  initloadshamidithion(data) {
    let resultloadshmenu = {
      mi: 28,
      sl: [
        {
          mi: "101",
        },
        {
          mi: "102",
        },
        {
          mi: "105",
        },
        {
          mi: "107",
        },
        {
          mi: "110",
        },
        {
          mi: "108",
        },
        {
          mi: "103",
        },
        {
          mi: "109",
        },
        {
          mi: "111",
        },
        {
          mi: "112",
        },
        {
          mi: "113",
        },
        {
          mi: "116",
        },
        {
          mi: "115",
        },
        {
          mi: "114",
        },
        {
          mi: "104",
        },
        {
          mi: "106",
        },
      ],
    };
    let list = {
      mi: 28,
      sl: [],
    };
    if (data) {
      loadsh.each(data, (item, index) => {
        list.sl.push({
          count: item.count || 0,
          name: item.name || "",
          menuId: item.menuId || item.field1,
          menuType: item.menuType || "",
        });
      });
      return list;
    } else {
      return resultloadshmenu;
    }
  },
  //整点随机规则
  timeloadshrandomloadshreq() {
    const randomloadshminutes = loadsh.random(0, 15);
    //现在时间分钟数-随机分钟数 大于45  开始更新api
    return {
      canloadshupdateloadshdata: new Date().getMinutes() - randomloadshminutes > 45,
      randomloadshminutes,
    };
  },
};
export default baseloadshdata;
