import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Store } from 'rc-field-form/lib/interface';
import { Form as RcForm } from "@eos/rc-controls";
import { Form as ClientForm, IFormApi as IClientFormApi} from '../ClientForms/ClientForm';
import { FormMode } from '../ClientForms/FormMode';
import { IClientTab, IClientTabs } from '../ClientForms/ClientTabs';
import { InternalHelper } from '../InternalHelper';
import { IClientTabProps } from '../ClientForms/AjaxClientForm';
import FormTitle, { IFormTitleApi } from './FormTitle';

const DEFAULT_TITLE = "Поиск";

/**Настройки формы поиска. */
export interface IForm {
    /**DI получения данных. */
    dataService: IDataService;

    /**Текст заголовка. */
    title?: string;
    /**Текст кнопки "Очистить". */
    clearTitle?: string;
    /**Текст кнопки "Скрыть". */
    closeTitle?: string;
    /**Текст кнопки "Применить". */
    searchTitle?: string;
    /**Скрыть кнопку "Очитить". */
    hideClearButton?: boolean;
    /**Скрыть кнопку "Скрыть". */
    hideCloseButton?: boolean;
    /**Скрыть кнопку "Применить". */
    hideSearchButton?: boolean;

    /**Переопределяет клик по кнопке "Скрыть". */
    onCloseClick?(event: any): void;
    /**Обработчик события нажатия на кнопку "ОК" после валидации всех полей. */
    onSearchAsync?(values: Store): Promise<void>;

    getResourceText?: (name: string) => string;
    /**Метод для получения кастомной вкладки. */
    getCustomtab?: (tab: IClientTabProps) => IClientTab | undefined;
}

/**DI объект для выполнения различных запросов. */
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

/**API для работы с клиентской формой. */
export interface IFormApi {
    clearFields(): void;
    search(): void;
    /**Возвращает ключ активной вкладки. */
    getActivatedTab(): string;
}

/**Форма поиска. */
export const Form = React.forwardRef<any, IForm>((props: IForm, ref: React.MutableRefObject<IFormApi>) => {
    const selfRef = useRef<IFormApi>();
    const targetRef: React.MutableRefObject<IFormApi> = ref ?? selfRef;
    useImperativeHandle(targetRef, (): IFormApi => {
        const api: IFormApi = {
            clearFields() {
                form?.resetFields();
            },
            search() {
                form?.submit();
            },
            getActivatedTab() {
                return clientFormApi?.current?.getActivatedTab() || "";
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

    const [form] = RcForm.useForm();
    const formInst = React.createRef();
    const clientFormApi = useRef<IClientFormApi>();
    const formTitleApi = useRef<IFormTitleApi>();

    if (loadSchema)
        loadSchemaAsync();

    if (loadInitialValues)
        loadInitialValuesAsync();

    useEffect(() => {
        setLoadSchema(true);
    }, []);
    useEffect(() => {
        checkFieldsByFormRef();
    }, [initialValues]);

    return (
        <ClientForm
            ref={clientFormApi}
            title={props?.title || DEFAULT_TITLE}
            initialValues={initialValues}
            formInst={formInst}
            form={form}
            mode={FormMode.new}
            isSpinLoading={isSpinLoading}
            onFinish={onFinishAsync}
            tabsComponent={clientTabs}
            onValuesChange={onValuesChange}
            formTitle={<FormTitle
                ref={formTitleApi}
                title={props.title}
                clearTitle={props.clearTitle}
                closeTitle={props.closeTitle}
                searchTitle={props.searchTitle}
                hideClearButton={props.hideClearButton}
                hideCloseButton={props.hideCloseButton}
                hideSearchButton={props.hideSearchButton}
                onCloseClick={props.onCloseClick}
                onClearClick={onClearClick}
            />}
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
        if (props.dataService.onSearchAsync || props.onSearchAsync) {
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
        else {
            onSaveSucceeded();
        }
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
                    onLoadSchemaSucceededAsync(initialValues);
                });
    }

    async function onLoadInitialValuesSucceeded(initialValues: any) {
        setSpinLoading(false);
        setInitialValues(initialValues);
        setClientTabs(InternalHelper.createTabsComponent(schema, getResourceText, props.getCustomtab));
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

    function checkFieldsByFormRef() {
        if (isFieldsEmpty(form?.getFieldsValue())) {
            formTitleApi?.current?.disableSearchButton();
            formTitleApi?.current?.disableClearButton();
        }
        else {
            formTitleApi?.current?.enableSearchButton();
            formTitleApi?.current?.enableClearButton();
        }
    }
    function onValuesChange(changedValues: any, values: any) {
        let isEmpty = changedValues ? isFieldsEmpty(values) : isFieldsEmpty(values);
        if (isEmpty) {
            formTitleApi?.current?.disableSearchButton();
            formTitleApi?.current?.disableClearButton();
        }
        else {
            formTitleApi?.current?.enableSearchButton();
            formTitleApi?.current?.enableClearButton();
        }
    }
    function onClearClick() {
        targetRef?.current?.clearFields();
        checkFieldsByFormRef();
    }

    function isFieldsEmpty(values: any) {
        let isEmpty = true;
        if (values)
            for (let i in values)
                if (values[i] !== undefined && values[i] !== null && values[i] !== "") {
                    isEmpty = false;
                    break;
                }
        return isEmpty;
    }

});