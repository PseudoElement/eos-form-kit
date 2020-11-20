import { FormMode, FieldDateTime } from "eos-webui-formgen";

class Helper {
    static getFields(mode: FormMode) {
        /**
         * Огрничение на колиечество элементов запроса
         */
        const CUSTOM_OPTIONS_AMOUNT = 11;
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
            { "disabled": false, "label": "Год окончания", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" },
            { 
                "disabled": false, 
                "label": "Срок хранения", 
                "name": "keepPeriod", 
                "required": false, 
                "requiredMessage": "inventory:formErrors.keepPeriod", 
                "type": "FieldLookup", 
                "value": null,
                "getData": (value: any) => { return { variables: { nameVal: value, first: CUSTOM_OPTIONS_AMOUNT } } },
                "getOptionItems": (data: any): any => {
                    // if (data && data.arhClsIndHistoriesPg && data.arhClsIndHistoriesPg.items) {
                    //     return data.arhClsIndHistoriesPg.items.map((item: any) => {
                    //         return {
                    //             "value": item.ind,
                    //             "key": item.ind
                    //         };
                    //     });
                    // }
                    // else {
                    //     return [];
                    // }
                    if (data) {
                        return data.map((item: any) => {
                            return {
                                "value": item.value,
                                "key": item.key
                            };
                        });
                    }
                    else {
                        return [];
                    }
                },
                "optionsAmountInfo": "{ t: t, namespace: ajaxSelect:showFirstAmountResults }",
                "notFoundContent": "t(ajaxSelect:notFoundContentDefaultText)",
                "optionsAmountLimit": CUSTOM_OPTIONS_AMOUNT,
                "getDataService": {
                    loadDataAsync: () => new Promise((resolve, reject) => {
                        // test getDataService
                        setTimeout(() => {
                            if (Math.random() > 0.5) {
                                // Рандом на количество полученных данных: > 10, < 10, 0
                                let chance = Math.random()
                                switch (true) {
                                    case chance > 0.7:
                                        resolve([
                                            {value: "5 лет", key: 1000084},
                                            {value: "5 лет ЭПК", key: 1000085},
                                            {value: "15 лет", key: 1000086},
                                            {value: "15 лет ЭПК", key: 1000087},
                                            {value: "20 лет", key: 1000088},
                                            {value: "20 лет ЭПК", key: 1000089},
                                            {value: "25 лет", key: 1000090},
                                            {value: "25 лет ЭПК", key: 1000091},
                                            {value: "30 лет", key: 1000092},
                                            {value: "30 лет ЭПК", key: 1000093},
                                            {value: "35 лет", key: 1000094},
                                        ]);
                                        break;
                                    case chance < 0.4:
                                        resolve([
                                            {value: "5 лет", key: 1000084},
                                            {value: "15 лет ЭПК", key: 1000087},
                                            {value: "20 лет", key: 1000088},
                                            {value: "25 лет", key: 1000090},
                                            {value: "25 лет ЭПК", key: 1000091},
                                            {value: "30 лет ЭПК", key: 1000093},
                                            {value: "35 лет", key: 1000094},
                                        ])
                                        break;
                                    default:
                                        resolve([])
                                        break;
                                }                         
                            } else {
                                reject(new Error("Error simulation at getDataService"))
                            }
                        }, 200)
                    }),
                    resultsAmount: CUSTOM_OPTIONS_AMOUNT,
                },
                // "getDataService": {
                //     "loadDataAsync": useLazyQuery,
                //     "query": GET_ARH_TYPEDOCUM_BY_NAME,
                //     "resultsAmount": CUSTOM_OPTIONS_AMOUNT
                // },
            },
            // test lookupAutoComplete
            { 
                "disabled": false, 
                "label": "Тип документа", 
                "name": "typeDocum", 
                "required": false, 
                "requiredMessage": "inventory:formErrors.typeDocum", 
                "type": "FieldLookupAutoComplete", 
                "value": null,
                "getData": (value: any) => { return { variables: { nameVal: value, first: CUSTOM_OPTIONS_AMOUNT } } },
                "getOptionItems": (data: any): any => {
                    // if (data && data.arhClsIndHistoriesPg && data.arhClsIndHistoriesPg.items) {
                    //     return data.arhClsIndHistoriesPg.items.map((item: any) => {
                    //         return {
                    //             "value": item.ind,
                    //             "key": item.ind
                    //         };
                    //     });
                    // }
                    // else {
                    //     return [];
                    // }
                    if (data) {
                        return data.map((item: any) => {
                            return {
                                "value": item.value,
                                "key": item.key
                            };
                        });
                    }
                    else {
                        return [];
                    }
                },
                "optionsAmountInfo": "{ t: t, namespace: ajaxAutoComplete:showFirstAmountResults }",
                "notFoundContent": "t(ajaxAutoComplete:notFoundContentDefaultText)",
                "optionsAmountLimit": CUSTOM_OPTIONS_AMOUNT,
                "getDataService": {
                    loadDataAsync: () => new Promise((resolve, reject) => {
                        // test getDataService
                        setTimeout(() => {
                            // Рандом на удачное завершение/ошибку при получении данных
                            if (Math.random() > 0.5) {
                                // Рандом на количество полученных данных: > 10, < 10, 0
                                let chance = Math.random()
                                switch (true) {
                                    case chance > 0.7:
                                        resolve([
                                            {value: "Тип 1", key: 1},
                                            {value: "Тип 2", key: 2},
                                            {value: "Тип 3", key: 3},
                                            {value: "Тип 4", key: 4},
                                            {value: "Тип 5", key: 5},
                                            {value: "Тип 6", key: 6},
                                            {value: "Тип 7", key: 7},
                                            {value: "Тип 8", key: 8},
                                            {value: "Тип 9", key: 9},
                                            {value: "Тип 10", key: 10},
                                            {value: "Тип 11", key: 11},
                                            {value: "Тип 12", key: 12},
                                        ]);
                                        break;
                                    case chance < 0.4:
                                        resolve([
                                            {value: "Тип 1", key: 1},
                                            {value: "Тип 2", key: 2},
                                            {value: "Тип 3", key: 3},
                                            {value: "Тип 4", key: 4},
                                            {value: "Тип 5", key: 5},
                                            {value: "Тип 6", key: 6},
                                            {value: "Тип 7", key: 7},
                                        ])
                                        break;
                                    default:
                                        resolve([])
                                        break;
                                }                         
                            } else {
                                reject(new Error("Error simulation at getDataService"))
                            }
                        }, 200)
                    }),
                    resultsAmount: CUSTOM_OPTIONS_AMOUNT,
                },
                // "getDataService": {
                //     "loadDataAsync": useLazyQuery,
                //     "query": GET_ARH_TYPEDOCUM_BY_NAME,
                //     "resultsAmount": CUSTOM_OPTIONS_AMOUNT
                // },
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
                    { "Cells": [{ "Type": 0, "Fields": ["E_DOCUMENT"], "Width": 24 }] },
                    { "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 }, { "Type": 0, "Fields": ["volumeNum"], "Width": 4 }, { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }] }, { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["startYear"], "Width": 6 }, { "Type": 0, "Fields": ["endYear"], "Width": 6 }] },
                    // test lookup lookupAutoComplete
                    { "Cells": [
                        { "Type": 0, "Fields": ["keepPeriod"], "Width": 12},
                        { "Type": 0, "Fields": ["typeDocum"], "Width": 12}
                    ]}
                
                ],
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