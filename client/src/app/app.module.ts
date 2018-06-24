import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FoodsComponent } from './components/foods/foods.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { MenuManagementComponent } from './components/menu-management/menu-management.component';
import { CategoryFoodService } from './services/category-food.service';
import { FoodService } from './services/food.service';
import { TableManagementComponent } from './components/table-management/table-management.component';
import { RegionService } from './services/region.service';
import { TableService } from './services/table.service';
import { EmployeeManagerComponent } from './components/employee-manager/employee-manager.component';
import { ProfileEmployeeComponent } from './components/profile-employee/profile-employee.component';
import { PayComponent } from './components/pay/pay.component';

import { CashierGuard } from './guards/cashier.guard';

import { OrderService } from './services/order.service';
import { EmployeeGuard } from './guards/employee.guard';
import { FoodGuard } from './guards/food.guard';
import { TableGuard } from './guards/table.guard';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FoodsComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    MenuManagementComponent,
    TableManagementComponent,
    EmployeeManagerComponent,
    ProfileEmployeeComponent,
    PayComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlashMessagesModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard,EmployeeGuard,CashierGuard,FoodGuard,TableGuard, CategoryFoodService, FoodService, RegionService, TableService,OrderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
