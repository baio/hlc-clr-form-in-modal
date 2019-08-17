import { Component, ChangeDetectionStrategy, Inject, ViewChild } from '@angular/core';
import { ClrFormLayouts, HlcClrFormComponent } from '@ng-holistic/clr-forms';
import { TextMask } from '@ng-holistic/clr-controls';
import { FormGroup, Validators } from '@angular/forms';
import { distinctPropChanged } from '@ng-holistic/forms';
import { format } from 'date-fns/esm/fp';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { HlcClrModalService, HLC_CONTAINER_DATA } from '@ng-holistic/clr-common';


export const definition = (form: FormGroup): ClrFormLayouts.ClrFormLayout => ({
    kind: 'fields',
    fields: [
        {
            id: 'select',
            kind: 'SelectField',
            props: {
                label: 'Select',
                items: [
                    { key: '0', label: 'disable text' },
                    { key: '1', label: 'set date control value to current date' },
                    { key: '2', label: 'make textarea required' },
                    { key: '3', label: 'hide text' }
                ]
            }
        },
        {
            id: 'text',
            kind: 'TextField',
            props: {
                label: 'Text',
                placeholder: 'Type something',
                readonly: form.valueChanges.pipe(map(({ select }) => select === '0'))
            },
            // it makes sence to remove validators for readOnly state
            validators: form.valueChanges.pipe(map(({ select }) => (select !== '0' ? [Validators.required] : []))),
            validatorsErrorsMap: { required: 'This field is required ' },
            hidden: form.valueChanges.pipe(map(({ select }) => select === '3'))
        },
        {
            id: 'date',
            kind: 'DateField',
            props: {
                label: 'Date'
            },
            value: form.valueChanges.pipe(
                distinctPropChanged('select'),
                map(({ select, date }) => {
                    // tslint:disable-next-line:quotemark
                    return select === '1' ? format("yyyy-MM-dd'T'HH:mm:ss", new Date()) : date;
                })
            )
        },
        {
            id: 'textarea',
            kind: 'TextAreaField',
            props: {
                label: 'Text Area',
                placeholder: 'Type something'
            },
            validators: form.valueChanges.pipe(map(({ select }) => (select === '2' ? [Validators.required] : [])))
        }
    ]
});

@Component({
    selector: 'hlc-form-modal',
    template: `
        <h5>{{ data.hint }}</h5>
        <hlc-clr-form [definition]="definition"></hlc-clr-form>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormInModalComponent {
    constructor(@Inject(HLC_CONTAINER_DATA) public data: any) {}

    definition = definition;

    @ViewChild(HlcClrFormComponent, { static: false }) clrForm: HlcClrFormComponent;

    get form$() {
        return this.clrForm.form.formCreated;
    }
}

@Component({
  selector: 'my-app',
  template: `<button autofocus class="btn" (click)="onShowModal()">Show Modal</button>`
})
export class AppComponent {
    constructor(private readonly modalService: HlcClrModalService) {}

    onShowModal() {
        this.modalService.showForm({
            title: 'Form in modal',
            data: { hint: 'Hint from caller' },
            componentFormField: 'form$',
            contentComponentType: FormInModalComponent,
            allowOkWhenFormPristine: false,
            dataAccess: {
                update(_) {
                    return timer(1000);
                }
            }
        });
    }
}
