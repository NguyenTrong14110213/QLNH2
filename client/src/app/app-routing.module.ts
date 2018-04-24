import {RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { FoodsComponent } from './components/foods/foods.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { MenuManagementComponent } from './components/menu-management/menu-management.component';

const appRoutes:Routes=[
    { path:'', component: HomeComponent },
    { path:'foods', component:FoodsComponent, canActivate:[AuthGuard]},
    { path:'register', component: RegisterComponent, canActivate:[NotAuthGuard]},
    { path:'login', component:LoginComponent, canActivate:[NotAuthGuard]},
    { path:'profile', component:ProfileComponent, canActivate:[AuthGuard]},
    { path:'menu_management', component:MenuManagementComponent},
    { path:'**', component:HomeComponent}
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  