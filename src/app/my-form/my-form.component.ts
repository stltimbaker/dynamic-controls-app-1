import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
  styleUrls: ['./my-form.component.css'], 
})
export class MyFormComponent implements OnInit {

  @Input() jsonFormData: any;

  public formData: any;

  public myForm: FormGroup = this.fb.group({});

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.http
    .get('/assets/my-form.json')
    .subscribe((data) => {
      this.formData = data;
      this.createForm(this.formData.controls);
    });
  }

  createForm(controls: any[]) {
    for (const control of controls) {

      //Validator Logic
      const validatorsToAdd = [];

      for(const [key, value] of Object.entries(control.validators))
        switch (key) {
          case 'required': 
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(5));
            break;
          default:
            break;
        }

      this.myForm.addControl(
        control.name, 
        this.fb.control(control.value, validatorsToAdd));
    }
  }

  onSubmit() {
    console.log('Form valid?: ', this.myForm.valid);
    console.log('Form Values: ', this.myForm.value);
  }
}
