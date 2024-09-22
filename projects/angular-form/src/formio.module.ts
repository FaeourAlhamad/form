import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formComponent } from './components/form/form.component';
import { formReportComponent } from './components/formreport/formreport.component';
import { FormBuilderComponent } from './components/formbuilder/formbuilder.component';
import { formAlerts } from './components/alerts/form.alerts';
import { ParseHtmlContentPipe } from './components/alerts/parse-html-content.pipe';
import { formAlertsComponent } from './components/alerts/form.alerts.component';
import { formLoaderComponent } from './components/loader/form.loader.component';
import { CustomTagsService } from './custom-tags.service';
import { formBaseComponent } from './formBaseComponent';

@NgModule({
    declarations: [
        formComponent,
        formReportComponent,
        formBaseComponent,
        FormBuilderComponent,
        formLoaderComponent,
        formAlertsComponent,
        ParseHtmlContentPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        formComponent,
        formReportComponent,
        FormBuilderComponent,
        formLoaderComponent,
        formAlertsComponent
    ],
    providers: [
        formAlerts,
        CustomTagsService
    ]
})
export class formModule {}
