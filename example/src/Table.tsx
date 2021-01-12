import React from 'react'
import { EosTable, ITableProvider, EosTableTypes } from "eos-webui-formgen"
import { IHandlerProps } from '../../dist/EosTable/types'

const TableExample = () => {
    const provider = GetProvider()
    provider.fetchAction = (name: string) => {
        switch (name) {
            case "delete":
                return (handlerProps: IHandlerProps) => {
                    console.log(handlerProps)
                }
            default:
                return undefined
        }
    }
    return <div style={{ height: "calc(100vh - 48px)" }}><EosTable provider={provider} initTableState={{ maxSelectedRecords: 2 }} /></div>
}

const GetProvider = () => {
    const tableProvider: ITableProvider = {
        saveUserSetting: (userSettings: EosTableTypes.ITableUserSettings) => {
            return new Promise<void>(() => {
                console.log(userSettings)
            })
        },
        tableSettingLoad: () => {
            return new Promise((resolve) => {
                const setting: EosTableTypes.ITableSettings = {
                    tableId: "test",
                    typeName: "test",
                    typePluralName: "tests",
                    columns: [
                        {
                            name: "col1",
                            title: "Колонка 1",
                            fields: [{ displayName: "Колонка 1", apiField: "col1" }]
                        },
                        {
                            name: "col2",
                            title: "Колонка 2",
                            fields: [{ displayName: "Колонка 2", apiField: "col2" }]
                        },
                        {
                            name: "col3",
                            title: "Колонка 3",
                            columns: [{
                                name: "col3_1",
                                title: "Колонка 3_1",
                            },
                            {
                                name: "col3_2",
                                title: "Колонка 3_2",
                            }]
                        }
                    ],
                    keyFields: ["key"],
                    visual: {
                        dragable: true,
                        resizable: true,
                    },
                    menu: [{
                        key: "add",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "PlusIcon"                                
                            }
                        },
                        title: "Добавить"
                    },
                    {
                        key: "divider",
                        render: {
                            renderType: "Divider"
                        }
                    },
                    {
                        key: "edit",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "EditIcon"
                            }
                        },
                        title: "Редактирвать"
                    },
                    {
                        key: "SynchroIcon",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "SynchroIcon"
                            }
                        },
                        title: "Обновить"
                    },
                    {
                        key: "delete",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "BinIcon"
                            }
                        },
                        children: [
                            {
                                key: "delete1",
                                render: {
                                    renderType: "Icon",
                                    renderArgs: {
                                        iconName: "BinIcon"
                                    }
                                },
                                title: 'Удалить'
                            }
                        ],
                    },
                    {
                        key: "delete2",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "BinForeverIcon"
                            }
                        },
                        children: [
                            {
                                key: "delete21",
                                render: {
                                    renderType: "Icon",
                                    renderArgs: {
                                        iconName: "BinIcon"
                                    }
                                },
                                title: 'Удалить'
                            }
                        ],
                    },
                    {
                        key: "setting",
                        render: {
                            renderType: "Button",
                            renderArgs: {
                                iconName: "SettingsIcon",
                                title: "Настройки",
                                type: "link"
                            },
                        }
                    }],
                    rightMenu: [{
                        key: "ShowFilter",
                        render: {
                            renderType: "ShowFilter"
                        }
                    }],
                    contextMenu: [
                        {
                            key: "edit",
                            render: {
                                renderType: "Button",
                                renderArgs: {
                                    iconName: "EditIcon",
                                    titleButton: "Редактирвать",
                                    typeButton: "link"
                                }
                            },
                            handlers: [{
                                type: "onClick",
                                handlerName: "delete"
                            }]
                        },
                        {
                            key: "divider",
                            render: {
                                renderType: "Divider"
                            }
                        },
                        {
                            key: "delete",
                            render: {
                                renderType: "Button",
                                renderArgs: {
                                    iconName: "BinIcon",
                                    titleButton: "Удалить",
                                    typeButton: "link"
                                }
                            }

                        }],
                }
                return resolve(setting)
            })
        },
        tableUserSettingLoad: () => {
            return new Promise((resolve) => {
                const setting: EosTableTypes.ITableUserSettings = {
                    tableId: "test",
                    columns: [
                        {
                            name: "col1",
                            width: 300,
                            visible: true
                        },
                        {
                            name: "col2",
                            width: 440,
                            visible: true
                        },
                        {
                            name: "col3",
                            visible: true,
                            width: 600,
                            columns: [{
                                name: "col3_1",
                                visible: true,
                                width: 300
                            },
                            {
                                name: "col3_2",
                                visible: true,
                                width: 300
                            }]
                        }
                    ]
                }
                return resolve(setting)
            })

        },
        fetchData: () => {
            return new Promise((resolve) => {
                const data: EosTableTypes.ITableData = {
                    totalCount: 5,
                    records: [{
                        deleted: true,
                        "key": 1,
                        col1: "row 1",
                        col2: "row 2"
                    },
                    {
                        "key": 2,
                        col1: "row 2"
                    },
                    {
                        "key": 3,
                        col1: "row 3"
                    },
                    {
                        "key": 4,
                        col1: "row 4"
                    },
                    {
                        "key": 5,
                        col1: "row 5"
                    },
                    ]
                }
                return resolve(data)
            })
        },
        searchFormService: {
            async getContextAsync() {
                const newContext = {
                    "Fields": [
                        {
                            "label": "inventory:fieldNames.parentName",
                            "name": "parentName",
                            "required": false,
                            "requiredMessage": null,
                            "type": "FieldText",
                            "value": null,
                            "additionalText": null,
                            "allowClear": false,
                            "maxLength": null
                        }
                    ],
                    "Mode": 0,

                    "Rows": [{ "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }]

                };
                return newContext;
            }
        }
    }

    return tableProvider
}

export { TableExample }
