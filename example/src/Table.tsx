import React from 'react'
import { EosTable, ITableProvider, EosTableTypes } from "eos-webui-formgen"

const TableExample = () => {
    const provider = GetProvider()
    return <div style={{ height: "calc(100vh - 48px)" }}><EosTable provider={provider} /></div>
}

const GetProvider = () => {
    const tableProvider: ITableProvider = {
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
                        }
                    ],
                    keyFields: ["key"],
                    visual: {
                        dragable: true,
                        resizable: true,
                        isDifferentRow: true
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
                    }]
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
                    "Tabs": [
                        {
                            "ClassName": null,
                            "CustomType": null,
                            "Disabled": false,
                            "ForceRender": null,
                            "Rows": [{ "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }]
                        }]
                };
                return newContext;
            }
        }
    }

    return tableProvider
}

export { TableExample }
