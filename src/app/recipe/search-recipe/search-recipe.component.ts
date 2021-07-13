import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Ingredient } from 'src/app/shared/interfaces/ingredient';
import { Recipe } from 'src/app/shared/interfaces/recipe';
import { IngredientService } from 'src/app/shared/services/ingredient/ingredient.service';
import { MeasurementUnitService } from 'src/app/shared/services/measurementUnit/measurement-unit.service';
import { RecipeService } from 'src/app/shared/services/recipe/recipe.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.css']
})
export class SearchRecipeComponent implements OnInit {
  public recipesSearched: Recipe[] = [];
  public ingredientForm: FormGroup;
  public ingredientList: Ingredient[];
  ingredients: FormArray;
  public dataSource: MatTableDataSource<Recipe>;
  public searchTermWord;
  displayedColumns: string[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public showSpinner = false;

  constructor(public userService: UserService, private formBuilder: FormBuilder, private recipeService: RecipeService, 
    private ingredientService: IngredientService, private snackBar: MatSnackBar, private measurementUnitService: MeasurementUnitService) { }

  ngOnInit(): void {
    this.createEmptyForm();
    this.measurementUnitService.getAllMeasurementUnits().subscribe(measurementUnitList => {
      this.ingredientService.getAllApprovedIngredients().subscribe(res => {
        this.ingredientList = res
        this.ingredientList.forEach(ingredient => ingredient.measurementUnitName = measurementUnitList.find(x => x.id == ingredient.measurementUnitId).name);
      });
    })
    this.displayedColumns = (this.userService.currentUser?.roleName == 'approver' || this.userService.currentUser?.roleName == 'admin') ? ["name", "delete"] : ["name"]
  }

  createEmptyForm(): void {
    this.ingredientForm = new FormGroup({
      ingredients: this.formBuilder.array([this.createIngredientFormGroup()])
    });
  }

  createIngredientFormGroup(): FormGroup {
    return this.formBuilder.group({
      ingredient: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)])
    }, { updateOn: 'blur' });
  }

  deleteRecipe(recipeId) {
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

  addIngredient(): void {
    this.ingredients = this.ingredientForm.get('ingredients') as FormArray;
    this.ingredients.push(this.createIngredientFormGroup());
  }

  searchIngredient: OperatorFunction<string, Ingredient[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.ingredientList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).map(x => <Ingredient>{ id: x.id, name: x.name, measurementUnitName: x.measurementUnitName} ).slice(0, 10))
    )
    
  formatResult = (result: Ingredient) => result.name + " | " + result.measurementUnitName;

  onSubmit(): void {
    var formatedIngredientList = [];
    
    this.ingredientForm.value.ingredients.forEach(x => formatedIngredientList.push({ id: x.ingredient.id, quantity: x.quantity, name: x.ingredient.name }));
    this.showSpinner = true;
    this.recipeService.getApproveRecipes().subscribe((res) => { 
      this.recipesSearched = [];  
      for (var recipe of res) {
        if (recipe.ingredients.every(v => {        
          if (formatedIngredientList.some(x => x.id == v.id)) {
            return Number(formatedIngredientList.find(x => x.id == v.id).quantity) >= Number(v.quantity);
          }
          return false;
        })) {
          this.recipesSearched.push(recipe);
        }
      }
      this.dataSource = new MatTableDataSource(this.recipesSearched);
      this.dataSource.paginator = this.paginator;
      this.showSpinner = false;
    });  
  }

  searchTerm(event: string) {
    this.dataSource.data = this.recipesSearched.filter(x => x.name.toLowerCase().includes(event.toLowerCase()));
  }

  DeleteIngredientRow(ingredientToDelete: FormGroup, deleteRowNum: number) {    
    this.ingredients = this.ingredientForm.get('ingredients') as FormArray;
    this.ingredients.removeAt(deleteRowNum);
  }
}