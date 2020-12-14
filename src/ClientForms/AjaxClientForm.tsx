import { Form as RcForm } from "@eos/rc-controls";
import React, { ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Form as ClientForm, IFormApi as IClientFormApi } from "./ClientForm";
import { IClientTab, IClientTabs } from "./ClientTabs";
import { FormMode } from "./FormMode";
import { Store } from 'rc-field-form/lib/interface';
import { InternalHelper } from '../InternalHelper';
import { IFormRows } from "./FormRows";
import { IToolBar } from "./ToolBar/ToolBar";

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
    /**Метод для получения кастомной вкладки. */
    getCustomtab?: (tab: IClientTabProps) => IClientTab | undefined;

    onCancelClick?: (event: any, mode: FormMode) => void;
    /**Вызовется, когда будет подгружена схема формы с сервера. */
    onContextLoaded?(context: any): void;
    onEditClick?: (event: any) => void;
    /**Вызовется, когда какое-то поле было изменено. */
    onFieldsWasModified?: (wasModified: boolean) => void;
    /**Метод вызовется когда нажали на кнопку "Сохранить". */
    onFinish?(data: Store): Promise<void>;
    /**Позволяет переопределить действие генератора форм после удачного сохранения.*/
    onFinishSucceeded?(): void;
    /**Позволяет переопределить действие генератора форм после неудачного сохранения.*/
    onFinishFailed?(): void;
    onRendered?(): void;
    onTabsChange?: (activeKey: string) => void;
    /**Обработчик события при изменении значений полей формы. */
    onValuesChange?(changedValues: any, values: any): void;


    /**Тулбар с кнопками. */
    toolbar?: IToolBar;
    /**Включает отрисовку иконки @ перед наименованием. */
    enableLeftIcon?: boolean;
    /**При включенной отрисовке левой иконки @ перед наименование изначальная её скрытость. */
    isHiddenLeftIcon?: boolean;
    /**Текст по наведению на иконку @ перед наименованием */
    leftIconTitle?: string;

    /**true - если необходимо заблокировать отрисовку заголовка формы с кнопками. */
    disableHeader?: boolean;
    disableEditButton?: boolean;
    disableCloseButton?: boolean;
    /**Дополнительные кнопки между заголовком и кнопкой закрытия формы просмотра. */
    additionalDispFormTitleButtons?: ReactNode | ReactNode[];
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
    /**Переполучает схему и элемент. */
    reload(): void;
    /**Показывает иконку @. */
    showLeftIcon(): void;
    /**Скрывает иконку @. */
    hideLeftIcon(): void;
    /**Скрывает анимацию загрузки данных. */
    hideLoading(): void;
    /**Показывает анимацию загрузки данных. */
    showLoading(): void;
    /**Показывает анимацию загрузки в виде скелетона. */
    showSkeletonLoading(): void;
    /**Показывает анимацию загрузки в виде спиннера. */
    showSpinLoading(): void;
    /**Устанавливает наименование заголовка. */
    setTitle(title?: string): void;
    /**
     * Проставляет значение поля.
     * @param name Имя поля.
     * @param value Значение поля.
     */
    setFieldValue(name: string, value?: any): void;
    disableField(name: string): void;
    enableField(name: string): void;
    getFieldsValue(): Store;
    setDisabledButton(disable: boolean, name: string): void
    setVisibleButton(visible: boolean, name: string): void
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
    const [isSkeletonLoading, setSkeletonLoading] = useState(false);
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
            reload() {
                clientFormApi?.current?.reset();
                setLoadSchema(true);
            },
            reloadItem() {
                clientFormApi?.current?.reset();
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
            },
            setTitle(title?: string) {
                clientFormApi?.current?.setTitle(title);
            },
            showSkeletonLoading() {
                setSkeletonLoading(true);
            },
            showSpinLoading() {
                setSpinLoading(true);
            },
            setFieldValue(name: string, value?: any) {
                clientFormApi?.current?.setFieldValue(name, value);
            },
            disableField(name: string) {
                clientFormApi?.current?.disableField(name);
            },
            enableField(name: string) {
                clientFormApi?.current?.enableField(name);
            },
            getFieldsValue(): Store {
                return clientFormApi?.current?.getFieldsValue() || {};
            },
            setDisabledButton(disable: boolean, name: string) {
                clientFormApi?.current?.setDisabledButton(disable, name);
            },
            setVisibleButton(visible: boolean, name: string) {
                clientFormApi?.current?.setVisibleButton(visible, name);
            },
        }
        return api;
    });

    useEffect(() => {
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
        clientFormApi?.current?.reset();
        setLoadSchema(true);
    }, [props.mode]);

    useEffect(() => {
        if (loadSchema)
            loadSchemaAsync(props.mode);
    }, [loadSchema]);
    useEffect(() => {
        if (loadItem)
            loadItemAsync();
    }, [loadItem]);

    const loadSchemaAsync = async function (mode: FormMode) {
        setLoadSchema(false);
        setLoadingSchema(true);
        const context = await props?.dataService?.getContextAsync(mode);
        setSchema(context);
        if (props.onContextLoaded)
            props.onContextLoaded(context);
        setLoadItem(true);
        setLoadingSchema(false);
    }
    const loadItemAsync = async function () {
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
            tabsComponent: context && context.Tabs ? InternalHelper.createTabsComponent(context, props.getResourceText, props.getCustomtab) : undefined,
            rows: context && context.Rows ? InternalHelper.createFormRows(context, props.getResourceText) : undefined,
        };
        setClientFormProps(prps);
    };
    const onFinish = async function (values: Store) {
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
    const ExecuteOnFinish = async function (values: Store) {
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
            onValuesChange={props.onValuesChange}
            onFieldsWasModified={props.onFieldsWasModified}
            onTabsChange={props.onTabsChange}
            tabsComponent={clientFormProps.tabsComponent}
            rows={clientFormProps.rows}
            toolbar={props.toolbar}
            enableLeftIcon={props.enableLeftIcon}
            leftIconTitle={props.leftIconTitle}
            isHiddenLeftIcon={props.isHiddenLeftIcon}
            disableHeader={props.disableHeader}
            disableEditButton={props.disableEditButton}
            disableCloseButton={props.disableCloseButton}
            additionalDispFormTitleButtons={props.additionalDispFormTitleButtons}
        />
    );
    function onSaveSucceeded() {
        if (props.onFinishSucceeded)
            props.onFinishSucceeded();
    }
    function onSaveFailed() {
        if (props.onFinishFailed)
            props.onFinishFailed();
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