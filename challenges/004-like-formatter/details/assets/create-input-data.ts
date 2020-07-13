const names = [
  'Tod',
  'Eamon',
  'Ross',
  'Abbott',
  'Meyer',
  'Jerrie',
  'Otes',
  'Merill',
  'Vera',
  'Nevsa',
];

export interface InputTestCase {
  id: number;
  isLikedByMe: boolean;
  likedFriends: string[];
  totalLikes: number;
}

let data: InputTestCase[] = [];

function shuffle<T>(array: T[]) {
  return array
    .map(name => [name, Math.random()] as const)
    .sort((a, b) => a[1] - b[1])
    .map(x => x[0]);
}

for (let isLikedByMe of [true, false]) {
  for (let likedFriendsCount of [0, 1, 3]) {
    for (let extraLikes of [0, 1, 3]) {
      const likedFriends = shuffle(names).slice(0, likedFriendsCount);
      const item: InputTestCase = {
        id: 0,
        isLikedByMe,
        likedFriends,
        totalLikes: (isLikedByMe ? 1 : 0) + likedFriends.length + extraLikes,
      };
      data.push(item);
    }
  }
}

data = shuffle(data);

data.forEach((item, i) => {
  item.id = i + 1;
});

console.log(JSON.stringify(data, null, 2));
