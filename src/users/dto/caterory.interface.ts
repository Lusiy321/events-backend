/* eslint-disable prettier/prettier */
export interface Categories {
  _id: string;
  name: string;
  subcategories: [
    {
      id: string;
      name: string;
    },
  ];
}
