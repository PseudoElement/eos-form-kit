import React, { FunctionComponent, useEffect, useRef } from 'react'


import "eos-webui-controls/dist/main.css";
import { AjaxClientForm, FormMode, parseFormMode } from "eos-webui-formgen";
import { Helper } from './Helper';
import { useRouteMatch } from 'react-router-dom';

interface IPageParams {
    id?: string;
    mode?: string;
}

const AjaxClientFormPage: FunctionComponent = () => {
    const E_DOCUMENT_LABEL = "Для электронных документов";
    const { params } = useRouteMatch<IPageParams>();
    const mode: FormMode = parseFormMode(params.mode);
    const id: number | undefined = params?.id ? parseFloat(params?.id) : undefined;

    useEffect(() => {
        formApi?.current?.reloadItem();
    }, [id]);

    const dataService: AjaxClientForm.IDataService = {
        async getContextAsync(mode: FormMode) {
            const dispContext = {
                "Fields": Helper.getFields(FormMode.display),
                "Mode": FormMode.display,
                "Tabs": Helper.getTabs()
            };
            const editContext = {
                "Fields": Helper.getFields(FormMode.edit),
                "Mode": FormMode.edit,
                "Tabs": Helper.getTabs()
            };
            const newContext = {
                "Fields": Helper.getFields(FormMode.new),
                "Mode": FormMode.new,
                "Tabs": Helper.getTabs()
            };
            await Helper.sleepAsync(100);
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
            await Helper.sleepAsync(100);
            return Helper.getInitialValues(mode, id ?? 0);
        },
        getTitle: function () {
            return getTitle();
        }
    }

    const formApi = useRef<AjaxClientForm.IFormApi>();

    return (
        <React.Fragment>
            <AjaxClientForm.Form
                ref={formApi}
                mode={mode}
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
                onCancelClick={() => {
                    formApi?.current?.showLoading();
                    setTimeout(() => {
                        formApi?.current?.hideLoading();
                    }, 1500);
                }}
                onEditClick={() => {
                    formApi?.current?.setTitle(getLoadingTitle());
                    setTimeout(() => {
                        formApi?.current?.setTitle(getTitle());
                    }, 1500);

                }}
            />
        </React.Fragment>
    );

    function getTitle() {
        return `Форма ${id ?? ""}`;
    }
    function getLoadingTitle() {
        return `Грузится`;
    }
}

export default AjaxClientFormPage;
