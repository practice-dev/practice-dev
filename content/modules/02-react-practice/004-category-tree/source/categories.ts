export interface Category {
  id: number;
  name: string;
  children?: Category[];
}

export const categories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    children: [
      {
        id: 3,
        name: 'Accessories',
        children: [
          {
            id: 8,
            name: 'Audio Accessories',
          },
          {
            id: 9,
            name: 'Camera Accessories',
          },
          {
            id: 10,
            name: 'Cell Phone Accessories',
          },
        ],
      },
      {
        id: 4,
        name: 'Computers',
        children: [
          {
            id: 11,
            name: 'Personal Computers',
            children: [
              {
                id: 14,
                name: 'Mac',
              },
              {
                id: 15,
                name: 'Linux',
              },
              {
                id: 16,
                name: 'Windows',
              },
            ],
          },
          {
            id: 12,
            name: 'Tablets',
          },
          {
            id: 13,
            name: 'Monitors',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Fashion',
    children: [
      {
        id: 5,
        name: 'Clothing',
      },
      {
        id: 6,
        name: 'Shoes',
      },
      {
        id: 7,
        name: 'Jewelry',
      },
    ],
  },
];
