// 主场动画配置
const homeSvgAnimationConfig = {
  init: [140, 95], // 初始位置
  beforePath: [
    [0, 0],

    [50, 0],
    [100, 20],

    [50, 40],
    [110, 60],

    [35, 80],
    [120, 100],

    [30, 120],
    [140, 140],

    [25, 165],
    [160, 185],

    [25, 210],
    [-130, 210]
  ], // Svg 路径
  afterPathMove: 440, // 正数向右移动
  // svg动画参数配置
  pathAnimateParams: {
    dur: '2s',
    repeatCount: '1', // 1 indefinite 动画执行次数
    fill: 'freeze',
    colors: ['rgba(0,0,0,.3)', "url(#gradient);rgba(0,0,0,.8)"], // 从一个颜色渐变到第二个颜色
  },
  // svg 文字动画参数配置
  textAnimateParams: {
    text: '主队事件', // 配置文字
    from: '0', // 从第一个位置 
    to: '100', // =》 到第二个位置
    dur: '0.5s', // 文字动画时间
    repeatCount: '1', // 1 indefinite 动画执行次数
    x: '100', // 文字初始x轴位置
    y: '150', // 文字初始y轴位置
    colors: ['rgba(255,255,255,0)', 'url(#gradient);rgba(255,255,255,.8)']
  }
}
// 客场动画配置
const awaySvgAnimationConfig = {
  init: [660, 95], // 初始位置
  startInit: [500, 95], // 初始偏移
  beforePath: [
    [0, 0],
    [0, 0],

    [130, 0],
    [70, 20],

    [110, 40],
    [50, 60],

    [120, 80],
    [45, 95],

    [125, 120],
    [35, 130],

    [125, 165],
    [15, 175],

    [100, 210],
    [130, 210]
  ], // Svg 路径
  afterPathMove: -440, // 正数向右移动
  // svg动画参数配置
  pathAnimateParams: {
    dur: '2s',
    repeatCount: '1', // 1 indefinite 动画执行次数
    fill: 'freeze',
    colors: ['rgba(0,0,0,.3)', "url(#gradient);rgba(0,0,0,.8)"], // 从一个颜色渐变到第二个颜色
  },
  // svg 文字动画参数配置
  textAnimateParams: {
    text: '客队事件', // 配置文字
    from: '520', // 从第一个位置 
    to: '450', // =》 到第二个位置
    dur: '0.5s', // 文字动画时间
    repeatCount: '1', // 1 indefinite 动画执行次数
    x: '450', // 文字初始x轴位置
    y: '150', // 文字初始y轴位置
    colors: ['rgba(255,255,255,0)', 'url(#gradient);rgba(255,255,255,.8)']
  }
}
// 主场默认动画
const homeSvgAnimationDefaultConfig = {
  textParams: {
    x: 110,
    y: 145,
    text: '主场事件'
  },
  pathParams: {
    x: 130,
    y: 140,
  }
}
// 客场默认动画
const awaySvgAnimationDefaultConfig = {
  textParams: {
    x: 440,
    y: 145,
    text: '客场事件'
  },
  pathParams: {
    x: 460,
    y: 140,
  }
}
// 默认动画
const svgAnimationDefaultConfig = {
  textParams: {
    x: 275,
    y: 145,
    text: '中立事件',
  },
  pathParams: {
    x: 300,
    y: 140,
  }
}

// 事件动画配置
export const event_animation = {
  // 危险球位置
  dang_poss: {
    svg_path_config: {
      init: [140, 95], // 初始位置
      beforePath: [
        [0, 0],
        
        [50, 0],
        [100, 20],
        
        [50, 40],
        [110, 60],
        
        [35, 80],
        [120, 100],
        
        [30, 120],
        [140, 140],
        
        [25, 165],
        [160, 185],
        
        [25, 210],
        [-130, 210]
      ], // Svg 路径
      afterPathMove: 440, // 正数向右移动
      // svg动画参数配置
      pathAnimateParams: {
        dur: '2s',
        repeatCount: '1', // 1 indefinite 动画执行次数
        fill: 'freeze',
        colors: ['rgba(0,0,0,.3)', "url(#gradient);rgba(0,0,0,.8)"], // 从一个颜色渐变到第二个颜色
      },
      // svg 文字动画参数配置
      textAnimateParams: {
        text: '主场进球', // 配置文字
        from: '0', // 从第一个位置 
        to: '100', // =》 到第二个位置
        dur: '0.5s', // 文字动画时间
        repeatCount: '1', // 1 indefinite 动画执行次数
        x: '100', // 文字初始x轴位置
        y: '150', // 文字初始y轴位置
        colors: ['rgba(255,255,255,0)', 'url(#gradient);rgba(255,255,255,.8)']
      }
    },
  },
  // 危险进攻
  dangerous_attack: {
    svg_path_config: {
      init: [660, 95], // 初始位置
      startInit: [500, 95], // 初始偏移
      beforePath: [
        [0, 0],
        [0, 0],

        [130, 0],
        [70, 20],

        [110, 40],
        [50, 60],

        [120, 80],
        [45, 95],

        [125, 120],
        [35, 130],

        [125, 165],
        [15, 175],

        [100, 210],
        [130, 210]
      ], // Svg 路径
      afterPathMove: -440, // 正数向右移动
      // svg动画参数配置
      pathAnimateParams: {
        dur: '2s',
        repeatCount: '1', // 1 indefinite 动画执行次数
        fill: 'freeze',
        colors: ['rgba(0,0,0,.3)', "url(#gradient);rgba(0,0,0,.8)"], // 从一个颜色渐变到第二个颜色
      },
      // svg 文字动画参数配置
      textAnimateParams: {
        text: '客场进球', // 配置文字
        from: '520', // 从第一个位置 
        to: '450', // =》 到第二个位置
        dur: '0.5s', // 文字动画时间
        repeatCount: '1', // 1 indefinite 动画执行次数
        x: '450', // 文字初始x轴位置
        y: '150', // 文字初始y轴位置
        colors: ['rgba(255,255,255,0)', 'url(#gradient);rgba(255,255,255,.8)']
      }
    },
  },
  // 安全球位置-safe_ball
  ball_safe: {
    svg_path_config: {
      init: [140, 95], // 初始位置
      beforePath: [
        [0, 0],

        [50, 0],
        [100, 20],

        [50, 40],
        [110, 60],

        [35, 80],
        [120, 100],

        [30, 120],
        [140, 140],

        [25, 165],
        [160, 185],

        [25, 210],
        [-130, 210]
      ], // Svg 路径
      afterPathMove: 440, // 正数向右移动
      // svg动画参数配置
      pathAnimateParams: {
        dur: '2s',
        repeatCount: '1', // 1 indefinite 动画执行次数
        fill: 'freeze',
        colors: ['rgba(0,0,0,.3)', "url(#gradient);rgba(0,0,0,.8)"], // 从一个颜色渐变到第二个颜色
      },
      // svg 文字动画参数配置
      textAnimateParams: {
        text: '主场进球', // 配置文字
        from: '0', // 从第一个位置 
        to: '100', // =》 到第二个位置
        dur: '0.5s', // 文字动画时间
        repeatCount: '1', // 1 indefinite 动画执行次数
        x: '100', // 文字初始x轴位置
        y: '150', // 文字初始y轴位置
        colors: ['rgba(255,255,255,0)', 'url(#gradient);rgba(255,255,255,.8)']
      }
    },
  },
  // 05' - 进球-goal
  goal: {
    svg_path_config: {
      init: [660, 95], // 初始位置
      startInit: [500, 95], // 初始偏移
      beforePath: [
        [0, 0],
        [0, 0],

        [130, 0],
        [70, 20],

        [110, 40],
        [50, 60],

        [120, 80],
        [45, 95],

        [125, 120],
        [35, 130],

        [125, 165],
        [15, 175],

        [100, 210],
        [130, 210]
      ], // Svg 路径
      afterPathMove: -440, // 正数向右移动
      // svg动画参数配置
      pathAnimateParams: {
        dur: '2s',
        repeatCount: '1', // 1 indefinite 动画执行次数
        fill: 'freeze',
        colors: ['rgba(0,0,0,.3)', "url(#gradient);rgba(0,0,0,.8)"], // 从一个颜色渐变到第二个颜色
      },
      // svg 文字动画参数配置
      textAnimateParams: {
        text: '客场进球', // 配置文字
        from: '520', // 从第一个位置 
        to: '450', // =》 到第二个位置
        dur: '0.5s', // 文字动画时间
        repeatCount: '1', // 1 indefinite 动画执行次数
        x: '450', // 文字初始x轴位置
        y: '150', // 文字初始y轴位置
        colors: ['rgba(255,255,255,0)', 'url(#gradient);rgba(255,255,255,.8)']
      }
    },
  },
  // 进球确认
  goal_confirm: {
    svg_path_config: {
      init: [140, 95], // 初始位置
      beforePath: [
        [0, 0],

        [50, 0],
        [100, 20],

        [50, 40],
        [110, 60],

        [35, 80],
        [120, 100],

        [30, 120],
        [140, 140],

        [25, 165],
        [160, 185],

        [25, 210],
        [-130, 210]
      ], // Svg 路径
      afterPathMove: 440, // 正数向右移动
      // svg动画参数配置
      pathAnimateParams: {
        dur: '2s',
        repeatCount: '1', // 1 indefinite 动画执行次数
        fill: 'freeze',
        colors: ['rgba(0,0,0,.3)', "url(#gradient);rgba(0,0,0,.8)"], // 从一个颜色渐变到第二个颜色
      },
      // svg 文字动画参数配置
      textAnimateParams: {
        text: '主场进球', // 配置文字
        from: '0', // 从第一个位置 
        to: '100', // =》 到第二个位置
        dur: '0.5s', // 文字动画时间
        repeatCount: '1', // 1 indefinite 动画执行次数
        x: '100', // 文字初始x轴位置
        y: '150', // 文字初始y轴位置
        colors: ['rgba(255,255,255,0)', 'url(#gradient);rgba(255,255,255,.8)']
      }
    },
  }
}
export const svgAnimationConfig = {
  homeSvgAnimationConfig,
  awaySvgAnimationConfig,
  // 主场默认动画
  homeSvgAnimationDefaultConfig,
  // 客场默认动画
  awaySvgAnimationDefaultConfig,
  // 默认动画
  svgAnimationDefaultConfig,
}