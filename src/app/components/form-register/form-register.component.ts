import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Moment } from '../../Moments';
import { FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.css'
})
export class FormRegisterComponent {
  @Output() OnSubmit = new EventEmitter<Moment>()
  @Input() btnText!: string;
  @Input() momentData!: Moment;
  @Output() componenteRenderizado = new EventEmitter<string>();

  momentForm!: FormGroup;

  constructor() {
    // Emitir o nome do componente renderizado assim que ele for inicializado
    this.componenteRenderizado.emit('form-register');
  }

  ngOnInit(): void {
    // this.momentForm = new FormGroup({
    //   id: new FormControl(this.momentData ? this.momentData.id : ''),
    //   title: new FormControl(this.momentData ? this.momentData.title : '', [Validators.required]),
    //   description: new FormControl(this.momentData ? this.momentData.description : '', [Validators.required]),
    //   image: new FormControl(''),
    // });
  }

  get title() {
    return this.momentForm.get('title')!;
  }

  get description() {
    return this.momentForm.get('description')!;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.momentForm.patchValue({ image: file })
  }
  submit() {
    if (this.momentForm.invalid) {
      console.log('deu ruim');
      return;
    }

    this.OnSubmit.emit(this.momentForm.value)

  }
}
