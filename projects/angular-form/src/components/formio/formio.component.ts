import { Component, OnInit, Optional, ViewEncapsulation, Input, NgZone, OnChanges } from '@angular/core';
import { formAppConfig } from '../../form.config';
import { form, Form } from '@form/js';
import { formBaseComponent } from '../../formBaseComponent';
import { CustomTagsService } from '../../custom-tags.service';

/* tslint:disable */
@Component({
  selector: 'form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../../../node_modules/@form/js/dist/form.form.min.css'],
  encapsulation: ViewEncapsulation.None,
})
/* tslint:enable */
export class formComponent extends formBaseComponent implements OnInit, OnChanges {
  constructor(
    public ngZone: NgZone,
    @Optional() public config: formAppConfig,
    @Optional() public customTags?: CustomTagsService,
  ) {
    super(ngZone, config, customTags);
    if (this.config) {
      form.setBaseUrl(this.config.apiUrl);
      form.setProjectUrl(this.config.appUrl);
    } else {
      console.warn('You must provide an AppConfig within your application!');
    }
  }

  getRenderer() {
    return this.renderer || Form;
  }
}
