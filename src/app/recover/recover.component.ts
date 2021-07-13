import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Ingredient } from '../shared/interfaces/ingredient';
import { Recipe } from '../shared/interfaces/recipe';
import { IngredientService } from '../shared/services/ingredient/ingredient.service';
import { RecipeService } from '../shared/services/recipe/recipe.service';
import { UserService } from '../shared/services/user/user.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {
  public recipesToRecover: Recipe[];
  public ingredientsToRecover: Ingredient[];
  public showSpinner = false;
  public displayedRecipeColumns: string[] = ["name", "recover"];
  public displayedIngredientColumns: string[] = ["name", "measurementUnit", "recover"]
  public dataSourceRecipes: MatTableDataSource<Recipe>;  
  public dataSourceIngredients: MatTableDataSource<Ingredient>;
  @ViewChild(MatPaginator, { static: true }) paginatorRecipe: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginatorIngredient: MatPaginator;
  
  constructor(public userService: UserService, private recipeService: RecipeService, private ingredientService: IngredientService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.recipeService.getAllDeletedRecipes().subscribe((res) =>{
      this.recipesToRecover = res;
      this.dataSourceRecipes = new MatTableDataSource(res);
      this.dataSourceRecipes.paginator = this.paginatorRecipe;
    })

    this.ingredientService.getAllDeletedIngredients().subscribe((res) =>{
      this.ingredientsToRecover = res;
      this.dataSourceIngredients = new MatTableDataSource(res);
      this.dataSourceIngredients.paginator = this.paginatorIngredient;
    })
  }

  recoverRecipe(recipeId: string): void {
    if (this.userService.currentUser.roleName == 'admin') {
      this.showSpinner = true;
      this.recipeService.recoverRecipe(recipeId).then(() => {
        this.showSpinner = false;
        this.snackBar.open("Receta recuperada satisfactoriamente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        })
      }).catch(() => {
        this.showSpinner = false;
        this.snackBar.open("No se pudo recuperar la receta.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        })
      });
    }
  }

  recoverIngredient(ingredientId: string): void {
    if (this.userService.currentUser.roleName == 'admin') {
      this.showSpinner = true;
      this.ingredientService.recoverIngredient(ingredientId).then(() => {
        this.showSpinner = false;
        this.snackBar.open("Ingrediente recuperado satisfactoriamente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        })
      }).catch(() => {
        this.showSpinner = false;
        this.snackBar.open("No se pudo recuperar el ingrediente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        })
      });
    }
  }
}
