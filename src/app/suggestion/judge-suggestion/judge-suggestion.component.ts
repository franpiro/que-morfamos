import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Ingredient } from 'src/app/shared/interfaces/ingredient';
import { Recipe } from 'src/app/shared/interfaces/recipe';
import { IngredientService } from 'src/app/shared/services/ingredient/ingredient.service';
import { MeasurementUnitService } from 'src/app/shared/services/measurementUnit/measurement-unit.service';
import { RecipeService } from 'src/app/shared/services/recipe/recipe.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-judge-suggestion',
  templateUrl: './judge-suggestion.component.html',
  styleUrls: ['./judge-suggestion.component.css']
})
export class JudgeSuggestionComponent implements OnInit {

  public recipesToApprove: Recipe[];
  public ingredientsToApprove: Ingredient[];
  public showSpinner = false;
  public displayedColumnsRecipe: string[] = ["name", "accion"];
  public displayedColumnsIngredient: string[] = ["name", "measurementUnit", "accion"];
  public dataSourceRecipes: MatTableDataSource<Recipe>;
  public dataSourceIngredients: MatTableDataSource<Ingredient>;
  @ViewChild(MatPaginator, { static: true }) paginatorRecipe: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginatorIngredient: MatPaginator;

  constructor(private recipeService: RecipeService, private ingredientService: IngredientService, public userService: UserService, private snackBar: MatSnackBar,
    private measurementUnitService: MeasurementUnitService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.recipeService.getAllNotApprovedRecipes().subscribe((res) =>{
      this.recipesToApprove = res;
      this.dataSourceRecipes = new MatTableDataSource(res);
      this.dataSourceRecipes.paginator = this.paginatorRecipe;
    });
    this.measurementUnitService.getAllMeasurementUnits().subscribe(measurementUnitRes => {
      this.ingredientService.getAllNotApprovedIngredients().subscribe((res) =>{
        res.forEach(x => x.measurementUnitName = measurementUnitRes.find(y => y.id == x.measurementUnitId).name);
        this.ingredientsToApprove = res;
        this.dataSourceIngredients = new MatTableDataSource(res);
        this.dataSourceIngredients.paginator = this.paginatorIngredient;
      })
    })    
  }

  approveRecipe(recipeId: string): void {
    if (this.userService.currentUser.roleName == 'approver' || this.userService.currentUser.roleName == 'admin') {
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
  }

  deleteRecipe(recipeId) {
    if (this.userService.currentUser.roleName == 'approver' || this.userService.currentUser.roleName == 'admin') {
      this.showSpinner = true;
      this.recipeService.deleteRecipe(recipeId).then(() => {
        this.showSpinner = false;
        this.snackBar.open("Receta eliminada satisfactoriamente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
      }).catch(() => {
        this.showSpinner = false;
        this.snackBar.open("No se pudo eliminar la receta.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      });
    }
  }

  approveIngredient(ingredientId: string): void {
    if (this.userService.currentUser.roleName == 'approver' || this.userService.currentUser.roleName == 'admin') {
      this.showSpinner = true;
      this.ingredientService.approveIngredient(ingredientId).then(() => {
        this.showSpinner = false;
        this.snackBar.open("Ingrediente aprobado satisfactoriamente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        })
      }).catch(() => {
        this.showSpinner = false;
        this.snackBar.open("No se pudo aprobar el ingrediente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        })
      });
    }
  }

  deleteIngredient(ingredientId) {
    if (this.userService.currentUser.roleName == 'approver' || this.userService.currentUser.roleName == 'admin') {
      this.showSpinner = true;
      this.ingredientService.deleteIngredient(ingredientId).then(() => {
        this.showSpinner = false;
        this.snackBar.open("Ingrediente eliminado satisfactoriamente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
      }).catch(() => {
        this.showSpinner = false;
        this.snackBar.open("No se pudo eliminar el ingrediente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      });
    }
  }
}
