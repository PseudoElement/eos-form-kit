import React, { FunctionComponent, useEffect, useRef } from 'react'
import { useHistory } from "react-router-dom";

import "eos-webui-controls/dist/main.css";
import {
    AjaxClientForm, FormMode, parseFormMode, FieldCheckbox, FieldDateTime, FieldMultiText, AjaxSelect, useBackUrlHistory,
    useHistoryListener
} from "eos-webui-formgen";
// import { Helper } from '../Helper';
import { useRouteMatch } from 'react-router-dom';
import Fields from './Fields';

interface IPageParams {
    id?: string;
    mode?: string;
}

const ArcPage: FunctionComponent = () => {
    const history = useHistory();
    const { pushPopPrevious, pushPrevious } = useBackUrlHistory();
    const { params } = useRouteMatch<IPageParams>();
    const mode: FormMode = parseFormMode(params.mode);
    const id: number | undefined = params?.id ? parseFloat(params?.id) : undefined;
    useEffect(() => { formApi?.current?.reloadItem(); }, [id]);

    const dataService: AjaxClientForm.IDataService = {
        async getContextAsync(mode: FormMode) {
            return getContext(mode);
        },
        async getInitialValuesAsync() {
            // await Helper.sleepAsync(1000);
            return {};
        },
        getTitle: function () {
            switch (mode) {
                case FormMode.new:
                    return "Создание";
                case FormMode.edit:
                    return "Изменение";
                case FormMode.display:
                    return "Просмотр";
            }
        },
        async onSaveAsync() {
            if (mode === FormMode.new) {
                pushPrevious("/test");
                // await Helper.sleepAsync(1000);
                // history.push(`/arc/disp/${id}`);
            }
            else {
                pushPopPrevious(`/arc/disp/${id}`);
                // pushPrevious("/test");
            }
        }
    }

    const formApi = useRef<AjaxClientForm.IFormApi>();
    const { currentState } = useHistoryListener("activeKey");
    const { toBack } = useBackUrlHistory();

    return (
        <React.Fragment>
            <div>currentState={currentState ? "true" : "false"}</div>
            <AjaxClientForm.Form
                // initialShownForm={true}
                // stopAnimation={true}
                ref={formApi}
                mode={mode}
                dataService={dataService}
                getResourceText={name => name}
                enableLeftIcon={true}
                isHiddenLeftIcon={true}
                onCancelClick={() => {
                    // switch (mode) {
                    //     case FormMode.new:
                    //     case FormMode.edit:
                    //         history.push("/arc/disp/1");
                    //         history.push("/arc/disp/1");
                    //         break;
                    //     case FormMode.display:
                    //         history.push("/arc/disp/1");
                    //         break;

                    // }
                    toBack();
                }}
                onEditClick={() => {
                    history.push("/arc/edit/1");
                }}
                onValuesChange={(changedValues: any) => {
                    if (changedValues) {
                        if (changedValues[Fields.E_DOCUMENT] !== undefined) {
                            if (changedValues[Fields.E_DOCUMENT] === true) {
                                formApi?.current?.showLeftIcon();
                                formApi?.current?.disableField(Fields.SHEET_COUNT);
                                formApi?.current?.enableField(Fields.FILESIZE);
                            }
                            else {
                                formApi?.current?.hideLeftIcon();
                                formApi?.current?.enableField(Fields.SHEET_COUNT);
                                formApi?.current?.disableField(Fields.FILESIZE);
                            }
                        }

                    }
                }}
                closeTitle={"Закрыть1"}
                editTitle={"Изменить1"}
                finishTitle={"Сохранить1"}

            />
        </React.Fragment>
    );

    function getContext(mode: FormMode) {
        switch (mode) {
            case FormMode.new:
                return getNewContext();
            case FormMode.edit:
                return getEditContext();
            case FormMode.display:
                return getDispContext();
        }
    }

    function getNewContext() {
        const context: AjaxClientForm.IContext = {
            "Fields": [
                { type: "FieldText", name: Fields.ISN_CLS, label: "arc:fields.isnCls", disabled: true },
                {
                    type: "FieldLookup",
                    name: Fields.IND_CLS,
                    label: "arc:fields.indCls",
                    required: false,
                    requiredMessage: t("arc:errors.indCls"),
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService()
                },
                { type: "FieldText", name: Fields.IND_ORD, label: " ", maxLength: 24, required: false, requiredMessage: t("arc:errors.indOrd") },
                { type: "FieldDateTime", name: Fields.START_YEAR, label: "arc:fields.startYear", dateTimeMode: FieldDateTime.DateTimeMode.year, required: false, requiredMessage: t("arc:errors.startYear") } as FieldDateTime.IDateTime,
                { type: "FieldDateTime", name: Fields.END_YEAR, label: "arc:fields.endYear", dateTimeMode: FieldDateTime.DateTimeMode.year } as FieldDateTime.IDateTime,
                {
                    type: "FieldLookup",
                    name: Fields.ISN_TYPE_DOCUM,
                    label: "arc:fields.isnTypeDocum",
                    required: false,
                    requiredMessage: t("arc:errors.isnTypeDocum"),
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService()
                },
                { type: "FieldCheckbox", name: Fields.E_DOCUMENT, label: " ", description: "arc:fields.eDocument" } as FieldCheckbox.ICheckbox,
                {
                    type: "FieldLookup",
                    name: Fields.ISN_KEEP_CLAUSE,
                    label: "arc:fields.isnKeepClause",
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService(),
                    // valueProperty: "name",
                    // keyProperty: "isnKeepClause",
                    // onButtonClick: () => { pushPrevious("/lookupPage?f=isnKeepClause") }
                },
                {
                    type: "FieldLookup",
                    name: Fields.ISN_KEEP_PERIOD,
                    label: "arc:fields.isnKeepPeriod",
                    required: false,
                    requiredMessage: t("arc:errors.isnKeepPeriod"),
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataServiceIsnKeepPeriod(),
                    valueProperty: "name",
                    keyProperty: "isnKeepPeriod",
                    onButtonClick: () => { pushPrevious("/lookupPage?f=isnKeepPeriod") }
                },
                { type: "FieldMultiText", name: Fields.NAME, label: "arc:fields.name", rows: 3, maxLength: 2000, required: false, requiredMessage: t("arc:errors.name") } as FieldMultiText.IMultiText,
                { type: "FieldInteger", name: Fields.VOLUME_NUM, label: "arc:fields.volumeNum", showCounter: false, max: 999 },
                { type: "FieldInteger", name: Fields.PART_NUM, label: "arc:fields.partNum", showCounter: false, max: 999 },
                { type: "FieldInteger", name: Fields.SHEET_COUNT, label: "arc:fields.sheetCount", showCounter: false, max: 9999 },
                { type: "FieldInteger", name: Fields.FILESIZE, label: "arc:fields.filesize", showCounter: false },
                {
                    type: "FieldLookup",
                    name: Fields.ISN_SECURLEVEL,
                    label: "arc:fields.isnSecurLevel",
                    required: false,
                    requiredMessage: t("arc:errors.isnSecurLevel"),
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService()
                },
                { type: "FieldText", name: Fields.ARCHIVAL_CODE, label: "arc:fields.archivalCode", maxLength: 300 },
                { type: "FieldDateTime", name: Fields.MIN_DOC_DATE, label: "arc:fields.minDocDate" },
                { type: "FieldDateTime", name: Fields.MAX_DOC_DATE, label: "arc:fields.maxDocDate" },
                { type: "FieldDateTime", name: Fields.KEEP_BEFORE, label: "arc:fields.keepBefore" },
                { type: "FieldDateTime", name: Fields.DESTROY_DATE, label: "arc:fields.destroyDate" },
                { type: "FieldCheckbox", name: Fields.HAS_RESERVE_FUND, description: "arc:fields.hasReserveFund" } as FieldCheckbox.ICheckbox,
                { type: "FieldMultiText", name: Fields.NOTE, label: "arc:fields.note", rows: 3, maxLength: 2000 } as FieldMultiText.IMultiText,

                //  Вторая вкладка.
                { type: "FieldText", name: Fields.ISN_INVENTORY, label: "arc:fields.isnInventory", disabled: true },
                { type: "FieldText", name: Fields.INVENTORY_NUM1, label: "arc:fields.inventoryNum1", disabled: true, maxLength: 24 },
                { type: "FieldText", name: Fields.ISN_SUMINVENTORY, label: "arc:fields.isnSuminventory", disabled: true },
                { type: "FieldText", name: Fields.SUMINVENTORY_NUM, label: "arc:fields.suminventoryNum", disabled: true },
                { type: "FieldText", name: Fields.SUMINVENTORY_NUM2, label: " ", disabled: true },
                {
                    type: "FieldLookup",
                    name: Fields.ISN_ACT,
                    label: "arc:fields.isnAct",
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService()
                },
                { type: "FieldDateTime", name: Fields.ARH_ACT_ACT_DATE, label: "arc:fields.arhActActDate", disabled: true },
                { type: "FieldText", name: Fields.ARH_ACT_TYPE_NAME, label: "arc:fields.arhActTypeName", disabled: true },
                //  Третья вкладка.
                {
                    type: "FieldLookup",
                    name: Fields.ISN_LOCATION,
                    label: "arc:fields.isnLocation",
                    dataService: getDataService()
                },
            ],
            "Mode": FormMode.new,
            "Tabs": [
                {
                    "ClassName": null,
                    "CustomType": null,
                    "ForceRender": false,
                    "Disabled": false,
                    "Title": "tabs:main",
                    "Rows": [
                        { "Cells": [{ "Type": 0, "Fields": [Fields.ISN_CLS], "Width": 24 }] },
                        {
                            "Cells": [
                                { "Type": 2, "LeftField": Fields.IND_CLS, "MiddleText": "-", "RightField": Fields.IND_ORD, "Width": 12 },
                                { "Type": 0, "Fields": [Fields.START_YEAR], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.END_YEAR], "Width": 6 },
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_TYPE_DOCUM], "Width": 12 },
                                { "Type": 0, "Fields": [Fields.E_DOCUMENT], "Width": 12 },
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_KEEP_CLAUSE], "Width": 12 },
                                { "Type": 0, "Fields": [Fields.ISN_KEEP_PERIOD], "Width": 12 },
                            ]
                        },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.NAME], "Width": 24 }] },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.VOLUME_NUM], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.PART_NUM], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.SHEET_COUNT], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.FILESIZE], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.ISN_SECURLEVEL], "Width": 12 }
                            ]
                        },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.ARCHIVAL_CODE], "Width": 24 }] },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.MIN_DOC_DATE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.MAX_DOC_DATE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.KEEP_BEFORE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.DESTROY_DATE], "Width": 6 }
                            ]
                        },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.HAS_RESERVE_FUND], "Width": 24 }] },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.NOTE], "Width": 24 }] }
                    ]
                },
                {

                    "ClassName": null,
                    "CustomType": null,
                    "ForceRender": false,
                    "Disabled": false,
                    "Title": "tabs:accounting",
                    "Rows": [
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_INVENTORY], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.INVENTORY_NUM1], "Width": 6 }
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_SUMINVENTORY], "Width": 16 },
                                { "Type": 0, "Fields": [Fields.SUMINVENTORY_NUM], "Width": 4 },
                                { "Type": 0, "Fields": [Fields.SUMINVENTORY_NUM2], "Width": 4 }
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_ACT], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.ARH_ACT_ACT_DATE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.ARH_ACT_TYPE_NAME], "Width": 12 }
                            ]
                        }
                    ]
                },
                {
                    "ClassName": null,
                    "CustomType": null,
                    "ForceRender": false,
                    "Disabled": false,
                    "Title": "tabs:specifications",
                    "Rows": [
                        {
                            "Cells": [{ "Type": 0, "Fields": [Fields.ISN_LOCATION], "Width": 24 }]
                        }
                    ]
                }
            ]
        };
        return context;
    }
    function getEditContext() {
        const context: AjaxClientForm.IContext = {
            "Fields": [
                { type: "FieldText", name: Fields.ISN_CLS, label: "arc:fields.isnCls", disabled: true },
                {
                    type: "FieldLookup",
                    name: Fields.IND_CLS,
                    label: "arc:fields.indCls",
                    required: false,
                    requiredMessage: t("arc:errors.indCls"),
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService()
                },
                { type: "FieldText", name: Fields.IND_ORD, label: " ", maxLength: 24, required: false, requiredMessage: t("arc:errors.indOrd") },
                { type: "FieldDateTime", name: Fields.START_YEAR, label: "arc:fields.startYear", dateTimeMode: FieldDateTime.DateTimeMode.year, required: false, requiredMessage: t("arc:errors.startYear") } as FieldDateTime.IDateTime,
                { type: "FieldDateTime", name: Fields.END_YEAR, label: "arc:fields.endYear", dateTimeMode: FieldDateTime.DateTimeMode.year } as FieldDateTime.IDateTime,
                {
                    type: "FieldLookup",
                    name: Fields.ISN_TYPE_DOCUM,
                    label: "arc:fields.isnTypeDocum",
                    required: false,
                    requiredMessage: t("arc:errors.isnTypeDocum"),
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService()
                },
                { type: "FieldCheckbox", name: Fields.E_DOCUMENT, label: " ", description: "arc:fields.eDocument" } as FieldCheckbox.ICheckbox,
                {
                    type: "FieldLookup",
                    name: Fields.ISN_KEEP_CLAUSE,
                    label: "arc:fields.isnKeepClause",
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService(),
                    // valueProperty: "name",
                    // keyProperty: "isnKeepClause",
                    // onButtonClick: () => { pushPrevious("/lookupPage?f=isnKeepClause") }
                },
                {
                    type: "FieldLookup",
                    name: Fields.ISN_KEEP_PERIOD,
                    label: "arc:fields.isnKeepPeriod",
                    required: false,
                    requiredMessage: t("arc:errors.isnKeepPeriod"),
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataServiceIsnKeepPeriod(),
                    valueProperty: "name",
                    keyProperty: "isnKeepPeriod",
                    onButtonClick: () => { pushPrevious("/lookupPage?f=isnKeepPeriod") }
                },
                { type: "FieldMultiText", name: Fields.NAME, label: "arc:fields.name", rows: 3, maxLength: 2000, required: false, requiredMessage: t("arc:errors.name") } as FieldMultiText.IMultiText,
                { type: "FieldInteger", name: Fields.VOLUME_NUM, label: "arc:fields.volumeNum", showCounter: false, max: 999 },
                { type: "FieldInteger", name: Fields.PART_NUM, label: "arc:fields.partNum", showCounter: false, max: 999 },
                { type: "FieldInteger", name: Fields.SHEET_COUNT, label: "arc:fields.sheetCount", showCounter: false, max: 9999 },
                { type: "FieldInteger", name: Fields.FILESIZE, label: "arc:fields.filesize", showCounter: false },
                {
                    type: "FieldLookup",
                    name: Fields.ISN_SECURLEVEL,
                    label: "arc:fields.isnSecurLevel",
                    required: false,
                    requiredMessage: t("arc:errors.isnSecurLevel"),
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService(),
                    valueProperty: "name",
                    keyProperty: "isnKeepPeriod",
                    onButtonClick: () => { pushPrevious("/lookupPage?f=isnKeepPeriod") }
                },
                { type: "FieldText", name: Fields.ARCHIVAL_CODE, label: "arc:fields.archivalCode", maxLength: 300 },
                { type: "FieldDateTime", name: Fields.MIN_DOC_DATE, label: "arc:fields.minDocDate" },
                { type: "FieldDateTime", name: Fields.MAX_DOC_DATE, label: "arc:fields.maxDocDate" },
                { type: "FieldDateTime", name: Fields.KEEP_BEFORE, label: "arc:fields.keepBefore" },
                { type: "FieldDateTime", name: Fields.DESTROY_DATE, label: "arc:fields.destroyDate" },
                { type: "FieldCheckbox", name: Fields.HAS_RESERVE_FUND, description: "arc:fields.hasReserveFund" } as FieldCheckbox.ICheckbox,
                { type: "FieldMultiText", name: Fields.NOTE, label: "arc:fields.note", rows: 3, maxLength: 2000 } as FieldMultiText.IMultiText,

                //  Вторая вкладка.
                { type: "FieldText", name: Fields.ISN_INVENTORY, label: "arc:fields.isnInventory", disabled: true },
                { type: "FieldText", name: Fields.INVENTORY_NUM1, label: "arc:fields.inventoryNum1", disabled: true, maxLength: 24 },
                { type: "FieldText", name: Fields.ISN_SUMINVENTORY, label: "arc:fields.isnSuminventory", disabled: true },
                { type: "FieldText", name: Fields.SUMINVENTORY_NUM, label: "arc:fields.suminventoryNum", disabled: true },
                { type: "FieldText", name: Fields.SUMINVENTORY_NUM2, label: " ", disabled: true },
                {
                    type: "FieldLookup",
                    name: Fields.ISN_ACT,
                    label: "arc:fields.isnAct",
                    notFoundContent: t("ajaxSelect:notFoundContentDefaultText"),
                    dataService: getDataService()
                },
                { type: "FieldDateTime", name: Fields.ARH_ACT_ACT_DATE, label: "arc:fields.arhActActDate", disabled: true },
                { type: "FieldText", name: Fields.ARH_ACT_TYPE_NAME, label: "arc:fields.arhActTypeName", disabled: true },
                //  Третья вкладка.
                {
                    type: "FieldLookup",
                    name: Fields.ISN_LOCATION,
                    label: "arc:fields.isnLocation",
                    dataService: getDataService()
                },
            ],
            "Mode": FormMode.edit,
            "Tabs": [
                {
                    "ClassName": null,
                    "CustomType": null,
                    "ForceRender": false,
                    "Disabled": false,
                    "Title": "tabs:main",
                    "Rows": [
                        { "Cells": [{ "Type": 0, "Fields": [Fields.ISN_CLS], "Width": 24 }] },
                        {
                            "Cells": [
                                { "Type": 2, "LeftField": Fields.IND_CLS, "MiddleText": "-", "RightField": Fields.IND_ORD, "Width": 12 },
                                { "Type": 0, "Fields": [Fields.START_YEAR], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.END_YEAR], "Width": 6 },
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_TYPE_DOCUM], "Width": 12 },
                                { "Type": 0, "Fields": [Fields.E_DOCUMENT], "Width": 12 },
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_KEEP_CLAUSE], "Width": 12 },
                                { "Type": 0, "Fields": [Fields.ISN_KEEP_PERIOD], "Width": 12 },
                            ]
                        },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.NAME], "Width": 24 }] },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.VOLUME_NUM], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.PART_NUM], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.SHEET_COUNT], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.FILESIZE], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.ISN_SECURLEVEL], "Width": 12 }
                            ]
                        },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.ARCHIVAL_CODE], "Width": 24 }] },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.MIN_DOC_DATE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.MAX_DOC_DATE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.KEEP_BEFORE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.DESTROY_DATE], "Width": 6 }
                            ]
                        },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.HAS_RESERVE_FUND], "Width": 24 }] },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.NOTE], "Width": 24 }] }
                    ]
                },
                {

                    "ClassName": null,
                    "CustomType": null,
                    "ForceRender": false,
                    "Disabled": false,
                    "Title": "tabs:accounting",
                    "Rows": [
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_INVENTORY], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.INVENTORY_NUM1], "Width": 6 }
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_SUMINVENTORY], "Width": 16 },
                                { "Type": 0, "Fields": [Fields.SUMINVENTORY_NUM], "Width": 4 },
                                { "Type": 0, "Fields": [Fields.SUMINVENTORY_NUM2], "Width": 4 }
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_ACT], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.ARH_ACT_ACT_DATE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.ARH_ACT_TYPE_NAME], "Width": 12 }
                            ]
                        }
                    ]
                },
                {
                    "ClassName": null,
                    "CustomType": null,
                    "ForceRender": false,
                    "Disabled": true,
                    "Title": "tabs:specifications",
                    "Rows": [
                        {
                            "Cells": [{ "Type": 0, "Fields": [Fields.ISN_LOCATION], "Width": 24 }]
                        }
                    ]
                }
            ]
        };
        return context;
    }
    function getDispContext() {
        const context: AjaxClientForm.IContext = {
            "Fields": [
                { type: "FieldText", name: Fields.ISN_CLS, label: "arc:fields.isnCls" },
                { type: "FieldLookup", name: Fields.IND_CLS, label: "arc:fields.indCls" },
                { type: "FieldText", name: Fields.IND_ORD, label: " " },
                { type: "FieldDateTime", name: Fields.START_YEAR, label: "arc:fields.startYear", dateTimeMode: FieldDateTime.DateTimeMode.year } as FieldDateTime.IDateTime,
                { type: "FieldDateTime", name: Fields.END_YEAR, label: "arc:fields.endYear", dateTimeMode: FieldDateTime.DateTimeMode.year } as FieldDateTime.IDateTime,
                { type: "FieldLookup", name: Fields.ISN_TYPE_DOCUM, label: "arc:fields.isnTypeDocum" },
                { type: "FieldCheckbox", name: Fields.E_DOCUMENT, label: " ", description: "arc:fields.eDocument" } as FieldCheckbox.ICheckbox,
                { type: "FieldLookup", name: Fields.ISN_KEEP_CLAUSE, label: "arc:fields.isnKeepClause" },
                { type: "FieldLookup", name: Fields.ISN_KEEP_PERIOD, label: "arc:fields.isnKeepPeriod" },
                { type: "FieldMultiText", name: Fields.NAME, label: "arc:fields.name", rows: 3 } as FieldMultiText.IMultiText,
                { type: "FieldInteger", name: Fields.VOLUME_NUM, label: "arc:fields.volumeNum" },
                { type: "FieldInteger", name: Fields.PART_NUM, label: "arc:fields.partNum" },
                { type: "FieldInteger", name: Fields.SHEET_COUNT, label: "arc:fields.sheetCount" },
                { type: "FieldInteger", name: Fields.FILESIZE, label: "arc:fields.filesize" },
                { type: "FieldLookup", name: Fields.ISN_SECURLEVEL, label: "arc:fields.isnSecurLevel" },
                { type: "FieldText", name: Fields.ARCHIVAL_CODE, label: "arc:fields.archivalCode" },
                { type: "FieldDateTime", name: Fields.MIN_DOC_DATE, label: "arc:fields.minDocDate" },
                { type: "FieldDateTime", name: Fields.MAX_DOC_DATE, label: "arc:fields.maxDocDate" },
                { type: "FieldDateTime", name: Fields.KEEP_BEFORE, label: "arc:fields.keepBefore" },
                { type: "FieldDateTime", name: Fields.DESTROY_DATE, label: "arc:fields.destroyDate" },
                { type: "FieldCheckbox", name: Fields.HAS_RESERVE_FUND, description: "arc:fields.hasReserveFund" } as FieldCheckbox.ICheckbox,
                { type: "FieldMultiText", name: Fields.NOTE, label: "arc:fields.note", rows: 3, maxLength: 2000 } as FieldMultiText.IMultiText,
                { type: "FieldText", name: Fields.ISN_INVENTORY, label: "arc:fields.isnInventory" },
                { type: "FieldText", name: Fields.INVENTORY_NUM1, label: "arc:fields.inventoryNum1" },
                { type: "FieldText", name: Fields.ISN_SUMINVENTORY, label: "arc:fields.isnSuminventory" },
                { type: "FieldText", name: Fields.SUMINVENTORY_NUM, label: "arc:fields.suminventoryNum" },
                { type: "FieldText", name: Fields.SUMINVENTORY_NUM2, label: " " },
                { type: "FieldLookup", name: Fields.ISN_ACT, label: "arc:fields.isnAct" },
                { type: "FieldDateTime", name: Fields.ARH_ACT_ACT_DATE, label: "arc:fields.arhActActDate" },
                { type: "FieldText", name: Fields.ARH_ACT_TYPE_NAME, label: "arc:fields.arhActTypeName" },
                { type: "FieldText", name: Fields.ARH_ACT_TYPE_NAME, label: "arc:fields.arhActTypeName" },
                { type: "FieldLookup", name: Fields.ISN_LOCATION, label: "arc:fields.isnLocation" },

            ],
            "Mode": FormMode.display,
            "Tabs": [
                {
                    "ClassName": null,
                    "CustomType": null,
                    "ForceRender": false,
                    "Disabled": false,
                    "Title": "tabs:main",
                    "Rows": [
                        { "Cells": [{ "Type": 0, "Fields": [Fields.ISN_CLS], "Width": 24 }] },
                        {
                            "Cells": [
                                { "Type": 2, "LeftField": Fields.IND_CLS, "MiddleText": "-", "RightField": Fields.IND_ORD, "Width": 12 },
                                { "Type": 0, "Fields": [Fields.START_YEAR], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.END_YEAR], "Width": 6 },
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_TYPE_DOCUM], "Width": 12 },
                                { "Type": 0, "Fields": [Fields.E_DOCUMENT], "Width": 12 },
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_KEEP_CLAUSE], "Width": 12 },
                                { "Type": 0, "Fields": [Fields.ISN_KEEP_PERIOD], "Width": 12 },
                            ]
                        },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.NAME], "Width": 24 }] },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.VOLUME_NUM], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.PART_NUM], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.SHEET_COUNT], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.FILESIZE], "Width": 3 },
                                { "Type": 0, "Fields": [Fields.ISN_SECURLEVEL], "Width": 12 }
                            ]
                        },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.ARCHIVAL_CODE], "Width": 24 }] },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.MIN_DOC_DATE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.MAX_DOC_DATE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.KEEP_BEFORE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.DESTROY_DATE], "Width": 6 }
                            ]
                        },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.HAS_RESERVE_FUND], "Width": 24 }] },
                        { "Cells": [{ "Type": 0, "Fields": [Fields.NOTE], "Width": 24 }] }
                    ]
                },
                {

                    "ClassName": null,
                    "CustomType": null,
                    "ForceRender": false,
                    "Disabled": false,
                    "Title": "tabs:accounting",
                    "Rows": [
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_INVENTORY], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.INVENTORY_NUM1], "Width": 6 }
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_SUMINVENTORY], "Width": 16 },
                                { "Type": 0, "Fields": [Fields.SUMINVENTORY_NUM], "Width": 4 },
                                { "Type": 0, "Fields": [Fields.SUMINVENTORY_NUM2], "Width": 4 }
                            ]
                        },
                        {
                            "Cells": [
                                { "Type": 0, "Fields": [Fields.ISN_ACT], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.ARH_ACT_ACT_DATE], "Width": 6 },
                                { "Type": 0, "Fields": [Fields.ARH_ACT_TYPE_NAME], "Width": 12 }
                            ]
                        }
                    ]
                },
                {
                    "ClassName": null,
                    "CustomType": null,
                    "ForceRender": false,
                    "Disabled": false,
                    "Title": "tabs:specifications",
                    "Rows": [
                        {
                            "Cells": [{ "Type": 0, "Fields": [Fields.ISN_LOCATION], "Width": 24 }]
                        }
                    ]
                }
            ]
        };
        return context;
    }

    function getDataService() {
        return {
            loadDataAsync: async (search?: string) => {
                const result: AjaxSelect.IOptionItem[] = [
                    { key: "1", value: "один" },
                    { key: "2", value: "два" },
                    { key: "3", value: "три" },
                    { key: "4", value: "четыре" }
                ]
                if (search) {
                    return result.filter((item) => {
                        if (item && item.value && item?.value?.indexOf(search) >= 0) {
                            return true;
                        }
                        return false;
                    }) ?? [];
                }
                else {
                    return result;
                }
            },
            resultsAmount: 3
        };
    }

    function getDataServiceIsnKeepPeriod() {
        return {
            loadDataAsync: async (search?: string) => {
                const result: AjaxSelect.IOptionItem[] = [
                    { key: "1", value: "один" },
                    { key: "2", value: "два" },
                    { key: "3", value: "три" },
                    { key: "4", value: "четыре" }
                ]
                if (search) {
                    return result.filter((item) => {
                        if (item && item.value && item?.value?.indexOf(search) >= 0) {
                            return true;
                        }
                        return false;
                    }) ?? [];
                }
                else {
                    return result;
                }
            },
            loadData2Async: async () => {
                return [{
                    code: null,
                    deleted: false,
                    description: null,
                    isEpk: "N",
                    isFolder: 0,
                    isPersonal: "N",
                    isnKeepPeriod: 1,
                    keepYears: 1,
                    key: "1",
                    name: "1 год",
                    note: null,
                    protected: "N",
                    title: "1 год"
                }];
            },
            resultsAmount: 3
        };
    }

    // function getDataServiceIsnKeepClause() {
    //     return {
    //         loadDataAsync: async (search?: string) => {
    //             const result: AjaxSelect.IOptionItem[] = [
    //                 { key: "1", value: "один" },
    //                 { key: "2", value: "два" },
    //                 { key: "3", value: "три" },
    //                 { key: "4", value: "четыре" }
    //             ]
    //             if (search) {
    //                 return result.filter((item) => {
    //                     if (item && item.value && item?.value?.indexOf(search) >= 0) {
    //                         return true;
    //                     }
    //                     return false;
    //                 }) ?? [];
    //             }
    //             else {
    //                 return result;
    //             }
    //         },
    //         loadData2Async: async () => {
    //             return [{
    //                 code: null,
    //                 deleted: false,
    //                 description: null,
    //                 isEpk: "N",
    //                 isFolder: 0,
    //                 isPersonal: "N",
    //                 isnKeepClause: 1,
    //                 keepYears: 1,
    //                 key: "1",
    //                 name: "1 год",
    //                 note: null,
    //                 protected: "N",
    //                 title: "1 год"
    //             }];            
    //         },
    //         resultsAmount: 3
    //     };
    // }
    function t(value: string) { return value; }

}
export default ArcPage;