import { FormMode, FieldDateTime, AjaxSelect, AjaxAutoComplete, FieldLookupMulti } from "eos-webui-formgen";

class Helper {
    static getFields(mode: FormMode) {
        /**
         * Огрничение на колиечество элементов запроса
         */
        const fields = [
            {
                "disabled": false,
                "label": "multiLookupRow",
                "name": "multiLookupRow",
                "defaultColumnLabel": "Особенности",
                "modalWindowTitle": "Название модального окна",
                "showHeader": false,
                "disabledDefaultColumn": false,
                "required": true,
                "allowDuplication": true,
                "requiredMessage": "Поле обязательное к заполнению",
                "type": "FieldLookupMultiRow",
                "value": null,
                "notFoundContent": "Нет элементов",
                "dataService": {
                    loadDataAsync: async (search?: string) => {
                        const result: FieldLookupMulti.IValue[] = [
                            { key: "1", value: "один" },
                            { key: "2", value: "два" },
                            { key: "3", value: "три" },
                            { key: "4", value: "четыре" }
                        ]
                        if (search) {
                            return result.filter((item) => {
                                if (item && item.value && item?.value?.indexOf(search) >= 0) {
                                    return true;
                                }
                                return false;
                            }) ?? [];
                        }
                        else {
                            return result;
                        }
                    },
                    resultsAmount: 10,
                },
                "otherColumns": [
                    { "label": "secondColumn", "name": "secondColumn", "disabled": false }
                ]
            },
            {
                "disabled": false,
                "label": "multiLookup1",
                "name": "multiLookup1",
                "defaultColumnLabel": "Особенности",
                "modalWindowTitle": "Название модального окна",
                "showHeader": false,
                "required": true,
                "allowTakes": true,
                "requiredMessage": "Поле обязательное к заполнению",
                "type": "FieldLookupMulti",
                "value": null,
                "notFoundContent": "Нет элементов",
                "dataService": {
                    loadDataAsync: async (search?: string) => {
                        const result: FieldLookupMulti.IValue[] = [
                            { key: "1", value: "один", other: [{ value: "один три", name: "secondColumn" } ] },
                            { key: "2", value: "два",  other: [{ value: "два три", name: "secondColumn" } ] },
                            { key: "3", value: "три",  other: [{ value: "три три", name: "secondColumn" } ] },
                            { key: "4", value: "четыре",  other: [{ value: "четыре три", name: "secondColumn" }]}
                        ]
                        if (search) {
                            return result.filter((item) => {
                                if (item && item.value && item?.value?.indexOf(search) >= 0) {
                                    return true;
                                }
                                return false;
                            }) ?? [];
                        }
                        else {
                            return result;
                        }
                    },
                    resultsAmount: 10,
                }
            },
            {
                "disabled": false,
                "label": "multiLookup2",
                "name": "multiLookup2",
                "defaultColumnLabel": "Другие особенности",
                "defaultColumnIndex": 1,
                "showHeader": true,
                "allowDuplication": false,
                "required": true,
                "requiredMessage": "Поле обязательное к заполнению",
                "type": "FieldLookupMulti",
                "value": null,
                "notFoundContent": "Нет элементов",
                "dataService": {
                    loadDataAsync: async (search?: string) => {
                        const result: FieldLookupMulti.IValue[] = [
                            { key: "1", value: "один", other: [{ value: "один три", name: "secondColumn" }, { value: "шесть три", name: "anotherColumn" } ] },
                            { key: "2", value: "два",  other: [{ value: "два три", name: "secondColumn" }, { value: "семь три", name: "anotherColumn" } ] },
                            { key: "3", value: "три",  other: [{ value: "три три", name: "secondColumn" }, { value: "восемь три", name: "anotherColumn" } ] },
                            { key: "4", value: "четыре",  other: [{ value: "четыре три", name: "secondColumn" }, { value: "девять три", name: "anotherColumn" } ] }
                        ]
                        if (search) {
                            return result.filter((item) => {
                                if (item && item.value && item?.value?.indexOf(search) >= 0) {
                                    return true;
                                }
                                return false;
                            }) ?? [];
                        }
                        else {
                            return result;
                        }
                    },
                    resultsAmount: 10,
                },
                "otherColumns": [
                    { "label": "secondColumn", "name": "secondColumn", "disabled": false },
                    { "label": "anotherColumn", "name": "anotherColumn", "disabled": false }
                ]
            },
            { type: "FieldCheckbox", name: "E_DOCUMENT", label: " ", description: "Для электронных документов" },
            { "disabled": true, "label": "Находится в", "name": "parentName", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null },
            { "disabled": false, "label": "Номер", "name": "ind", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 },
            { "disabled": false, "label": "Том", "name": "volumeNum", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false },
            { "disabled": true, "label": "Находится в", "name": "parentName2", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null },
            { "disabled": false, "label": "Номер", "name": "ind2", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 },
            { "disabled": false, "label": "Том", "name": "volumeNum2", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false },
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
            { "disabled": false, "label": "Год окончания", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" },
            { "disabled": false, "label": "Год начала", "name": "startYear2", "required": true, "requiredMessage": "inventory:formErrors.startYear", "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" },
            { "disabled": false, "label": "Год окончания", "name": "endYear2", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" },
            {
                "disabled": false,
                "label": "Срок хранения",
                "name": "keepPeriod",
                "required": true,
                "requiredMessage": "Срок хранения обязателен для заполнения",
                "type": "FieldLookup",
                "value": null,
                "notFoundContent": "Нет элементов",
                "dataService": {
                    loadDataAsync: async (search?: string) => {
                        const result: AjaxSelect.IOptionItem[] = [
                            { key: "value1", value: "один", other: [{ value: "один три", name: "secondColumn" }] },
                            { key: "value2", value: "два",  other: [{ value: "два три", name: "secondColumn" }] },
                            { key: "value3", value: "три",  other: [{ value: "три три", name: "secondColumn" }] },
                            { key: "value4", value: "четыре",  other: [{ value: "четыре три", name: "secondColumn" }] }
                        ]
                        if (search) {
                            return result.filter((item) => {
                                if (item && item.value && item?.value?.indexOf(search) >= 0) {
                                    return true;
                                }
                                return false;
                            }) ?? [];
                        }
                        else {
                            return result;
                        }
                    },
                    resultsAmount: 3,
                },
            },
            {
                "disabled": false,
                "label": "Тип документа",
                "name": "typeDocum",
                "type": "FieldLookupAutoComplete",
                "value": null,
                "notFoundContent": "Нет элементов",
                "dataService": {
                    loadDataAsync: async (search?: string) => {
                        const result: AjaxAutoComplete.IOptionItem[] = [
                            { key: "1", value: "один" },
                            { key: "2", value: "два" },
                            { key: "3", value: "три" },
                            { key: "4", value: "четыре" }
                        ]
                        if (search) {
                            return result.filter((item) => {
                                if (item && item.value && item?.value?.indexOf(search) >= 0) {
                                    return true;
                                }
                                return false;
                            }) ?? [];
                        }
                        else {
                            return result;
                        }
                    },
                    resultsAmount: 3,
                }
            }
        ];
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
                    { "Cells": [{ "Type": 0, "Fields": ["multiLookupRow"], "Width": 24 }] },
                    { "Cells": [{ "Type": 0, "Fields": ["multiLookup1"], "Width": 24 }] },
                    { "Cells": [{ "Type": 0, "Fields": ["multiLookup2"], "Width": 24 }] },
                    { "Cells": [{ "Type": 0, "Fields": ["E_DOCUMENT"], "Width": 24 }] },
                    { "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] },
                    {
                        "Title": "Заглавие строки",
                        "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 },
                        { "Type": 0, "Fields": ["volumeNum"], "Width": 4 },
                        { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }]
                    },
                    { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] },
                    { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] },
                    {
                        "Cells": [
                            { "Type": 0, "Fields": ["startYear"], "Width": 6 },
                            { "Type": 0, "Fields": ["endYear"], "Width": 6 }
                        ]
                    },
                    {
                        "Cells": [
                            { "Type": 1, "Fields": ["startYear2", "endYear2"] }
                        ]
                    },
                    // test lookup lookupAutoComplete
                    {
                        "Cells": [
                            { "Type": 0, "Fields": ["keepPeriod"], "Width": 12 },
                            { "Type": 0, "Fields": ["typeDocum"], "Width": 12 }
                        ]
                    }

                ],
                "Title": "Раздел описи"
            },
            {
                "ClassName": null,
                "CustomType": null,
                "Disabled": false,
                "ForceRender": null,
                "Rows": [
                    {
                        "Title": "Заглавие строки 2",
                        "Cells": [
                            { "Type": 0, "Fields": ["ind2"], "Width": 8 },
                            { "Type": 0, "Fields": ["volumeNum2"], "Width": 4 }]
                    },
                    { "Cells": [{ "Type": 0, "Fields": ["name2"], "Width": 24 }] }
                ],
                "Title": "Раздел описи2"
            }
            // { "ClassName": null, "CustomType": "InventoryFiles", "Disabled": true, "ForceRender": null, "Rows": null, "Title": "Файлы" }
        ];
        return json;
    }
    static getRows() {
        const rows = [
            { "Cells": [{ "Type": 0, "Fields": ["multiLookupRow"], "Width": 24 }] },
            { "Cells": [{ "Type": 0, "Fields": ["multiLookup1"], "Width": 24 }] },
            { "Cells": [{ "Type": 0, "Fields": ["multiLookup2"], "Width": 24 }] },
            { "Cells": [{ "Type": 0, "Fields": ["E_DOCUMENT"], "Width": 24 }] },
            { "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] },
            {
                "Cells": [
                    { "Type": 0, "Fields": ["ind"], "Width": 8 },
                    { "Type": 0, "Fields": ["volumeNum"], "Width": 4 },
                    { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }]
            },
            { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] },
            { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] },
            {
                "Cells": [
                    { "Type": 0, "Fields": ["startYear"], "Width": 6 },
                    { "Type": 0, "Fields": ["endYear"], "Width": 6 }]
            }];
        return rows;
    }
    static getInitialValues(mode: FormMode, id: number) {
        switch (id) {
            case 1:
                const secondItem = {
                    "E_DOCUMENT": true,
                    "multiLookupRow": [
                        { key: "2", value: "два", other: [{ value: "двадцать два", name: "secondColumn" }] },
                        { key: "3", value: "три", other: [{ value: "тридцать три", name: "secondColumn" }] }
                    ],
                    "multiLookup1": [
                        { key: "10", value: "десять", },
                        { key: "11", value: "одинадцать" },
                        { key: "12", value: "двенадцать" },
                        { key: "13", value: "тринадцать" }
                    ],
                    "multiLookup2": [
                        { key: "2", value: "два", other: [{ value: "двадцать два", name: "secondColumn" }, { value: "двадцать шесть", name: "anotherColumn" }] },
                        { key: "3", value: "три", other: [{ value: "тридцать три", name: "secondColumn" }, { value: "двадцать семь", name: "anotherColumn" }] },
                    ],
                    "parentName2": "Находися в 2-ом элементе",
                    "parentName": "Находися в 1-ом элементе",
                    "ind": "Номер 1",
                    "volumeNum": 1,
                    "keepCategory": "1",
                    "name": "Наименование 1",
                    "note": "Примечание 1",
                    "startYear": FieldDateTime.getFieldValueForClientRender(mode, "2013", FieldDateTime.DateTimeMode.year),
                    "endYear": FieldDateTime.getFieldValueForClientRender(mode, "2020", FieldDateTime.DateTimeMode.year),
                    "startYear2": FieldDateTime.getFieldValueForClientRender(mode, "2013", FieldDateTime.DateTimeMode.year),
                    "endYear2": FieldDateTime.getFieldValueForClientRender(mode, "2020", FieldDateTime.DateTimeMode.year),
                    "name2": "Наименование 11",
                    "ind2": "Номер 11",
                    "volumeNum2": 11,
                    "keepPeriod": { key: "3", value: "три", other: [{ value: "три три", name: "secondColumn" }] }
                }
                return secondItem;
            case 2:
                const firstItem = {
                    "E_DOCUMENT": false,
                    "multiLookupRow": [
                        { key: "2", value: "два", other: [{ key: "101", value: "стоодин" }] },
                        { key: "3", value: "три", other: [{ key: "100", value: "сто" }] }
                    ],
                    "multiLookupTest1": [
                        { key: "10", value: "десять", },
                        { key: "11", value: "одинадцать" },
                        { key: "12", value: "двенадцать" },
                        { key: "13", value: "тринадцать" }
                    ],
                    "multiLookupTest2": [
                        { key: "10", value: "десять", other: [{ key: "100", value: "сто" }] },
                        { key: "11", value: "одинадцать", other: [{ key: "101", value: "стоодин" }] },
                        { key: "12", value: "двенадцать", other: [{ key: "102", value: "стодва" }] },
                        { key: "13", value: "тринадцать", other: [{ key: "103", value: "стотри" }] }
                    ],
                    "parentName2": "Находися в 2-ом элементе",
                    "parentName": "Находися в 2-ом элементе",
                    "ind": "Номер 2",
                    "volumeNum": 2,
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