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
    ProfileEmployeeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlashMessagesModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, CategoryFoodService, FoodService, RegionService, TableService],
  bootstrap: [AppComponent]
})
export class AppModule { }
