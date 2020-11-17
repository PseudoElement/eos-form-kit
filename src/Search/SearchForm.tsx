import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Store } from 'rc-field-form/lib/interface';
import { Form } from "@eos/rc-controls";
import ClientForm, { IClientFormApi } from '../ClientForms/ClientForm';
import { FormMode } from '../ClientForms/FormMode';
import { IClientTab, IClientTabs } from '../ClientForms/ClientTabs';
import { createTabsComponent } from '../InternalHelper';
import { IClientTabProps } from '../ClientForms/AjaxClientForm';

const DEFAULT_TITLE = "Поиск";

export interface ISearchForm {
    /**Наименование формы поиска. */
    title?: string;
    dataService: IDataService;
    /**Обработчик события нажатия на кнопку "ОК". */
    onSearchAsync?(values: Store): Promise<void>;
    getResourceText?: (name: string) => string;
    /**Метод для получения кастомной вкладки. */
    getCustomtab?: (tab: IClientTabProps) => IClientTab | undefined;
}
export interface IDataService {
    /**Подгружает настройки для генератора форм. */
    getContextAsync(): Promise<any>;
    /**Метод возвращающий значения полей для формы.*/
    getInitialValuesAsync?(): Promise<any>;
    /**Обработчик события нажатия на кнопку "ОК". */
    onSearchAsync?(values: Store): Promise<void>;
    /**Кастомная валидация. Вызовется после основной валидации полей. */
    onValidateAsync?(data: Store): Promise<boolean>;
    /**Позволяет модифицировать контекст формы прямо перед отрисовкой формы. */
    modifyContextAsync?(context: any): Promise<any>;
}

export interface ISearchFormApi {
    clearFields(): void;
    search(): void;
}
// const AjaxClientForm = React.forwardRef<any, IAjaxClientForm>((props: IAjaxClientForm, ref) => {
const SearchForm = React.forwardRef<any, ISearchForm>((props: ISearchForm, ref: any) => {
    useImperativeHandle(ref, (): ISearchFormApi => {
        const api: ISearchFormApi = {
            clearFields() {

            },
            search() {

            }
        }
        return api;
    });

    const getResourceText = props.getResourceText ?? getDefaultResourceText;

    const [schema, setSchema] = useState<any>(null);
    const [initialValues, setInitialValues] = useState<any>({});

    const [isSpinLoading, setSpinLoading] = useState(false);
    const [loadSchema, setLoadSchema] = useState(false);
    const [loadInitialValues, setLoadInitialValues] = useState(false);
    const [clientTabs, setClientTabs] = useState<IClientTabs>();

    const [form] = Form.useForm();
    const formInst = React.createRef();
    const clientFormApi = useRef<IClientFormApi>();

    if (loadSchema)
        loadSchemaAsync();

    if (loadInitialValues)
        loadInitialValuesAsync();

    useEffect(() => {
        debugger;
        setLoadSchema(true);
    }, []);

    return (
        <ClientForm
            ref={clientFormApi}
            title={props.title ?? DEFAULT_TITLE}
            initialValues={initialValues}
            formInst={formInst}
            form={form}
            mode={FormMode.new}
            isSpinLoading={isSpinLoading}
            onFinish={onFinishAsync}
            tabsComponent={clientTabs}
        // toolbar={props.toolbar}
        />
    );

    async function onFinishAsync(values: Store) {
        setSpinLoading(true);
        if (props.dataService.onValidateAsync) {
            const isValid = await props.dataService.onValidateAsync(values);
            if (isValid) {
                await ExecuteOnFinish(values);
            }
            else {
                setSpinLoading(false);
            }
        }
        else {
            await ExecuteOnFinish(values);
        }
    }
    async function ExecuteOnFinish(values: Store) {
        if (props.dataService.onSearchAsync) {
            await props.dataService.onSearchAsync(values)
                .then(onSaveSucceeded)
                .catch(onSaveFailed);
        }
        if (props.onSearchAsync)
            await props.onSearchAsync(values)
                .then(onSaveSucceeded)
                .catch(onSaveFailed);
    }

    function onSaveSucceeded() {
        setSpinLoading(false);
    }
    function onSaveFailed() {
        setSpinLoading(false);
    }

    async function loadInitialValuesAsync() {
        setLoadInitialValues(false);
        setSpinLoading(true);
        if (props.dataService.getInitialValuesAsync)
            props.dataService.getInitialValuesAsync()
                .then((initialValues: any) => {
                    onLoadInitialValuesSucceeded(initialValues);
                });
        else {
            onLoadInitialValuesSucceeded({});
        }
    }
    async function loadSchemaAsync() {
        setLoadSchema(false);
        setSpinLoading(true);
        if (props.dataService.getContextAsync)
            props.dataService.getContextAsync()
                .then((initialValues: any) => {
                    debugger;
                    onLoadSchemaSucceededAsync(initialValues);
                });
    }

    async function onLoadInitialValuesSucceeded(initialValues: any) {
        setSpinLoading(false);
        setInitialValues(initialValues);
        setClientTabs(createTabsComponent(schema, getResourceText, props.getCustomtab));
    };
    async function onLoadSchemaSucceededAsync(schema: any) {
        if (props.dataService.modifyContextAsync) {
            await props.dataService.modifyContextAsync(schema);
            setSchema({ ...schema });
        }
        else {
            setSchema({ ...schema });
        }
        setLoadInitialValues(true);
    };

    function getDefaultResourceText(value: string) {
        return value;
    }

});
export default SearchForm;