import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/shared/interfaces/recipe';
import { Role } from 'src/app/shared/interfaces/role';
import { User } from 'src/app/shared/interfaces/user';
import { RecipeService } from 'src/app/shared/services/recipe/recipe.service';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {
  public user: User;
  public recipeList: Recipe[];
  public dataSource: MatTableDataSource<Recipe>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public displayedColumns: string[];
  public showSpinner = false;
  public searchTermWord;
  public roles: Role[];

  constructor(public userService: UserService, public roleService: RoleService, private activatedRoute: ActivatedRoute, private recipeService: RecipeService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userService.getUserById(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(res => {
      this.roleService.getRoleById(res[0].roleId).subscribe(role => {        
        this.user = res[0];
        this.user.roleName = role.name;         
      });
    }); 

    this.roleService.getAllRoles().subscribe(roles => {      
      this.roles = roles;
    })    

    this.displayedColumns = (this.userService.currentUser?.roleName == 'approver' || this.userService?.currentUser?.roleName == 'admin') ? ["name", "status", "eliminar"] : ["name", "status"]
  }

  ngAfterViewInit(): void {
    this.recipeService.getRecipeByCreatorId(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(recipes => {
      this.recipeList = recipes;
      this.dataSource = new MatTableDataSource(recipes);
      this.dataSource.paginator = this.paginator;
    });  
  }

  updateRole(roleId, roleName) {
    if (this.userService.currentUser.roleName == 'admin') {
      this.showSpinner = true;
      this.userService.updateUserRole(this.user.documentId, roleId).then(() => {
        this.showSpinner = false;
        this.user.roleId = roleId;
        this.user.roleName = roleName;
        this.snackBar.open("Rol actualizado satisfactoriamente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        })
      }).catch(() => {
        this.showSpinner = false;
        this.snackBar.open("No se pudo actualizar el rol.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        })
      });
    }
  }

  searchTerm(event: string) {
    this.dataSource.data = this.recipeList.filter(x => x.name.toLowerCase().includes(event.toLowerCase()));
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

  banUser(documentId) {
    if (this.userService.currentUser.roleName == 'admin') {
      this.showSpinner = true;
      this.userService.banUser(documentId).then(() => {
        this.showSpinner = false;
        this.snackBar.open("Usuario deshabilitado satisfactoriamente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        })
      }).catch(() => {
        this.showSpinner = false;
        this.snackBar.open("No se pudo deshabilitar el usuario.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        })
      });
    }
  }

  unbanUser(documentId) {
    if (this.userService.currentUser.roleName == 'admin') {
      this.showSpinner = true;
      this.userService.unbanUser(documentId).then(() => {
        this.showSpinner = false;
        this.snackBar.open("Usuario activado satisfactoriamente.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        })
      }).catch(() => {
        this.showSpinner = false;
        this.snackBar.open("No se pudo activar el usuario.", "", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        })
      });
    }
  }
}
