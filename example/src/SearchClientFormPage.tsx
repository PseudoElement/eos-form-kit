import React, { FunctionComponent, useRef } from 'react'
import { SearchForm } from "eos-webui-formgen";


const SearchClientFormPage: FunctionComponent = () => {
    //  DI объект(провайер) выполняющий различные запросы получения данных, валидации и т.д.
    const dataSerive: SearchForm.IDataService = {
        async getContextAsync() {
            const newContext = {
                "Fields": [
                    { "disabled": true, "label": "Находится в", "name": "parentName", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null },
                    { "disabled": false, "label": "Номер", "name": "ind", "required": false, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 },
                    { "disabled": false, "label": "Том", "name": "volumeNum", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false },
                    { "disabled": false, "label": "Категория", "name": "keepCategory", "required": false, "requiredMessage": "inventory:formErrors.keepCategory", "type": "FieldSelect", "value": null, "values": [{ "key": "1", "value": "fields:keepCategory.1" }, { "key": "2", "value": "fields:keepCategory.2" }, { "key": "3", "value": "fields:keepCategory.3" }, { "key": "4", "value": "fields:keepCategory.4" }] },
                    { "disabled": false, "label": "Наименование", "name": "name", "required": false, "requiredMessage": "inventory:formErrors.name", "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.note", "name": "note", "required": false, "requiredMessage": null, "type": "FieldMultiText", "value": null, "maxLength": null, "rows": null },
                    { "disabled": false, "label": "Год начала", "name": "startYear", "required": false, "requiredMessage": "inventory:formErrors.startYear", "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" },
                    { "disabled": false, "label": "Год окончания", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }],
                "Mode": 0,
                "Tabs": [
                    {
                        "ClassName": null,
                        "CustomType": null,
                        "Disabled": false,
                        "ForceRender": null,
                        "Rows": [{ "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 }, { "Type": 0, "Fields": ["volumeNum"], "Width": 4 }, { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }] }, { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["startYear"], "Width": 6 }, { "Type": 0, "Fields": ["endYear"], "Width": 6 }] }],
                        "Title": "Раздел описи"
                    },
                    { "ClassName": null, "CustomType": "InventoryFiles", "Disabled": true, "ForceRender": null, "Rows": null, "Title": "Файлы" }]
            };
            return newContext;
        }
    }
    const searchForm = useRef<SearchForm.IFormApi>();

    //  Настройки формы поиска.
    const props: SearchForm.IForm = {
        dataService: dataSerive

    }
    //  Компонент формы.
    return (<SearchForm.Form ref={searchForm} {...props} />);
}
export default SearchClientFormPage;