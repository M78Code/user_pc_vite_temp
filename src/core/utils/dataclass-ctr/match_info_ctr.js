/*
 * @Author: success
 * @Date: 2020-09-07 12:45:18
 * @Description: 赛事详情页面信息操作类-实现快速检索,修改等功能 用于各个版本的赛事详情
 */
import MatchDataUpdTime from "./match_data_upd_time";
export default class MatchInfoCtr
{
  /**
   * @description: 构造函数
   * @param {Object} view Vue实例
   * @return {undefined} undefined
   */
  constructor(view, module='match_details')
  {
    // 视图对象
    this.view = view;
    this._module = module;
    // 赛事操后对应的字段时间戳对象
    this.upd_time_obj = new MatchDataUpdTime()
    // 初始化数据
    this.init();
  }


  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init(){
    this.data = null;
    // 玩法菜单列表
    this.plays_menu_list = [];
    // 玩法数据
    this.list = [];
    // 玩法数据对象
    this.pl_obj = {};
    // 所有投注项对象
    this.ol_obj={};
    // 所有盘口对象
    this.hl_obj={};
    // 一坑位为id的所有投注项
    this.hn_obj={};
    // 赛事对象
    this.match_obj={};
  }

  /**
   * @description: 设置赛事信息
   * @param {Object} data 赛事信息
   * @return {undefined} undefined
   */  
  init_match_obj(data = {}, timestap) {
    if(this.match_obj && this.match_obj.mid && timestap) {
      // 设置赛事时间控制类
      let data_obj = this.upd_time_obj.get_need_upd_obj(this.match_obj.mid, this.match_obj, timestap);
      Object.assign(data, data_obj.upd);
      this.upd_time_obj.set_match_obj(this.match_obj.mid, data_obj.no_upd, timestap);
    }    
    this.match_obj = {_upd: timestap,...data,};
  }
  /**
   * @description: 初始化菜单列表
   * @param {Array} data 菜单列表
   * @return {undefined} undefined
   */  
  init_play_menu_list(data) {
    //console.log(`=====matchInfoCtr============init_play_menu_list========data:${JSON.stringify(data)}`);
    if(data instanceof Array) {
      let play_category_list = [];
      for(let i=0;i<data.length;i++) {
        let item = data[i];
        //console.log(`===============i:${i}======${JSON.stringify(item)}`);
        if(item && item.id) {
          let obj = {
            id: item.id,
            list: []
          };
          if(item.plays && item.plays instanceof Array) {
            for(let ii=0;ii<item.plays[ii];ii++) {
              let play_obj = {
                hpid: item.plays[ii]
              };
              //console.log(`===============ii:${ii}======${JSON.stringify(play_obj)}`);
              obj.list.push(play_obj);
            }
          } 
          play_category_list.push(obj);
        }        
      }
      if(play_category_list.length>0) {
        if(!this.data) {
          this.data = {cateyList: play_category_list};
        } else {
          this.data.cateyList = play_category_list;
        } 
        this.plays_menu_list = this.data.cateyList;   
      }
    }
  }
  /**
   * @description: 初始化play对象
   * @param {Array} data 玩法数据
   * @return {undefined} undefined
   */
  init_plays_data(data) {
    if(data instanceof Array) {
      let plays = [];
      for(let i=0;i<data.length;i++) {
        let item = data[i];
        if(item) {
          plays.push(item);
        }
      }
      if(plays.length>0) {
        if(!this.data) {
          this.data = { plays };
        } else {
          this.data.plays = plays;
        }
        this.list = plays;
      }
    }

    if(this.data && this.data.cateyList && this.data.plays) {
      this.set_list_obj(this.data);
    }
  }
  /**
   * @description: 设置tab list
   * @param {Object} data 需要设置的列表
   * @return {undefined} undefined
   */
  set_list_obj(data){
    // let data = {"code":"0000000","data":{"cateyList":[{"id":"0","list":[{"hpid":12,"jno":"1"},{"hpid":1,"jno":"1"}],"marketName":"所有投注"},{"id":"0","list":[{"hpid":8,"jno":"1"},{"hpid":5}],"marketName":"热门"}],"plays":[{"hl":[{"hid":"1249960443116826625","hmt":0,"hon":"2192000","hs":0,"hv":"","ol":[{"cds":"SR","obv":108000,"oid":"1249960443133603841","on":"","os":1,"ot":"1","otd":47,"ots":"","ott":"罗马","otv":"罗马","ov":108000},{"cds":"SR","obv":1000000,"oid":"1249960443150381057","on":"","os":1,"ot":"X","otd":48,"ots":"","ott":"平局","otv":"平局","ov":1000000},{"cds":"SR","obv":2300000,"oid":"1249960443167158273","on":"","os":1,"ot":"2","otd":49,"ots":"","ott":"乌迪内斯","otv":"乌迪内斯","ov":2300000}]}],"hlid":"0","hmm":0,"hpid":"12","hpn":"全场赛果","hpon":1,"hpt":1,"hshow":"Yes","hsw":"0","hton":"0","jno":"1","mid":624,"title":[{"osn":"罗马","otd":47},{"osn":"平局","otd":48},{"osn":"乌迪内斯","otd":49}]},{"hl":[{"hid":"1249969382114111490","hmt":0,"hon":"5000","hs":0,"hv":"4","ol":[{"cds":"SR","obv":195000,"oid":"1249969382130888706","on":"4","os":1,"ot":"Under","otd":1,"ots":"","ott":"小","otv":"小4","ov":195000},{"cds":"SR","obv":190000,"oid":"1249969382143471618","on":"4","os":1,"ot":"Over","otd":2,"ots":"","ott":"大","otv":"大4","ov":190000}]},{"hid":"1249969383502426113","hmt":0,"hon":"45000","hs":0,"hv":"4/4.5","ol":[{"cds":"SR","obv":170000,"oid":"1249969383515009026","on":"4/4.5","os":1,"ot":"Under","otd":1,"ots":"","ott":"小","otv":"小4/4.5","ov":170000},{"cds":"SR","obv":215000,"oid":"1249969383531786241","on":"4/4.5","os":1,"ot":"Over","otd":2,"ots":"","ott":"大","otv":"大4/4.5","ov":215000}]},{"hid":"1249960440323420162","hmt":0,"hon":"50000","hs":0,"hv":"3.5/4","ol":[{"cds":"SR","obv":220000,"oid":"1249960440440860674","on":"3.5/4","os":1,"ot":"Under","otd":1,"ots":"","ott":"小","otv":"小3.5/4","ov":220000},{"cds":"SR","obv":170000,"oid":"1249960440478609409","on":"3.5/4","os":1,"ot":"Over","otd":2,"ots":"","ott":"大","otv":"大3.5/4","ov":170000}]}],"hlid":"0","hmm":1,"hpid":"1","hpn":"大小盘","hpon":2,"hpt":2,"hshow":"No","hsw":"1","hton":"0","jno":"1","mid":624,"title":[{"osn":"小","otd":1},{"osn":"大","otd":2}]},{"hl":[{"hid":"1249960447202078721","hmt":0,"hon":"210000","hs":0,"hv":"-2","ol":[{"cds":"SR","obv":185000,"oid":"1249960447231438849","on":"-2","os":1,"ot":"1","otd":7,"ots":"","ott":"罗马","otv":"罗马-2","ov":185000},{"cds":"SR","obv":395000,"oid":"1249960447248216066","on":"-2","os":1,"ot":"X","otd":8,"ots":"","ott":"平局","otv":"平局-2","ov":395000},{"cds":"SR","obv":340000,"oid":"1249960447273381889","on":"+2","os":1,"ot":"2","otd":9,"ots":"","ott":"乌迪内斯","otv":"乌迪内斯+2","ov":340000}]},{"hid":"1249960447365656578","hmt":0,"hon":"235000","hs":0,"hv":"-3","ol":[{"cds":"SR","obv":315000,"oid":"1249960447390822402","on":"-3","os":1,"ot":"1","otd":7,"ots":"","ott":"罗马","otv":"罗马-3","ov":315000},{"cds":"SR","obv":425000,"oid":"1249960447411793922","on":"-3","os":1,"ot":"X","otd":8,"ots":"","ott":"平局","otv":"平局-3","ov":425000},{"cds":"SR","obv":190000,"oid":"1249960447432765442","on":"+3","os":1,"ot":"2","otd":9,"ots":"","ott":"乌迪内斯","otv":"乌迪内斯+3","ov":190000}]},{"hid":"1249969383229796353","hmt":0,"hon":"490000","hs":0,"hv":"-4","ol":[{"cds":"SR","obv":620000,"oid":"1249969383246573570","on":"-4","os":1,"ot":"1","otd":7,"ots":"","ott":"罗马","otv":"罗马-4","ov":625000},{"cds":"SR","obv":570000,"oid":"1249969383263350785","on":"-4","os":1,"ot":"X","otd":8,"ots":"","ott":"平局","otv":"平局-4","ov":575000},{"cds":"SR","obv":135000,"oid":"1249969383284322306","on":"+4","os":1,"ot":"2","otd":9,"ots":"","ott":"乌迪内斯","otv":"乌迪内斯+4","ov":135000}]}],"hlid":"0","hmm":1,"hpid":"8","hpn":"全场让球赛果","hpon":3,"hpt":4,"hshow":"No","hsw":"0","hton":"0","jno":"1","mid":624,"title":[{"osn":"罗马","otd":7},{"osn":"平局","otd":8},{"osn":"乌迪内斯","otd":9}]},{"hl":[{"hid":"1249969382042808321","hmt":0,"hon":"5000","hs":0,"hv":"-1.5","ol":[{"cds":"SR","obv":185000,"oid":"1249969382059585538","on":"-1.5","os":1,"ot":"1","otd":3,"ots":"","ott":"罗马","otv":"罗马-1.5","ov":185000},{"cds":"SR","obv":190000,"oid":"1249969382067974146","on":"+1.5","os":1,"ot":"2","otd":4,"ots":"","ott":"乌迪内斯","otv":"乌迪内斯+1.5","ov":190000}]},{"hid":"1249974184109846529","hmt":0,"hon":"15000","hs":0,"hv":"-0.5","ol":[{"cds":"SR","obv":180000,"oid":"1249974184126623746","on":"-0.5","os":1,"ot":"1","otd":3,"ots":"","ott":"罗马","otv":"罗马-0.5","ov":180000},{"cds":"SR","obv":195000,"oid":"1249974184139206657","on":"+0.5","os":1,"ot":"2","otd":4,"ots":"","ott":"乌迪内斯","otv":"乌迪内斯+0.5","ov":195000}]},{"hid":"1249969381287833601","hmt":0,"hon":"45000","hs":0,"hv":"-1.5/2","ol":[{"cds":"SR","obv":215000,"oid":"1249969381300416514","on":"-1.5/2","os":1,"ot":"1","otd":3,"ots":"","ott":"罗马","otv":"罗马-1.5/2","ov":215000},{"cds":"SR","obv":170000,"oid":"1249969381317193730","on":"+1.5/2","os":1,"ot":"2","otd":4,"ots":"","ott":"乌迪内斯","otv":"乌迪内斯+1.5/2","ov":170000}]}],"hlid":"0","hmm":1,"hpid":"5","hpn":"让球盘","hpon":4,"hpt":2,"hshow":"No","hsw":"1","hton":"0","mid":624,"title":[{"osn":"罗马","otd":3},{"osn":"乌迪内斯","otd":4}]},{"hl":[{"hid":"1249960437819420674","hmt":0,"hon":"999000","hs":0,"hv":"","ol":[{"cds":"SR","obv":101000,"oid":"1249960437861363714","on":"","os":1,"ot":"1","otd":5,"ots":"","ott":"罗马","otv":"罗马","ov":101000},{"cds":"SR","obv":1100000,"oid":"1249960437886529537","on":"","os":1,"ot":"2","otd":6,"ots":"","ott":"乌迪内斯","otv":"乌迪内斯","ov":1100000}]}],"hlid":"0","hmm":0,"hpid":"5","hpn":"平局退款","hpon":5,"hpt":3,"hshow":"No","hsw":"1","hton":"0","mid":624,"title":[{"osn":"罗马","otd":5},{"osn":"乌迪内斯","otd":6}]},{"hl":[{"hid":"1249960433268600834","hmt":0,"hon":"597000","hs":0,"hv":"","ol":[{"cds":"SR","obv":0,"oid":"1249960433289572354","on":"","os":2,"ot":"1X","otd":10,"ots":"","ott":"罗马或平局","otv":"罗马或平局","ov":0},{"cds":"SR","obv":103000,"oid":"1249960433306349570","on":"","os":1,"ot":"12","otd":11,"ots":"","ott":"罗马或乌迪内斯","otv":"罗马或乌迪内斯","ov":103000},{"cds":"SR","obv":700000,"oid":"1249960433331515393","on":"","os":1,"ot":"X2","otd":12,"ots":"","ott":"平局或乌迪内斯","otv":"平局或乌迪内斯","ov":700000}]}],"hlid":"0","hmm":0,"hpid":"6","hpn":"双重机会","hpon":6,"hpt":0,"hshow":"No","hsw":"1","hton":"0","mid":624,"title":[{"osn":"罗马或平局","otd":10},{"osn":"罗马或乌迪内斯","otd":11},{"osn":"平局或乌迪内斯","otd":12}]},{"hl":[{"hid":"1249960443985047553","hmt":0,"hon":"2520000","hs":0,"hv":"","ol":[{"cds":"SR","obv":1550000,"oid":"1249960444010213377","on":"1-0","os":1,"ot":"1:0","otd":1,"ots":"","ott":"","otv":"1-0","ov":1575000},{"cds":"SR","obv":800000,"oid":"1249960444031184897","on":"2-0","os":1,"ot":"2:0","otd":1,"ots":"","ott":"","otv":"2-0","ov":800000},{"cds":"SR","obv":1000000,"oid":"1249960444136042497","on":"2-1","os":1,"ot":"2:1","otd":1,"ots":"","ott":"","otv":"2-1","ov":1025000},{"cds":"SR","obv":670000,"oid":"1249960444052156417","on":"3-0","os":1,"ot":"3:0","otd":1,"ots":"","ott":"","otv":"3-0","ov":675000},{"cds":"SR","obv":850000,"oid":"1249960444152819714","on":"3-1","os":1,"ot":"3:1","otd":1,"ots":"","ott":"","otv":"3-1","ov":850000},{"cds":"SR","obv":2100000,"oid":"1249960444249288705","on":"3-2","os":1,"ot":"3:2","otd":1,"ots":"","ott":"","otv":"3-2","ov":2100000},{"cds":"SR","obv":850000,"oid":"1249960444068933633","on":"4-0","os":1,"ot":"4:0","otd":1,"ots":"","ott":"","otv":"4-0","ov":850000},{"cds":"SR","obv":1050000,"oid":"1249960444182179842","on":"4-1","os":1,"ot":"4:1","otd":1,"ots":"","ott":"","otv":"4-1","ov":1075000},{"cds":"SR","obv":2700000,"oid":"1249960444274454529","on":"4-2","os":1,"ot":"4:2","otd":1,"ots":"","ott":"","otv":"4-2","ov":2700000},{"cds":"SR","obv":2900000,"oid":"1249960444417060866","on":"4-3","os":1,"ot":"4:3","otd":1,"ots":"","ott":"","otv":"4-3","ov":2900000},{"cds":"SR","obv":0,"oid":"1249960443997630466","on":"0-0","os":2,"ot":"0:0","otd":0,"ots":"","ott":"","otv":"0-0","ov":0},{"cds":"SR","obv":2600000,"oid":"1249960444119265281","on":"1-1","os":1,"ot":"1:1","otd":0,"ots":"","ott":"","otv":"1-1","ov":2600000},{"cds":"SR","obv":2700000,"oid":"1249960444236705793","on":"2-2","os":1,"ot":"2:2","otd":0,"ots":"","ott":"","otv":"2-2","ov":2700000},{"cds":"SR","obv":2900000,"oid":"1249960444400283650","on":"3-3","os":1,"ot":"3:3","otd":0,"ots":"","ott":"","otv":"3-3","ov":2900000},{"cds":"SR","obv":2900000,"oid":"1249960444542889986","on":"4-4","os":1,"ot":"4:4","otd":0,"ots":"","ott":"","otv":"4-4","ov":2900000},{"cds":"SR","obv":380000,"oid":"1249960444572250113","on":"其他","os":1,"ot":"Other","otd":0,"ots":"","ott":"","otv":"其他","ov":380000},{"cds":"SR","obv":0,"oid":"1249960444089905153","on":"0-1","os":2,"ot":"0:1","otd":2,"ots":"","ott":"","otv":"0-1","ov":0},{"cds":"SR","obv":0,"oid":"1249960444198957058","on":"0-2","os":2,"ot":"0:2","otd":2,"ots":"","ott":"","otv":"0-2","ov":0},{"cds":"SR","obv":2900000,"oid":"1249960444219928578","on":"1-2","os":1,"ot":"1:2","otd":2,"ots":"","ott":"","otv":"1-2","ov":2900000},{"cds":"SR","obv":0,"oid":"1249960444287037442","on":"0-3","os":2,"ot":"0:3","otd":2,"ots":"","ott":"","otv":"0-3","ov":0},{"cds":"SR","obv":2900000,"oid":"1249960444358340609","on":"1-3","os":1,"ot":"1:3","otd":2,"ots":"","ott":"","otv":"1-3","ov":2900000},{"cds":"SR","obv":2900000,"oid":"1249960444375117826","on":"2-3","os":1,"ot":"2:3","otd":2,"ots":"","ott":"","otv":"2-3","ov":2900000},{"cds":"SR","obv":0,"oid":"1249960444442226690","on":"0-4","os":2,"ot":"0:4","otd":2,"ots":"","ott":"","otv":"0-4","ov":0},{"cds":"SR","obv":2900000,"oid":"1249960444463198209","on":"1-4","os":1,"ot":"1:4","otd":2,"ots":"","ott":"","otv":"1-4","ov":2900000},{"cds":"SR","obv":2900000,"oid":"1249960444488364033","on":"2-4","os":1,"ot":"2:4","otd":2,"ots":"","ott":"","otv":"2-4","ov":2900000},{"cds":"SR","obv":2900000,"oid":"1249960444509335554","on":"3-4","os":1,"ot":"3:4","otd":2,"ots":"","ott":"","otv":"3-4","ov":2900000}]}],"hlid":"0","hmm":0,"hpid":"7","hpn":"全场比分","hpon":7,"hpt":4,"hshow":"No","hsw":"2","hton":"0","mid":624,"title":[{"osn":"罗马","otd":1},{"osn":"和局","otd":0},{"osn":"乌迪内斯","otd":2}]},{"hl":[{"hid":"1249960444907794433","hmt":0,"hon":"740000","hs":0,"hv":"","ol":[{"cds":"SR","obv":0,"oid":"1249960444924571650","on":"0","os":2,"ot":"0","otd":0,"ots":"","ott":"","otv":"0","ov":0},{"cds":"SR","obv":870000,"oid":"1249960444945543169","on":"1","os":1,"ot":"1","otd":0,"ots":"","ott":"","otv":"1","ov":875000},{"cds":"SR","obv":375000,"oid":"1249960444958126081","on":"2","os":1,"ot":"2","otd":0,"ots":"","ott":"","otv":"2","ov":375000},{"cds":"SR","obv":135000,"oid":"1249960444970708994","on":"3+","os":1,"ot":"3+","otd":0,"ots":"","ott":"","otv":"3+","ov":135000}]}],"hlid":"0","hmm":0,"hpid":"8","hpn":"主队准确进球数","hpon":8,"hpt":0,"hshow":"No","hsw":"1","hton":"0","mid":624,"title":[]},{"hl":[{"hid":"1249960446744899585","hmt":0,"hon":"1555000","hs":0,"hv":"","ol":[{"cds":"SR","obv":195000,"oid":"1249960446761676802","on":"0","os":1,"ot":"0","otd":0,"ots":"","ott":"","otv":"0","ov":195000},{"cds":"SR","obv":245000,"oid":"1249960446782648322","on":"1","os":1,"ot":"1","otd":0,"ots":"","ott":"","otv":"1","ov":245000},{"cds":"SR","obv":570000,"oid":"1249960446799425538","on":"2","os":1,"ot":"2","otd":0,"ots":"","ott":"","otv":"2","ov":575000},{"cds":"SR","obv":1750000,"oid":"1249960446820397057","on":"3+","os":1,"ot":"3+","otd":0,"ots":"","ott":"","otv":"3+","ov":1750000}]}],"hlid":"0","hmm":0,"hpid":"9","hpn":"客队准确进球数","hpon":9,"hpt":0,"hshow":"No","hsw":"1","hton":"0","mid":624,"title":[]},{"hl":[{"hid":"1249969383045246978","hmt":0,"hon":"50000","hs":0,"hv":"3.5","ol":[{"cds":"SR","obv":165000,"oid":"1249969383062024194","on":"3.5","os":1,"ot":"Under","otd":114,"ots":"","ott":"小","otv":"小3.5","ov":165000},{"cds":"SR","obv":215000,"oid":"1249969383087190018","on":"3.5","os":1,"ot":"Over","otd":115,"ots":"","ott":"大","otv":"大3.5","ov":215000}]},{"hid":"1249977568635957249","hmt":0,"hon":"190000","hs":0,"hv":"4.5","ol":[{"cds":"SR","obv":130000,"oid":"1249977568652734465","on":"4.5","os":1,"ot":"Under","otd":114,"ots":"","ott":"小","otv":"小4.5","ov":130000},{"cds":"SR","obv":320000,"oid":"1249977568665317378","on":"4.5","os":1,"ot":"Over","otd":115,"ots":"","ott":"大","otv":"大4.5","ov":320000}]}],"hlid":"0","hmm":1,"hpid":"10","hpn":"主队进球大小盘","hpon":10,"hpt":2,"hshow":"No","hsw":"1","hton":"0","mid":624,"title":[{"osn":"小","otd":114},{"osn":"大","otd":115}]},{"hl":[{"hid":"1249960435495776257","hmt":0,"hon":"25000","hs":0,"hv":"0.5","ol":[{"cds":"SR","obv":195000,"oid":"1249960435516747778","on":"0.5","os":1,"ot":"Under","otd":116,"ots":"","ott":"小","otv":"小0.5","ov":195000},{"cds":"SR","obv":170000,"oid":"1249960435541913601","on":"0.5","os":1,"ot":"Over","otd":117,"ots":"","ott":"大","otv":"大0.5","ov":170000}]}],"hlid":"0","hmm":1,"hpid":"11","hpn":"客队进球大小盘","hpon":11,"hpt":2,"hshow":"No","hsw":"1","hton":"0","mid":624,"title":[{"osn":"小","otd":116},{"osn":"大","otd":117}]}]},"msg":"成功","ts":1591363034951}
    this.data=data;
    //console.log(JSON.stringify(data))
    if(!this.data)
    {
      return;
    }

    // 数据转字典
    // 赛事信息集合
    //this.list = _.cloneDeep(this.data.plays);
    // let plays_list_ = this.list;
    // 所有投注项对象
    let ol_obj_= this.ol_obj;
    // 所有盘口对象
    let hl_obj_ = this.hl_obj;
    // 所有玩法对象
    let pl_obj_ = this.pl_obj;
    // 坑位对应的投注项
    let hn_obj_ = this.hn_obj;

    let manyObj = this.list_to_many_obj(this.list);
    this.ol_obj = manyObj.ol_obj;
    this.hl_obj = manyObj.hl_obj;
    this.pl_obj = manyObj.pl_obj;
    this.hn_obj = manyObj.hn_obj;

    this.clear(manyObj);
    // this.clear(playsList_);
    this.clear(ol_obj_);
    this.clear(hl_obj_);
    this.clear(pl_obj_);
    this.clear(hn_obj_);

    /* this.plays_menu_list = this.data.cateyList;
    // 组装菜单列表子项数据数据
    if(this.plays_menu_list && this.plays_menu_list.length)
    {
      this.plays_menu_list.forEach(menu_data => {
        console.log(menu_data.marketName)
        if(menu_data && menu_data.list && menu_data.list.length)
        {
          menu_data.list.forEach(play_data => {
            if(play_data && play_data.hpid)
            {
              let aa = this.get_play_data(play_data.hpid, play_data.jno);
              console.log(JSON.stringify(aa))
            }
          });
        }
      });
    } */
  }

  /**
   * @description: 组装菜单列表子项数据数据
   * @param {Number} 父菜单编号
   * @return {Array} 子类菜单列表
   */  
  plays_menu_list_data(id){
    let ret = [];
    // 组装菜单列表子项数据数据
    if(this.plays_menu_list && this.plays_menu_list.length)
    {
      for (let i = 0; i < this.plays_menu_list.length; i++) {
        const menuData = this.plays_menu_list[i];
        if(menuData && menuData.id == id && menuData.list && menuData.list.length)
        {
          menuData.list.forEach(play_data => {
            if(play_data && play_data.hpid)
            {
              let palay_ = this.get_play_data(play_data.hpid);
              if(palay_)
              {
                ret.push(palay_);
              }
            }
          });
          break;
        }
      }
    }
    // 排序
    ret = this.plays_sort(ret);
    return ret; 
  }

  /**
   * @description: 赛事玩法集数据列表排序
   * @param {Array} 赛事玩法集数据列表
   * @return {Array} 处理后的列表
   */
  plays_sort(list){
    let ret = []
    if(list && (list instanceof Array))
    {
      list.sort(function(a, b){
        return (a?a.hpon:0)-(b?b.hpon:0);
      });
    }
    let temp = 0;
    list.forEach(item => {
      temp = item&&item.hton?parseInt(item.hton):0
      if(temp!=0)
      {
        ret.push(item)
      }
    });
    ret.sort(function(a, b){
      return (b.hton?parseInt(b.hton):0)-(a.hton?parseInt(a.hton):0)
    });
    list.forEach(item => {
      temp = item&&item.hton?parseInt(item.hton):0
      if(temp==0)
      {
        ret.push(item)
      }
    });
    list.splice(0,list.length)
    ret.forEach(item => {
      list.push(item)
    });
    return list;
  }
  
  /**
   * @description: 玩法置顶操作
   * @param {Object} play 玩法对象
   * @param {Array} list 赛事集列表
   * @return {Array} 返回置顶后的列表
   */  
  top_index(play, list){
    if(play&&play.hpid)
    {
      if(play.hton == 0)
      {
        play.hton = new Date().getTime()
        this.pl_obj[play.hpid][(play.jno?play.jno:0)]=play.hton
        //置顶
      } else {
        play.hton = 0;
        this.pl_obj[play.hpid][(play.jno?play.jno:0)]=0
        //置顶
        //排序
        list = this.plays_sort(list)
        return list;
      }
      let index = -1;
      let obj_ = null;
      // jno
      this.plays_menu_list.forEach(menuItem => {
        if(menuItem.list && menuItem.list.length)
        {
          index = -1;
          obj_ = null;
          for (let i = 0; i < menuItem.list.length; i++) {
            const play_ = menuItem.list[i];
            if(play_.hpid == play.hpid && (play_.jno?play_.jno:0) == (play.jno?play.jno:0))
            {
              index = i;
              break;
            }
          }
          if(index > 0)
          {
            obj_ = menuItem.list.splice(index, 1);
            menuItem.list.unshift(obj_);
          }
        }
      });
      console.log(JSON.stringify(this.plays_menu_list))
    }
    return list;
  }

  /**
   * @description: 通过hpid获取和jno获取对象
   * @param {Number} hpid 玩法编号
   * @return {object} jno获取对象
   */
  get_play_data(hpid){
    let ret = null;
    if(this.pl_obj[hpid])
    {
      ret = this.pl_obj[hpid];
    }
    return ret;
  }

  /**
   * @description: 按照玩法顺序排序(原来地址顺序发生变化)
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  list_sort(){
    if(this.list && (this.list instanceof Array))
    {
      this.list.sort(function(a, b){
        return a.hpon-b.hpon;
      });
    }
  }

  /**
   * @description: 冒泡排序(原来地址顺序不发生变化---保持原来的顺序不变,返回新的列表但是子项使用原来的地址)
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  list_sort_new(){
    let list = this.list;
    var list_ = [];
    if(list && (list instanceof Array))
    {
      for (let i = 0; i < list.length; i++) {
        if(list[i].hton!=0)
        {
          list_.push(list[i]);
        }
      }
      if(list_.length)
      {
        var len = list_.length-1;
        var t = '';
        for (let i = 0; i < len; i++) {
          for (let k = 0; k < len-i; k++) {
            if(parseInt(list_[k].hton) < parseInt(list_[k+1].hton)){ 
                t = list_[k]; 
                list_[k] = list_[k+1];
                list_[k+1] = t;
            }
          }
        }
      }
      // console.log('list_='+list_.length)
    }
    return list_;
  }
  /**
   * @description: 将赛事详情对象转成多个对象,以便提高操作速度和效率
   * @param {Object} item 赛事对象
   * @param {Object} manyObj 数据叠加时使用的变量
   * @return {undefined} undefined
   */
  list_item_to_many_obj(item, manyObj){
    if(!this.match_obj.mid) {
      this.match_obj.mid = item.mid;
    }
    if(item && item.mid == this.match_obj.mid) {
      if(item){        
        manyObj.pl_obj[item.hpid] = item;  
        if (item.hl && item.hl.length) {
          item.hl.forEach(item3 => {
            if (item3) {
              if (item3.hid) {
                item3.mid = item.mid;
                item3.hpid = item.hpid;
                item3.hsw = item.hsw;
                manyObj.hl_obj[item3.hid] = item3;
              }
              if (item3.ol && item3.ol.length) {
                item3.ol.forEach(item4 => {
                  let ot = ''; // 处理ot是小数的情况
                  if(item4.ot && item4.ot.includes('.')) {
                    ot = item4.ot.replace('.','-');
                  } else {
                    ot = item4.ot;
                  }
                  let _hn = item3.hn?`${item.mid}_${item.hpid}_${item3.hn}_${ot}`:'';
                  // 押注项设置盘口状态
                  Object.assign(item4, {
                    _hpid:item.hpid,
                    _hs: (item3.hs ? item3.hs : 0), 
                    _mhs: (item.mhs ? item.mhs : 0),
                    _mid: item.mid,
                    _hid: item3.hid,
                    _hn,
                  });
                  manyObj.ol_obj[item4.oid] = item4;
                  if(_hn) {
                    manyObj.hn_obj[_hn] = item4;
                  }
                });
              }
            }
          });
        }
      }
    }
  }

  /**
   * @description: 将list格式化成多个obj对象
   * @param {Array} list 赛事列表
   * @return {Object} 将赛事列表转成成对象,提高检索速度
   */
  list_to_many_obj(list){
    let manyObj = {pl_obj:{}, ol_obj:{}, hl_obj:{}, hn_obj:{}}
    if(list && (list instanceof Array)) {
      list.forEach(item => {
        this.list_item_to_many_obj(item,manyObj);
      });
    } else {
      
    }
    return manyObj;
  }
  /**
   * @description: 设置赛事投注项信息
   * @param {Object} data 投注项信息
   * @return {undefined} undefined
   */
   set_match_ol_data(data,hn) {
    let ol_obj = _.get(this.ol_obj, `${data.oid}`);
    if(data.oid && ol_obj) {
      let ol_obj_hn = ol_obj._hn;
      if(hn && ol_obj_hn) {
        let _hn = ol_obj_hn.split('_')[2];
        if(hn==_hn && this.hn_obj[ol_obj_hn]) {
          Object.assign(this.hn_obj[ol_obj_hn], data);
        }
      }
      Object.assign(ol_obj, data);      
      // window.wslog.sendMsg('match_info_ctr中的set_match_ol_data被执行oid', { oid: this.ol_obj[data.oid], data})
    }
  }
  /**
   * @description: 修改赛事级别状态变化
   * @param {String,Number} mid 赛事mid
   * @param {Number} status  赛事级别状态
   * @return {undefined} undefined
   */
  set_match_mhs_status(status){
    // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
    if(this.match_obj && this.match_obj.mid)
    {
      // 设置赛事状态
      Object.assign(this.match_obj, {mhs:status, hs:status})
      // 设置投注项状态
      if(this.list && (this.list instanceof Array))
      {
        this.list.forEach(item_hps => {
          if(item_hps && item_hps.hl && (item_hps.hl instanceof Array))
          {
            item_hps.hl.forEach(item_hl => {
              if(item_hl && item_hl.ol && (item_hl.ol instanceof Array))
              {
                Object.assign(item_hl,{hs: status});
                item_hl.ol.forEach(item_ol => {
                  if(item_ol)
                  {
                    Object.assign(item_ol,{_mhs:status, _hs:status});
                  }
                });
              }
            });
          }
        });
      }
    }
  }
  /**
   * @description: 盘口类型设置
   * @param {String, Number} hid 盘口id
   * @param {Number} hmt
   */
  set_match_hmt(hid, hmt) {
    if(hid&&this.hl_obj[hid])
    {
      Object.assign(this.hl_obj[hid],{ hmt });
    }
  }

  /**
   * @description: 修改盘口级别状态变化
   * @param {String,Number} hid 盘口编号
   * @param {Number} status 盘口状态
   * @param {Array} ols 盘口所对应的投注项列表
   * @return {undefined} undefined
   */
  set_match_hs_status(hid,status,ols){
    // console.log(status+'--333333 set_match_hs_status >>>>'+hid);
    if(hid&&this.hl_obj[hid])
    {
      // 设置赛事级别状态
      Object.assign(this.hl_obj[hid],{hs:status});
      // window.wslog.sendMsg('设置赛事级别状态', { hid, hs: status })   
      if(ols && (ols instanceof Array))
      {
        // 设置新盘口信息(新增和修改)
        ols.forEach(item_ols => {
          if(item_ols&&item_ols.oid&&this.ol_obj[item_ols.oid])
          {
            Object.assign(item_ols, {_hs: status});
            Object.assign(this.ol_obj[item_ols.oid],item_ols);          
            let hn =  this.ol_obj[item_ols.oid]._hn;
            if(hn) {
              Object.assign(this.hn_obj[hn],item_ols);
              // window.wslog.sendMsg('通过坑位设置投注项', { hn, ol_item: item_ols })
            }
          }
        });
      }

      if(this.hl_obj[hid] && this.hl_obj[hid].ol && (this.hl_obj[hid].ol instanceof Array))
      {
        this.hl_obj[hid].ol.forEach(item_ol => {
          if(item_ol)
          {
            Object.assign(item_ol,{_mhs:status, _hs:status});
            // window.wslog.sendMsg('设置赛事级状态和盘口转台到投注项中', { _mhs:status, _hs:status })
          }
        });
      }
    }
  }
  /**
   * @description: 修改押注项级别状态变化
   * @param {String,Number} oid 投注项编号
   * @param {Number} status 投注项状态
   * @return {undefined} undefined
   */
  set_match_os_status(id,status){
    if(id&&this.ol_obj[id])
    {
      // 设置赛事级别状态
      Object.assign(this.ol_obj[id],{os:status});
      id = this.ol_obj[id]._hn;
      if(id) {
        Object.assign(this.hn_obj[id],{os:status});
      }
    }
    if(id&&this.hn_obj[id]) {
      Object.assign(this.hn_obj[id],{os:status});
      id = this.hn_obj[id].oid;
      Object.assign(this.ol_obj[id],{os:status});    
    }
  }
  /**
   * @description: 获取当前玩法
   * @param {Number} hpid 玩法编号
   * @return {Object} 玩法对象
   */
  get_play_info(hpid){
    let play = null;
    if(hpid)
    {
      for (let i = 0; i < this.list.length; i++) {
        if(this.list[i].hpid == hpid)
        {
          play = this.list[i];
          break;
        }
      }
    }
    return play;
  }

  /**
   * @description: 增加/修改玩法信息
   * @param {Object} obj 赛事对象
   * @param {Object} addPlay 需要修改和增加的玩法信息对象
   * @return {undefined} undefined
   */
  upd_play(obj,addPlay){
    // obj= {
    //     "hpid": "173",
    //     "hl": [
    //         {
    //             "hid": "1240538134874726401",
    //             "hs": 0,
    //             "hv": "74.5",
    //             "hmt": 0,
    //             "ol": [
    //                 {
    //                     "oid": "1240538134925058049",
    //                     "os": 2,
    //                     "otd": 548,
    //                     "ot": "Over",
    //                     "ov": 289000,
    //                     "obv": 289000,
    //                     "on": "大 74.5",
    //                     "cds": "SR",
    //                     "ots": "T2"
    //                 },
    //                 {
    //                     "oid": "1240538134992166914",
    //                     "os": 3,
    //                     "otd": 547,
    //                     "ot": "Under",
    //                     "ov": 287000,
    //                     "obv": 287000,
    //                     "on": "小 74.5",
    //                     "cds": "SR",
    //                     "ots": "T1"
    //                 }
    //             ]
    //         }
    //     ],
    //     "hpon": 168,
    //     "hpn": "总分1",
    //     "mid": 363587,
    //     "hmm": 1,
    //     "hshow": "Yes",
    //     "hton": "0",
    //     "hpnb": "总分1",
    //     "title": [
    //         {
    //             "osn": "大 ",
    //             "otd": 548
    //         },
    //         {
    //             "osn": "小 ",
    //             "otd": 547
    //         }
    //     ],
    //     "hpt": 2,
    //     "hsw": "1,2,3,4,5,6"
    // }

    if(obj && this.match_obj && this.match_obj.mid == obj.mid && this.list &&(this.list instanceof Array))
    {
      let isFind = false;
      let hps = this.list;
      let play = null;
      for (let i = 0; i < hps.length; i++) {
        if(hps[i].hpid == obj.hpid)
        {
          play = hps[i];
          break;
        }
      }

      if(play)
      {
        // 删除之前的盘口对象和投注项对象
        if(play&&play.hl&&(play.hl instanceof Array))
        {
          play.hl.forEach(item_hl => {
            if(item_hl){
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol){                    
                    if(this.ol_obj[item_ol.oid]) {
                      let hn = this.ol_obj[item_ol.oid]._hn;
                      // 删除坑位
                      if(hn && this.hn_obj[hn]) {
                        delete this.hn_obj[hn];
                      }
                    }
                    // 删除押注项
                    delete this.ol_obj[item_ol.oid];
                  }
                });
              }
              // 删除盘口对象
              delete this.hl_obj[item_hl.hid];
            }
          });
        }

        // let play_ = _.cloneDeep(obj);
        // 修改玩法信息
        if(obj&&obj.hl&&(obj.hl instanceof Array))
        {
          obj.hl.forEach(item_hl => {
            if(item_hl){
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol){
                    // 押注项对象增加mid,hid
                    Object.assign(item_ol, {
                      _hpid:play.hpid,
                      _mid: obj.mid,
                      _hid: item_hl.hid,
                      _hs: (item_hl.hs ? item_hl.hs : 0), 
                      _mhs: (this.match_obj.mhs ? this.match_obj.mhs : 0),
                      _hn: item_hl.hn
                    });
                  }
                });
              }
              // 盘口对象增加mid
              Object.assign(item_hl, {
                mid: obj.mid,
              });
            }
          });
        }
        let play_ = _.cloneDeep(obj);
        Object.assign(play,play_);
        play_.hl.forEach(item_hl => {
          if(item_hl){
            if(item_hl.ol&&(item_hl.ol instanceof Array)) {
              item_hl.ol.forEach(item_ol => {
                if(item_ol){
                  let ot = ''; // 处理ot是小数的情况
                  if(item_ol.ot && item_ol.ot.includes('.')) {
                    ot = item_ol.ot.replace('.','-');
                  } else {
                    ot = item_ol.ot;
                  }
                  let _hn = item_hl.hn?`${play_.mid}_${item_hl.hpid}_${item_hl.hn}_${ot}`:'';
                  Object.assign(item_ol, {
                    _hpid:item_hl.hpid,
                    _mid: play_.mid,
                    _hid: item_hl.hid,
                    _hs: (item_hl.hs ? item_hl.hs : 0), 
                    _mhs: (this.match_obj.mhs ? this.match_obj.mhs : 0),
                    _hn
                  });
                  this.ol_obj[item_ol.oid] = item_ol;
                  if(_hn) {
                    this.hn_obj[_hn] = item_ol;
                  }                 
                }
              });
            }
            // 盘口对象增加mid
            this.hl_obj[item_hl.hid] = item_hl;
          }
        });
      } else if(addPlay){
        // 未发现玩法增加
        let play_ = obj;
        // 增加盘口对象
        if(play_&&play.hl&&(play_.hl instanceof Array))
        {
          play_.hl.forEach(item_hl => {
            if(item_hl){
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                    if(item_ol){
                      let ot = ''; // 处理ot是小数的情况
                      if(item_ol.ot && item_ol.ot.includes('.')) {
                        ot = item_ol.ot.replace('.','-');
                      } else {
                        ot = item_ol.ot;
                      }
                      let _hn = item_hl.hn?`${play_.mid}_${item_hl.hpid}_${item_hl.hn}_${ot}`:'';
                      // 增加押注项
                      Object.assign(item_ol, {
                        _hpid:item_hl.hpid,
                        _mid: play_.mid,
                        _hid: item_hl.hid,
                        _mhs: play_.mhs,
                        _hs: item_hl.hs,
                        _hn
                      });
                  }
                });
              }
              Object.assign(item_hl, {
                mid: obj.mid,
              });
            }
          });
        }
        play_ = _.cloneDeep(play_);
        if(play_&&play_.hl&&(play_.hl instanceof Array))
        {
          play_.hl.forEach(item_hl => {
            if(item_hl){
              if(item_hl.ol&&(item_hl.ol instanceof Array))
              {
                item_hl.ol.forEach(item_ol => {
                  if(item_ol){
                    let ot = ''; // 处理ot是小数的情况
                    if(item_ol.ot && item_ol.ot.includes('.')) {
                      ot = item_ol.ot.replace('.','-');
                    } else {
                      ot = item_ol.ot;
                    }
                    let _hn = item_hl.hn?`${play_.mid}_${item_hl.hpid}_${item_hl.hn}_${ot}`:'';
                    Object.assign(item_ol, {
                      _hpid: item_hl.hpid,
                      _mid: play_.mid,
                      _hid: item_hl.hid,
                      _mhs: play_.mhs,
                      _hs: item_hl.hs,
                      _hn
                    });
                    // 增加押注项
                    this.ol_obj[item_ol.oid] = item_ol;
                    if(_hn) {
                      this.hn_obj[_hn] = item_ol;
                    }
                  }
                });
              }
              this.hl_obj[item_hl.hid] = item_hl;
            }
          });
        }
        // 增加玩法对象
        hps.push(play_);
      }
    }
  }

/**
 * @description: 清空盘口对象
 * @param {String,Number} hid 盘口编号
 * @return {undefined} undefined
 */
clear_hl_obj(hid){
  var isBreak = false;
  if(hid&&this.hl_obj[hid])
  {
    // 查找list中的列表数据
    if(this.hl_obj[hid].ol && (this.hl_obj[hid].ol instanceof Array))
    {
      // 删除下面的所有押注项
      this.hl_obj[hid].ol.forEach(item_ol => {
        if(item_ol&&item_ol.oid)
        {
          let hn = this.ol_obj[item_ol.oid]._hn;
          if(hn) {
            delete this.hn_obj[hn];
          }
          // this.clear_ol_obj(item_ol.oid);
          delete this.ol_obj[item_ol.oid];
        }
      });
    }
    // 删除盘口对象
    delete this.hl_obj[hid];
    //删除列表中盘口对象
    if(this.list && (this.list instanceof Array))
    {
      let hl_list = null;
      let ret = false; 
      for (let i = 0; i < this.list.length; i++) {
        hl_list = this.list[i];
        if(hl_list && hl_list.hl && (hl_list.hl instanceof Array))
        {
          for (let j = 0; j < hl_list.hl.length; j++) {
            if(hl_list.hl[j] && hl_list.hl[j].hid && hl_list.hl[j].hid == hid)
            {
              hl_list.hl.splice(j, 1);
              ret = true;
              break;
            }
          }
        }
        if(ret)
        {
          break;
        }
      }
    }
  }
}

/**
 * @description: 清空投注项对象
 * @param {String,Number} oid 投注项编号
 * @return {undefined} undefined
 */
clear_ol_obj(oid){
  if(oid&&this.ol_obj[oid]) {
    let hid = this.ol_obj[oid]._hid;
    // 查找list中的列表数据
    if(hid&&this.hl_obj[hid]){
      let ol = this.hl_obj[hid].ol;
      if(ol&& ol.length) {
        for (let i = 0; i < ol.length; i++) {
          if(ol[i]&&ol[i].oid == oid)
          {
            ol.splice(i,1);
            break;
          }
        }
      }
    }
    // 删除押注项对象
    delete this.ol_obj[oid];
  }
}
/**
 * @description: 清空坑位对象
 * @param {String} hn 坑位编号
 * @return {undefined} undefined
 */
clear_hn_obj(hn){
  if(hn && this.hn_obj[hn]) {
    let hid = this.hn_obj[hn]._hid;
    if(hid && this.hl_obj[hid]) {
      let ol = this.hl_obj[hid].ol;
      if(ol && ol.length) {
        for(let i = 0; i < ol.length; i++) {
          if(ol[i]&&ol[i]._hn == hn) {
            ol.splice(i, 1);
            break;
          }
        }
      }
    }
    // 删除坑位对象
    delete this.hn_obj[hn];
  }
}

/**
 * @description: 清空对象
 * @param {Object,Array} any 要清空的对象和列表
 * @return {undefined} undefined
 */
  clear(any){
    if(any&&_.isObject(any))
    {
      if(any instanceof Array){
        any.splice(0,any.length);
      } else{
        for (const key in any) {
          delete any[key]
        }
      }
    }
  }


  /**
   * @description: 清除所有数据
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  clear_data(){
    this.clear(this.play_obj);
    this.clear(this.ol_obj);
    this.clear(this.hl_obj);
    this.clear(this.hn_obj);
    this.clear(this.match_obj);
    this.clear(this.list);    
  }

  /**
   * @description: 销毁函数-清除所有数据和对象
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  destroy(){
    this.clear(this.ol_obj);
    this.clear(this.hl_obj);
    this.clear(this.match_obj);
    this.clear(this.plays_menu_list);
    this.clear(this.list);
    this.view = null;
  }
}
