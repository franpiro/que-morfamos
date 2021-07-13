import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Ingredient } from 'src/app/shared/interfaces/ingredient';
import { FirestorageService } from 'src/app/shared/services/firestorage/firestorage.service';
import { IngredientService } from 'src/app/shared/services/ingredient/ingredient.service';
import { MeasurementUnitService } from 'src/app/shared/services/measurementUnit/measurement-unit.service';
import { RecipeService } from 'src/app/shared/services/recipe/recipe.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {

  public recipeForm: FormGroup;
  ingredients: FormArray;
  steps: FormArray;
  public ingredientList: Ingredient[];
  public showSpinner = false;
  public formData = new FormData();
  public imageUrl: SafeUrl = null;
  public imagePercentage = 0;
  public prexistentImageUrl: string;
  public prexistentImageName: string;
  private recipeId: string;
  public recipeCreatorId: string;

  constructor(private formBuilder: FormBuilder, public userService: UserService, private ingredientService: IngredientService, 
    private recipeService: RecipeService, private snackBar: MatSnackBar, private firestorageService: FirestorageService,
    private activatedRoute: ActivatedRoute,private domSanitizer: DomSanitizer, private measurementUnitService: MeasurementUnitService,
    private router: Router) { }

  get name() { return this.recipeForm.get('name'); }
  get description() { return this.recipeForm.get('description'); }
  get ingredient() { return this.recipeForm.get('ingredient'); }
  get quantity() { return this.recipeForm.get('quantity'); }

  formatResult = (result: Ingredient) => result.name + " | " + result.measurementUnitName;

  ngOnInit(): void {
    this.recipeForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),      
      ingredients: this.formBuilder.array([]),
      steps: this.formBuilder.array([]),
      image: new FormControl(null)
    });
    this.ingredientService.getAllIngredients().subscribe(ingredientList => {
      this.measurementUnitService.getAllMeasurementUnits().subscribe(measurementUnitList => {
        this.recipeService.getRecipeById(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((recipe) => { 
          this.recipeId = recipe.id;  
          this.recipeCreatorId = recipe.createdById;     
          this.prexistentImageName = recipe.imageName;
          this.recipeForm.get('name').setValue(recipe.name);
          this.recipeForm.get('description').setValue(recipe.description);
          recipe.ingredients.forEach(x => {
            var ingredient = ingredientList.find(y => y.id == x.id);
            ingredient.measurementUnitName = measurementUnitList.find(y => y.id == ingredient.measurementUnitId).name;
            (this.recipeForm.get('ingredients') as FormArray).push(this.createIngredientFormGroup({ingredient: { id: x.id, name: ingredient.name, measurementUnitName: ingredient.measurementUnitName }, quantity: Number(x.quantity) }))
          })
          recipe.steps.forEach(x => (this.recipeForm.get('steps') as FormArray).push(this.createStepFormGroup(x)));
          this.firestorageService.getFileReference(recipe.imageName).getDownloadURL().subscribe(x => this.prexistentImageUrl =  x);
        })
      })      
    })
    
    this.measurementUnitService.getAllMeasurementUnits().subscribe(measurementUnitList => {
      this.ingredientService.getAllApprovedIngredients().subscribe(res => {
        this.ingredientList = res;
        this.ingredientList.forEach(ingredient => ingredient.measurementUnitName = measurementUnitList.find(x => x.id = ingredient.measurementUnitId).name);
      });
    })
  }

  MapIngredient(ingredientList) {
    var mappedIngredientList: any[] = [];
    ingredientList.forEach(x => mappedIngredientList.push({ ingredient: { id: x.id, name: x.name }, quantity: Number(x.quantity) }))
    return mappedIngredientList;
  }

  createIngredientFormGroup(x): FormGroup {
    var formBuilder = this.formBuilder.group({
      ingredient: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)])
    }, { updateOn: 'blur' });
    if (x) {
      formBuilder.setValue(x);
    }
    return formBuilder;
  }

  createStepFormGroup(x): FormGroup {
    var formBuilder = this.formBuilder.group({
      step: new FormControl(null, [Validators.required]),      
    }, { updateOn: 'blur' });
    if (x) {
      formBuilder.setValue(x);
    }
    return formBuilder;
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
    this.ingredients.push(this.createIngredientFormGroup(null));
  }

  addStep(): void {
    this.steps = this.recipeForm.get('steps') as FormArray;
    this.steps.push(this.createStepFormGroup(null));
  }

  searchIngredient: OperatorFunction<string, Ingredient[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.ingredientList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).map(x => <Ingredient>{ id: x.id, name: x.name, measurementUnitName: x.measurementUnitName} ).slice(0, 10))
    )

  changeImage(event): void {
    this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
    this.formData.delete('image');
    this.formData.append('image', event.target.files[0], event.target.files[0].name)
  }

  onSubmit() {
    if(this.recipeCreatorId ==  this.userService.currentUser.id || this.userService.currentUser.roleName == 'approver' || this.userService.currentUser.roleName == 'admin') {
      this.recipeForm.value.id = this.recipeId;
      var ingredientList = [];
      this.recipeForm.value.isApproved = false;
      this.recipeForm.value.ingredients.forEach(x => ingredientList.push({ id: x.ingredient.id, quantity: Number(x.quantity), name: x.ingredient.name }));
      this.recipeForm.value.ingredients = ingredientList;
      let file = this.formData.get('image');
      this.showSpinner = true;
      this.recipeForm.value.imageName = Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
      if (file) {
        this.firestorageService.uploadFile(this.recipeForm.value.imageName, file).percentageChanges().subscribe((p) => {
          this.imagePercentage = Math.round(p);
          if (this.imagePercentage == 100) {
            this.firestorageService.getFileReference(this.recipeForm.value.imageName).getDownloadURL().subscribe((url) => {
              this.recipeForm.value.imageUrl = url; 
              this.recipeService.modifyRecipe(this.recipeForm.value).then(res => {            
                this.showSpinner = false;
                this.snackBar.open("Receta modificada satisfactoriamente.", "", {
                  duration: 2000,
                  panelClass: ['mat-toolbar', 'mat-primary']
                })
                this.router.navigateByUrl("/recipe/search");
              }).catch(() => {
                this.showSpinner = false;
                this.snackBar.open("No se pudo cargar la receta.", "", {
                  duration: 2000,
                  panelClass: ['mat-toolbar', 'mat-warn']
                })
              })
            })          
          }          
        });
      } else {
        this.recipeForm.value.image = this.prexistentImageUrl;
        this.recipeService.modifyRecipe(this.recipeForm.value).then(res => {            
          this.showSpinner = false;
          this.snackBar.open("Receta modificada satisfactoriamente.", "", {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
        }).catch(() => {
          this.showSpinner = false;
          this.snackBar.open("No se pudo cargar la receta.", "", {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        });          
      }    
    }
  }
}
