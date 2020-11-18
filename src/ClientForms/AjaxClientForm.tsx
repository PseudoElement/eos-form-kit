import { Form as RcForm } from "@eos/rc-controls";
import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { Form as ClientForm, Form as IFormApi, IToolBar } from "./ClientForm";
import { IClientTab, IClientTabs } from "./ClientTabs";
import { FormMode } from "./FormMode";
import { Store } from 'rc-field-form/lib/interface';
import { InternalHelper } from '../InternalHelper';

/**DI объект для выполнения различных запросов. */
export interface IDataService {
    /**Подгружает настройки для генератора форм. */
    getContextAsync(mode: FormMode): Promise<any>;
    /**Метод возвращающий значения полей для формы.*/
    getInitialValuesAsync?(): Promise<any>;
    /**Метод, возвращающий наименование формы. */
    getTitle(): string;
    /**Обработчик события нажатия на кнопку "ОК". */
    onSaveAsync?(data: Store): Promise<void>;
    /**Кастомная валидация. Вызовется после основной валидации полей. */
    onValidateAsync?(data: Store): Promise<boolean>;
    /**Позволяет модифицировать контекст формы прямо перед отрисовкой формы. */
    modifyContextAsync?(context: any): Promise<any>;
}

/**Настройки генератора форм. */
export interface IForm {
    /**Тип формы. */
    mode: FormMode;
    dataService: IDataService;
    getResourceText: (name: string) => string;
    onEditClick?: (event: any) => void;
    onCancelClick?: (event: any, mode: FormMode) => void;
    /**Метод для получения кастомной вкладки. */
    getCustomtab?: (tab: IClientTabProps) => IClientTab | undefined;
    /**Вызовется, когда будет подгружена схема формы с сервера. */
    onContextLoaded?(context: any): void;
    /**Тулбар с кнопками. */
    toolbar?: IToolBar;
    /**Метод вызовется когда нажали на кнопку "Сохранить". */
    onFinish?(data: Store): Promise<void>;
    onRendered?(): void;
    /**Вызовется, когда какое-то поле было изменено. */
    onFieldsWasModified?: (wasModified: boolean) => void;
}
/**Настройки вкладок генератора форм. */
export interface IClientTabProps {
    /**Наименование вкладки */
    title?: string;
    /**Принудительная отрисовка вкладки, если она не активна. */
    forceRender?: boolean;
    /**Кастомный тип отрисовки формы. */
    customType?: string;
    /**true - если вкладки должна быть не кликабельна. */
    disabled?: boolean;
}
/**API для работы с клиентской формой. */
export interface IFormApi {
    /**Возвращает ключ активной вкладки. */
    getActivatedTab(): string;
    /**
     * Делает вкладку активной.
     * @param key Ключ вкладки.
     */
    activateTab(key?: string): void;
    setTabTitle(key: string, title: string): void;
    setTabCount(key: string, count?: number): void;
}


interface IClientFormProps {
    mode?: FormMode;
    initialValues?: any;
    tabsComponent?: IClientTabs;
}

/**Генератор форм выполняющий запрос за элементом и схемой через DI.*/
export const Form = React.forwardRef<any, IForm>((props: IForm, ref) => {
    const [schema, setSchema] = useState<any>(null);
    const [isFirstLoading, setFirstLoading] = useState(true);
    const [isSkeletonLoading, setSkeletonLoading] = useState(true);
    const [isSpinLoading, setSpinLoading] = useState(false);

    const [loadSchema, setLoadSchema] = useState(false);
    const [isLoadingSchema, setLoadingSchema] = useState(false);
    const [loadItem, setLoadItem] = useState(false);
    const [isLoadingItem, setLoadingItem] = useState(false);
    const [clientFormProps, setClientFormProps] = useState<IClientFormProps>({ mode: props.mode });

    useImperativeHandle(ref, (): IFormApi => {
        const api: IFormApi = {
            getActivatedTab() {
                return clientFormApi.current?.getActivatedTab() || "";
            },
            activateTab(key?: string) {
                if (key != undefined)
                    clientFormApi.current?.activateTab(key);
            },
            setTabTitle(key: string, title: string) {
                clientFormApi.current?.setTabTitle(key, title);
            },
            setTabCount(key: string, count?: number) {
                clientFormApi.current?.setTabCount(key, count);
            }
        }
        return api;
    });


    useLayoutEffect(() => {
        if (isLoadingSchema || isLoadingItem) {
            if (isFirstLoading) {
                setSkeletonLoading(true);
                setSpinLoading(false);
            }
            else {
                setSkeletonLoading(false);
                setSpinLoading(true);
            }
        }
        else {
            setSkeletonLoading(false);
            setSpinLoading(false);
            // setTimeout(() => {
            //     if (props.onRendered)
            //         props.onRendered();
            // }, 0);
            if (props.onRendered)
                props.onRendered();
        }

    }, [isFirstLoading, isLoadingSchema, isLoadingItem]);

    useEffect(() => {
        setLoadSchema(true);
    }, [props.mode]);

    const onLoadItemSucceeded = async function (data: any) {
        if (props.dataService.modifyContextAsync) {
            await props.dataService.modifyContextAsync(schema);
            setSchema({ ...schema });
        }
        setLoadingItem(false);
        setFirstLoading(false);
        const prps: IClientFormProps = {
            initialValues: data,
            mode: props.mode,
            tabsComponent: InternalHelper.createTabsComponent(schema, props.getResourceText, props.getCustomtab),
        };
        setClientFormProps(prps);
    };

    if (loadSchema) {
        loadSchemaAsync(props.mode);
    }
    if (loadItem) {
        loadItemAsync();
    }

    const [form] = RcForm.useForm();
    const formInst = React.createRef();
    const clientFormApi = useRef<IFormApi>();
    return (
        <ClientForm
            ref={clientFormApi}
            title={props.dataService.getTitle()}
            initialValues={clientFormProps.initialValues}
            formInst={formInst}
            form={form}
            mode={clientFormProps.mode}
            isSkeletonLoading={isSkeletonLoading}
            isSpinLoading={isSpinLoading}
            onEditClick={props.onEditClick}
            onCancelClick={props.onCancelClick}
            onFinish={onFinish}
            tabsComponent={clientFormProps.tabsComponent}
            toolbar={props.toolbar}
        />
    );

    async function loadSchemaAsync(mode: FormMode) {
        setLoadSchema(false);
        setLoadingSchema(true);
        const context = await props?.dataService?.getContextAsync(mode);
        setSchema(context);
        if (props.onContextLoaded)
            props.onContextLoaded(context);
        setLoadItem(true);
        setLoadingSchema(false);
    }
    async function loadItemAsync() {
        setLoadItem(false);
        setLoadingItem(true);
        if (props.dataService.getInitialValuesAsync)
            props.dataService.getInitialValuesAsync()
                .then((initialValues: any) => {
                    onLoadItemSucceeded(initialValues);
                });
        else
            onLoadItemSucceeded({});

    }

    async function onFinish(values: Store) {
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
        if (props.dataService.onSaveAsync) {
            await props.dataService.onSaveAsync(values)
                .then(onSaveSucceeded)
                .catch(onSaveFailed);
        }
        if (props.onFinish)
            await props.onFinish(values)
                .then(onSaveSucceeded)
                .catch(onSaveFailed);
    }

    function onSaveSucceeded() {
        setSpinLoading(false);
    }
    function onSaveFailed() {
        setSpinLoading(false);
    }
})