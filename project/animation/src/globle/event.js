const getSvgPath = (key) => {
    return `/public/animation/svg/${key}.svg`;
}
// 事件动画配置
export const event_animation = {
    // 危险球位置
    dang_poss: {
        animation_svg: '危险球位置',
        animation_svg_path: getSvgPath(0),
        animation_svg_tmp: 0,
        animation_fun: '',
        svg_config: {
            duration: '2s',
            repeatCount: '1', // 1 indefinite
            fill: 'freeze',
        }
    },
    // 危险进攻
    dangerous_attack: {
        animation_svg: '危险进攻',
        animation_svg_path: getSvgPath(1),
        animation_svg_tmp: 1,
    },
    // 安全球位置-safe_ball
    ball_safe: {
        animation_svg: '安全球位置',
        animation_svg_path: getSvgPath(2),
        animation_svg_tmp: 0,
    },
    // 05' - 进球-goal
    goal: {
        animation_svg: '进球',
        animation_svg_path: getSvgPath(3),
        animation_svg_tmp: 1,
    },
    // 进球确认
    goal_confirm: {
        animation_svg: '进球确认',
        animation_svg_path: getSvgPath(4),
        animation_svg_tmp: 0,
    }
   
}