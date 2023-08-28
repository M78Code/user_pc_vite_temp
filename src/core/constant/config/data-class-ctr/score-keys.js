// S120~S159 比分key列表
let many_keys = []
for (let i = 120; i <= 159; i++) {
  many_keys.push(`S${i}`)
}
/**
 * 历史比分字典
 */
export const history_score_dict = {
  // 【篮球】第1节~第4节，加时赛比分，点球大战
  csid_2: ['S19','S20','S21','S22','S7','S170'],
  // 【篮球半场】上半场，下半场，加时赛比分
  csid_2_half: ["S2", "S3", "S7"],
  // 【棒球】第1局比分 ~ 第40局比分
  csid_3: [...many_keys, "S7","S170"],
  // 【冰球】第1局比分 ~ 第40局比分，点球大战比分
  csid_4: [...many_keys, "S7","S170"],
  // 【网球】第1盘比分 ~ 第5盘比分
  csid_5: ["S23", "S39", "S55", "S71", "S87"],
  // 【斯诺克】第1局比分 ~ 第40局比分
  csid_7: many_keys,
  // 【乒乓球】第1局比分 ~ 第40局比分
  csid_8: many_keys,
  // 【排球】第1局比分 ~ 第40局比分
  csid_9: many_keys,
  // 【羽毛球】第1局比分 ~ 第40局比分
  csid_10: many_keys,
  // 【手球】下半场，点球大战比分
  csid_11: ["S7", "S170"],
  // 【沙滩排球】第1局比分 ~ 第40局比分
  csid_13: many_keys,
  // 【曲棍】第1节~第4节，加时赛比分，点球大战
  csid_15: ['S19','S20','S21','S22','S7','S170'],
  // 【水球】第1节~第4节，加时赛比分，点球大战
  csid_16: ['S19','S20','S21','S22','S7','S170'],

}

/**
 * 赛事阶段 对应的比分key
 */
export const match_state_convert_score_dict = {
  //【篮球】——根据mmp
  csid_2: {
    // 上半场比分
    mmp_1: "S2",
    // 下半场比分
    mmp_2: "S3",
    // 等待加时,加时赛
    mmp_32: "S7",
    mmp_40: "S7",
    // 第1节
    mmp_13: "S19",
    // 第1节间休息、第2节
    mmp_301: "S20",
    mmp_14: "S20",
    // 第2节间休息、第3节
    mmp_302: "S21",
    mmp_15: "S21",
    // 第3节间休息、第4节、全场结束
    mmp_303: "S22",
    mmp_16: "S22",
    mmp_100: "S22",

  },
  //【冰球】——根据mmp
  csid_4: {
    // 未开赛、第1局
    mmp_0: "S120",
    mmp_1: "S120",
    // 第1局间休息、第2局
    mmp_301: "S121",
    mmp_2: "S121",
    // 第2局间休息、第3局
    mmp_302: "S122",
    mmp_3: "S122",
    // 等待加时,加时赛
    mmp_32: "S7",
    mmp_40: "S7",
    // 等待点球，点球
    mmp_34:"S170",
    mmp_50:"S170",
  },

  //【网球】——根据mmp
  csid_5: {
    // 未开赛、第一盘
    mmp_0: "S23",
    mmp_8: "S23",
    // 第二盘
    mmp_9: "S39",
    // 第三盘
    mmp_10: "S55",
    // 第四盘
    mmp_11: "S71",
    // 第五盘
    mmp_12: "S87",
  },

  //【美式足球】——根据mmp
  csid_6: {
    // 未开赛、第1节
    mmp_0: "S19",
    mmp_13: "S19",
    // 第1节间休息、第2节
    mmp_301: "S20",
    mmp_14: "S20",
    // 第2节间休息、第3节
    mmp_302: "S21",
    mmp_15: "S21",
    // 第3节间休息、第4节、全场结束
    mmp_303: "S22",
    mmp_16: "S21",
    mmp_100: "S22",
    // 加时赛
    mmp_40: "S7",
  },

  //【排球】——根据mmp
  csid_9: {
    // 未开赛、第1局
    mmp_0: "S120",
    mmp_8: "S120",
    // 第1局间休息、第2局
    mmp_301: "S121",
    mmp_9: "S121",
    // 第2局间休息、第3局
    mmp_302: "S122",
    mmp_10: "S122",
    // 第3局间休息、第4局
    mmp_303: "S123",
    mmp_11: "S123",
    // 第4局间休息、第5局
    mmp_304: "S124",
    mmp_12: "S124",
    // 第5局间休息、第6局
    mmp_305: "S124",
    mmp_441: "S124",
    // 第6局间休息、第7局
    mmp_306: "S124",
    mmp_442: "S124",
  },

  //【羽毛球】——根据mmp
  csid_10: {
    // 未开赛、第1盘
    mmp_0: "S120",
    mmp_8: "S120",
    // 第1盘间休息、第2盘
    mmp_301: "S121",
    mmp_9: "S121",
    // 第2盘间休息、第3盘
    mmp_302: "S122",
    mmp_10: "S122",
    // 第3盘间休息、第4盘
    mmp_303: "S123",
    mmp_11: "S123",
    // 第4盘间休息、第5盘
    mmp_304: "S124",
    mmp_12: "S124",
  },
  //【斯诺克】——根据mct
  csid_7: ["S120",...many_keys],

  //【乒乓球】——根据mmp
  csid_8: {
    // 未开赛、第1局
    mmp_0: "S120",
    mmp_8: "S120",
    // 第1局间休息、第2局
    mmp_301: "S121",
    mmp_9: "S121",
    // 第2局间休息、第3局
    mmp_302: "S122",
    mmp_10: "S122",
    // 第3局间休息、第4局
    mmp_303: "S123",
    mmp_11: "S123",
    // 第4局间休息、第5局
    mmp_304: "S124",
    mmp_12: "S124",
    // 第5局间休息、第6局
    mmp_305: "S125",
    mmp_441: "S125",
    // 第6局间休息、第7局
    mmp_306: "S126",
    mmp_442: "S126",

  },
  //【曲棍球】——根据mmp
  csid_15: {
    // 未开赛、第1节
    mmp_0: "S19",
    mmp_13: "S19",
    // 第1节间休息、第2节
    mmp_301: "S20",
    mmp_14: "S20",
    // 第2节间休息、第3节
    mmp_302: "S21",
    mmp_15: "S21",
    // 第3节间休息、第4节、全场结束
    mmp_303: "S22",
    mmp_16: "S22",
    mmp_100: "S22",
    // 加时赛
    mmp_40: "S7",
  },
  //【水球】——根据mmp
  csid_16: {
    // 未开赛、第1节
    mmp_0: "S19",
    mmp_13: "S19",
    // 第1节间休息、第2节
    mmp_301: "S20",
    mmp_14: "S20",
    // 第2节间休息、第3节
    mmp_302: "S21",
    mmp_15: "S21",
    // 第3节间休息、第4节、全场结束
    mmp_303: "S22",
    mmp_16: "S22",
    mmp_100: "S22",
    // 加时赛
    mmp_40: "S7",
  }
}