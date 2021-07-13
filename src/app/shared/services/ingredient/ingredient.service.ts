import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Ingredient } from '../../interfaces/ingredient';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  constructor(private firestore: AngularFirestore) { }

  getAllIngredients(): Observable<Ingredient[]> {
    return this.firestore.collection<Ingredient>('ingredients').valueChanges({ idField: "id" });
  }

  getAllApprovedIngredients(): Observable<Ingredient[]> {
    return this.firestore.collection<Ingredient>('ingredients', ref => ref.where("isApproved", "==", true).where("isDeleted", "==", false)).valueChanges({ idField: "id" });
  }

  getAllNotApprovedIngredients(): Observable<Ingredient[]> {
    return this.firestore.collection<Ingredient>("ingredients", ref => ref.where("isApproved", "==", false).where("isDeleted", "==", false)).valueChanges({ idField: "id" });
  }

  getAllDeletedIngredients(): Observable<Ingredient[]> {
    return this.firestore.collection<Ingredient>("ingredients", ref => ref.where("isDeleted", "==", true)).valueChanges({ idField: "id" });
  }

  postIngredient(ingredient: Ingredient): Promise<DocumentReference<Ingredient>> {
    return this.firestore.collection<Ingredient>("ingredients").add(ingredient);
  }

  approveIngredient(ingredientId: string): Promise<void> {
    return this.firestore.collection<Ingredient>("ingredients").doc(ingredientId).update({ isApproved: true});
  }

  deleteIngredient(ingredientId: string): Promise<void> {
    return this.firestore.collection<Ingredient>("ingredients").doc(ingredientId).update({ isDeleted: true});
  }

  recoverIngredient(ingredientId: string): Promise<void> {
    return this.firestore.collection<Ingredient>("ingredients").doc(ingredientId).update({ isDeleted: false});
  }
}
