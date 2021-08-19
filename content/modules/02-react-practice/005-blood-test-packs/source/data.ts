export interface BloodTest {
  id: number;
  name: string;
  price: number;
}

export interface BloodPack {
  id: number;
  name: string;
  tests: number[];
  price: number;
}

export const bloodTests: BloodTest[] = [
  { id: 1, name: 'Complete blood count', price: 5 },
  { id: 2, name: 'ESR', price: 5 },
  { id: 3, name: 'Glucose', price: 8 },
  { id: 4, name: 'Creatinine', price: 8 },
  { id: 5, name: 'Urea', price: 8 },
  { id: 6, name: 'CRP', price: 15 },
  { id: 7, name: 'Total cholesterol', price: 10 },
  { id: 8, name: 'HDL', price: 10 },
  { id: 9, name: 'LDL', price: 10 },
  { id: 10, name: 'Electrolytes (Na, K)', price: 15 },
  { id: 11, name: 'Iron', price: 8 },
  { id: 12, name: 'Magnesium', price: 8 },
  { id: 13, name: 'Calcium', price: 8 },
  { id: 14, name: 'TSH', price: 15 },
  { id: 15, name: 'FT3', price: 15 },
  { id: 16, name: 'FT4', price: 15 },
  { id: 17, name: 'ALT', price: 5 },
  { id: 18, name: 'AST', price: 5 },
  { id: 19, name: 'ALP', price: 5 },
  { id: 20, name: 'Testosterone', price: 20 },
  { id: 21, name: 'FSH', price: 20 },
  { id: 22, name: 'LH', price: 20 },
  { id: 23, name: 'Estradiol', price: 20 },
  { id: 24, name: 'Prolactin', price: 20 },
  { id: 25, name: 'PSA', price: 30 },
];

export const bloodPacks: BloodPack[] = [
  {
    id: 1,
    name: 'Active minimum',
    tests: [1, 2, 3, 4, 6, 7, 14, 17],
    price: 45,
  },
  {
    id: 2,
    name: 'Active maximum',
    tests: [1, 2, 3, 4, 6, 7, 8, 9, 12, 14, 17, 18, 19],
    price: 75,
  },
  {
    id: 3,
    name: 'Thyroid',
    tests: [14, 15, 16],
    price: 25,
  },
  {
    id: 4,
    name: 'For woman',
    tests: [1, 2, 3, 7, 8, 9, 10, 14, 23],
    price: 60,
  },
  {
    id: 5,
    name: 'For man',
    tests: [1, 2, 3, 7, 8, 9, 10, 20, 25],
    price: 70,
  },
  {
    id: 6,
    name: 'Woman hormones',
    tests: [14, 21, 22, 23, 24],
    price: 65,
  },
];
