import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { formCore as form } from '@form/js';

@Component({
    selector: 'form',
    template: '<div #form></div>'
})
export class formComponent implements AfterViewInit {
    @Input() src?: string;
    @Input() form?: Object | null;
    @Input() submission?: Object | null;
    @Input() options?: Object = {};
    @Output() ready = new EventEmitter<form>();
    @Output() submit = new EventEmitter<object>();
    @Output() error = new EventEmitter<any>();
    @ViewChild('form') element: ElementRef;
    ngAfterViewInit(): void {
        form.createForm(this.element.nativeElement, this.src || this.form, this.options).then((form) => {
            if (this.submission) {
                form.submission = this.submission;
            }
            this.ready.emit(form);
            form.on('submit', (submission) => this.submit.emit(submission));
            form.on('error', (err) => this.error.emit(err));
        }).catch((err) => this.error.emit(err));
    }
}