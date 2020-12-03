import { Badge, Tabs } from "@eos/rc-controls";
import React, { ReactElement, ReactText, useEffect, useImperativeHandle, useState } from "react";
import { IFormRow } from "./FormRow";
import FormRows from "./FormRows";

/**Настройки компонента вкладок. */
export interface IClientTabs {
    className?: string;
    tabBarStyle?: React.CSSProperties;
    defaultActiveKey?: string;
    tabs?: IClientTab[];
    onChange?: (activeKey: string) => void;
    onTabClick?: (key: string | number, e?: MouseEvent) => void;
    /**Если передать информацию о полях, то вкладка будет автоматически раскрываться, если в ней не валидное поле. */
    fields?: IFieldsInfo[];
    invalidFields?: any;
}
/**Настройки вкладки. */
export interface IClientTab {
    title?: string;
    key?: string;
    count?: number;
    forceRender?: boolean;
    children?: ReactElement | ReactElement[];
    disabled?: boolean;
    rows?: IFormRow[];
}

/**API для работы с компонентом вкладок. */
export interface IClientTabsApi {
    /**Возвращает ключ активной вкладки. */
    getActivatedTab(): string;
    /**
     * Делает вкладку активной.
     * @param key Ключ вкладки.
     */
    activateTab(key?: string): void;
    setTabTitle(key: string, title: string): void;
    setTabCount(key: string, count?: number): void;
    disableField(name: string): void;
    enableField(name: string): void;
}

/**Компонент вкладок. */
const ClientTabs = React.forwardRef<any, IClientTabs>((props: IClientTabs, ref) => {
    // const [formRows] = useState<any[]>([props?.tabs?.length || 0]);
    // const length = props?.tabs?.length || 0;
    // for (let i = 0; i < length; i++)
    //     formRows[i] = useRef<IFormRowsApi>();

    useImperativeHandle(ref, (): IClientTabsApi => {
        const api: IClientTabsApi = {
            getActivatedTab() {
                return activeKey;
            },
            activateTab(key?: string) {
                if (key != undefined)
                    setActiveKey(key);
            },
            setTabTitle(key: string, title: string) {
                if (tabs) {
                    const modifiedTabs = tabs.map(tab => tab);
                    for (let tab of modifiedTabs)
                        if (tab.key === key)
                            tab.title = title;
                    setModifiedTabs(modifiedTabs);
                }
            },
            setTabCount(key: string, count?: number) {
                if (tabs) {
                    const modifiedTabs = tabs.map(tab => tab);
                    for (let tab of modifiedTabs)
                        if (tab.key === key)
                            tab.count = count;
                    setModifiedTabs(modifiedTabs);
                }
            },
            disableField() {
                // if (formRows)
                //     for (let formRow of formRows) {
                //         const api: React.MutableRefObject<IFormRowsApi> = formRow;
                //         api?.current?.disableField(name);
                //     }
            },
            enableField() {
                // if (formRows)
                //     for (let formRow of formRows) {
                //         const api: React.MutableRefObject<IFormRowsApi> = formRow;
                //         api?.current?.enableField(name);
                //     }
            }
        }
        return api
    });

    const DEFAULT_ACTIVE_KEY = "0";
    const [tabs, setTabs] = useState<IClientTab[] | undefined>();
    const [modifiedTabs, setModifiedTabs] = useState<IClientTab[] | undefined>();
    const [activeKey, setActiveKey] = useState(props.defaultActiveKey ?? DEFAULT_ACTIVE_KEY);
    const [checkedActiveKey, setCheckedActiveKey] = useState(DEFAULT_ACTIVE_KEY);

    useEffect(() => {
        const firstTabkey = tabs && tabs.length > 0 ? tabs[0].key : DEFAULT_ACTIVE_KEY;
        let isEnabled = false;
        if (tabs && tabs.length)
            for (let tab of tabs) {
                if (tab.key === activeKey) {
                    isEnabled = !tab.disabled;
                    break;
                }
            }

        if (isEnabled) {
            setCheckedActiveKey(activeKey);
        }
        else {
            setCheckedActiveKey(firstTabkey ?? DEFAULT_ACTIVE_KEY);
        }
    }, [activeKey, tabs]);
    useEffect(() => {
        checkFields(props.invalidFields);
    }, [props.invalidFields])
    useEffect(() => {
        setTabs(props.tabs);
    }, [props.tabs]);
    useEffect(() => {
        if (modifiedTabs)
            setTabs(modifiedTabs);
    }, [modifiedTabs]);

    return (
        <Tabs
            style={{ width: "100%", background: "#fff" }}
            activeKey={checkedActiveKey}
            tabBarStyle={{ ...props.tabBarStyle, background: "#f5f5f5", padding: "0px 20px", margin: 0 }}
            onTabClick={(key: ReactText) => {
                if (key) {
                    const k = key.toString();
                    setCheckedActiveKey(k);
                    if (props.onTabClick)
                        props.onTabClick(k);
                }
            }}
            onChange={(activeKey: string) => {
                if (props.onChange)
                    props.onChange(activeKey);
            }}
        >
            {
                tabs && tabs.map(tab => {
                    return (
                        <Tabs.TabPane disabled={tab.disabled} forceRender={tab.forceRender}
                            tab={<Badge count={tab.count ? tab.count : undefined} type="text">{tab.title}</Badge>} key={tab.key} >
                            { tab.rows && <FormRows rows={tab.rows} />}
                            { tab.children}
                        </Tabs.TabPane>
                    )
                })
            }
        </Tabs>
    );

    function checkFields(values: any) {
        if (props.fields) {
            const error: IError = values;
            if (error && error.errorFields && error.errorFields.length > 0) {
                const invalidTabs = props.fields.filter((fieldsInfo: IFieldsInfo) => {
                    for (let fieldName of fieldsInfo.fields) {
                        for (let errorField of error.errorFields) {
                            if (errorField && errorField.name) {
                                for (let invalidFieldName of errorField.name) {
                                    if (fieldName === invalidFieldName)
                                        return true;
                                }
                            }
                        }
                    }
                    return false;
                });
                if (invalidTabs && invalidTabs.length > 0) {
                    setActiveKey(invalidTabs[0].tabKey);
                }
            }
        }
    }

});

export default ClientTabs;

/**Настройки полей внутри компонента вкладок. */
export interface IFieldsInfo {
    tabKey: string;
    fields: string[];
}

export interface IError {
    errorFields: IFieldError[];
}
export interface IFieldError {
    errors?: any[];
    name: string[];
}
