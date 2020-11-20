import { Form as RcForm } from "@eos/rc-controls";
import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { Form as ClientForm, IFormApi as IClientFormApi, IToolBar } from "./ClientForm";
import { IClientTab, IClientTabs } from "./ClientTabs";
import { FormMode } from "./FormMode";
import { Store } from 'rc-field-form/lib/interface';
import { InternalHelper } from '../InternalHelper';
import { IFormRows } from "./FormRows";

/**DI объект для выполнения различных запросов. */
export interface IDataService {
    /**Подгружает настройки для генератора форм. */
    getContextAsync(mode: FormMode): Promise<any | IContext>;
    /**Метод возвращающий значения полей для формы.*/
    getInitialValuesAsync?(): Promise<any>;
    /**Метод, возвращающий наименование формы. */
    getTitle?(): string;
    /**Обработчик события нажатия на кнопку "ОК". */
    onSaveAsync?(data: Store): Promise<void>;
    /**Кастомная валидация. Вызовется после основной валидации полей. */
    onValidateAsync?(data: Store): Promise<boolean>;
    /**Позволяет модифицировать контекст формы прямо перед отрисовкой формы. */
    modifyContextAsync?(context: any): Promise<any>;
}

/**Контекст, который должна должен вернуть провайдер IDataService методом getContextAsync. */
export interface IContext {
    /**Список схем полей. */
    Fields: any[];
    /**Тип отрисовки формы. */
    Mode: FormMode;
    /**Список вкладок, если форма не должна содержать вкладки, то оставить пустым.*/
    Tabs?: any[];
    /**Список полей, если форма не должна содержать вкладки*/
    Rows?: any[];
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
    /**Включает отрисовку иконки @ перед наименованием. */
    enableLeftIcon?: boolean;
    /**При включенной отрисовке левой иконки @ перед наименование изначальная её скрытость. */
    isHiddenLeftIcon?: boolean;
    /**Текст по наведению на иконку @ перед наименованием */
    leftIconTitle?: string;

    /**Обработчик события при изменении значений полей формы. */
    onValuesChange?(changedValues: any, values: any): void;
    /**true - если необходимо заблокировать отрисовку заголовка формы с кнопками. */
    disableHeader?: boolean;
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
    /**
     * Проставляет имя вкладки.
     * @param key Ключ вкладки.
     * @param title Имя вкладки.
     */
    setTabTitle(key: string, title: string): void;
    /**
     * Проставляет количество элементов рядом с наименованием вкладки.
     * @param key Ключ вкладки.
     * @param count Количество элементов.
     */
    setTabCount(key: string, count?: number): void;
    /**Переполучает элемент и отрисовывает его заново. */
    reloadItem(): void;
    /**Показывает иконку @. */
    showLeftIcon(): void;
    /**Скрывает иконку @. */
    hideLeftIcon(): void;
    hideLoading(): void;
    showLoading(): void;
}


interface IClientFormProps {
    mode?: FormMode;
    initialValues?: any;
    tabsComponent?: IClientTabs;
    rows?: IFormRows;
}

/**Генератор форм выполняющий запрос за элементом и схемой через DI.*/
export const Form = React.forwardRef<any, IForm>((props: IForm, ref) => {
    const [schema, setSchema] = useState<IContext | null>(null);
    const [isFirstLoading, setFirstLoading] = useState(true);
    const [isSkeletonLoading, setSkeletonLoading] = useState(true);
    const [isSpinLoading, setSpinLoading] = useState(false);

    const [loadSchema, setLoadSchema] = useState(false);
    const [isLoadingSchema, setLoadingSchema] = useState(false);
    const [loadItem, setLoadItem] = useState(false);
    const [isLoadingItem, setLoadingItem] = useState(false);
    const [clientFormProps, setClientFormProps] = useState<IClientFormProps>({ mode: props.mode });

    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, (): IFormApi => {
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
            },
            reloadItem() {
                if (schema) {
                    setLoadItem(true);
                }
            },
            showLeftIcon() {
                clientFormApi?.current?.showLeftIcon();
            },
            hideLeftIcon() {
                clientFormApi?.current?.hideLeftIcon();
            },
            hideLoading() {
                hideLoading();
            },
            showLoading() {
                showLoading();
            }
        }
        return api;
    });

    useLayoutEffect(() => {
        if (isLoadingSchema || isLoadingItem) {
            showLoading();
        }
        else {
            hideLoading();
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
            setSchema({ ...schema } as IContext);
        }
        setLoadingItem(false);
        setFirstLoading(false);
        const context: IContext | null = schema as IContext;
        const prps: IClientFormProps = {
            initialValues: data,
            mode: props.mode,
            tabsComponent: context.Tabs ? InternalHelper.createTabsComponent(context, props.getResourceText, props.getCustomtab) : undefined,
            rows: context.Rows ? InternalHelper.createFormRows(context, props.getResourceText) : undefined,
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
    const clientFormApi = useRef<IClientFormApi>();
    return (
        <ClientForm
            ref={clientFormApi}
            title={props.dataService.getTitle ? props.dataService.getTitle() : undefined}
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
            rows={clientFormProps.rows}
            toolbar={props.toolbar}
            enableLeftIcon={props.enableLeftIcon}
            leftIconTitle={props.leftIconTitle}
            isHiddenLeftIcon={props.isHiddenLeftIcon}
            onValuesChange={props.onValuesChange}
            disableHeader={props.disableHeader}
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
        // if (clientFormProps.mode === FormMode.display)
        //     form?.resetFields();

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
    function hideLoading() {
        setSkeletonLoading(false);
        setSpinLoading(false);
    }
    function showLoading() {
        if (isFirstLoading) {
            setSkeletonLoading(true);
            setSpinLoading(false);
        }
        else {
            setSkeletonLoading(false);
            setSpinLoading(true);
        }
    }
})