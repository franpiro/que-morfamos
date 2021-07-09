import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/shared/interfaces/user';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  public displayedColumns: string[] = ["name", "email", "roleName", "status", "accion"];
  public searchTermWord: string = "";
  public userList: User[];
  public dataSource: MatTableDataSource<User>;
  public showSpinner: boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  constructor(public userService: UserService, public roleService: RoleService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.roleService.getAllRoles().subscribe(role => {
      this.userService.getAllUsers().subscribe(res => {
        res.forEach(x => x.roleName = role.filter(y => y.id == x.roleId)[0].name)
        this.userList = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }); 
    })    
  }

  searchTerm(event: string) {
    this.dataSource.data = this.userList.filter(x => x.name.toLowerCase().includes(event.toLowerCase()) || x.email.toLowerCase().includes(event.toLowerCase()) || x.roleName.toLowerCase().includes(event.toLowerCase()));
  }

  banUser(documentId) {
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

  unbanUser(documentId) {
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
