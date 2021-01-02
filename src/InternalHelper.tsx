import { IClientTabProps, IContext } from "./ClientForms/AjaxClientForm";
import { IClientTab, IClientTabs, IFieldsInfo } from "./ClientForms/ClientTabs";
import { CellType, IAutoCell, IThreeFieldsCell, IWidthCell, IWidthAutoCell } from "./ClientForms/FormCell";
import { FormMode } from "./ClientForms/FormMode";
import { CellsType, IFormRow } from "./ClientForms/FormRow";
import { IFormRows } from "./ClientForms/FormRows";
import { ISelect } from "./Fields/FieldSelect";
import { ICheckbox } from "./Fields/FieldCheckbox";
import IField from "./Fields/IField";

class InternalHelper {
    static createTabsComponent(schema: IContext, getResourceText: (name: string) => string, getCustomtab?: (tab: IClientTabProps) => IClientTab | undefined): IClientTabs {
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
                    const rows: IFormRow[] = this.getTabRows(schema?.Mode, schema?.Fields, schema?.Tabs[i].Rows, tabFields, getResourceText);
                    tabsComponent?.tabs?.push(
                        {
                            title: getResourceText(tab.Title),
                            disabled: tab.Disabled,
                            //  Есть бага в библиотеке компонентов. Если в другой вкладке находится обязательное поле и вызывается сабмит,
                            //  без захода на ту вкладку, то валидация выполнится. Поэтому для таких вкладок ставлю принудительную отрисовку.
                            // forceRender: tab.ForceRender,
                            forceRender: true,
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
    static createFormRows(schema: IContext, getResourceText: (name: string) => string): IFormRows {
        let result: IFormRows = {
            rows: this.getRows(schema?.Mode, schema?.Fields, schema?.Rows, getResourceText)
        };
        return result;
    }


    private static getTabRows(mode: FormMode, fields: any, rows: any, tabFields: string[], getResourceText: (name: string) => string): IFormRow[] {
        if (!tabFields)
            tabFields = [];
        let formRows: IFormRow[] = [];
        if (fields && rows) {
            for (let row of rows) {
                let formRow: IFormRow = { cells: [] };
                // formRow.title = row.Title;
                if (row) {
                    formRow.title = row.Title;
                    if (row.Cells)
                        for (let cell of row.Cells) {
                            formRow?.cells?.push(this.getCell(mode, fields, cell, tabFields, getResourceText))
                        }
                }
                formRows.push(formRow);
            }
        }
        return formRows;
    }
    private static getRows(mode: FormMode, fields: any, rows: any, getResourceText: (name: string) => string): IFormRow[] {
        let formRows: IFormRow[] = [];
        if (fields && rows) {
            for (let row of rows) {
                let formRow: IFormRow = { cells: [] };
                if (row) {
                    formRow.title = row.Title;
                    if (row.Cells)
                        for (let cell of row.Cells) {
                            formRow?.cells?.push(this.getCell(mode, fields, cell, null, getResourceText))
                        }
                }
                formRows.push(formRow);
            }
        }
        return formRows;
    }

    private static getCell(mode: FormMode, fields: any, cell: any, tabFields: string[] | null, getResourceText: (name: string) => string): CellsType {
        let result: CellsType;
        let fieldNames: (string | undefined)[] = [];
        switch (cell.Type) {
            case CellType.threeFields:
                let threeFields: IThreeFieldsCell = {
                    type: CellType.threeFields,
                    leftField: this.convertToField(mode, this.getField(fields, cell.LeftField), getResourceText),
                    middleText: cell.MiddleText,
                    rightField: this.convertToField(mode, this.getField(fields, cell.RightField), getResourceText),
                    width: cell.Width
                }
                fieldNames = [threeFields?.leftField?.name, threeFields?.leftField?.name];
                result = threeFields;
                break;
            case CellType.autoCell:
                let autoCell: IAutoCell = {
                    type: CellType.autoCell,
                    fields: this.getFields(mode, fields, cell.Fields, getResourceText)
                }
                fieldNames = autoCell.fields?.map(field => field.name) || [];
                result = autoCell;
                break;
            case CellType.widthAutoCell:
                // IWidthAutoCell 
                 let widthAutoCell: IWidthAutoCell = {
                    type: CellType.widthAutoCell,
                    width: cell.Width,
                    fields: this.getFields(mode, fields, cell.Fields, getResourceText)
                }
                fieldNames = widthAutoCell.fields?.map(field => field.name) || [];
                result = widthAutoCell;
                break;
            case CellType.widthCell:
            default:
                let widthCell: IWidthCell = {
                    type: CellType.widthCell,
                    width: cell.Width,
                    fields: this.getFields(mode, fields, cell.Fields, getResourceText)
                }
                fieldNames = widthCell.fields?.map(field => field.name) || [];
                result = widthCell;
                break;
        }
        if (tabFields)
            fieldNames.forEach(fieldName => {
                if (fieldName != undefined)
                    tabFields.push(fieldName);
            });
        return result;
    }
    private static getFields(mode: FormMode, fields: any, fieldNames: string[], getResourceText: (name: string) => string): IField[] {
        let result: IField[] = [];
        for (let fieldName of fieldNames) {
            const field = this.getField(fields, fieldName);
            if (field)
                result.push(this.convertToField(mode, field, getResourceText));
        }
        return result;
    }
    private static getField(fields: any, fieldName: string): any | undefined {
        if (fields && fieldName)
            for (let field of fields) {
                if (fieldName === field.name) {
                    return field;
                }
            }
    }
    private static convertToField(mode: FormMode, fieldSchema: any, getResourceText: (name: string) => string): IField {
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
            case "FieldCheckbox":
                let fieldCheckboxProps: ICheckbox = field;
                fieldCheckboxProps.description = getResourceText(fieldCheckboxProps.description ?? "");
                break;
        }
        return field;
    }
}
export { InternalHelper };