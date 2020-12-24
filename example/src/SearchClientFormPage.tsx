import React, { FunctionComponent, useRef } from 'react'
import { FormMode, SearchForm } from "eos-webui-formgen";
import { Helper } from './Helper';


const SearchClientFormPage: FunctionComponent = () => {
    //  DI объект(провайер) выполняющий различные запросы получения данных, валидации и т.д.
    const dataSerive: SearchForm.IDataService = {
        async getContextAsync() {
            const newContext = {
                "Fields": Helper.getSearchFields(),
                "Mode": FormMode.new,
                "Tabs": Helper.getTabs()
            };
            return newContext;
        },
        async getInitialValuesAsync() {
            return { name: "Наименование" };
        }
    }
    const formApi = useRef<SearchForm.IFormApi>();

    //  Настройки формы поиска.
    const props: SearchForm.IForm = {
        dataService: dataSerive,
        onCloseClick() {
            formApi?.current?.showLoading();
            setTimeout(() => { formApi?.current?.hideLoading(); }, 1500);
        }
    }
    //  Компонент формы.
    return (<SearchForm.Form ref={formApi} {...props} />);
}
export default SearchClientFormPage;