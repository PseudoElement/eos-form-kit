import { FormMode, FieldDateTime, AjaxSelect, AjaxAutoComplete, FieldLookupMulti, RowType } from "eos-webui-formgen";

class Helper {
    static getFields(mode: FormMode, onMultiLookupAddClick?: (path: string) => void) {
        /** Огрничение на отображаемое количество элементов запроса */
        const RESULT_AMOUNT_LIMIT: number = 2;
        /** Фактически требуемое количество элементов при запросе, чтобы указать, что отображены только первые элементы запроса, а не все */
        const LOADING_ELEMENTS_AMOUNT: number = RESULT_AMOUNT_LIMIT + 1;

        const fields = [
            {
                "disabled": false,
                "label": "multiLookupRow",
                "name": "multiLookupRow",
                "defaultColumnLabel": "Особенности",
                "modalWindowTitle": "Название модального окна",
                "showHeader": true,
                "hideDefaultColumn": false,
                "disabledDefaultColumn": false,
                "addRowToolbarTitle": "Добавить строку",
                "deleteRowsToolbarTitle": "Удалить строки",
                "addRowToolbarWarning": "Такой элемент уже существует",
                "deleteRowsToolbarWarning": "Вы действительно хотите удалить выбранные данные?",
                "required": true,
                "maxInputLength": 15,
                "allowDuplication": false,
                "requiredMessage": "Поле обязательное к заполнению",
                "type": "FieldLookupMultiRow",
                "value": null,
                "notFoundContent": "Нет элементов",
                "onAdd": () => console.log('addRow'),
                "dataService": {
                    loadData2Async: async (search?: string) => {
                        const result: FieldLookupMulti.IValue[] = [
                            { key: "1", value: "один", other: [{ value: "один три", name: "secondColumn" }] },
                            { key: "2", value: "два", other: [{ value: "один шесть", name: "secondColumn" }] },
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
                    loadDataAsync: async (search?: string) => {
                        const result: FieldLookupMulti.IValue[] = [
                            { key: "1", value: "один", other: [{ value: "один три", name: "secondColumn" }] },
                            { key: "2", value: "два", other: [{ value: "один шесть", name: "secondColumn" }] },
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
                    { "label": "Колонка 2", "name": "secondColumn", "disabled": false }
                ]
            },
            {
                "disabled": false,
                "label": "multiLookup1",
                "name": "multiLookup1",
                "defaultColumnLabel": "Особенности",
                "modalWindowTitle": "Название модального окна",
                "addRowToolbarTitle": "Добавить строку",
                "deleteRowsToolbarTitle": "Удалить строки",
                "addRowToolbarWarning": "Такой элемент уже существует",
                "deleteRowsToolbarWarning": "Вы действительно хотите удалить выбранные данные?",
                "showHeader": true,
                "required": true,
                "allowTakes": true,
                "requiredMessage": "Поле обязательное к заполнению",
                "type": "FieldLookupMulti",
                "value": null,
                "notFoundContent": "Нет элементов",
                "valueProperty": "name",
                "keyProperty": "isnKeepPeriod",
                "onAdd": () => onMultiLookupAddClick && onMultiLookupAddClick('/lookupPage?f=multiLookup1'),
                "dataService": {
                    loadData2Async: async () => {
                        return [{
                            code: null,
                            deleted: false,
                            description: null,
                            isEpk: "N",
                            isFolder: 0,
                            isPersonal: "N",
                            isnKeepPeriod: 2,
                            keepYears: 2,
                            key: "6",
                            name: "6 лет",
                            note: null,
                            protected: "N",
                            title: "5 лет",
                            data: {
                                code: null,
                                deleted: "N",
                                isEpk: "N",
                                isPersonal: "N",
                                isnKeepPeriod: 6,
                                keepYears: 5,
                                name: "11 лет",
                                note: null,
                                protected: "N"
                            }
                        },
                        {
                            code: null,
                            deleted: false,
                            description: null,
                            isEpk: "N",
                            isFolder: 0,
                            isPersonal: "N",
                            isnKeepPeriod: 3,
                            keepYears: 2,
                            key: "7",
                            name: "7 лет",
                            note: null,
                            protected: "N",
                            title: "5 лет",
                            data: {
                                code: null,
                                deleted: "N",
                                isEpk: "N",
                                isPersonal: "N",
                                isnKeepPeriod: 3,
                                keepYears: 5,
                                name: "10 лет",
                                note: null,
                                protected: "N"
                            }
                        }]
                        // const result: FieldLookupMulti.IValue[] = [
                        //     { key: "1", value: "один", other: [{ value: "один три", name: "secondColumn" }] },
                        //     { key: "2", value: "два", other: [{ value: "два три", name: "secondColumn" }] },
                        //     { key: "3", value: "три", other: [{ value: "три три", name: "secondColumn" }] },
                        //     { key: "4", value: "четыре", other: [{ value: "четыре три", name: "secondColumn" }] }
                        // ]
                        // if (search) {
                        //     return result.filter((item) => {
                        //         if (item && item.value && item?.value?.indexOf(search) >= 0) {
                        //             return true;
                        //         }
                        //         return false;
                        //     }) ?? [];
                        // }
                        // else {
                        //     return result;
                        // }

                    },
                    resultsAmount: 10,
                },
                "otherColumns": [
                    { "label": "Колонка 2", "name": "deleted", "disabled": false }
                ]
            },
            {
                "disabled": false,
                "label": "multiLookup2",
                "name": "multiLookup2",
                "defaultColumnLabel": "Другие особенности",
                "addRowToolbarTitle": "Добавить строку",
                "deleteRowsToolbarTitle": "Удалить строки",
                "hiddenDeleteToolTitle": true,
                "hiddenAddRowToolTitle": true,
                "addRowToolbarWarning": "Такой элемент уже существует",
                "deleteRowsToolbarWarning": "Вы действительно хотите удалить выбранные данные?",
                "defaultColumnIndex": 1,
                "hideDefaultColumn": false,
                "showHeader": true,
                "allowDuplication": true,
                "required": true,
                "requiredMessage": "Поле обязательное к заполнению",
                "type": "FieldLookupMulti",
                "value": null,
                "notFoundContent": "Нет элементов",
                "dataService": {
                    loadDataAsync: async (search?: string) => {
                        const result: FieldLookupMulti.IValue[] = [
                            { key: "1", value: "один", other: [{ value: "один три", name: "secondColumn" }, { value: "шесть три", name: "anotherColumn" }] },
                            { key: "2", value: "два", other: [{ value: "два три", name: "secondColumn" }, { value: "семь три", name: "anotherColumn" }] },
                            { key: "3", value: "три", other: [{ value: "три три", name: "secondColumn" }, { value: "восемь три", name: "anotherColumn" }] },
                            { key: "4", value: "четыре", other: [{ value: "четыре три", name: "secondColumn" }, { value: "девять три", name: "anotherColumn" }] }
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
                    { "label": "Колонка 2", "name": "secondColumn", "disabled": false },
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
            { "disabled": false, "label": "Номер", "name": "ind3", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 },
            { "disabled": false, "label": "Том", "name": "volumeNum3", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false },
            { "disabled": false, "label": "Номер", "name": "ind4", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 },
            { "disabled": false, "label": "Том", "name": "volumeNum4", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false },
            { "disabled": false, "label": "Номер", "name": "ind5", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 },
            { "disabled": false, "label": "Том", "name": "volumeNum5", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false },

            {
                "disabled": false, "label": "Категория", "name": "keepCategory", "required": true, "requiredMessage": "inventory:formErrors.keepCategory", "type": "FieldSelect", "value": null,
                "values": [
                    { "key": "1", "value": "Постоянно" },
                    { "key": "2", "value": "Свыше 10 лет" },
                    { "key": "3", "value": "До 10 лет (включительно)" },
                    { "key": "4", "value": "Личный состав" },
                    { "key": "5", "value": "Обычный" },
                    { "key": "6", "value": "Специальный", "disabled": false, "isSpecific": true },
                    { "key": "7", "value": "Специальный заблок.", "disabled": true, "isSpecific": true },
                    { "key": "8", "value": "Обычный заблок.", "disabled": true, "isSpecific": false },
                    { "key": "9", "value": "Обычный со св-вами.", "disabled": false, "isSpecific": false, "other": [{ "value": "четыре три", "name": "secondColumn" }, { "value": "девять три", "name": "anotherColumn" }] },
                ]
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
                // "showResultInfoText": true,
                "resultInfoText": `Отображены первые ${RESULT_AMOUNT_LIMIT} элементов`,
                "dataService": {
                    loadDataAsync: async (search?: string) => {
                        const result: AjaxSelect.IOptionItem[] = [
                            { key: "value1", value: "один", other: [{ value: "один три", name: "secondColumn" }] },
                            { key: "value2", value: "два", other: [{ value: "два три", name: "secondColumn" }] },
                            { key: "value3", value: "три", other: [{ value: "три три", name: "secondColumn" }] },
                            { key: "value4", value: "четыре", other: [{ value: "четыре три", name: "secondColumn" }] },
                            { key: "value5", value: "пять", disabled: false, isSpecific: false },
                            { key: "value6", value: "шесть", disabled: true, isSpecific: false },
                            { key: "value7", value: "семь", disabled: false, isSpecific: true },
                            { key: "value8", value: "восемь", disabled: true, isSpecific: true },
                            { key: "value9", value: "девять", disabled: false, isSpecific: false, other: [{ value: "два один", name: "secondColumn" }] },
                            { key: "value10", value: "десять", disabled: true, isSpecific: false, other: [{ value: "два два", name: "secondColumn" }] },
                            { key: "value11", value: "одиннадцать", disabled: false, isSpecific: true, other: [{ value: "два три", name: "secondColumn" }] },
                            { key: "value12", value: "двенадцать", disabled: true, isSpecific: true, other: [{ value: "два четыре", name: "secondColumn" }] }
                        ]
                        if (search) {
                            let res = result.filter((item) => {
                                if (item && item.value && item?.value?.indexOf(search) >= 0) {
                                    return true;
                                }
                                return false;
                            })
                            return res.length > 0 ? res : [];
                        }
                        else {
                            return result;
                        }
                    },
                    resultsAmount: LOADING_ELEMENTS_AMOUNT
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
                    resultsAmount: LOADING_ELEMENTS_AMOUNT,
                }
            },
            // test lookup without manual input
            {
                "disabled": false,
                "label": "Признак",
                "name": "arhClsAttr",
                "required": false,
                "requiredMessage": "Признак обязателен для заполнения",
                "type": "FieldLookup",
                "value": null,
                "onButtonClick": () => console.log("onButtonClick"),
                "notFoundContent": "Нет элементов",
                "manualInputAllowed": false,
                "showResultInfoText": false,
                // "resultInfoText": `Отображены первые ${RESULT_AMOUNT_LIMIT} элементов`,
                "dataService": {
                    loadDataAsync: async (search?: string) => {
                        const result: AjaxSelect.IOptionItem[] = [
                            { key: "value1", value: "один", other: [{ value: "один три", name: "secondColumn" }] },
                            { key: "value2", value: "два", other: [{ value: "два три", name: "secondColumn" }] },
                            { key: "value3", value: "три", other: [{ value: "три три", name: "secondColumn" }] },
                            { key: "value4", value: "четыре", other: [{ value: "четыре три", name: "secondColumn" }] },
                            { key: "value5", value: "пять", disabled: false, isSpecific: false },
                            { key: "value6", value: "шесть", disabled: true, isSpecific: false },
                            { key: "value7", value: "семь", disabled: false, isSpecific: true },
                            { key: "value8", value: "восемь", disabled: true, isSpecific: true },
                            { key: "value9", value: "девять", disabled: false, isSpecific: false, other: [{ value: "два один", name: "secondColumn" }] },
                            { key: "value10", value: "десять", disabled: true, isSpecific: false, other: [{ value: "два два", name: "secondColumn" }] },
                            { key: "value11", value: "одиннадцать", disabled: false, isSpecific: true, other: [{ value: "два три", name: "secondColumn" }] },
                            { key: "value12", value: "двенадцать", disabled: true, isSpecific: true, other: [{ value: "два четыре", name: "secondColumn" }] }
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
                    // resultsAmount: LOADING_ELEMENTS_AMOUNT
                },
            },
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
                    {
                        CustomType: "customFormRow",
                        Type: RowType.CustomFormRow
                    },
                    { "Cells": [{ "Type": 0, "Fields": ["multiLookupRow"], "Width": 24 }] },
                    { "Cells": [{ "Type": 0, "Fields": ["multiLookup1"], "Width": 24 }] },
                    // { "Cells": [{ "Type": 0, "Fields": ["multiLookup2"], "Width": 24 }] },
                    // { "Cells": [{ "Type": 0, "Fields": ["E_DOCUMENT"], "Width": 24 }] },
                    // { "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] },
                    {
                        Title: "Группировка",
                        Collapsable: true,
                        Type: RowType.CollapsableFormRow,
                        Rows: [
                            { "Cells": [{ "Type": 0, "Fields": ["multiLookup2"], "Width": 24 }] },
                            { "Cells": [{ "Type": 0, "Fields": ["E_DOCUMENT"], "Width": 24 }] },
                            { "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] },
                        ]
                    },

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
                    {
                        "Cells": [
                            // test lookup lookupAutoComplete
                            { "Type": 0, "Fields": ["keepPeriod"], "Width": 12 },
                            { "Type": 0, "Fields": ["typeDocum"], "Width": 12 }
                        ]
                    },
                    {
                        "Cells": [
                            // test lookup w/o manual input
                            { "Type": 0, "Fields": ["arhClsAttr"], "Width": 12 }
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
                    { "Cells": [{ "Type": 3, "Fields": ["ind3", "volumeNum3"], "Width": 24 }] }
                ],
                "Title": "Раздел описи2"
            },
            {
                "ClassName": null,
                "CustomType": null,
                "Disabled": false,
                "ForceRender": null,
                "Rows": [
                    { "Cells": [{ "Type": 3, "Fields": ["ind4", "volumeNum4"], "Width": 24 }] },
                    {
                        Title: "Группировка",
                        Collapsable: true,
                        Type: RowType.CollapsableFormRow,
                        Rows: [
                            { "Cells": [{ "Type": 0, "Fields": ["ind5"], "Width": 24 }] },
                            { "Cells": [{ "Type": 0, "Fields": ["volumeNum5"], "Width": 24 }] }
                        ]
                    }
                ],
                "Title": "Третья вкладка"
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
                    "multiLookup1": [{
                        code: null,
                        deleted: false,
                        description: null,
                        isEpk: "N",
                        isFolder: 0,
                        isPersonal: "N",
                        isnKeepPeriod: 2,
                        keepYears: 2,
                        key: "6",
                        name: "6 лет",
                        note: null,
                        protected: "N",
                        title: "5 лет",
                        data: {
                            code: null,
                            deleted: "N",
                            isEpk: "N",
                            isPersonal: "N",
                            isnKeepPeriod: 6,
                            keepYears: 5,
                            name: "6 лет",
                            note: null,
                            protected: "N"
                        }
                    },
                    {
                        code: null,
                        deleted: false,
                        description: null,
                        isEpk: "N",
                        isFolder: 0,
                        isPersonal: "N",
                        isnKeepPeriod: 3,
                        keepYears: 2,
                        key: "7",
                        name: "7 лет",
                        note: null,
                        protected: "N",
                        title: "5 лет",
                        data: {
                            code: null,
                            deleted: "N",
                            isEpk: "N",
                            isPersonal: "N",
                            isnKeepPeriod: 3,
                            keepYears: 5,
                            name: "5 лет",
                            note: null,
                            protected: "N"
                        }
                    }],
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