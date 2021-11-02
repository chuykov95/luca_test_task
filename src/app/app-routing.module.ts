import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EditPageComponent} from "./edit-page/edit-page.component";
import {MainPageComponent} from "./main-page/main-page.component";

const routes: Routes = [
    {path: '', component: MainPageComponent},
    {path: 'editor/:id', component: EditPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
