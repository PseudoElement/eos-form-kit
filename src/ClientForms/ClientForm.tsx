import React, {
    forwardRef, ReactElement, ReactNode, useCallback, useEffect, useImperativeHandle,
    useMemo,
    useRef, useState
} from "react";
import { Form as RcForm, Row, Col } from "@eos/rc-controls";
import { Store } from 'rc-field-form/lib/interface';
import { FormMode } from "./FormMode";
import ClientTabs, { IClientTabs, IClientTabsApi } from "./ClientTabs";
import SpinMaximized from "./SpinMaximized/SpinMaximized";
import Skeleton from "./Skeleton/Skeleton";
import FormRows, { IFormRows } from "./FormRows";
import FormTitle, { IFormTitleApi } from "./Title/FormTitle";
import ToolBar, { IToolBar } from "./ToolBar/ToolBar";
import Animate from "rc-animate";
import { FormContext, IFormContext, IField } from "../Context/Context";
import useHistoryWriter from "../Hooks/useHistoryState";
import useHistoryListener from "../Hooks/useHistoryListener";

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
    /**Показывает иконку @. */
    showLeftIcon(): void;
    /**Скрывает иконку @. */
    hideLeftIcon(): void;
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
    reset(): void;
    setDisabledMenuButton(disable: boolean, name: string): void
    setVisibleMenuButton(visible: boolean, name: string): void
}

/**Настройки клиентской формы. */
export interface IForm {
    /**Крутилка в виде спиннера. */
    isSpinLoading?: boolean;
    /**Крутилка в виде скелетона. */
    isSkeletonLoading?: boolean;

    /**
     * Дочерние элементы Tabs.Pane, которые будут внутри Tabs.
     */
    children?: ReactNode | ReactNode[];
    /**
     * Заголовок формы.
     */
    title?: string;
    /**
     * Значения формы по умоланию.
     */
    initialValues: any;
    onEditClick?: (event: any) => void;
    onCancelClick?: (event: any, mode: FormMode) => void;
    onFinish?: (values: Store) => void;
    onFinishFailed?: (errors: any) => void;
    onTabsChange?: (activeKey: string) => void;
    onInitialValuesChanged?: (newValues: any) => void;
    /**Вызовется, когда какое-то поле было изменено. */
    onFieldsWasModified?: (wasModified: boolean) => void;
    /**
     * Экземпляр формы, который надо определить как  const [formInst] = Form.useForm();
     */
    formInst?: any;
    form?: any;
    /**
     * Список вкладок и полей, чтобы происходило автоматическое раскрытие вкладки с невалидными полями.
     */
    // fields?: IFieldsInfo[];
    mode?: FormMode;
    /**
     * Тулбар с кнопками.
     */
    toolbar?: IToolBar;

    tabBarStyle?: any;

    /**Компонент вкладок. Можно не указывать, а передать rows. */
    tabsComponent?: IClientTabs;
    /**Список строк с полями, необходимо указывать, если нет вкладок. */
    rows?: IFormRows;
    /**Метод для получения кастомной строки с произвольной разметкой. */
    getCustomRow?: (customType: string) => ReactElement | ReactElement[] | undefined;

    /**Компонент заголовка формы. */
    formTitle?: ReactNode | ReactNode[];

    /**Обработчик события при изменении значений полей формы. */
    onValuesChange?(changedValues: any, values: any): void;

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
    /**true если не надо обрезать пробелы по краям для всех текстовых значений. */
    noTrimFieldValues?: boolean;
    /**
     * Показана ли форма по умолчанию.
     * Если false, то форма покажется только после скрытия скелетона.
     */
    initialShownForm?: boolean;

    /**Дополнительные кнопки между заголовком и кнопкой закрытия формы просмотра. */
    additionalDispFormTitleButtons?: ReactNode | ReactNode[];

    /**Текст кнопки "Закрыть". */
    closeTitle?: string;
    /**Текст кнопки "Сохранить". */
    finishTitle?: string;
    /**Текст кнопки "Изменить". */
    editTitle?: string;
}

/**Клиентская форма. */
export const Form = forwardRef<any, IForm>((props: IForm, ref) => {
    const [wasModified, setWasModified] = useState(false);
    const [invalidFields, setInvalidFields] = useState<any>(null);
    const [isFormVisible, setFormVisible] = useState<boolean>(props.initialShownForm ? true : false);
    const selfRcFormUseForm = RcForm.useForm();
    const selfRcFormRef = React.createRef();

    const rcFormForm = props.form ?? selfRcFormUseForm;
    const rcFormRef = props.formInst ?? selfRcFormRef;

    const [formContext, setFormContext] = useState<IFormContext>({
        setFieldValue(name: string, value?: any) {
            setFieldValue(name, value);
        },
        hideField: useCallback((name: string) => {
            if (!formContext.fields)
                formContext.fields = [];
            let field: IField | null = null;
            for (let i = 0; i < formContext.fields.length; i++) {
                if (formContext.fields[i].name === name) {
                    field = formContext.fields[i];
                    break;
                }
            }
            if (!field) {
                field = { name: name };
                formContext.fields.push(field);
            }
            field.hidden = true;
            setFormContext({ ...formContext });
        }, []),
        showField: useCallback((name: string) => {
            if (!formContext.fields)
                formContext.fields = [];
            let field: IField | null = null;
            for (let i = 0; i < formContext.fields.length; i++) {
                if (formContext.fields[i].name === name) {
                    field = formContext.fields[i];
                    break;
                }
            }
            if (!field) {
                field = { name: name };
                formContext.fields.push(field);
            }
            field.hidden = false;
            setFormContext({ ...formContext });
        }, []),
        disableField: useCallback((name: string) => {
            if (!formContext.fields)
                formContext.fields = [];
            let field: IField | null = null;
            for (let i = 0; i < formContext.fields.length; i++) {
                if (formContext.fields[i].name === name) {
                    field = formContext.fields[i];
                    break;
                }
            }
            if (!field) {
                field = { name: name };
                formContext.fields.push(field);
            }

            field.disabled = true;
            setFormContext({ ...formContext });

        }, []),
        enableField: useCallback((name: string) => {
            if (!formContext.fields)
                formContext.fields = [];
            let field: IField | null = null;
            for (let i = 0; i < formContext.fields.length; i++) {
                if (formContext.fields[i].name === name) {
                    field = formContext.fields[i];
                    break;
                }
            }
            if (!field) {
                field = { name: name };
                formContext.fields.push(field);
            }

            field.disabled = false;
            setFormContext({ ...formContext });

        }, []),
        reset: useCallback(() => {
            formContext.fields = [];
            formContext.header = undefined;
            formContext.menuButtons = [];
            setFormContext({ ...formContext });
        }, []),
        hideLeftIcon: useCallback(() => {
            if (!formContext.header)
                formContext.header = {};
            formContext.header.isLeftIconVisible = false;
            setFormContext({ ...formContext });
        }, []),
        showLeftIcon: useCallback(() => {
            if (!formContext.header)
                formContext.header = {};
            formContext.header.isLeftIconVisible = true;
            setFormContext({ ...formContext });
        }, []),
        setLeftIconTitle: useCallback((title?: string) => {
            if (!formContext.header)
                formContext.header = {};
            formContext.header.leftIconTitle = title;
            setFormContext({ ...formContext });
        }, []),
        setDisabledMenuButton: useCallback((disabled: boolean, name: string) => {
            let buttons = []
            if (formContext.menuButtons && formContext.menuButtons.length > 0) {
                buttons = [...formContext.menuButtons]
                const index = formContext.menuButtons.findIndex(item => item.name === name)
                if (index >= 0) {
                    buttons[index] = {
                        ...formContext.menuButtons[index],
                        disabled
                    }
                }
            }
            else {
                buttons = [{
                    name,
                    disabled
                }]
            }
            formContext.menuButtons = buttons
            setFormContext({ ...formContext });
        }, []),
        setVisibleMenuButton: useCallback((visible: boolean, name: string) => {
            let buttons = []
            if (formContext.menuButtons && formContext.menuButtons.length > 0) {
                buttons = [...formContext.menuButtons]
                const index = formContext.menuButtons.findIndex(item => item.name === name)
                if (index >= 0) {
                    buttons[index] = {
                        ...formContext.menuButtons[index],
                        visible
                    }
                }
            }
            else {
                buttons = [{
                    name,
                    visible
                }]
            }
            formContext.menuButtons = buttons
            setFormContext({ ...formContext });
        }, []),
        setCheckedMenuButton: useCallback((checked: boolean, name: string) => {
            let buttons = []
            if (formContext.menuButtons && formContext.menuButtons.length > 0) {
                buttons = [...formContext.menuButtons]
                const index = formContext.menuButtons.findIndex(item => item.name === name)
                if (index >= 0) {
                    buttons[index] = {
                        ...formContext.menuButtons[index],
                        checked
                    }
                }
            }
            else {
                buttons = [{
                    name,
                    checked
                }]
            }
            formContext.menuButtons = buttons
            setFormContext({ ...formContext });
        }, []),
    });

    const selfRef = useRef();
    const { setState } = useHistoryWriter();
    const { currentState } = useHistoryListener("activeKey");

    useImperativeHandle(ref ?? selfRef, (): IFormApi => {
        const api: IFormApi = {
            getActivatedTab() {
                return clientTabsApi.current?.getActivatedTab() || "";
            },
            activateTab(key?: string) {
                if (key != undefined)
                    clientTabsApi.current?.activateTab(key);
            },
            setTabTitle(key: string, title: string) {
                clientTabsApi.current?.setTabTitle(key, title);
            },
            setTabCount(key: string, count?: number) {
                clientTabsApi.current?.setTabCount(key, count);
            },
            showLeftIcon() {
                // formTitleApi?.current?.showLeftIcon();
                formContext.showLeftIcon();
            },
            hideLeftIcon() {
                // formTitleApi?.current?.hideLeftIcon();
                formContext.hideLeftIcon();
            },
            setTitle(title?: string) {
                formTitleApi?.current?.setTitle(title);
                // formContext.formTitle = title;
                // setFormContext({ ...formContext });
                // setWasModified(true);
            },
            setFieldValue(name: string, value?: any) {
                setFieldValue(name, value);;
            },
            disableField(name: string) {
                formContext.disableField(name);
                // formRowsApi?.current?.disableField(name);
                // clientTabsApi?.current?.disableField(name);
            },
            enableField(name: string) {
                formContext.enableField(name);
            },
            hideField(name: string) {
                formContext.hideField(name);
            },
            showField(name: string) {
                formContext.showField(name);
            },
            getFieldsValue(): Store {
                rcFormForm?.getFieldsValue();
                return rcFormForm?.getFieldsValue() || {};
            },
            reset() {
                formContext?.reset();
            },
            setDisabledMenuButton: formContext?.setDisabledMenuButton,
            setVisibleMenuButton: formContext?.setVisibleMenuButton
        }
        return api;
    });

    const clientTabsApi = useRef<IClientTabsApi>();
    const formTitleApi = useRef<IFormTitleApi>();

    const mode = props.mode ?? FormMode.new;

    useEffect(() => {
        if (props.onFieldsWasModified)
            props.onFieldsWasModified(wasModified);
    }, [wasModified]);
    useEffect(() => {
        props?.form?.setFieldsValue(props.initialValues);
        // setInitialValues(props.initialValues);
        if (props.onInitialValuesChanged)
            props.onInitialValuesChanged(props.initialValues);
        setWasModified(false);
    }, [props.initialValues]);
    useEffect(() => {
        if (!isEnabledTab(clientTabsApi.current?.getActivatedTab() || "")) {
            const firstTab = props?.tabsComponent?.tabs && props?.tabsComponent?.tabs?.length > 0 ? props?.tabsComponent?.tabs[0] : null;
            if (firstTab)
                clientTabsApi.current?.activateTab(firstTab.key);
        }
        setWasModified(false);
    }, [props.mode]);


    const memoizedForm = useMemo(() => {
        return (
                <RcForm
                    form={rcFormForm}
                    ref={rcFormRef}
                    // style={{ height: "100%", display: rcFormDisplayStyle }}
                    style={{ height: "100%" }}
                    name="basic" layout="vertical"
                    initialValues={props.initialValues}
                    onFinish={(values: Store) => {
                        let formValues: Store;
                        if (props.noTrimFieldValues)
                            formValues = values;
                        else
                            formValues = trim(values);

                        if (props?.onFinish)
                            props?.onFinish(formValues);
                    }}
                    onFinishFailed={onFinishFailed}
                    onValuesChange={(changedValues: any, values: any) => {
                        setWasModified(true);
                        if (props.onValuesChange)
                            props.onValuesChange(changedValues, values);
                    }} >
                    {!props.disableHeader &&
                        <FormTitle
                            ref={formTitleApi}
                            formTitle={props.formTitle}
                            mode={mode}
                            title={props.title}
                            onCancelClick={(e) => onCancelClick(e)}
                            onEditClick={props.onEditClick}
                            enableLeftIcon={props.enableLeftIcon}
                            isHiddenLeftIcon={props.isHiddenLeftIcon}
                            leftIconTitle={props.leftIconTitle}
                            disableEditButton={props.disableEditButton}
                            disableCloseButton={props.disableCloseButton}
                            additionalDispFormTitleButtons={props.additionalDispFormTitleButtons}
                            closeTitle={props.closeTitle}
                            finishTitle={props.finishTitle}
                            editTitle={props.editTitle}
                        />}
                    <ToolBar {...props.toolbar}></ToolBar>
                    <ClientTabs ref={clientTabsApi}
                        className={props?.tabsComponent?.className}
                        tabBarStyle={props?.tabsComponent?.tabBarStyle}
                        defaultActiveKey={currentState ?? props.tabsComponent?.defaultActiveKey}
                        tabs={props?.tabsComponent?.tabs}
                        fields={props?.tabsComponent?.fields}
                        invalidFields={invalidFields}
                        onChange={(activeKey: string) => {
                            setState("activeKey", activeKey);
                            if (props.tabsComponent && props.tabsComponent.onChange)
                                props.tabsComponent.onChange(activeKey);
                            if (props.onTabsChange)
                                props.onTabsChange(activeKey);
                        }}
                        getCustomRow={props.getCustomRow}
                    />
                    {props.rows && <FormRows rows={props?.rows?.rows} getCustomRow={props.getCustomRow} />}
                </RcForm>
        );
    }, [props.initialValues, mode]);

    const memoizedElements = useMemo(() => {
        return (
            <SpinMaximized spinning={props.isSpinLoading}>
                <Row style={{ height: "100%" }} justify="center">
                    <Col style={{ width: "800px", height: "100%", paddingTop: "20px" }}>
                        <Animate showProp="visible" transitionName="fade"
                            onEnd={() => {
                                // setRcFormDisplayStyle(props.isSkeletonLoading ? "none" : "");
                                setFormVisible(props.isSkeletonLoading ? false : true);
                            }}>
                            <Skeleton visible={props.isSkeletonLoading} />
                        </Animate>
                        {isFormVisible && memoizedForm}
                    </Col>
                </Row>
            </SpinMaximized>
        );
    }, [props.isSkeletonLoading, props.isSpinLoading, isFormVisible, props.initialValues, mode]);
    // }, [props.isSkeletonLoading, props.isSpinLoading]);

    return (<FormContext.Provider value={formContext}>{memoizedElements}</FormContext.Provider>);

    function onCancelClick(e: Event) {
        if (mode !== FormMode.edit) {
            // saveTab(actionTarget, DEFAULT_ACTIVE_KEY);
        }
        if (props.onCancelClick)
            props.onCancelClick(e, mode);
    }
    function onFinishFailed(values: any) {
        setInvalidFields(values);
        if (props.onFinishFailed)
            props.onFinishFailed(values);
    }
    function isEnabledTab(activeKey?: string) {
        if (activeKey != undefined && props.tabsComponent && props.tabsComponent.tabs && props.tabsComponent.tabs.length > 0) {
            for (let tab of props.tabsComponent.tabs) {
                if (tab.key === activeKey && tab.disabled !== true) {
                    return true;
                }
            }
        }
        return false;
    }
    function trim(values: Store) {
        if (values) {
            let newValues = { ...values };
            for (let i in newValues) {
                if (newValues[i] && Object.prototype.toString.call(newValues[i]) === "[object String]")
                    newValues[i] = newValues[i].trim();
            }
            return newValues;
        }
        return values;
    }

    function setFieldValue(name: string, value?: any) {
        const { ...fieldValues } = rcFormForm?.getFieldsValue();
        fieldValues[name] = value;
        rcFormForm?.setFieldsValue(fieldValues);
    }
});
