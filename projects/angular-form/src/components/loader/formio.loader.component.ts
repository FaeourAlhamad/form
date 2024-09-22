import {Component, Input} from '@angular/core';

@Component({
  selector: 'form-loader',
  styleUrls: ['./form.loader.component.scss'],
  templateUrl: './form.loader.component.html'
})
export class formLoaderComponent {
  @Input() isLoading: boolean;
}
