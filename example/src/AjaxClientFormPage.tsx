import React, { FunctionComponent, useRef } from 'react'


import "eos-webui-controls/dist/main.css";
import { AjaxClientForm, FormMode } from "eos-webui-formgen";
import { Button } from '@eos/rc-controls';


const AjaxClientFormPage: FunctionComponent = () => {
    const E_DOCUMENT_LABEL = "Для электронных документов";
    const dataService: AjaxClientForm.IDataService = {
        async getContextAsync(mode: FormMode) {
            const dispContext = {
                "Fields": [{ "disabled": true, "label": "inventory:fieldNames.parentName", "name": "parentName", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.ind", "name": "ind", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 }, { "disabled": false, "label": "inventory:fieldNames.volumeNum", "name": "volumeNum", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false }, { "disabled": false, "label": "inventory:fieldNames.keepCategory", "name": "keepCategory", "required": true, "requiredMessage": "inventory:formErrors.keepCategory", "type": "FieldSelect", "value": null, "values": [{ "key": "1", "value": "fields:keepCategory.1" }, { "key": "2", "value": "fields:keepCategory.2" }, { "key": "3", "value": "fields:keepCategory.3" }, { "key": "4", "value": "fields:keepCategory.4" }] }, { "disabled": false, "label": "inventory:fieldNames.name", "name": "name", "required": true, "requiredMessage": "inventory:formErrors.name", "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.note", "name": "note", "required": false, "requiredMessage": null, "type": "FieldMultiText", "value": null, "maxLength": null, "rows": null }, { "disabled": false, "label": "inventory:fieldNames.startYear", "name": "startYear", "required": true, "requiredMessage": "inventory:formErrors.startYear", "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }, { "disabled": false, "label": "inventory:fieldNames.endYear", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }],
                "Mode": 2,
                "Tabs": [{ "ClassName": null, "CustomType": null, "Disabled": false, "ForceRender": null, "Rows": [{ "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 }, { "Type": 0, "Fields": ["volumeNum"], "Width": 4 }, { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }] }, { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["startYear"], "Width": 6 }, { "Type": 0, "Fields": ["endYear"], "Width": 6 }] }], "Title": "tabs:inventory" }, { "ClassName": null, "CustomType": "InventoryFiles", "Disabled": false, "ForceRender": null, "Rows": null, "Title": "tabs:files" }]
            };
            const editContext = {
                "Fields": [{ "disabled": true, "label": "inventory:fieldNames.parentName", "name": "parentName", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.ind", "name": "ind", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 }, { "disabled": false, "label": "inventory:fieldNames.volumeNum", "name": "volumeNum", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false }, { "disabled": false, "label": "inventory:fieldNames.keepCategory", "name": "keepCategory", "required": true, "requiredMessage": "inventory:formErrors.keepCategory", "type": "FieldSelect", "value": null, "values": [{ "key": "1", "value": "fields:keepCategory.1" }, { "key": "2", "value": "fields:keepCategory.2" }, { "key": "3", "value": "fields:keepCategory.3" }, { "key": "4", "value": "fields:keepCategory.4" }] }, { "disabled": false, "label": "inventory:fieldNames.name", "name": "name", "required": true, "requiredMessage": "inventory:formErrors.name", "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.note", "name": "note", "required": false, "requiredMessage": null, "type": "FieldMultiText", "value": null, "maxLength": null, "rows": null }, { "disabled": false, "label": "inventory:fieldNames.startYear", "name": "startYear", "required": true, "requiredMessage": "inventory:formErrors.startYear", "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }, { "disabled": false, "label": "inventory:fieldNames.endYear", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }],
                "Mode": 1,
                "Tabs": [
                    {
                        "ClassName": null, "CustomType": null, "Disabled": false, "ForceRender": null,
                        "Rows": [{ "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 }, { "Type": 0, "Fields": ["volumeNum"], "Width": 4 }, { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }] }, { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["startYear"], "Width": 6 }, { "Type": 0, "Fields": ["endYear"], "Width": 6 }] }], "Title": "tabs:inventory"
                    },
                    {
                        "ClassName": null, "CustomType": "InventoryFiles", "Disabled": true, "ForceRender": null, "Rows": null, "Title": "tabs:files"
                    }]
            };
            const newContext = {
                "Fields": [
                    { type: "FieldCheckbox", name: "E_DOCUMENT", label: " ", description: E_DOCUMENT_LABEL },
                    { "disabled": true, "label": "inventory:fieldNames.parentName", "name": "parentName", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null },
                    { "disabled": false, "label": "inventory:fieldNames.ind", "name": "ind", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 }, { "disabled": false, "label": "inventory:fieldNames.volumeNum", "name": "volumeNum", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false }, { "disabled": false, "label": "inventory:fieldNames.keepCategory", "name": "keepCategory", "required": true, "requiredMessage": "inventory:formErrors.keepCategory", "type": "FieldSelect", "value": null, "values": [{ "key": "1", "value": "fields:keepCategory.1" }, { "key": "2", "value": "fields:keepCategory.2" }, { "key": "3", "value": "fields:keepCategory.3" }, { "key": "4", "value": "fields:keepCategory.4" }] }, { "disabled": false, "label": "inventory:fieldNames.name", "name": "name", "required": true, "requiredMessage": "inventory:formErrors.name", "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.note", "name": "note", "required": false, "requiredMessage": null, "type": "FieldMultiText", "value": null, "maxLength": null, "rows": null }, { "disabled": false, "label": "inventory:fieldNames.startYear", "name": "startYear", "required": true, "requiredMessage": "inventory:formErrors.startYear", "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }, { "disabled": false, "label": "inventory:fieldNames.endYear", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }],
                "Mode": 0,
                "Tabs": [{
                    "ClassName": null, "CustomType": null, "Disabled": false, "ForceRender": null,
                    "Rows": [
                        { "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] },
                        { "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 }, { "Type": 0, "Fields": ["volumeNum"], "Width": 4 }, { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }] },
                        { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] },
                        { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] },
                        { "Cells": [{ "Type": 0, "Fields": ["startYear"], "Width": 6 }, { "Type": 0, "Fields": ["endYear"], "Width": 6 }] },
                        { "Cells": [{ "Type": 0, "Fields": ["E_DOCUMENT"], "Width": 24 }] },
                    ], "Title": "tabs:inventory"
                }, { "ClassName": null, "CustomType": "InventoryFiles", "Disabled": true, "ForceRender": null, "Rows": null, "Title": "tabs:files" }]
            };
            await sleep(1000);
            switch (mode) {
                case FormMode.edit:
                    return editContext;
                case FormMode.display:
                    return dispContext;
                case FormMode.new:
                default:
                    return newContext;
            }
        },
        async getInitialValuesAsync() {
            await sleep(1000);
            return {};
        },
        getTitle: function () {
            return "Форма";
        }
    }

    const formApi = useRef<AjaxClientForm.IFormApi>();

    return (
        <React.Fragment>
            <Button onClick={() => {
                formApi?.current?.showLoading();
                setTimeout(() => { formApi?.current?.hideLoading(); }, 1500);
            }}>Грузить</Button>
            <AjaxClientForm.Form
                ref={formApi}
                mode={FormMode.new}
                dataService={dataService}
                getResourceText={name => name}
                enableLeftIcon={true}
                leftIconTitle={E_DOCUMENT_LABEL}
                isHiddenLeftIcon={true}
                onValuesChange={(changedValues: any) => {
                    if (changedValues && changedValues.E_DOCUMENT !== undefined) {
                        if (changedValues.E_DOCUMENT === true)
                            formApi?.current?.showLeftIcon();
                        else
                            formApi?.current?.hideLeftIcon();
                    }
                }}
            />
        </React.Fragment>
    );

    async function sleep(msec: number) {
        return new Promise(resolve => setTimeout(resolve, msec));
    }
}

export default AjaxClientFormPage;
