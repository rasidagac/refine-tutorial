export interface Meal {
  id: number;
  name: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  groups?: Group[];
  options: Option[];
  quantity: number;
  quantity_type: QuantityType;
}

export type Group = "vegan" | "vegetarian";

export interface Option {
  name: string;
  quality: Quality;
  price: number;
  per_amount: PerAmount;
}

export type PerAmount = "kilogram" | "litre";

export type Quality = "high" | "medium" | "low";

export type QuantityType = "gram" | "millilitre";
