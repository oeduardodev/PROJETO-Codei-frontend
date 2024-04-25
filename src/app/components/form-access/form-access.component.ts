import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { Moment } from '../../Moments';
import { FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-access',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './form-access.component.html',
  styleUrl: './form-access.component.css'
})
export class FormAccessComponent {

  @Output() OnSubmit = new EventEmitter<Moment>()
  @Input() btnText!: string;
  @Input() btnTextSecundary!: string;
  @Input() momentData!: Moment;
  @Output() componenteRenderizado = new EventEmitter<string>();

  momentForm!: FormGroup;

  constructor() {
    // Emitir o nome do componente renderizado assim que ele for inicializado
    this.componenteRenderizado.emit('form-access');
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

  submit() {
    if (this.momentForm.invalid) {
      console.log('deu ruim');
      return;
    }

    this.OnSubmit.emit(this.momentForm.value)

  }
}
