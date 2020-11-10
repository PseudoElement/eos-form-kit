import { Form } from "eos-webui-controls";
import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { IFieldSelect } from "../Fields/FieldSelect";
import IField from "../Fields/IField";
import ClientForm, { IClientFormApi, IToolBar } from "./ClientForm";
import { IClientTab, IClientTabs, IFieldsInfo } from "./ClientTabs";
import { CellType, IAutoCell, IThreeFieldsCell, IWidthCell } from "./FormCell";
import { FormMode } from "./FormMode";
import { CellsType, IFormRow } from "./FormRow";
import { Store } from 'rc-field-form/lib/interface';

// declare function getInitialValues3(): Promise<any>;

export interface IDataService {
    /**Подгружает настройки для генератора форм. */
    getContext(mode: FormMode): Promise<any>;
    getInitialValues?(): Promise<any>;
    getTitle(): string;
    // onSave?(data: Store, onSuccess: (data?: any) => void, onFailed: (err?: any) => void): void;
    onSave?(data: Store): Promise<void>;

    /**Кастомная валидация. Вызовется после основной валидации полей. */
    // onValidate?(data: Store, onSuccess: (data?: any) => void, onFailed: (err?: any) => void): void;
    onValidate?(data: Store): Promise<boolean>;
    /**Позволяет модифицировать контекст формы прямо перед отрисовкой формы. */
    modifyContext?(context: any): Promise<any>;
}

export interface IProps {
    /**Тип формы. */
    mode: FormMode;
    dataService: IDataService;
    getResourceText: (name: string) => string;
    onEditClick?: (event: any) => void;
    onCancelClick?: (event: any, mode: FormMode) => void;
    /**Метод для получения кастомной вкладки. */
    getCustomtab?: (tab: IClientTabProps) => IClientTab | undefined;
    /**Вызовется, когда будет подгружена схема формы с сервера. */
    onContextLoaded?(context: any): void;
    /**Тулбар с кнопками. */
    toolbar?: IToolBar;
    /**Метод вызовется когда нажали на кнопку "Сохранить". */
    onFinish?(data: Store): Promise<void>;
    onRendered?(): void;
    /**Вызовется, когда какое-то поле было изменено. */
    onFieldsWasModified?: (wasModified: boolean) => void;
}
export interface IClientTabProps {
    title?: string;
    forceRender?: boolean;
    customType?: string;
    disabled?: boolean;
}
/**API для работы с клиентской формой. */
export interface IAjaxClientFormApi {
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


interface IClientFormProps {
    mode?: FormMode;
    initialValues?: any;
    tabsComponent?: IClientTabs;
}

// const ClientForm = React.forwardRef<any, IClientForm>((props: IClientForm, ref) => {
// const AjaxClientForm: FunctionComponent<IProps> = (props: IProps) => {
const AjaxClientForm = React.forwardRef<any, IProps>((props: IProps, ref) => {
    const [schema, setSchema] = useState<any>(null);
    const [isFirstLoading, setFirstLoading] = useState(true);
    const [isSkeletonLoading, setSkeletonLoading] = useState(true);
    const [isSpinLoading, setSpinLoading] = useState(false);

    const [loadSchema, setLoadSchema] = useState(false);
    const [isLoadingSchema, setLoadingSchema] = useState(false);
    const [loadItem, setLoadItem] = useState(false);
    const [isLoadingItem, setLoadingItem] = useState(false);
    const [clientFormProps, setClientFormProps] = useState<IClientFormProps>({ mode: props.mode });

    useImperativeHandle(ref, (): IAjaxClientFormApi => {
        const api: IAjaxClientFormApi = {
            getActivatedTab() {
                return clientFormApi.current?.getActivatedTab() || "";
            },
            activateTab(key?: string) {
                if (key != undefined)
                    clientFormApi.current?.activateTab(key);
            },
            setTabTitle(key: string, title: string) {
                clientFormApi.current?.setTabTitle(key, title);
            },
            setTabCount(key: string, count?: number) {
                clientFormApi.current?.setTabCount(key, count);
            }
        }
        return api;
    });


    useLayoutEffect(() => {
        if (isLoadingSchema || isLoadingItem) {
            if (isFirstLoading) {
                setSkeletonLoading(true);
                setSpinLoading(false);
            }
            else {
                setSkeletonLoading(false);
                setSpinLoading(true);
            }
        }
        else {
            setSkeletonLoading(false);
            setSpinLoading(false);
            // setTimeout(() => {
            //     if (props.onRendered)
            //         props.onRendered();
            // }, 0);
            if (props.onRendered)
                props.onRendered();
        }

    }, [isFirstLoading, isLoadingSchema, isLoadingItem]);

    useEffect(() => {
        setLoadSchema(true);
    }, [props.mode]);

    const onLoadItemSucceeded = async function (data: any) {
        if (props.dataService.modifyContext) {
            await props.dataService.modifyContext(schema);
            setSchema({ ...schema });
        }
        setLoadingItem(false);
        setFirstLoading(false);
        const prps: IClientFormProps = {
            initialValues: data,
            mode: props.mode,
            tabsComponent: createTabsComponent(),
        };
        setClientFormProps(prps);
    };

    if (loadSchema) {
        loadSchemaAsync(props.mode);
    }
    if (loadItem) {
        loadItemAsync();
    }

    const [form] = Form.useForm();
    const formInst = React.createRef();
    const clientFormApi = useRef<IClientFormApi>();
    return (
        <ClientForm
            ref={clientFormApi}
            title={props.dataService.getTitle()}
            initialValues={clientFormProps.initialValues}
            formInst={formInst}
            form={form}
            mode={clientFormProps.mode}
            isSkeletonLoading={isSkeletonLoading}
            isSpinLoading={isSpinLoading}
            onEditClick={props.onEditClick}
            onCancelClick={props.onCancelClick}
            onFinish={onFinish}
            tabsComponent={clientFormProps.tabsComponent}
            toolbar={props.toolbar}
        />
    );

    async function loadSchemaAsync(mode: FormMode) {
        setLoadSchema(false);
        setLoadingSchema(true);
        const context = await props?.dataService?.getContext(mode);
        setSchema(context);
        if (props.onContextLoaded)
            props.onContextLoaded(context);
        setLoadItem(true);
        setLoadingSchema(false);
    }
    async function loadItemAsync() {
        setLoadItem(false);
        setLoadingItem(true);
        if (props.dataService.getInitialValues)
            props.dataService.getInitialValues()
                .then((initialValues: any) => {
                    onLoadItemSucceeded(initialValues);
                });
        else
            onLoadItemSucceeded({});

    }
    function createTabsComponent(): IClientTabs {
        let fieldsInfo: IFieldsInfo[] = [];
        let tabsComponent: IClientTabs = { tabs: [], fields: fieldsInfo };
        if (schema && schema?.Tabs) {
            for (let i = 0; i < schema?.Tabs?.length; i++) {
                const tab = schema?.Tabs[i];
                if (tab.CustomType) {
                    if (props.getCustomtab) {
                        const tabInfo: IClientTabProps = {
                            customType: tab.CustomType,
                            forceRender: tab.ForceRender,
                            title: tab.Title,
                            disabled: tab.Disabled,
                        };
                        const customTab = props.getCustomtab(tabInfo);
                        if (customTab)
                            tabsComponent?.tabs?.push(customTab);
                    }
                }
                else {
                    let tabFields: string[] = [];
                    const rows: IFormRow[] = getTabRows(schema?.Mode, schema?.Fields, schema?.Tabs[i].Rows, tabFields);
                    tabsComponent?.tabs?.push(
                        {
                            title: props.getResourceText(tab.Title),
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
    function getTabRows(mode: FormMode, fields: any, rows: any, tabFields: string[]): IFormRow[] {
        if (!tabFields)
            tabFields = [];
        let formRows: IFormRow[] = [];
        if (fields && rows) {
            for (let row of rows) {
                let formRow: IFormRow = { cells: [] };
                if (row && row.Cells) {
                    for (let cell of row.Cells) {
                        formRow?.cells?.push(getCell(mode, fields, cell, tabFields))
                    }
                }
                formRows.push(formRow);
            }
        }
        return formRows;
    }
    function getCell(mode: FormMode, fields: any, cell: any, tabFields: string[]): CellsType {
        let result: CellsType;
        let fieldNames: (string | undefined)[] = [];
        switch (cell.Type) {
            case CellType.threeFields:
                let threeFields: IThreeFieldsCell = {
                    type: CellType.autoCell,
                    leftField: convertToField(mode, getField(fields, cell.LeftField)),
                    middleText: cell.MiddleText,
                    rightField: convertToField(mode, getField(fields, cell.LeftField)),
                    width: cell.Width
                }
                fieldNames = [threeFields?.leftField?.name, threeFields?.leftField?.name];
                result = threeFields;
            case CellType.autoCell:
                let autoCell: IAutoCell = {
                    type: CellType.autoCell,
                    fields: getFields(mode, fields, cell.Fields)
                }
                fieldNames = autoCell.fields?.map(field => field.name) || [];
                result = autoCell;
            case CellType.widthCell:
            default:
                let widthCell: IWidthCell = {
                    type: CellType.widthCell,
                    width: cell.Width,
                    fields: getFields(mode, fields, cell.Fields)
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
    function getFields(mode: FormMode, fields: any, fieldNames: string[]): IField[] {
        let result: IField[] = [];
        for (let fieldName of fieldNames) {
            const field = getField(fields, fieldName);
            if (field)
                result.push(convertToField(mode, field));
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

    function convertToField(mode: FormMode, fieldSchema: any): IField {
        let field: IField = { ...fieldSchema };
        field.mode = field.disabled ? FormMode.display : mode;
        field.type = fieldSchema.type;
        field.label = props.getResourceText(fieldSchema.label);
        field.requiredMessage = fieldSchema.requiredMessage ? props.getResourceText(fieldSchema.requiredMessage) : undefined;

        switch (field.type) {
            case "FieldSelect":
                let fieldSelectProps: IFieldSelect = field;
                if (fieldSelectProps.values) {
                    for (let value of fieldSelectProps.values)
                        value.value = props.getResourceText(value.value);
                }
                break;
            // case "FieldLookup":

            //     break;
        }
        return field;
    }

    async function onFinish(values: Store) {
        setSpinLoading(true);
        if (props.dataService.onValidate) {
            const isValid = await props.dataService.onValidate(values);
            if (isValid) {
                await ExecuteOnFinish(values);
            }
            else {
                setSpinLoading(false);
            }
        }
        else {
            await ExecuteOnFinish(values);
        }
    }
    async function ExecuteOnFinish(values: Store) {
        if (props.dataService.onSave) {
            await props.dataService.onSave(values)
                .then(onSaveSucceeded)
                .catch(onSaveFailed);
        }
        if (props.onFinish)
            await props.onFinish(values)
                .then(onSaveSucceeded)
                .catch(onSaveFailed);
    }

    function onSaveSucceeded() {
        setSpinLoading(false);
    }
    function onSaveFailed() {
        setSpinLoading(false);
    }
})
export default AjaxClientForm;