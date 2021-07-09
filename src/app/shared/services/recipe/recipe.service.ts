import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Ingredient } from '../../interfaces/ingredient';
import { Recipe } from '../../interfaces/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private firestore: AngularFirestore) { }

  getAllRecipes(): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>("recipes").valueChanges({ idField: "id"});
  }

  getAllNotApprovedRecipes(): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>("recipes", ref => ref.where("isApproved", "==", false).where("isDeleted", "==", false)).valueChanges({ idField: "id" });
  }

  getAllDeletedRecipes(): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>("recipes", ref => ref.where("isDeleted", "==", true)).valueChanges({ idField: "id" });
  }

  getRecipeById(recipeId): Observable<Recipe> {
    return this.firestore.collection<Recipe>("recipes").doc(recipeId).valueChanges({ idField: "id"});
  }

  getApproveRecipes(): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>("recipes", ref => ref.where("isApproved", "==", true).where("isDeleted", "==", false)).valueChanges({ idField: "id"});
  }

  getRecipesWithPagination(startAt: number, limit: number): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>("recipes", ref => ref.where("isApproved", "==", true).orderBy("name").startAt(startAt).limit(limit)).valueChanges({ idField: "id"});
  }

  getRecipeByCreatorId(creatorId): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>("recipes", ref => ref.where("createdById", "==", creatorId).where("isDeleted", "==", false)).valueChanges({ idField: "id"});
  }

  approveRecipe(recipeId: string): Promise<void> {
    return this.firestore.collection<Recipe>("recipes").doc(recipeId).update({ isApproved: true});
  }

  deleteRecipe(recipeId: string): Promise<void> {
    return this.firestore.collection<Recipe>("recipes").doc(recipeId).update({ isDeleted: true});
  }

  recoverRecipe(recipeId: string): Promise<void> {
    return this.firestore.collection<Recipe>("recipes").doc(recipeId).update({ isDeleted: false});
  }

  postRecipe(recipe: Recipe): Promise<DocumentReference<Recipe>> {
    return this.firestore.collection<Recipe>("recipes").add(recipe);
  }

  modifyRecipe(recipe: Recipe): Promise<void> {
    return this.firestore.collection<Recipe>("recipes").doc(recipe.id).update({ name: recipe.name, description: recipe.description, ingredients: recipe.ingredients, 
      steps: recipe.steps, isApproved: recipe.isApproved, imageName: recipe.imageName, imageUrl: recipe.imageUrl});
  }
}
