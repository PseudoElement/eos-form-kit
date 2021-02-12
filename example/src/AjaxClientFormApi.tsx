import React, { forwardRef, FunctionComponent, useEffect, useImperativeHandle, useRef, useState } from 'react'


import "@eos/rc-controls/dist/main.css";
import { AjaxClientForm, FormMode, IToolBar, parseFormMode, EosMenu, EosTableTypes, useEosComponentsStore, EosMenuTypes, useBackUrlHistory } from "eos-webui-formgen";
import { Helper } from './Helper';
import { useRouteMatch } from 'react-router-dom';
import { SmartButton } from '@eos/rc-controls';

interface IPageParams {
    id?: string;
    mode?: string;
}

const AjaxClientFormApi: FunctionComponent = () => {
    const { addActionToStore, addConditionToStore } = useEosComponentsStore()
    const { pushPrevious } = useBackUrlHistory();
    addActionToStore("add", (handlerProps: EosTableTypes.IHandlerProps) => { alert(handlerProps.menuItem.key) })
    addActionToStore("disable", () => {
        menuRefApi.current?.setButtonDisabled("add")
        menuRefApi.current?.setButtonVisible("deletedVisible", true)
    })
    addActionToStore("edit", () => {
        menuRefApi.current?.setButtonDisabled("add", false)
        menuRefApi.current?.setButtonVisible("deletedVisible", false)
    })
    addConditionToStore("add", (handlerProps: EosTableTypes.IHandlerProps) => {
        const name = (handlerProps.refApi?.current as AjaxClientForm.IFormApi)?.getFieldsValue()["name"];
        return name === "Новое наименование"
    })

    const E_DOCUMENT_LABEL = "Для электронных документов";
    const { params } = useRouteMatch<IPageParams>();
    const mode: FormMode = parseFormMode(params.mode);
    const id: number | undefined = params?.id ? parseFloat(params?.id) : undefined;

    // const { setState } = useHistoryState();
    // useEffect(() => { setState("title", document.title) }, []);

    useEffect(() => {
        formApi?.current?.reloadItem();
    }, [id]);

    const dataService: AjaxClientForm.IDataService = {
        async getContextAsync(mode: FormMode) {
            const dispContext = {
                "Fields": Helper.getFields(FormMode.display, (path) => pushPrevious(path)),
                "Mode": FormMode.display,
                "Tabs": Helper.getTabs()
            };
            const editContext = {
                "Fields": Helper.getFields(FormMode.edit, (path) => pushPrevious(path)),
                "Mode": FormMode.edit,
                "Tabs": Helper.getTabs()
            };
            const newContext = {
                "Fields": Helper.getFields(FormMode.new, (path) => pushPrevious(path)),
                "Mode": FormMode.new,
                "Tabs": Helper.getTabs()
            };
            await Helper.sleepAsync(400);
            switch (mode) {
                case FormMode.edit:
                    return editContext;
                case FormMode.display:
                    return dispContext;
                case FormMode.new:
                default:
                    return newContext;
            }
        },
        async getInitialValuesAsync() {
            await Helper.sleepAsync(400);
            return Helper.getInitialValues(mode, id ?? 0);
        },
        getTitle: function () {
            return getTitle();
        }
    }

    const formApi = useRef<AjaxClientForm.IFormApi>();
    const buttonsPanelApi = useRef<IButtonsPanelApi>();
    const menuRefApi = useRef<EosMenuTypes.IEosMenuApi>()

    const toolbar: IToolBar = {
        children: <EosMenu ref={menuRefApi}
            menuItems={[{
                key: "add",
                render: {
                    renderType: "Icon",
                    renderArgs: {
                        iconName: "PlusIcon",
                        title: "Добавить",
                        type: "link"
                    }
                },
                handlers: [{
                    type: "onClick",
                    handlerName: "add"
                },
                {
                    type: "disabled",
                    handlerName: "add"
                }]
            },
            {
                key: "edit",
                render: {
                    renderType: "Icon",
                    renderArgs: {
                        iconName: "EditIcon"
                    }
                },
                title: "Редактировать",
                handlers: [{
                    type: "onClick",
                    handlerName: "edit"
                },
                {
                    type: "disabled",
                    handlerName: "edit"
                }]
            },
            {
                key: "diasble",
                render: {
                    renderType: "Icon",
                    renderArgs: {
                        iconName: "CancelIcon"
                    }
                },
                title: "Сделать неактивными поля",
                handlers: [{
                    type: "onClick",
                    handlerName: "disable"
                }]
            },
            {
                key: "deletedVisible",
                render: {
                    renderType: "CheckableButton",
                    renderArgs: {
                        iconName: "HideIcon",

                    }
                }, title: "Показать логически удаленные"
            },
            {
                key: "sub",
                render: {
                    renderType: "Icon",
                    renderArgs: {
                        iconName: "ProcessIcon"
                    }
                },
                children: [{
                    key: "child1",

                    render: {
                        renderType: "Button",
                        renderArgs: {
                            iconName: "PlusIcon",
                            titleButton: "ПОдменю",
                            typeButton: "link"
                        }
                    }
                }]
            }
            ]}
            refApi={formApi}
        ></EosMenu>
    }

    return (
        <React.Fragment>
            <ButtonsPanel
                ref={buttonsPanelApi}
                onEditTitleClick={() => { formApi?.current?.setTitle("Грузится"); setTimeout(() => { formApi?.current?.setTitle(getTitle()); }, 1500); }}
                onSkeletonLoadingClick={() => { formApi?.current?.showSkeletonLoading(); setTimeout(() => { formApi?.current?.hideLoading(); }, 1500); }}
                onSpinnerClick={() => { formApi?.current?.showSpinLoading(); setTimeout(() => { formApi?.current?.hideLoading(); }, 1500); }}
                onLookupSetClick={() => { formApi?.current?.setFieldValue("keepPeriod", { key: "2", value: "два" }); }}
                onNameSetClick={() => { formApi?.current?.setFieldValue("name", "Новое наименование"); }}
                onLookupMultiSetClick={() => { formApi?.current?.setFieldValue("multiLookup1", [{ key: "4", value: "четыре" }, { key: "3", value: "три" }]); }}
                onLookupMultiSetClick2={() => {
                    formApi?.current?.setFieldValue("multiLookup2", [{ key: "4", value: "четыре", other: [{ value: "тридцать семь", name: "secondColumn" }] },
                    { key: "3", value: "три", other: [{ value: "тридцать два", name: "secondColumn" }] }]);
                }}
                onLookupMultiRowSetClick={() => {
                    formApi?.current?.setFieldValue("multiLookupRow", [{ key: "4", value: "четыре", other: [{ value: "тридцать семь", name: "secondColumn" }] },
                    { key: "3", value: "три", other: [{ value: "тридцать два", name: "secondColumn" }] }]);
                }}
                onTripleSkeletonLoadingClick={() => {
                    formApi?.current?.showSkeletonLoading();
                    setTimeout(() => { formApi?.current?.hideLoading(); }, 3000);

                    setTimeout(() => {
                        formApi?.current?.showSkeletonLoading();
                        setTimeout(() => { formApi?.current?.hideLoading(); }, 3000);
                    }, 500);

                    setTimeout(() => {
                        formApi?.current?.showSkeletonLoading();
                        setTimeout(() => { formApi?.current?.hideLoading(); }, 3000);
                    }, 500);
                }}
                onReloadClick={() => { formApi?.current?.reload(); }}
                onReloadItemClick={() => { formApi?.current?.reloadItem(); }}
                onSetFiveCountClick={() => { formApi?.current?.setTabCount("0", 5); }}
                onClearCountClick={() => { formApi?.current?.setTabCount("0"); }}
                onSetZeroCountClick={() => { formApi?.current?.setTabCount("0", 0); }}
                onDisableFieldsClick={() => {
                    const fields = Helper.getFields(mode, (path) => pushPrevious(path));
                    for (let field of fields)
                        formApi?.current?.disableField(field.name);
                }}
                onEnableFieldsClick={() => {
                    const fields = Helper.getFields(mode, (path) => pushPrevious(path));
                    for (let field of fields)
                        formApi?.current?.enableField(field.name);
                }}
                onHideFieldsClick={() => {
                    formApi?.current?.hideField("ind");
                    formApi?.current?.hideField("name");
                }}
                onShowFieldsClick={() => {
                    formApi?.current?.showField("ind");
                    formApi?.current?.showField("name");
                }}
                onDisableTitleClick={() => { formApi?.current?.disableField("name2"); }}
                onEnableTitleClick={() => { formApi?.current?.enableField("name2"); }}
                onShowTitleClick={() => { formApi?.current?.showField("name2"); }}
                onHideTitleClick={() => { formApi?.current?.hideField("name2"); }}
                onSetRquiredTitleClick={() => { formApi?.current?.setRequiredField("name2"); }}
                onUnsetRquiredTitleClick={() => { formApi?.current?.unsetRequiredField("name2"); }}
                onSetRquiredFieldsClick={() => {
                    const fields = Helper.getFields(mode, (path) => pushPrevious(path));
                    for (let field of fields)
                        formApi?.current?.setRequiredField(field.name);
                }}
                onUnsetRquiredFieldsClick={() => {
                    const fields = Helper.getFields(mode, (path) => pushPrevious(path));
                    for (let field of fields)
                        formApi?.current?.unsetRequiredField(field.name);
                }}
            />
            <AjaxClientForm.Form
                toolbar={toolbar}
                ref={formApi}
                mode={mode}
                dataService={dataService}
                getResourceText={name => name}
                enableLeftIcon={true}
                leftIconTitle={E_DOCUMENT_LABEL}
                isHiddenLeftIcon={true}
                onValuesChange={(changedValues: any) => {
                    if (changedValues && changedValues.E_DOCUMENT !== undefined) {
                        if (changedValues.E_DOCUMENT === true) {
                            formApi?.current?.showLeftIcon();
                            formApi?.current?.disableField("ind");
                            formApi?.current?.disableField("name");
                            formApi?.current?.disableField("volumeNum");
                            formApi?.current?.disableField("keepCategory");
                            // const fields = Helper.getFields(FormMode.display);
                            // for (let field of fields)
                            //     formApi?.current?.disableField(field.name);
                        }
                        else {
                            formApi?.current?.hideLeftIcon();
                            formApi?.current?.enableField("ind");
                            formApi?.current?.enableField("name");
                            formApi?.current?.enableField("volumeNum");
                            formApi?.current?.enableField("keepCategory");
                            // const fields = Helper.getFields(FormMode.display);
                            // for (let field of fields)
                            //     formApi?.current?.enableField(field.name);
                        }
                    }
                }}
                onFinish={async (values: any) => {
                    console.log(values);
                    await Helper.sleepAsync(500);
                    formApi?.current?.hideLoading();
                }}
                onTabsChange={(activeKey: string) => {
                    buttonsPanelApi?.current?.setText(activeKey);
                }}
                disableEditButton={true}
                disableCloseButton={true}
                getCustomRow={(customType: string) => {
                    switch (customType) {
                        case "customFormRow":
                            return (<div>Произвольная строчка</div>);
                        default:
                            return undefined;
                    }
                }}
            />
        </React.Fragment >
    );

    function getTitle() {
        return `Форма ${id ?? ""}`;
    }

}

export default AjaxClientFormApi;

interface IButtonsPanel {
    onSkeletonLoadingClick?(): void;
    onTripleSkeletonLoadingClick?(): void;
    onSpinnerClick?(): void;
    onEditTitleClick?(): void;
    onLookupSetClick?(): void;
    onNameSetClick?(): void;
    onLookupMultiSetClick?(): void;
    onLookupMultiSetClick2?(): void;
    onLookupMultiRowSetClick?(): void;
    onReloadItemClick?(): void;
    onReloadClick?(): void;
    onSetFiveCountClick?(): void;
    onClearCountClick?(): void;
    onSetZeroCountClick?(): void;

    onDisableFieldsClick?(): void;
    onEnableFieldsClick?(): void;

    onHideFieldsClick?(): void;
    onShowFieldsClick?(): void;

    onDisableTitleClick?(): void;
    onEnableTitleClick?(): void;
    onShowTitleClick?(): void;
    onHideTitleClick?(): void;
    onSetRquiredTitleClick?(): void;
    onUnsetRquiredTitleClick?(): void;
    onSetRquiredFieldsClick?(): void;
    onUnsetRquiredFieldsClick?(): void;
}
interface IButtonsPanelApi {
    setText(text?: string): void;
}
// const ButtonsPanel: FunctionComponent<IButtonsPanel> = (props: IButtonsPanel) => {
const ButtonsPanel = forwardRef<any, IButtonsPanel>((props: IButtonsPanel, ref: any) => {
    const [text, setText] = useState("");

    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, () => {
        const api: IButtonsPanelApi = {
            setText(text?: string) {
                setText(text ?? "");
            }
        }
        return api;
    });

    return (<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>
            <SmartButton onClick={props.onSkeletonLoadingClick}>Скелетон</SmartButton>
            <SmartButton onClick={props.onTripleSkeletonLoadingClick}>3 скелетона</SmartButton>
            <SmartButton onClick={props.onSpinnerClick}>Спиннер</SmartButton>
            <SmartButton onClick={props.onEditTitleClick}>Заголовок</SmartButton>
            <SmartButton onClick={props.onLookupSetClick}>Задать срок хранения</SmartButton>
            <SmartButton onClick={props.onNameSetClick}>Задать наименование</SmartButton>
            <SmartButton onClick={props.onLookupMultiSetClick}>Задать особенности 1</SmartButton>
            <SmartButton onClick={props.onLookupMultiSetClick2}>Задать особенности 2</SmartButton>
            <SmartButton onClick={props.onLookupMultiRowSetClick}>Задать Мультилукап 2</SmartButton>
            <SmartButton onClick={props.onReloadItemClick}>ReloadItem</SmartButton>
            <SmartButton onClick={props.onReloadClick}>Reload</SmartButton>
            <SmartButton onClick={props.onSetFiveCountClick}>SetCount(5)</SmartButton>
            <SmartButton onClick={props.onClearCountClick}>SetCount(undefined)</SmartButton>
            <SmartButton onClick={props.onSetZeroCountClick}>SetCount(0)</SmartButton>
            <SmartButton onClick={props.onEnableFieldsClick}>Enable fields</SmartButton>
            <SmartButton onClick={props.onDisableFieldsClick}>Disable fields</SmartButton>
            <SmartButton onClick={props.onHideFieldsClick}>Hide fields</SmartButton>
            <SmartButton onClick={props.onShowFieldsClick}>Show fields</SmartButton>
            <SmartButton onClick={props.onDisableTitleClick}>Disable Title</SmartButton>
            <SmartButton onClick={props.onEnableTitleClick}>EnableTitle</SmartButton>
            <SmartButton onClick={props.onShowTitleClick}>Show Title</SmartButton>
            <SmartButton onClick={props.onHideTitleClick}>Hide Title</SmartButton>
            <SmartButton onClick={props.onSetRquiredTitleClick}>Set Rquired Title</SmartButton>
            <SmartButton onClick={props.onUnsetRquiredTitleClick}>Unset Rquired Title</SmartButton>
            <SmartButton onClick={props.onSetRquiredFieldsClick}>Set required fields</SmartButton>
            <SmartButton onClick={props.onUnsetRquiredFieldsClick}>Unset required fields</SmartButton>
        </div>
        <div>{text}</div>
    </div>);
});
