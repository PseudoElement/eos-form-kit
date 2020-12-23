import React, { FunctionComponent, useRef } from "react";
import { SearchForm } from "../..";


export const SearchClientFormPage: FunctionComponent = () => {
    //  DI объект(провайер) выполняющий различные запросы получения данных, валидации и т.д.
    const dataSerive: SearchForm.IDataService = {
        async getContextAsync() {
            const newContext = {
                "Fields": [
                    {
                        "disabled": true,
                        "label": "inventory:fieldNames.parentName",
                        "name": "parentName",
                        "required": false,
                        "requiredMessage": null,
                        "type": "FieldText",
                        "value": null,
                        "additionalText": null,
                        "allowClear": false,
                        "maxLength": null
                    }
                ],
                "Mode": 0,
                "Tabs": [
                    {
                        "ClassName": null,
                        "CustomType": null,
                        "Disabled": false,
                        "ForceRender": null,
                        "Rows": [{ "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }]
                    }]
            };
            return newContext;
        }
    }
    //  API для работы с формой поиска.
    const searchForm = useRef<SearchForm.IFormApi>();

    //  Настройки формы поиска.
    const props: SearchForm.IForm = {
        dataService: dataSerive

    }
    //  Компонент формы.
    return (<SearchForm.Form ref={searchForm} {...props} />);
}