import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/interfaces/ingredient';
import { Recipe } from 'src/app/shared/interfaces/recipe';
import { IngredientService } from 'src/app/shared/services/ingredient/ingredient.service';
import { MeasurementUnitService } from 'src/app/shared/services/measurementUnit/measurement-unit.service';
import { RecipeService } from 'src/app/shared/services/recipe/recipe.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-details-recipe',
  templateUrl: './details-recipe.component.html',
  styleUrls: ['./details-recipe.component.css']
})
export class DetailsRecipeComponent implements OnInit {
  public recipe: Recipe;
  public createdByName: string;
  public showSpinner = false;
  constructor(private recipeService: RecipeService, private ingredientService: IngredientService, private measurmentUnitService: MeasurementUnitService, private activatedRoute: ActivatedRoute, public userService: UserService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.ingredientService.getAllIngredients().subscribe(ingredientList => {
      this.measurmentUnitService.getAllMeasurementUnits().subscribe(measurementUnitList => {
        this.recipeService.getRecipeById(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res) => {    
          if (res.name != undefined) {
            this.recipe = res;
            this.recipe.ingredients.forEach(ingredient => {
              var ing = ingredientList.find(x => x.id == ingredient.id);
              var measuringUnit = measurementUnitList.find(x => x.id == ing.measurementUnitId);
              ingredient.name = ing.name;
              ingredient.measurementUnitName = measuringUnit.name;
            });
            this.userService.getUserById(this.recipe.createdById).subscribe(user => this.createdByName = user[0].name)
          }                    
        });
      })
      
    });    
  }

  deleteRecipe(): void {
    this.showSpinner = true;
    this.recipeService.deleteRecipe(this.recipe.id).then(() => {
      this.showSpinner = false;
      this.snackBar.open("Receta eliminada satisfactoriamente.", "", {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-primary']
      })
    }).catch(() => {
      this.showSpinner = false;
      this.snackBar.open("No se pudo eliminar la receta.", "", {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-warn']
      })
    });;
  }

  recoverRecipe(recipeId) {
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
    });;
  }

  approveRecipe(recipeId: string): void {
    this.showSpinner = true;
    this.recipeService.approveRecipe(recipeId).then(() => {
      this.showSpinner = false;
      this.snackBar.open("Receta aprobada satisfactoriamente.", "", {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-primary']
      })
    }).catch(() => {
      this.showSpinner = false;
      this.snackBar.open("No se pudo aprobar la receta.", "", {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-warn']
      })
    });
  }

  editRecipe() {

  }
}