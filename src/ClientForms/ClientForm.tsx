import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Form as RcForm, Row, Col } from "@eos/rc-controls";
import { Store } from 'rc-field-form/lib/interface';
import { FormMode } from "./FormMode";
import ClientTabs, { IClientTabs, IClientTabsApi } from "./ClientTabs";
import SpinMaximized from "./SpinMaximized/SpinMaximized";
import Skeleton from "./Skeleton/Skeleton";
import FormRows, { IFormRows } from "./FormRows";
import FormTitle, { IFormTitleApi } from "./Title/FormTitle";
import ToolBar, {IToolBar} from "./ToolBar/ToolBar";

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
}

/**Клиентская форма. */
export const Form = forwardRef<any, IForm>((props: IForm, ref) => {
    const [wasModified, setWasModified] = useState(false);
    const [invalidFields, setInvalidFields] = useState<any>(null);

    const selfRef = useRef();

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
                formTitleApi?.current?.showLeftIcon();
            },
            hideLeftIcon() {
                formTitleApi?.current?.hideLeftIcon();
            },
            setTitle(title?: string) {
                formTitleApi?.current?.setTitle(title);
            }
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
        if (props.onInitialValuesChanged)
            props.onInitialValuesChanged(props.initialValues);
    }, [props.initialValues]);
    useEffect(() => {
        if (!isEnabledTab(clientTabsApi.current?.getActivatedTab() || "")) {
            const firstTab = props?.tabsComponent?.tabs && props?.tabsComponent?.tabs?.length > 0 ? props?.tabsComponent?.tabs[0] : null;
            if (firstTab)
                clientTabsApi.current?.activateTab(firstTab.key);
        }
    }, [props.mode]);

    const clientTabsProps: IClientTabs | null =
        props.tabsComponent
            ? {
                ...props.tabsComponent,
                defaultActiveKey: props.tabsComponent?.defaultActiveKey,
                invalidFields: invalidFields,
                onChange: (activeKey: string) => {
                    if (props.tabsComponent && props.tabsComponent.onChange)
                        props.tabsComponent.onChange(activeKey);
                }
            }
            : null;

    return (
        <SpinMaximized spinning={props.isSpinLoading}>
            <Row style={{ height: "100%" }} justify="center">
                <Col style={{ width: "800px", height: "100%", paddingTop: "20px" }}>
                    {props.isSkeletonLoading && <Skeleton />}
                    <RcForm form={props.form}
                        style={{ height: "100%" }}
                        ref={props.formInst}
                        name="basic" layout="vertical"
                        initialValues={props.initialValues}
                        onFinish={(values: Store) => {
                            if (props?.onFinish)
                                props?.onFinish(values);
                        }}
                        onFinishFailed={onFinishFailed}
                        onValuesChange={(changedValues: any, values: any) => {
                            setWasModified(true);
                            if (props.onValuesChange)
                                props.onValuesChange(changedValues, values);
                        }} >
                        {!props.disableHeader &&
                            <FormTitle
                                formTitle={props.formTitle}
                                mode={mode}
                                ref={formTitleApi}
                                title={props.title}
                                onCancelClick={(e) => onCancelClick(e)}
                                onEditClick={props.onEditClick}
                                enableLeftIcon={props.enableLeftIcon}
                                isHiddenLeftIcon={props.isHiddenLeftIcon}
                                leftIconTitle={props.leftIconTitle}
                            />}
                        <ToolBar {...props.toolbar}></ToolBar>
                        {clientTabsProps && <ClientTabs ref={clientTabsApi} {...clientTabsProps} />}
                        {props.rows && <FormRows rows={props?.rows?.rows} />}
                    </RcForm>
                </Col>
            </Row>
        </SpinMaximized>
    );
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
});

