import { Form as RcForm } from "@eos/rc-controls";
import React, { ReactElement, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Form as ClientForm, IFormApi as IClientFormApi } from "./ClientForm";
import { IClientTab, IClientTabs } from "./ClientTabs";
import { FormMode } from "./FormMode";
import { Store } from 'rc-field-form/lib/interface';
import { InternalHelper } from '../InternalHelper';
import { IFormRows } from "./FormRows";
import { IToolBar } from "./ToolBar/ToolBar";
import moment from 'moment';
import useHistoryWriter from "../Hooks/useHistoryState";
import useHistoryListener, { HistoryActionType } from "../Hooks/useHistoryListener";
// import { IField } from "..";
import IField from "../Fields/IField";
import { IDateTime, getFieldValueForClientRender, DateTimeMode } from "../Fields/FieldDateTime";


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
    /**Метод для получения кастомной строки с произвольной разметкой. */
    getCustomRow?: (customType: string) => ReactElement | ReactElement[] | undefined;

    /**Обработчик клика по кнопке "Отмена". */
    onCancelClick?: (event: any, mode: FormMode) => void;
    /**Вызовется, когда будет подгружена схема формы с сервера. */
    onContextLoaded?(context: any): void;
    /**Обработчик клика по кнопке "Изменить". */
    onEditClick?: (event: any) => void;
    /**Вызовется, когда какое-то поле было изменено. */
    onFieldsWasModified?: (wasModified: boolean) => void;
    /**Метод вызовется когда нажали на кнопку "Сохранить". */
    onFinish?(data: Store): Promise<void>;
    /**Позволяет переопределить действие генератора форм после удачного сохранения.*/
    onFinishSucceeded?(): void;
    /**Позволяет переопределить действие генератора форм после неудачного сохранения.*/
    onFinishFailed?(): void;
    /**Теоретически метод вызовется после отрисовки гененратора, но не всегда срабатывает корректно. */
    onRendered?(): void;
    /**Вызовется при активации вкладки. */
    onTabsChange?: (activeKey: string) => void;
    /**Обработчик события при изменении значений полей формы. */
    onValuesChange?(changedValues: any, values: any): void;


    /**Текст кнопки "Закрыть". */
    closeTitle?: string;
    /**Текст кнопки "Сохранить". */
    finishTitle?: string;
    /**Текст кнопки "Изменить". */
    editTitle?: string;

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
    /**Отключает кнопку изменения. */
    disableEditButton?: boolean;
    /**Отключает кнопку закрытия. */
    disableCloseButton?: boolean;
    /**Дополнительные кнопки между заголовком и кнопкой закрытия формы просмотра. */
    additionalDispFormTitleButtons?: ReactNode | ReactNode[];
    /**true - если между переходами по страницам не сохранять значения полей в window.history. */
    notRestoreFields?: boolean;
    /**Необходимо ли скрывать автоматически анимацию выполнения запроса (скелетон или спиннер).  */
    autoHideLoadingAfterSaved?: boolean;
    stopAnimation?: boolean;
    initialShownForm?: boolean
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
    hideField(name: string): void;
    showField(name: string): void;
    getFieldsValue(): Store;
    setDisabledMenuButton(disable: boolean, name: string): void;
    setVisibleMenuButton(visible: boolean, name: string): void;
    /**Включает анимацию загрузки данных. */
    enableAnimation(): void;
    /**Выключает анимацию загрузки данных. */
    disableAnimation(): void;
    setRequiredField(name: string): void;
    unsetRequiredField(name: string): void;
}


interface IClientFormProps {
    mode?: FormMode;
    initialValues?: any;
    tabsComponent?: IClientTabs;
    rows?: IFormRows;
}

/**Генератор форм выполняющий запрос за элементом и схемой через DI.*/
export const Form = React.forwardRef<any, IForm>((props: IForm, ref) => {
    const { setState } = useHistoryWriter();
    const { currentState, getRedirectType } = useHistoryListener("FormValues");

    const [schema, setSchema] = useState<IContext | null>(null);
    const [isFirstLoading, setFirstLoading] = useState(true);
    const [isSkeletonLoading, setSkeletonLoading] = useState(false);
    const [isSpinLoading, setSpinLoading] = useState(false);

    const [loadSchema, setLoadSchema] = useState(false);
    const [isLoadingSchema, setLoadingSchema] = useState(false);
    const [loadItem, setLoadItem] = useState(false);
    // const loadItem = useRef<boolean>(false);
    // const [counter, setCounter] = useState<number>((prevState: number) => { return prevState + 1; });
    // const [counter, setCount] = useState(0);

    const [isLoadingItem, setLoadingItem] = useState(false);
    const [clientFormProps, setClientFormProps] = useState<IClientFormProps>({ mode: props.mode });

    let stopAnimation = useRef(props.stopAnimation ?? false);

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
                    // loadItem.current = true;
                    // setCount(prev => { return prev + 1 });
                    // loadItemAsync();
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
            hideField(name: string) {
                clientFormApi?.current?.hideField(name);
            },
            showField(name: string) {
                clientFormApi?.current?.showField(name);
            },
            getFieldsValue(): Store {
                return clientFormApi?.current?.getFieldsValue() || {};
            },
            setDisabledMenuButton(disable: boolean, name: string) {
                clientFormApi?.current?.setDisabledMenuButton(disable, name);
            },
            setVisibleMenuButton(visible: boolean, name: string) {
                clientFormApi?.current?.setVisibleMenuButton(visible, name);
            },
            enableAnimation() {
                stopAnimation.current = false;
            },
            disableAnimation() {
                stopAnimation.current = true;
            },
            setRequiredField(name: string) {
                clientFormApi?.current?.setRequiredField(name);
            },
            unsetRequiredField(name: string) {
                clientFormApi?.current?.unsetRequiredField(name);
            }
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

    // useEffect(() => {
    //     if (loadSchema)
    //         loadSchemaAsync(props.mode);
    // }, [loadSchema, counter]);
    // useEffect(() => {
    //     if (loadItem?.current === true)
    //         loadItemAsync();
    // }, [counter]); 
    useEffect(() => {
        if (loadSchema)
            loadSchemaAsync(props.mode);
    }, [loadSchema]);
    useEffect(() => {
        if (loadItem === true)
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
        // loadItem.current = true;
        // setCount(prev => { return prev + 1 });
        setLoadingSchema(false);
    }
    const loadItemAsync = async function () {
        // if (props.notRestoreFields || !currentState) {
        //     // setLoadItem(false);
        //     loadItem.current = false;
        //     setLoadingItem(true);
        //     if (props.dataService.getInitialValuesAsync)
        //         props.dataService.getInitialValuesAsync()
        //             .then((initialValues: any) => {
        //                 onLoadItemSucceeded(initialValues);
        //             });
        //     else
        //         onLoadItemSucceeded({});
        // }
        // else {
        //     onLoadItemSucceeded(prepareValuesForRestore(currentState));
        // }

        setLoadItem(false);
        // loadItem.current = false;
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

        // const values = props.notRestoreFields || !currentState ? data : prepareValuesForRestore(currentState);
        //  Данные для формы.
        let values: any = {};
        if (props.notRestoreFields || !currentState || getRedirectType() === HistoryActionType.none)
            values = data;
        else
            values = prepareValuesForRestore(currentState);

        const context: IContext | null = schema as IContext;
        const prps: IClientFormProps = {
            initialValues: values ? { ...values } : values,
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
            onValuesChange={onValuesChange}
            onFieldsWasModified={props.onFieldsWasModified}
            onTabsChange={props.onTabsChange}
            tabsComponent={clientFormProps.tabsComponent}
            rows={clientFormProps.rows}
            getCustomRow={props.getCustomRow}
            toolbar={props.toolbar}
            enableLeftIcon={props.enableLeftIcon}
            leftIconTitle={props.leftIconTitle}
            isHiddenLeftIcon={props.isHiddenLeftIcon}
            disableHeader={props.disableHeader}
            disableEditButton={props.disableEditButton}
            disableCloseButton={props.disableCloseButton}
            additionalDispFormTitleButtons={props.additionalDispFormTitleButtons}
            closeTitle={props.closeTitle}
            finishTitle={props.finishTitle}
            editTitle={props.editTitle}
            initialShownForm={props.initialShownForm}
        />
    );
    function onSaveSucceeded() {
        if (props.onFinishSucceeded)
            props.onFinishSucceeded();
        if (props.autoHideLoadingAfterSaved) {
            hideLoading();
        }
    }
    function onSaveFailed() {
        if (props.onFinishFailed)
            props.onFinishFailed();
        if (props.autoHideLoadingAfterSaved) {
            hideLoading();
        }
    }
    function hideLoading() {
        setSkeletonLoading(false);
        setSpinLoading(false);
    }
    function showLoading() {
        if (!stopAnimation.current) {
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
            hideLoading();
        }
    }
    function onValuesChange(changedValues: any, values: any) {
        if (!props.notRestoreFields) {
            const backupValues = prepareValuesForBackup(values);
            setState("FormValues", backupValues);
        }

        if (props.onValuesChange)
            props.onValuesChange(changedValues, values);
    }

    function prepareValuesForBackup(values: any) {
        let result = {};
        if (values) {
            for (let i in values) {
                const fieldSchema: IField | null = getFieldSchema(i);
                if (fieldSchema?.type === "FieldDateTime") {
                    const fieldDateTime: IDateTime = fieldSchema as IDateTime;
                    if (fieldDateTime.dateTimeMode === DateTimeMode.year)
                        result[i] = moment.isMoment(values[i]) ? (values[i] as moment.Moment).year() : undefined;
                    else
                        result[i] = moment.isMoment(values[i]) ? values[i].toISOString() : undefined;
                }
                else {
                    result[i] = values[i];
                }
            }
            return result;
        }
        else {
            return null;
        }
    }

    function prepareValuesForRestore(values: any) {
        let result = {};
        if (values) {
            for (let i in values) {
                const fieldSchema: IField | null = getFieldSchema(i);
                if (fieldSchema?.type === "FieldDateTime") {
                    const fieldDateTime: IDateTime = fieldSchema as IDateTime;
                    // if (fieldDateTime.dateTimeMode === FieldDateTime.DateTimeMode.year)
                    //     // FieldDateTime.getFieldValueForClientRender(props.mode,values[i], fieldDateTime.dateTimeMode );
                    //     result[i] = moment.isMoment(values[i]) ? (values[i] as moment.Moment).year() : undefined;
                    // else
                    //     result[i] = moment.isMoment(values[i]) ? values[i].toISOString() : undefined;
                    result[i] = getFieldValueForClientRender(props.mode, values[i], fieldDateTime.dateTimeMode);
                }
                else {
                    result[i] = values[i];
                }
            }
            return result;
        }
        else {
            return null;
        }
    }

    function getFieldSchema(name: string): IField | null {
        if (schema && schema.Fields) {
            for (let item of schema.Fields) {
                const field: IField = item;
                if (field.name === name) {
                    return field;
                }
            }
        }
        return null;
    }
})