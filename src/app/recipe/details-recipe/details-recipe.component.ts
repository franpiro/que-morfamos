import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/shared/interfaces/recipe';
import { RecipeService } from 'src/app/shared/services/recipe/recipe.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-details-recipe',
  templateUrl: './details-recipe.component.html',
  styleUrls: ['./details-recipe.component.css']
})
export class DetailsRecipeComponent implements OnInit {
  public recipe: Recipe;
  public showSpinner = false;
  constructor(private recipeService: RecipeService, private activatedRoute: ActivatedRoute, public userService: UserService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.recipeService.getRecipeById(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res) => {
      console.log(res);
      this.recipe = res;
    })
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