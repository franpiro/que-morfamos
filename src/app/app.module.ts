import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddIngredientComponent } from './ingredient/add-ingredient/add-ingredient.component';
import { AddRecipeComponent } from './recipe/add-recipe/add-recipe.component';
import { DetailsRecipeComponent } from './recipe/details-recipe/details-recipe.component';
import { SearchRecipeComponent } from './recipe/search-recipe/search-recipe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { JudgeSuggestionComponent } from './suggestion/judge-suggestion/judge-suggestion.component';
import { EditRecipeComponent } from './recipe/edit-recipe/edit-recipe.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { ProfileUserComponent } from './user/profile-user/profile-user.component';
import { RecoverComponent } from './recover/recover.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavMenuComponent,
    AddIngredientComponent,
    AddRecipeComponent,
    DetailsRecipeComponent,
    SearchRecipeComponent,
    SpinnerComponent,
    JudgeSuggestionComponent,
    EditRecipeComponent,
    ListUserComponent,
    ProfileUserComponent,
    RecoverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    OverlayModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
