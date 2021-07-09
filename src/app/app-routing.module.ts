import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { AddIngredientComponent } from './ingredient/add-ingredient/add-ingredient.component';
import { AddRecipeComponent } from './recipe/add-recipe/add-recipe.component';
import { DetailsRecipeComponent } from './recipe/details-recipe/details-recipe.component';
import { EditRecipeComponent } from './recipe/edit-recipe/edit-recipe.component';
import { SearchRecipeComponent } from './recipe/search-recipe/search-recipe.component';
import { RecoverComponent } from './recover/recover.component';
import { JudgeSuggestionComponent } from './suggestion/judge-suggestion/judge-suggestion.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { ProfileUserComponent } from './user/profile-user/profile-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },  
  { path: 'ingredient/add', component: AddIngredientComponent, canActivate: [AuthGuard] },
  { path: 'recipe/add', component: AddRecipeComponent, canActivate: [AuthGuard] },
  { path: 'suggestion/judgesuggestion', component: JudgeSuggestionComponent, canActivate: [AuthGuard] },
  { path: 'recipe/search', component: SearchRecipeComponent, canActivate: [AuthGuard] },
  { path: 'recipe/details/:id', component: DetailsRecipeComponent, canActivate: [AuthGuard] },
  { path: 'recipe/edit/:id', component: EditRecipeComponent, canActivate: [AuthGuard] },
  { path: 'user/profile/:id', component: ProfileUserComponent, canActivate: [AuthGuard] },
  { path: 'user/list', component: ListUserComponent, canActivate: [AuthGuard] },
  { path: 'recover', component: RecoverComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
