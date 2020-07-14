interface InputTestCase {
  id: number;
  isLikedByMe: boolean;
  likedFriends: string[];
  totalLikes: number;
}

export const inputData: InputTestCase[] = [
  {
    id: 1,
    isLikedByMe: false,
    likedFriends: ['Merill', 'Meyer', 'Abbott'],
    totalLikes: 4,
  },
  {
    id: 2,
    isLikedByMe: false,
    likedFriends: ['Ross', 'Jerrie', 'Eamon'],
    totalLikes: 6,
  },
  {
    id: 3,
    isLikedByMe: false,
    likedFriends: ['Eamon', 'Ross', 'Jerrie'],
    totalLikes: 3,
  },
  {
    id: 4,
    isLikedByMe: true,
    likedFriends: ['Meyer'],
    totalLikes: 5,
  },
  {
    id: 5,
    isLikedByMe: true,
    likedFriends: ['Merill', 'Meyer', 'Otes'],
    totalLikes: 7,
  },
  {
    id: 6,
    isLikedByMe: true,
    likedFriends: [],
    totalLikes: 4,
  },
  {
    id: 7,
    isLikedByMe: false,
    likedFriends: ['Eamon'],
    totalLikes: 2,
  },
  {
    id: 8,
    isLikedByMe: false,
    likedFriends: [],
    totalLikes: 1,
  },
  {
    id: 9,
    isLikedByMe: true,
    likedFriends: ['Eamon'],
    totalLikes: 3,
  },
  {
    id: 10,
    isLikedByMe: false,
    likedFriends: [],
    totalLikes: 3,
  },
  {
    id: 11,
    isLikedByMe: true,
    likedFriends: ['Meyer', 'Otes', 'Vera'],
    totalLikes: 5,
  },
  {
    id: 12,
    isLikedByMe: false,
    likedFriends: [],
    totalLikes: 0,
  },
  {
    id: 13,
    isLikedByMe: true,
    likedFriends: ['Abbott'],
    totalLikes: 2,
  },
  {
    id: 14,
    isLikedByMe: true,
    likedFriends: ['Nevsa', 'Tod', 'Abbott'],
    totalLikes: 4,
  },
  {
    id: 15,
    isLikedByMe: false,
    likedFriends: ['Meyer'],
    totalLikes: 1,
  },
  {
    id: 16,
    isLikedByMe: false,
    likedFriends: ['Vera'],
    totalLikes: 4,
  },
  {
    id: 17,
    isLikedByMe: true,
    likedFriends: [],
    totalLikes: 2,
  },
  {
    id: 18,
    isLikedByMe: true,
    likedFriends: [],
    totalLikes: 1,
  },
];
