/*
 * @Author: nuanyang
 * @Date: 2022-12-20 13:35:41
 * @Description: 球种数量模板
 */
/**
 * 球种数量模板
 */
const sport_match_count = {
    csid_100:{count:0},
    csid_101:{count:0},
    csid_102:{count:0},
    csid_103:{count:0},
    csid_104:{count:0},
    csid_105:{count:0},
    csid_1001:{count:0},
    csid_1002:{count:0},
    csid_1003:{count:0},
    csid_1004:{count:0},
    csid_1005:{count:0},
    csid_1009:{count:0},
    csid_1010:{count:0},
    csid_1011:{count:0},
    csid_1012:{count:0},
  }
  for(let i = 1; i < 51; i++){
    sport_match_count['csid_'+i] = {count:0}
  }
  export { sport_match_count}