import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Course} from "../models/course.model";
import {Observable, Subscription} from "rxjs";
import {auditTime, filter, map, switchMap} from "rxjs/operators";
import {DataService} from "../services/data/data.service";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {stringify} from "@angular/compiler/src/util";
import {ContentsItemType} from "../models/contents-item-type.enum";
import {DurationUnit} from "../models/duration-unit.enum";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {

  form!: FormGroup
  course!: Course

  course$!: Observable<Course>

  uSub!: Subscription

  data!: Partial<Course>

  constructor(
    private route: ActivatedRoute,
    private readonly dataService:DataService
  ) {}

  ngOnInit() {
    this.course$ = this.route.params
      .pipe(switchMap((params: Params) => {
        return this.dataService.courses$.pipe(filter((c: Course[], idx: number) => {
          return c[idx]['id'] === params['id']
        }))
      }))
      .pipe(map((el) => {
        return el[0]
      }))

    this.uSub = this.course$.subscribe((course: Course) => {
      this.course = course
      this.form = new FormGroup({
        name: new FormControl(course.name, Validators.required),
        firstName: new FormControl(course.author.firstName, Validators.required),
        lastName: new FormControl(course.author.lastName, Validators.required),
        content: new FormArray([
        ]),
        plansName: new FormControl(course.plans[0].name, Validators.required),
        plansPrice: new FormControl(course.plans[0].price, Validators.required),
        duration: new FormControl(course.duration?.value, Validators.required),
        salesStart: new FormControl(course.sales?.start?.toISOString().slice(0, -1), Validators.required),
        salesEnd: new FormControl(course.sales?.end?.toISOString().slice(0, -1), Validators.required),
      })
    })

    this.form.valueChanges.pipe(auditTime(2000)).subscribe(formData => this.submit());

    for (let content of this.course.contents) {
      (<FormArray>this.form.controls['content']).push(new FormControl(content.name, Validators.required));
    }

  }

  getFormsControls(control: string) : FormArray{
    return this.form.controls[control] as FormArray;
  }

  submit() {
    this.data = {
      ...this.course,
      name: this.form.value.name,
      author: {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName
      },
      contents: [
        { name: "First lesson", type: ContentsItemType.lesson },
        { name: "Second lesson", type: ContentsItemType.lesson },
        { name: "first stream", type: ContentsItemType.stream },
      ],
      plans: [
        {
          name: "Free",
          price: 0,
          advantages: [
            {
              available: true,
              title: "First Advantage"
            },
            {
              available: false,
              title: "Second advantage"
            },
          ],
        },
      ],
      duration: { value: 1, unit: DurationUnit.day },
      sales: {
        start: new Date(2021, 9, 24, 12, 20),
        end: new Date(2021, 11, 25, 7, 35),
      },
    }

    this.dataService.updateCourse(this.course.id, this.data)

  }
}
