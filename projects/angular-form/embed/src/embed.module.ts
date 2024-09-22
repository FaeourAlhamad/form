import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { formComponent } from "./form.component";
import { formBuilder } from "./builder.component";
import { formAppService } from "./app.service";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        formComponent,
        formBuilder
    ],
    exports: [
        formComponent,
        formBuilder
    ],
    providers: [
        formAppService
    ]
})
export class formEmbedModule {}