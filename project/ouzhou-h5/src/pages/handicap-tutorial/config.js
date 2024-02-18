const questionsData = [
   {
      questionsType: 0,
      homeTeam: i18n_t('app_h5.handicap_tutorial.real_madrid'),
      awayTeam: i18n_t('app_h5.handicap_tutorial.barcelona'),
      matchResult: "1-1",
      questions: i18n_t('app_h5.handicap_tutorial.which_win'),
      options: [
         {
            label: "A",
            option: i18n_t('app_h5.handicap_tutorial.big').replace('%s', '2.5'),
            isRight: "error",
            odds: "1.99",
            isWin: false
         },
         {
            label: "B",
            option: i18n_t('app_h5.handicap_tutorial.small').replace('%s', '2.5'),
            isRight: "success",
            odds: "1.98",
            isWin: true
         }
      ],
      note: i18n_t('app_h5.handicap_tutorial.questionsData.1.note_1'), 
      note1: i18n_t('app_h5.handicap_tutorial.questionsData.1.note_2')
   },
   {
      questionsType: 0,
      homeTeam: i18n_t('app_h5.handicap_tutorial.m_chesester_city'),
      awayTeam: i18n_t('app_h5.handicap_tutorial.m_chesester_untied'),
      matchResult: "1-1",
      questions: i18n_t('app_h5.handicap_tutorial.which_win_half'),
      options: [
         {
            label: "A",
            option: i18n_t('app_h5.handicap_tutorial.big').replace('%s', '2/2.5'),
            isRight: "error",
            odds: "1.99",
            isWin: false
         },
         {
            label: "B",
            option: i18n_t('app_h5.handicap_tutorial.small').replace('%s', '2/2.5'),
            isRight: "success",
            odds: "1.98",
            isWin: true
         }
      ],
      note: i18n_t('app_h5.handicap_tutorial.questionsData.2.note_1'), 
      note1: i18n_t('app_h5.handicap_tutorial.questionsData.2.note_2')
   }
]
const bigAndSmallBallData = [
    {
        ballNumber: '',
        title: i18n_t('app_h5.handicap_tutorial.big_small_ball'),
        homeTeamScore: '',
        awayTeamScore: "",
        condition: i18n_t('app_h5.handicap_tutorial.handicapData_condition'), 
        matchList: [
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '3', winIsWho: 'homeTeam', note: '', homeTeamText: i18n_t('app_h5.handicap_tutorial.big_bet').replace('%s', '2.5'), awayTeamText: i18n_t('app_h5.handicap_tutorial.big_bet').replace('%s', '2.5') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.win_half'), awayTeam: i18n_t('app_h5.handicap_tutorial.lose_half'), matchResult: '3', winIsWho: 'homeTeam', note: '', homeTeamText: i18n_t('app_h5.handicap_tutorial.big_bet').replace('%s', '2.5/3'), awayTeamText: i18n_t('app_h5.handicap_tutorial.big_bet').replace('%s', '2.5/3')},
            { homeTeam: i18n_t('app_h5.handicap_tutorial.lose_half'), awayTeam: i18n_t('app_h5.handicap_tutorial.win_half'), matchResult: '3', winIsWho: 'awayTeam', note: '', homeTeamText: i18n_t('app_h5.handicap_tutorial.big_bet').replace('%s', '3/3.5'), awayTeamText: i18n_t('app_h5.handicap_tutorial.big_bet').replace('%s', '3/3.5')},
            { homeTeam: i18n_t('app_h5.handicap_tutorial.return_principal_discount'), awayTeam: i18n_t('app_h5.handicap_tutorial.return_principal_discount'), matchResult: '3', winIsWho: '', note: '', homeTeamText: i18n_t('app_h5.handicap_tutorial.big_bet').replace('%s', '3'), awayTeamText: i18n_t('app_h5.handicap_tutorial.small_bet').replace('%s', '3')}
        ]
    },
]
const handicapData = [
    {
        ballNumber: '0',
        title: i18n_t('app_h5.handicap_tutorial.tie_handicap'),
        homeTeamScore: '0',
        awayTeamScore: "0",
        condition: i18n_t('app_h5.handicap_tutorial.handicapData_condition'),
        matchList: [
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '1 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_1'), },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.return_principal'), awayTeam: i18n_t('app_h5.handicap_tutorial.return_principal'), matchResult: '0 - 0', winIsWho: '', note: i18n_t('app_h5.handicap_tutorial.note_2'), },
        ]
    },
    {
        ballNumber: '0/0.5',
        title: i18n_t('app_h5.handicap_tutorial.tie_half_plate'),
        homeTeamScore: '-0/0.5',
        awayTeamScore: '+0/0.5',
        condition: i18n_t('app_h5.handicap_tutorial.home_team_handicap').replace('%s', '0/0.5'),
        matchList: [
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '1 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_3'), },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.lose_half'), awayTeam: i18n_t('app_h5.handicap_tutorial.win_half'), matchResult: '0 - 0', winIsWho: 'awayTeam', note: i18n_t('app_h5.handicap_tutorial.note_4'), },
        ]
    },
    {
        ballNumber: '0.5',
        title: i18n_t('app_h5.handicap_tutorial.ball_plate_1'),
        homeTeamScore: '-0.5',
        awayTeamScore: '+0.5',
        condition: i18n_t('app_h5.handicap_tutorial.home_team_handicap').replace('%s', '0.5'),
        matchList: [
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '1 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_3'), },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '0 - 0', winIsWho: 'awayTeam', note: i18n_t('app_h5.handicap_tutorial.note_5'), },
        ]
    },
    {
        ballNumber: '0.5/1',
        title: i18n_t('app_h5.handicap_tutorial.ball_plate_2'),
        homeTeamScore: '-0.5/1',
        awayTeamScore: '+0.5/1',
        condition: i18n_t('app_h5.handicap_tutorial.home_team_handicap').replace('%s', '0.5/1'),
        matchList: [
            { homeTeam: i18n_t('app_h5.handicap_tutorial.win_half'), awayTeam: i18n_t('app_h5.handicap_tutorial.lose_half'), matchResult: '1 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_6') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '2 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_7') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_win'), matchResult: '0 - 0', winIsWho: 'awayTeam', note: i18n_t('app_h5.handicap_tutorial.note_5') },
        ]
    },
    {
        ballNumber: '1',
        title: i18n_t('app_h5.handicap_tutorial.ball_plate_3'),
        homeTeamScore: '-1',
        awayTeamScore: '+1',
        condition: i18n_t('app_h5.handicap_tutorial.home_team_handicap').replace('%s', '1'),
        matchList: [
            { homeTeam: i18n_t('app_h5.handicap_tutorial.return_principal'), awayTeam: i18n_t('app_h5.handicap_tutorial.return_principal'), matchResult: '1 - 0', winIsWho: '', note: i18n_t('app_h5.handicap_tutorial.note_8')},
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '2 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_7') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_win'), matchResult: '0 - 0', winIsWho: 'awayTeam', note: i18n_t('app_h5.handicap_tutorial.note_5') },
        ]
    },
    {
        ballNumber: i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1/1.5'),
        title: i18n_t('app_h5.handicap_tutorial.ball_plate_4'),
        homeTeamScore: '-1/1.5',
        awayTeamScore: '+1/1.5',
        condition: i18n_t('app_h5.handicap_tutorial.home_team_handicap').replace('%s', '1/1.5'),
        matchList: [
            { homeTeam: i18n_t('app_h5.handicap_tutorial.lose_half'), awayTeam: i18n_t('app_h5.handicap_tutorial.win_half'), matchResult: '1 - 0', winIsWho: 'awayTeam ', note: i18n_t('app_h5.handicap_tutorial.note_9') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '2 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_7') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_win'), matchResult: '0 - 0', winIsWho: 'awayTeam', note: i18n_t('app_h5.handicap_tutorial.note_5') },
        ]
    },
    {
        ballNumber: i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1.5'),
        title: i18n_t('app_h5.handicap_tutorial.ball_plate_5'),
        homeTeamScore: '-1.5',
        awayTeamScore: '+1.5',
        condition: i18n_t('app_h5.handicap_tutorial.home_team_handicap').replace('%s', '1.5'),
        matchList: [
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_win'), matchResult: '1 - 0', winIsWho: 'awayTeam ', note: i18n_t('app_h5.handicap_tutorial.note_10') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '2 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_7') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_win'), matchResult: '0 - 0', winIsWho: 'awayTeam', note: i18n_t('app_h5.handicap_tutorial.note_5') },
        ]
    },
    {
        ballNumber: i18n_t('app_h5.handicap_tutorial.ball').replace('%s', '1.5/2'),
        title: i18n_t('app_h5.handicap_tutorial.ball_plate_6'),
        homeTeamScore: '-1.5/2',
        awayTeamScore: '+1.5/2',
        condition: i18n_t('app_h5.handicap_tutorial.home_team_handicap').replace('%s', '1.5/2'),
        matchList: [
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_win'), matchResult: '1 - 0', winIsWho: 'awayTeam', note: i18n_t('app_h5.handicap_tutorial.note_11') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.win_half'), awayTeam: i18n_t('app_h5.handicap_tutorial.lose_half'), matchResult: '2 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_12') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_win'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), matchResult: '3 - 0', winIsWho: 'homeTeam', note: i18n_t('app_h5.handicap_tutorial.note_13') },
            { homeTeam: i18n_t('app_h5.handicap_tutorial.all_lose'), awayTeam: i18n_t('app_h5.handicap_tutorial.all_win'), matchResult: '0 - 0', winIsWho: 'awayTeam', note: i18n_t('app_h5.handicap_tutorial.note_5') },
        ]
    },
]
 export { questionsData, bigAndSmallBallData, handicapData }
