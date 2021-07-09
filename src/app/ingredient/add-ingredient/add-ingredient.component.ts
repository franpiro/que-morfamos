import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IngredientService } from 'src/app/shared/services/ingredient/ingredient.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Ingredient } from 'src/app/shared/interfaces/ingredient'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.css']
})
export class AddIngredientComponent implements OnInit {

  public ingredientDetails: Ingredient;
  public ingredientsList: Ingredient[];
  public ingredientForm: FormGroup;
  public showSpinner = false;
  public dataSource: MatTableDataSource<Ingredient>;
  public searchTermWord: string;
  displayedColumns: string[] = ['name', 'delete'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  
  constructor(public userService: UserService, private ingredientService: IngredientService, private snackBar: MatSnackBar) {
    this.ingredientForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(30)])
    }, { updateOn: 'blur' });    
  }

  get name() { return this.ingredientForm.get('name'); }

  ngOnInit(): void {};

  ngAfterViewInit(): void {
    this.ingredientService.getAllApprovedIngredients().subscribe(res => {
      this.ingredientsList = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
    }); 
  }

  onSubmit(): void {
    this.showSpinner = true;
    this.ingredientForm.value.isDeleted = false;
    this.ingredientForm.value.isApproved = false;
    this.ingredientService.postIngredient(this.ingredientForm.value)
      .then(() =>  {
        this.showSpinner = false;
        this.snackBar.open("Ingrediente creado satisfactoriamente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        })        
      }).catch(() => {
        this.showSpinner = false;
        this.snackBar.open("No se pudo crear el ingrediente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
      });
    });
  }

  searchTerm(event: string): void {
    this.dataSource.data = this.ingredientsList.filter(x => x.name.toLowerCase().includes(event.toLowerCase()));
  }

  deleteIngredient(ingredientId: string): void {
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
