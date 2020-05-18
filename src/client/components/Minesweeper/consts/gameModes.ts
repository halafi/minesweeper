const GAME_MODES = [
  {
    name: 'Easy',
    mines: 12,
    width: 10,
    height: 12,
    // 10
    minesDesktop: 10,
    widthDesktop: 10,
    heightDesktop: 10,
    //  10
  },
  {
    name: 'Normal',
    mines: 33,
    width: 12,
    height: 18,
    // 6.55
    minesDesktop: 30,
    widthDesktop: 14,
    heightDesktop: 14,
    // 6.53
  },
  {
    name: 'Hard',
    mines: 55,
    width: 14,
    height: 20,
    // 5.09
    minesDesktop: 50,
    widthDesktop: 16, // 14 x 25
    heightDesktop: 16,
    // 5.12
  },
  {
    name: 'Very Hard',
    mines: 80,
    width: 16,
    height: 23,
    // 4.60
    minesDesktop: 70,
    widthDesktop: 18,
    heightDesktop: 18,
    // 4.63
  },
  {
    name: 'Nightmare',
    mines: 103,
    width: 16,
    height: 26,
    // 4.04
    minesDesktop: 99,
    widthDesktop: 20,
    heightDesktop: 20,
    // 4.04
  },
  {
    name: 'Torment',
    mines: 124,
    width: 16,
    height: 30,
    // 3.87
    minesDesktop: 125,
    widthDesktop: 22,
    heightDesktop: 22,
    // 3.87
  },
];

export default GAME_MODES;
