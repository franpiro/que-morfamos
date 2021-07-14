import { Component, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { Ingredient } from 'src/app/shared/interfaces/ingredient';
import { IngredientService } from 'src/app/shared/services/ingredient/ingredient.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { RecipeService } from 'src/app/shared/services/recipe/recipe.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestorageService } from 'src/app/shared/services/firestorage/firestorage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MeasurementUnitService } from 'src/app/shared/services/measurementUnit/measurement-unit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent implements OnInit {
  public recipeForm: FormGroup;
  ingredients: FormArray;
  steps: FormArray;
  public ingredientList: Ingredient[];
  public showSpinner = false;
  public formData = new FormData();
  public imagePercentage = 0;
  public imageUrl = null;

  constructor(private formBuilder: FormBuilder, public userService: UserService, private ingredientService: IngredientService, 
    private recipeService: RecipeService, private snackBar: MatSnackBar, private firestorageService: FirestorageService,
    private domSanitizer: DomSanitizer, private measurementUnitService: MeasurementUnitService, private router: Router) { }

  get name() { return this.recipeForm.get('name'); }
  get description() { return this.recipeForm.get('description'); }
  get ingredient() { return this.recipeForm.get('ingredient'); }
  get quantity() { return this.recipeForm.get('quantity'); }

  formatResult = (result: Ingredient) => result.name + " | " + result.measurementUnitName;

  ngOnInit(): void {
    this.recipeForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),      
      ingredients: this.formBuilder.array([this.createIngredientFormGroup()]),
      steps: this.formBuilder.array([this.createStepFormGroup()]),
      image: new FormControl(null, Validators.required)
    });
    this.measurementUnitService.getAllMeasurementUnits().subscribe(measurementUnitList => {
      this.ingredientService.getAllApprovedIngredients().subscribe(res => {
        res.forEach(ingredient => {
          ingredient.measurementUnitName = measurementUnitList.find(x => x.id == ingredient.measurementUnitId).name
        });
        this.ingredientList = res        
      });
    })
    
  }

  createIngredientFormGroup(): FormGroup {
    return this.formBuilder.group({
      ingredient: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)])
    }, { updateOn: 'blur' });
  }

  createStepFormGroup(): FormGroup {
    return this.formBuilder.group({
      step: new FormControl(null, [Validators.required]),      
    }, { updateOn: 'blur' });
  }

  deleteIngredientRow(deleteRowNum: number) {
    this.ingredients = this.recipeForm.get('ingredients') as FormArray;
    this.ingredients.removeAt(deleteRowNum);
  }

  deleteStepRow(deleteRowNum: number) {
    this.steps = this.recipeForm.get('steps') as FormArray;
    this.steps.removeAt(deleteRowNum);
  }

  addIngredient(): void {
    this.ingredients = this.recipeForm.get('ingredients') as FormArray;
    this.ingredients.push(this.createIngredientFormGroup());
  }

  addStep(): void {
    this.steps = this.recipeForm.get('steps') as FormArray;
    this.steps.push(this.createStepFormGroup());
  }

  searchIngredient: OperatorFunction<string, Ingredient[]> = (text$: Observable<string>) => 
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.ingredientList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).map(x => <Ingredient>{ id: x.id, name: x.name, measurementUnitName: x.measurementUnitName} ).slice(0, 10))
    )

  changeImage(event): void {  
    if(event.target.files[0]) {
      this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
      this.formData.delete('image');
      this.formData.append('image', event.target.files[0], event.target.files[0].name)
    } 
    else {
      this.imageUrl = "";
      this.formData.delete('image');
    } 
    
  }

  onSubmit() {
    var ingredientList = [];
    this.recipeForm.value.isApproved = false;
    this.recipeForm.value.isDeleted = false;
    this.recipeForm.value.createdById = this.userService.currentUser.id; 
    var badIngredient = false;
    this.recipeForm.value.ingredients.forEach(x =>  { 
      if (x.ingredient.id){
        ingredientList.push({ id: x.ingredient.id, quantity: Number(x.quantity) }) 
      }        
      else {
        this.snackBar.open(`Ingrediente ${x.ingredient} cargado incorrectamente.`, "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        })
        badIngredient = true;
      }
    });
    if (badIngredient) {
      return;
    }
    this.recipeForm.value.ingredients = ingredientList;
    let file = this.formData.get('image');
    this.showSpinner = true;
    this.recipeForm.value.imageName = Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
    try {
      this.firestorageService.uploadFile(this.recipeForm.value.imageName, file).percentageChanges().subscribe((p) => {
        this.imagePercentage = Math.round(p);
        if (this.imagePercentage == 100) {
          this.firestorageService.getFileReference(this.recipeForm.value.imageName).getDownloadURL().subscribe((url) => {
            this.recipeForm.value.imageUrl = url; 
            this.recipeForm.value.image = null;
            this.recipeService.postRecipe(this.recipeForm.value).then(res => {            
              this.showSpinner = false;
              this.snackBar.open("Receta creada satisfactoriamente.", "", {
                duration: 2000,
                panelClass: ['mat-toolbar', 'mat-primary']
              })
              this.router.navigateByUrl("/recipe/search");
            })
          })          
        }          
      });
    }
    catch { 
      this.showSpinner = false;
      this.snackBar.open("No se pudo cargar la receta.", "", {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-warn']
      })
    }    
  }
}
