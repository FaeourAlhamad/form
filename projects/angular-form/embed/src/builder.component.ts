import { Component, ElementRef, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { formCore as form } from '@form/js';

@Component({
    selector: 'form-builder',
    template: '<div #form></div>'
})
export class formBuilder implements AfterViewInit {
    @ViewChild('form') element: ElementRef;
    @Input() form?: Object | null;
    @Input() options?: Object = {};
    @Output() ready = new EventEmitter<form>();
    @Output() error = new EventEmitter<any>();
    ngAfterViewInit(): void {
        form.builder(this.element.nativeElement, this.form, this.options).then((builder) => {
            this.ready.emit(builder);
        }).catch((err) => this.error.emit(err));
    }
}