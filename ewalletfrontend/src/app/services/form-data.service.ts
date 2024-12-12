import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formData: any = {};

  setFormData(key: string, value: any) {
    this.formData[key] = value;
  }

  getFormData(key: string) {
    return this.formData[key];
  }

  clearFormData() {
    this.formData = {};
  }
}

