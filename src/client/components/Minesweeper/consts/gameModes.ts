const GAME_MODES = [
  {
    name: 'Easy',
    mines: 10,
    width: 10,
    height: 10,
  },
  {
    name: 'Normal',
    mines: 30,
    width: 14,
    height: 14,
  },
  {
    name: 'Hard',
    mines: 60,
    width: 16, // 14 x 25
    height: 16,
  },
  {
    name: 'Very Hard',
    mines: 80,
    width: 18,
    height: 18,
  },
  {
    name: 'Nightmare',
    mines: 120,
    width: 20,
    height: 20,
  },
];

export default GAME_MODES;
// 10 x 10 / 10 = 10
// 14 x 14 / 30 = 6,53
// 16 x 16 / 60 = 4,27
// 18 x 18 / 80 = 4,05
// 20 x 20 / 120 = 3,33
