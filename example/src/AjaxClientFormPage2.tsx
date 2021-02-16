import React, { FunctionComponent, useEffect, useRef } from 'react'


import "@eos/rc-controls/dist/main.css";
import { AjaxClientForm, FormMode, parseFormMode } from "eos-webui-formgen";
import { Helper } from './Helper';
import { useRouteMatch } from 'react-router-dom';

interface IPageParams {
    id?: string;
    mode?: string;
}

const AjaxClientFormPage2: FunctionComponent = () => {
    const E_DOCUMENT_LABEL = "Для электронных документов";
    const { params } = useRouteMatch<IPageParams>();
    const mode: FormMode = parseFormMode(params.mode);
    const id: number | undefined = params?.id ? parseFloat(params?.id) : undefined;
    
    useEffect(() => {
        formApi?.current?.reloadItem();
    }, [id]);

    const dataService: AjaxClientForm.IDataService = {
        async getContextAsync(mode: FormMode): Promise<AjaxClientForm.IContext> {
            const dispContext = {
                "Fields": Helper.getFields(FormMode.display),
                "Mode": FormMode.display,
                "Rows": Helper.getRows()
            };
            const editContext = {
                "Fields": Helper.getFields(FormMode.edit),
                "Mode": FormMode.edit,
                "Rows": Helper.getRows()
            };
            const newContext = {
                "Fields": Helper.getFields(FormMode.new),
                "Mode": FormMode.new,
                "Rows": Helper.getRows()
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
            return `Форма ${id ?? ""}`;
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
                        if (changedValues.E_DOCUMENT === true){
                            formApi?.current?.showLeftIcon();
                            formApi?.current?.disableField("name");
                            formApi?.current?.disableField("volumeNum");
                            formApi?.current?.disableField("keepCategory");
                        }
                        else{
                            formApi?.current?.hideLeftIcon();
                            formApi?.current?.enableField("name");
                            formApi?.current?.enableField("volumeNum");
                            formApi?.current?.enableField("keepCategory");
                        }
                    }
                }}
                onCancelClick={() => {
                    formApi?.current?.showLoading();
                    setTimeout(() => { formApi?.current?.hideLoading(); }, 1500);
                }}
                disableHeader={true}
            />
        </React.Fragment>
    );
}

export default AjaxClientFormPage2;
