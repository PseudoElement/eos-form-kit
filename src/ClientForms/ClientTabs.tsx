import { Badge, Tabs } from "eos-webui-controls";
import React, { ReactElement, ReactText, useEffect, useImperativeHandle, useState } from "react";
import FormRow, { IFormRow } from "./FormRow";

export interface IClientTabs {
    className?: string;
    tabBarStyle?: React.CSSProperties;
    defaultActiveKey?: string;
    tabs?: IClientTab[];
    onChange?: (activeKey: string) => void;
    onTabClick?: (key: string | number, e?: MouseEvent) => void;
    fields?: IFieldsInfo[];
    invalidFields?: any;
}
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
}

/**Компонент вкладок. */
const ClientTabs = React.forwardRef<any, IClientTabs>((props: IClientTabs, ref) => {
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
            }
        }
        return api
    });

    const DEFAULT_ACTIVE_KEY = "0";
    const [tabs, setTabs] = useState<IClientTab[] | undefined>();
    const [modifiedTabs, setModifiedTabs] = useState<IClientTab[] | undefined>();
    const [activeKey, setActiveKey] = useState(props.defaultActiveKey ?? DEFAULT_ACTIVE_KEY);
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
    let key = 0;
    return (
        <Tabs
            style={{ width: "100%", background: "#fff" }}
            activeKey={activeKey}
            tabBarStyle={{ ...props.tabBarStyle, background: "#f5f5f5", padding: "0px 20px", margin: 0 }}
            onTabClick={(key: ReactText) => {
                if (key) {
                    const k = key.toString();
                    setActiveKey(k);
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
                            tab={<Badge count={tab.count} type="text">{tab.title}</Badge>} key={tab.key} >
                            {tab.rows &&
                                (
                                    <div style={{ padding: "20px 20px 0 20px" }}>
                                        {
                                            tab.rows.map(row => {
                                                return <FormRow key={key++} {...row} />
                                            })
                                        }
                                    </div>
                                )
                            }
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
