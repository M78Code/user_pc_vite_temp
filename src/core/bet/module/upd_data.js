  /**
       * @description: 调用queryLatestMarketInfo完接口后的回调方法用来更新vuex中投注项的数据
       * @param {*} this.
       * @param {*} obj 设置的新对象
       */
  http_upd_data( obj) {
    // console.log('进入queryLatestMarketInfo回调方法',{method: 'http_upd_data'});
    let i = obj.i;

    let http_data_list = obj.http_data_list;  //接口返回的http_data_list
    let id, hpid, old_hv, old_on, new_on = '', handicap_value, old_odds_value, bs, hid, msc, bet_obj, score_type;
    let bet_item, self = obj.self, handicap_change = {};

    if(this.is_bet_single) {
      bet_obj = "bet_single_obj";
      id = this.bet_single_list[i];
    } else {
      bet_obj = "bet_obj";
      id = this.bet_list[i];
    }
    if(!id) return;
    if(!this[bet_obj][id]) {
      return;
    }
    bet_item = this.bet_obj[id];
    bs = this[bet_obj][id].bs;

    hid =  _.get(bs, 'hps[0].hl[0].hid') || _.get(bs, 'hps[0].hl[0].ol.hid');
    hpid = _.get(bs, 'hps[0].hpid') ||  _.get(bs, 'hps[0].hl[0].ol.hpid');
    old_hv = bs.hps[0].hl[0].hv ||  _.get(bs, 'hps[0].hl[0].ol.hv');
    old_on = bs.hps[0].hl[0].ol[0] ?bs.hps[0].hl[0].ol[0].on:bs.hps[0].hl[0].ol.on;
    old_odds_value = bs.hps[0].hl[0].ol[0]?bs.hps[0].hl[0].ol[0].ov:bs.hps[0].hl[0].ol.ov;
    // console.log('提起获取上次旧数据:', {hid, old_hv, old_on, old_odds_value })
    // 如果盘口有正负号,则移除正负号
    if(old_hv) {
     old_hv = _.trim(old_hv);
     if(old_hv.startsWith('+') || old_hv.startsWith('-')) {
      old_hv = old_hv.substr(1, old_hv.length);
     } else if (old_hv.endsWith('+') || old_hv.endsWith('-')) {
      old_hv = old_hv.substr(0, old_hv.length-1);
     }
    }

    // 取掉盘口值 如: 大
    if(old_on && old_on.includes(old_hv)) {
      // 用&nbsp;先取代盘口的位置
      new_on = old_on.replace(old_hv, '&nbsp;');
      // console.log(`========用&nbsp;先取代盘口的位置===============>${new_on}`);
    }

    //整合数据
    http_data_list.forEach((market_info) => {
      let {
          away, // 客队id
          home,  // 主队id
          matchInfoId, // 赛事id
          matchPeriodId, // 赛事阶段
          matchStatus, // 赛事状态
          matchHandicapStatus,//赛事盘口状态
          playId,    // 玩法id
          playName,  // 玩法名称
          tournamentName, // 联赛名称
          currentMarket,  // 当前选中的盘口数据
          marketList, // 当前玩法下的盘口数据
          matchOver,   //赛事结束
          cds,//数据源
          pendingOrderStatus
      } = market_info;

      if(bs.mid == matchInfoId) {
        let sportId = _.get(`${bet_obj}.${id}.bs.csid`);
        if(!_.isUndefined(matchOver) && !_.isNull(matchOver)) {
          this[bet_obj][id].cs.match_over = matchOver;
        }
        if(!_.isUndefined(matchStatus) && !_.isNull(matchStatus)) {
          this[bet_obj][id].bs.ms = matchStatus; // 赛事状态
        }
        if(!_.isUndefined(matchHandicapStatus) && !_.isNull(matchHandicapStatus)) {
          this[bet_obj][id].bs.mhs = matchHandicapStatus; // 赛事状态
          this[bet_obj][id].cs.match_status = matchHandicapStatus;
        }
        if(!_.isUndefined(matchPeriodId) && !_.isNull(matchPeriodId)) {
          // 根据不同的赛事阶段更新score_type的值
          let match = this[bet_obj][id].bs;
          score_type = self.set_basic_key(match);
          // 赛事阶段不同对score_type进行更新
          if(score_type && this[bet_obj][id].bs.mmp !=  matchPeriodId) {
            this[bet_obj][id].cs.score_type = score_type;
          }
          // 赛事阶段
          this[bet_obj][id].bs.mmp = matchPeriodId;
        }
        // 主队
        if(!_.isEmpty(home)) {
          this[bet_obj][id].bs.mhn = home;
          this[bet_obj][id].cs.home = home;
        }
        // 客队
        if(!_.isEmpty(away)) {
          this[bet_obj][id].bs.man = away;
          this[bet_obj][id].cs.away = away;
        }
        // 数据源
        if(!_.isEmpty(cds)) {
          this[bet_obj][id].bs.cds = cds;
          this[bet_obj][id].cs.cds = cds;
        }
        // 玩法名称
        if(_.get(`${bet_obj}.${id}.cs.${playId}`, false) &&
          !_.isUndefined(playName) &&
          !_.isNull(playName)) {
          this[bet_obj][id].bs.hps[0].hpn = playName;
          this[bet_obj][id].cs.play_name = playName;
        }


        // 联赛名称
        if(!_.isUndefined(tournamentName) && !_.isNull(tournamentName)) {
          this[bet_obj][id].bs.tn = tournamentName;
        }
        if(!_.isUndefined(currentMarket) && !_.isNull(currentMarket)) {
          let  {
            marketType,
            placeNum,
            status,
            marketValue,
            marketOddsList,
            score
          } = currentMarket;
          if((placeNum &&
             (matchInfoId == bs.mid) &&
             (placeNum == _.get(bs, 'hps[0].hl[0].hn', -1) &&
             playId == hpid) ||

             (currentMarket.id == hid && playId == hpid))) {
            // 赛事比分
            let item_score, home_score = _.get(bet_item, 'cs.home_score') || '0', away_score = _.get(bet_item, 'cs.away_score') || '0',  msc;
            if(score && score.includes('|') && score.includes(':')) {
              let scoreBenchmark = score.split('|');
              score_type = scoreBenchmark[0];
              // console.log(`==============cs.score_type:${this[bet_obj][id].cs.score_type}=============score_type:${score_type}`);
              if(score_type == this[bet_obj][id].cs.score_type) {
                let scroe_array = scoreBenchmark[1].split(':');
                home_score = scroe_array[0] || '0';
                away_score = scroe_array[1] || '0';
                item_score = `${score_type}|${home_score}:${away_score}`;
              }
            }
            msc = this[bet_obj][id].bs.msc || [];
            if(!['match_details','details'].includes(this[bet_obj][id].cs.source)) {
              let score_obj = {};
              let len = msc.length;
              for (let i = 0; i < len; i++) {
                if (msc[i] && msc[i].includes('|')) {
                  let mcs_item_arr = msc[i].split('|');
                  if(mcs_item_arr[0] == score_type) {
                    score_obj[mcs_item_arr[0]] = `${home_score}:${away_score}`;
                  } else {
                    score_obj[mcs_item_arr[0]] = mcs_item_arr[1];
                  }
                }
              }
              msc = [];
              for (let [key, value] of Object.entries(score_obj)) {
                let item = `${key}|${value}`;
                msc.push(item);
              }

              if (msc.length == 0 && item_score) {
                msc = [item_score];
              }

              if(msc.length > 0) {
                this[bet_obj][id].bs.msc = msc;
              }
            } else if(_.isArray(msc) && !_.isEmpty(score)) { // 详情意外的其他模块比分处理
              let index = _.findIndex(msc, item => item.includes(score_type));
              if(index == -1) {
                msc.push(score);
              } else {
                msc[index] = score;
              }
            }

            // console.log(`==============cs.score_type:${this[bet_obj][id].cs.score_type}=============score_type:${score_type}`);
            if(!_.isEmpty(score) && score_type == this[bet_obj][id].cs.score_type) {
              // 合并主队得分
              this[bet_obj][id].cs.home_score = home_score;
              // 合并客队得分
              this[bet_obj][id].cs.away_score = away_score;
            }
            // 坑位存在与盘口id不相等，则需要更新盘口id
            if(placeNum && currentMarket.id != hid ) {
              // 盘口是否发生变化(坑位变化)
              handicap_change = {
                mid: matchInfoId,
                hpid: playId,
                csid: sportId
              };
              this[bet_obj][id].bs.hps[0].hl[0].hid = currentMarket.id;
              this[bet_obj][id].cs.handicap_id = currentMarket.id
            }
            // 盘口类型
            if(!_.isUndefined(marketType) && !_.isNull(marketType)) {
              this[bet_obj][id].bs.hps[0].hl[0].hmt = marketType;
              this[bet_obj][id].cs.market_type = marketType;
            }
            if(!_.isEmpty(marketValue)  && this[bet_obj][id].bs.hps[0].hl[0].hv != marketValue) {
              handicap_change = {
                mid: matchInfoId,
                hpid: playId,
                csid: sportId
              };
            }
            let  no_merage_market_value = play_mapping.NO_MERAGE_MARKETVALUE[sportId];
            // 盘口值
            if(
              _.isArray(no_merage_market_value) &&
              !no_merage_market_value.includes(`${playId}`) &&
              !_.isUndefined(marketValue) &&
              !_.isNull(marketValue)) {
              handicap_value = _.trim(marketValue) || '';
            }
            // 盘口状态合并
            if(!_.isUndefined(status) && !_.isNull(status)) {
              this[bet_obj][id].cs.handicap_status = status;
              this[bet_obj][id].bs.hps[0].hl[0].hs = status;
            }
          }
          if(_.isArray(marketOddsList)) {
            let hn;
            // 如果赛事存在玩法id,以及坑位
            if(playId && placeNum) {
              hn = `${matchInfoId}_${playId}_${placeNum}`;
            }
            // 移除盘口正负号
            if(handicap_value) {
              handicap_value = _.trim(handicap_value);
              if(handicap_value.startsWith('+') || handicap_value.startsWith('-')) {
                handicap_value = handicap_value.substr(1, handicap_value.length);
              } else if (handicap_value.endsWith('+') || handicap_value.endsWith('-')) {
                handicap_value = handicap_value.substr(0, handicap_value.length-1);
              }
            }
            //  投注项数据合并
            marketOddsList.forEach(odds_item => {
              // 投注项类型存在,则坑位加上投注项类型才是完整的坑位id
              if(hn && odds_item.oddsType) {
                hn = `${hn}_${odds_item.oddsType}`;
              } else {
                hn = null;
              }

              let new_obj = this[bet_obj][id];
              let kid = new_obj.cs.kid;
              let clone_obj ={};
              if(!(new_obj.bs.hps[0].hl[0].ol instanceof Array)) {
                clone_obj  = _.cloneDeep(new_obj.bs.hps[0].hl[0].ol)
              }
              if(!new_obj.bs.hps[0].hl[0].ol[0])
              {
                new_obj.bs.hps[0].hl[0].ol[0] = clone_obj;
              }
              if(hn && hn == kid) { // 如果坑位存在,则需要合并oid
                // 投注项oid
                new_obj.cs.oid = odds_item.id;
                new_obj.bs.hps[0].hl[0].ol[0].oid = odds_item.id;

                // 赔率
                new_obj.cs.odds_value = odds_item.oddsValue;
                new_obj.bs.hps[0].hl[0].ol[0].ov = odds_item.oddsValue;

                // 投注状态
                new_obj.cs.active = odds_item.oddsStatus;
                new_obj.bs.hps[0].hl[0].ol[0].os = odds_item.oddsStatus;
                if(handicap_value && old_hv != handicap_value) {
                  // console.log(`=============将&nbsp;的位置替换为盘口值===========>${new_on.replace('&nbsp;', handicap_value)}`);
                  // console.log('将&nbsp;的位置替换为盘口值:', {new_on: new_on.replace('&nbsp;', handicap_value)})
                  new_obj.bs.hps[0].hl[0].hv = handicap_value;
                  new_obj.cs.handicap_value = handicap_value;
                  // 将&nbsp;的位置替换为盘口值
                  new_obj.bs.hps[0].hl[0].ol[0].on = new_on.replace('&nbsp;', handicap_value);
                  // console.log(`================11111==========>>>>>on:${new_obj.bs.hps[0].hl[0].ol[0].on}`);
                }
                // ot(投注类型)字段合并
                if(!_.isUndefined(odds_item.oddsType) && !_.isNull(odds_item.oddsType)) {
                  new_obj.bs.hps[0].hl[0].ol[0].ot = odds_item.oddsType;
                }
                // 前后盘口值有变化则进行标记
                if(handicap_value && old_hv != handicap_value && old_odds_value != odds_item.oddsValue) {
                  new_obj.cs.hv_ov_change = true;
                }
                //如果是预约投注添加预约投注数据
                if(!_.isUndefined(pendingOrderStatus) &&  !_.isNull(pendingOrderStatus)) {
                  this[bet_obj][id].cs.pending_order_status = pendingOrderStatus;
                  // console.log(`------------http_upd_data------->>>>pending_order_status:${pendingOrderStatus}`);
                }
              } else if (new_obj.cs.oid == odds_item.id) { // 坑位不存在,通过oid进行匹配合并赔率以及状态
                // 赔率
                new_obj.cs.odds_value = odds_item.oddsValue;
                new_obj.bs.hps[0].hl[0].ol[0].ov = odds_item.oddsValue;

                // 投注状态
                new_obj.cs.active = odds_item.oddsStatus;
                new_obj.bs.hps[0].hl[0].ol[0].os = odds_item.oddsStatus;
                if(odds_item.playOptions) {
                  new_obj.bs.hps[0].hl[0].ol[0].on = odds_item.playOptions;
                  handicap_value = odds_item.playOptions;
                  new_obj.bs.hps[0].hl[0].hv = handicap_value;
                  new_obj.cs.handicap_value = handicap_value;
                } else if(handicap_value && old_hv != handicap_value) {
                  // 重新拼接新的on 之前为`大 盘口值` // 将&nbsp;的位置替换为盘口值
                  // console.log(`=======重新拼接新的on============>${new_on.replace('&nbsp;', handicap_value)}`);
                  // console.log('重新拼接新的on:', {new_on: new_on.replace('&nbsp;', handicap_value)})
                  new_obj.bs.hps[0].hl[0].ol[0].on = new_on.replace('&nbsp;', handicap_value);
                  // console.log(`================222222==========>>>>>on:${new_obj.bs.hps[0].hl[0].ol[0].on}`);
                }
                // ot(投注类型)字段合并
                if(!_.isUndefined(odds_item.oddsType) && !_.isNull(odds_item.oddsType)) {
                  new_obj.bs.hps[0].hl[0].ol[0].ot = odds_item.oddsType;
                }
                // 如果盘口和赔率都不相同则把标志为设置为true
                if(handicap_value && old_hv != handicap_value && old_odds_value != odds_item.oddsValue) {
                  // console.log('重置盘口赔率一起变化的hv_ov_change参数',{handicap_value, old_hv,old_odds_value,odds_value:odds_item.oddsValue})
                  new_obj.cs.hv_ov_change = true;
                }
                //如果是预约投注添加预约投注数据
                if(!_.isUndefined(pendingOrderStatus) &&  !_.isNull(pendingOrderStatus)) {
                  this[bet_obj][id].cs.pending_order_status = pendingOrderStatus;
                  // console.log(`------------http_upd_data------->>>>pending_order_status:${pendingOrderStatus}`);
                }
              }
            });
          }
        }
        // 如果有坑位变化则发送C303，否则就发送C105
        if(!_.isEmpty(handicap_change)) {
          self.yabo_common.update_handicap(handicap_change);
        } else {
          // 同步盘口下所有投注项的数据
          self.yabo_common.update_odds_info2({
            mid: matchInfoId,
            sportId,
            mhs: matchHandicapStatus,
            playId,
            marketList
          });
        }
      }
    });

  }