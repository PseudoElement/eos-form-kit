import { FormMode, FieldDateTime } from "eos-webui-formgen";

class Helper {
    static getFields(mode: FormMode) {
        const fields = [
            { type: "FieldCheckbox", name: "E_DOCUMENT", label: " ", description: "Для электронных документов" },
            { "disabled": true, "label": "Находится в", "name": "parentName", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null },
            { "disabled": false, "label": "Номер", "name": "ind", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 },
            { "disabled": false, "label": "Том", "name": "volumeNum", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false },
            {
                "disabled": false, "label": "Категория", "name": "keepCategory", "required": true, "requiredMessage": "inventory:formErrors.keepCategory", "type": "FieldSelect", "value": null,
                "values": [
                    { "key": "1", "value": "Постоянно" },
                    { "key": "2", "value": "Свыше 10 лет" },
                    { "key": "3", "value": "До 10 лет (включительно)" },
                    { "key": "4", "value": "Личный состав" }]
            },
            { "disabled": false, "label": "Наименование", "name": "name", "required": true, "requiredMessage": "inventory:formErrors.name", "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null },
            { "disabled": false, "label": "Примечание", "name": "note", "required": false, "requiredMessage": null, "type": "FieldMultiText", "value": null, "maxLength": null, "rows": null },
            { "disabled": false, "label": "Год начала", "name": "startYear", "required": true, "requiredMessage": "inventory:formErrors.startYear", "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" },
            { "disabled": false, "label": "Год окончания", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }];
        if (mode === FormMode.display)
            for (let field of fields)
                field.required = false;
        return fields;
    }
    static getSearchFields() {
        const fields = this.getFields(FormMode.new);
        for (let field of fields)
            field.required = false;
        return fields;
    }
    static getTabs() {
        const json = [
            {
                "ClassName": null,
                "CustomType": null,
                "Disabled": false,
                "ForceRender": null,
                "Rows": [
                    { "Cells": [{ "Type": 0, "Fields": ["E_DOCUMENT"], "Width": 24 }] },
                    { "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 }, { "Type": 0, "Fields": ["volumeNum"], "Width": 4 }, { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }] }, { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["startYear"], "Width": 6 }, { "Type": 0, "Fields": ["endYear"], "Width": 6 }] }],
                "Title": "Раздел описи"
            },
            { "ClassName": null, "CustomType": "InventoryFiles", "Disabled": true, "ForceRender": null, "Rows": null, "Title": "Файлы" }];
        return json;
    }
    static getInitialValues(mode: FormMode, id: number) {
        switch (id) {
            case 1:
                const secondItem = {
                    "E_DOCUMENT": true,
                    "parentName": "Находися в 1-ом элементе",
                    "ind": "Номер 1",
                    "volumeNum": "Том 1",
                    "keepCategory": "1",
                    "name": "Наименование 1",
                    "note": "Примечание 1",
                    "startYear": FieldDateTime.getFieldValueForClientRender(mode, "2013", FieldDateTime.DateTimeMode.year),
                    "endYear": FieldDateTime.getFieldValueForClientRender(mode, "2020", FieldDateTime.DateTimeMode.year)
                }
                return secondItem;
            case 2:
                const firstItem = {
                    "E_DOCUMENT": false,
                    "parentName": "Находися в 2-ом элементе",
                    "ind": "Номер 2",
                    "volumeNum": "Том 2",
                    "keepCategory": "2",
                    "name": "Наименование 2",
                    "note": "Примечание 2",
                    "startYear": FieldDateTime.getFieldValueForClientRender(mode, "2014", FieldDateTime.DateTimeMode.year),
                    "endYear": FieldDateTime.getFieldValueForClientRender(mode, "2021", FieldDateTime.DateTimeMode.year)
                }
                return firstItem;
            default:
                return {};
        }
    }

    static async sleepAsync(msec: number) {
        return new Promise(resolve => setTimeout(resolve, msec));
    }
}
export { Helper };