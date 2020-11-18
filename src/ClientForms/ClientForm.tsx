import React, { FunctionComponent, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button, Form as RcForm, Row, Col, Space, EditIcon, CloseIcon, Typography, Divider } from "@eos/rc-controls";
import { Store } from 'rc-field-form/lib/interface';
import { FormMode } from "./FormMode";
import ClientTabs, { IClientTabs, IClientTabsApi } from "./ClientTabs";
import SpinMaximized from "./SpinMaximized/SpinMaximized";
import Skeleton from "./Skeleton/Skeleton";

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
    title: string;
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

    /**Компонент вкладок */
    tabsComponent?: IClientTabs;

    /**Компонент заголовка формы. */
    formTitle?: ReactNode | ReactNode[];

    /**Обработчик события при изменении значений полей формы. */
    onValuesChange?(changedValues: any, values: any): void;
}
/**Настройки тулбары формы. */
export interface IToolBar {
    /**
     * Разметка внутри тулбара.
     */
    children?: ReactNode;
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

/**Клиентская форма. */
export const Form = React.forwardRef<any, IForm>((props: IForm, ref) => {
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
            }
        }
        return api;
    });

    const clientTabsApi = useRef<IClientTabsApi>();

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




    const clientTabsProps: IClientTabs = {
        ...props.tabsComponent,
        defaultActiveKey: props.tabsComponent?.defaultActiveKey,
        invalidFields: invalidFields,
        onChange: (activeKey: string) => {
            if (props.tabsComponent && props.tabsComponent.onChange)
                props.tabsComponent.onChange(activeKey);
        }
    };

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
                        {
                            props.formTitle ?
                                props.formTitle :
                                (
                                    mode === FormMode.display
                                        ? <DispFormTitle title={props.title} onCancelClick={(e) => onCancelClick(e)}
                                            onEditClick={props.onEditClick} />
                                        : <EditFormTitle title={props.title} onCancelClick={(e) => onCancelClick(e)} />)
                        }
                        <ToolBar {...props.toolbar}></ToolBar>
                        <ClientTabs ref={clientTabsApi} {...clientTabsProps} />
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
    // function getActiveTab(actionTarget: ActionTarget) {
    //     const activeKey = loadTab(actionTarget);
    //     if (activeKey !== DEFAULT_ACTIVE_KEY && isEnabledTab(activeKey))
    //         return activeKey;
    //     return DEFAULT_ACTIVE_KEY;
    // }
});


interface IEditFormTitle {
    title: string;
    onCancelClick?: (event: any) => void;
}
const EditFormTitle: FunctionComponent<IEditFormTitle> = (props: IEditFormTitle) => {
    const SAVE_TEXT = "Сохранить";
    const { Paragraph } = Typography;
    return (
        <React.Fragment>
            <Row align="middle" style={{ margin: "", flexWrap: "nowrap", height: 48, background: "#f5f5f5" }} gutter={[40, 0]}>
                <Col flex="auto" style={{ overflow: "hidden" }}>
                    <Paragraph ellipsis style={{ fontSize: "18px", color: "#646464", margin: 0 }}>{props.title}</Paragraph>
                </Col>
                <Col flex="0 0 auto">
                    <Space size="small" direction="horizontal">
                        <Button type="primary" htmlType="submit">{SAVE_TEXT}</Button>
                        <Button onClick={props.onCancelClick} type="link"><CloseIcon /></Button>
                    </Space>
                </Col>
            </Row>
            <Divider style={{ margin: 0 }} />
        </React.Fragment>
    )
}

interface IDispFormTitle {
    title: string;
    onEditClick?: (event: any) => void;
    onCancelClick?: (event: any) => void;
}
const DispFormTitle: FunctionComponent<IDispFormTitle> = (props: IDispFormTitle) => {
    const { Paragraph } = Typography;
    return (
        <div>
            <Row align="middle" style={{ margin: "", flexWrap: "nowrap", height: 48, background: "#f5f5f5" }} gutter={[40, 0]}>
                <Col flex="auto" style={{ overflow: "hidden" }}>
                    <Paragraph ellipsis style={{ fontSize: "18px", color: "#646464", margin: 0 }}>{props.title}</Paragraph>
                </Col>
                <Col flex="0 0 auto">
                    <Space size="small" direction="horizontal">
                        {/* {(<SimplePagination actionTarget={props.actionTarget} />)} */}
                        <Button onClick={props.onEditClick} type="link">
                            <EditIcon />
                        </Button>
                        <Button onClick={props.onCancelClick} type="link">
                            <CloseIcon />
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Divider style={{ margin: 0 }} />
        </div>
    );
}



const ToolBar: FunctionComponent<IToolBar> = (props: IToolBar) => {
    if (props?.children)
        return (
            <div>
                <Row style={{ height: 48, background: "#f5f5f5", padding: "0px 10px" }} >
                    <Col flex="auto">
                        {/* <Menu mode="horizontal" style={{ justifyContent: "flex-start" }}>
                    {props?.children}
                </Menu> */}
                        {props?.children}

                    </Col>
                </Row>
                <Divider style={{ margin: 0 }} />
            </div>
        );
    else
        return (<div />);
}