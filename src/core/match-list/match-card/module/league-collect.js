
  /**
   * @Description 冠军投注后跟新 联赛收藏状态
   * @param {string} mid  赛事id
   * @returns
   */
  update_league_collect_data(mid){
    for (let index = 0; index < this.match_list_card_key_arr.length; index++) {
      let item = this.match_list_card_key_arr[index]
      if(item.indexOf('league_title') !=-1){
        if(this.all_card_obj[item].mid == mid){
          this.all_card_obj[item].league_obj.tf = true
          return
        }
      }
    }
  }
  /**
   *@Description 更新常规赛事不同分类的联赛收藏状态 并 获取所有同联赛下的赛事ID
   * @param {String} tid  联赛id
   * @param {Boolean} status  联赛收藏状态
   * @returns {Array}       联赛下的赛事ID
   */
  update_league_collect_data_and_get_mids(tid,status){
    let mids = []
    // 遍历所有卡片key
    _.each(this.match_list_card_key_arr, card_key => {
      if(card_key.indexOf('league_title') !=-1){
        let card_obj = this.all_card_obj[card_key]
        if(card_obj.league_obj.tid == tid){
          card_obj.league_obj.tf = status
          // 组装联赛下的赛事ID
          mids.push(...card_obj.league_obj.mids.split(','))
        }
      }
    })
    return mids
  }