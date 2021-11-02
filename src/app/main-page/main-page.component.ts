import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data/data.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {



  constructor(
    private readonly dataService:DataService
  ) {}
  courses$ = this.dataService.courses$;

}
