export interface Categories {
    _id: string;
    name: string;
    subcategories: Subcategory[];
}
export interface Subcategory {
    id: string;
    name: string;
}
