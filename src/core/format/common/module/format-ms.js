

  /**
   * @description 根据 ms 返回是否是滚球
   * @param  {number} ms  赛事的当前状态
   * @oaran {array} exclude 排除的状态
   * @return {number} is_play 是否滚球：0 非滚球 1 滚球
   */
  const get_match_status=(ms,exclude)=>{
    let _ms = Number(ms)
    // 为滚球的所有状态
    let all_ms = [1,2,7,10,110]

    // 排除某些滚球状态
    if(exclude){
      all_ms = all_ms.concat(exclude).filter(v => !all_ms.includes(v) || !exclude.includes(v))
    }

    // 非滚球
    let is_play =  0
    // 进行中,暂停,延迟,比赛中断,即将开赛
    if(all_ms.includes(_ms)){
      is_play = 1
    }

    return is_play
  }