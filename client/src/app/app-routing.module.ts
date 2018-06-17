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
import { TableManagementComponent } from './components/table-management/table-management.component';
import { EmployeeManagerComponent } from './components/employee-manager/employee-manager.component';
import { ProfileEmployeeComponent } from './components/profile-employee/profile-employee.component';
import { PayComponent } from './components/pay/pay.component';
import { AdminGuard } from './guards/admin.guard';
import { CashierGuard } from './guards/cashier.guard';
import { CookGuard } from './guards/cook.guard';
import { ManagerGuard } from './guards/manager.guard';

const appRoutes:Routes=[
    { path:'', component: HomeComponent },
    { path:'food/:id', component:FoodsComponent, canActivate:[AdminGuard||CookGuard]},
    { path:'register', component: RegisterComponent, canActivate:[NotAuthGuard]},
    { path:'login', component:LoginComponent, canActivate:[NotAuthGuard]},
    { path:'profile', component:ProfileComponent, canActivate:[AuthGuard]},
    { path:'menu_management', component:MenuManagementComponent, canActivate:[AdminGuard||CookGuard||ManagerGuard]},
    { path:'table_management', component:TableManagementComponent, canActivate:[AdminGuard || ManagerGuard]},
    { path:'emloyee_management', component:EmployeeManagerComponent, canActivate:[AdminGuard]},
    { path:'profile_emloyee/:username', component:ProfileEmployeeComponent, canActivate:[AdminGuard]},
    { path:'pay', component:PayComponent, canActivate:[AdminGuard||CashierGuard]},
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
  