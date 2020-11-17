import { IClientTabProps } from "./ClientForms/AjaxClientForm";
import { IClientTab, IClientTabs, IFieldsInfo } from "./ClientForms/ClientTabs";
import { CellType, IAutoCell, IThreeFieldsCell, IWidthCell } from "./ClientForms/FormCell";
import { FormMode } from "./ClientForms/FormMode";
import { CellsType, IFormRow } from "./ClientForms/FormRow";
import { ISelect } from "./Fields/FieldSelect";
import IField from "./Fields/IField";

export function createTabsComponent(schema: any, getResourceText: (name: string) => string, getCustomtab?: (tab: IClientTabProps) => IClientTab | undefined): IClientTabs {
    let fieldsInfo: IFieldsInfo[] = [];
    let tabsComponent: IClientTabs = { tabs: [], fields: fieldsInfo };
    if (schema && schema?.Tabs) {
        for (let i = 0; i < schema?.Tabs?.length; i++) {
            const tab = schema?.Tabs[i];
            if (tab.CustomType) {
                if (getCustomtab) {
                    const tabInfo: IClientTabProps = {
                        customType: tab.CustomType,
                        forceRender: tab.ForceRender,
                        title: tab.Title,
                        disabled: tab.Disabled,
                    };
                    const customTab = getCustomtab(tabInfo);
                    if (customTab)
                        tabsComponent?.tabs?.push(customTab);
                }
            }
            else {
                let tabFields: string[] = [];
                const rows: IFormRow[] = getTabRows(schema?.Mode, schema?.Fields, schema?.Tabs[i].Rows, tabFields, getResourceText);
                tabsComponent?.tabs?.push(
                    {
                        title: getResourceText(tab.Title),
                        disabled: tab.Disabled,
                        forceRender: tab.ForceRender,
                        key: i.toString(),
                        rows: rows
                    }
                );
                fieldsInfo.push({ tabKey: i.toString(), fields: tabFields });
            }
        }
    }
    return tabsComponent;
}

function getTabRows(mode: FormMode, fields: any, rows: any, tabFields: string[], getResourceText: (name: string) => string): IFormRow[] {
    if (!tabFields)
        tabFields = [];
    let formRows: IFormRow[] = [];
    if (fields && rows) {
        for (let row of rows) {
            let formRow: IFormRow = { cells: [] };
            if (row && row.Cells) {
                for (let cell of row.Cells) {
                    formRow?.cells?.push(getCell(mode, fields, cell, tabFields, getResourceText))
                }
            }
            formRows.push(formRow);
        }
    }
    return formRows;
}
function getCell(mode: FormMode, fields: any, cell: any, tabFields: string[], getResourceText: (name: string) => string): CellsType {
    let result: CellsType;
    let fieldNames: (string | undefined)[] = [];
    switch (cell.Type) {
        case CellType.threeFields:
            let threeFields: IThreeFieldsCell = {
                type: CellType.autoCell,
                leftField: convertToField(mode, getField(fields, cell.LeftField), getResourceText),
                middleText: cell.MiddleText,
                rightField: convertToField(mode, getField(fields, cell.LeftField), getResourceText),
                width: cell.Width
            }
            fieldNames = [threeFields?.leftField?.name, threeFields?.leftField?.name];
            result = threeFields;
        case CellType.autoCell:
            let autoCell: IAutoCell = {
                type: CellType.autoCell,
                fields: getFields(mode, fields, cell.Fields, getResourceText)
            }
            fieldNames = autoCell.fields?.map(field => field.name) || [];
            result = autoCell;
        case CellType.widthCell:
        default:
            let widthCell: IWidthCell = {
                type: CellType.widthCell,
                width: cell.Width,
                fields: getFields(mode, fields, cell.Fields, getResourceText)
            }
            fieldNames = widthCell.fields?.map(field => field.name) || [];
            result = widthCell;
    }
    fieldNames.forEach(fieldName => {
        if (fieldName != undefined)
            tabFields.push(fieldName);
    });
    return result;
}
function getFields(mode: FormMode, fields: any, fieldNames: string[], getResourceText: (name: string) => string): IField[] {
    let result: IField[] = [];
    for (let fieldName of fieldNames) {
        const field = getField(fields, fieldName);
        if (field)
            result.push(convertToField(mode, field, getResourceText));
    }
    return result;
}
function getField(fields: any, fieldName: string): any | undefined {
    if (fields && fieldName)
        for (let field of fields) {
            if (fieldName === field.name) {
                return field;
            }
        }
}

function convertToField(mode: FormMode, fieldSchema: any, getResourceText: (name: string) => string): IField {
    let field: IField = { ...fieldSchema };
    field.mode = field.disabled ? FormMode.display : mode;
    field.type = fieldSchema.type;
    field.label = getResourceText(fieldSchema.label);
    field.requiredMessage = fieldSchema.requiredMessage ? getResourceText(fieldSchema.requiredMessage) : undefined;

    switch (field.type) {
        case "FieldSelect":
            let fieldSelectProps: ISelect = field;
            if (fieldSelectProps.values) {
                for (let value of fieldSelectProps.values)
                    value.value = getResourceText(value.value);
            }
            break;
    }
    return field;
}