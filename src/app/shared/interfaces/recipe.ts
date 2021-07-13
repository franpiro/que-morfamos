import { IngredientQuantity } from "./ingredientQuantity";

export interface Recipe {
    id: string;
    name: string;
    description: string;
    isApproved: boolean;
    ingredients: IngredientQuantity[];
    steps: string[];
    isDeleted: boolean;
    imageName: string;
    imageUrl: string;
    createdById: string;    
}