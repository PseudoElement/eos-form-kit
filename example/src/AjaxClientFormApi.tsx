import React, { forwardRef, FunctionComponent, useEffect, useImperativeHandle, useRef, useState } from 'react'


import "eos-webui-controls/dist/main.css";
import { AjaxClientForm, FormMode, parseFormMode } from "eos-webui-formgen";
import { Helper } from './Helper';
import { useRouteMatch } from 'react-router-dom';
import { Button } from '@eos/rc-controls';

interface IPageParams {
    id?: string;
    mode?: string;
}

const AjaxClientFormApi: FunctionComponent = () => {
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
                "Fields": Helper.getFields(FormMode.display),
                "Mode": FormMode.display,
                "Tabs": Helper.getTabs()
            };
            const editContext = {
                "Fields": Helper.getFields(FormMode.edit),
                "Mode": FormMode.edit,
                "Tabs": Helper.getTabs()
            };
            const newContext = {
                "Fields": Helper.getFields(FormMode.new),
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
                    const fields = Helper.getFields(mode);
                    for (let field of fields)
                        formApi?.current?.disableField(field.name);
                }}
                onEnableFieldsClick={() => {
                    const fields = Helper.getFields(mode);
                    for (let field of fields)
                        formApi?.current?.enableField(field.name);
                }}
            />
            <AjaxClientForm.Form
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
    onReloadItemClick?(): void;
    onReloadClick?(): void;
    onSetFiveCountClick?(): void;
    onClearCountClick?(): void;
    onSetZeroCountClick?(): void;

    onDisableFieldsClick?(): void;
    onEnableFieldsClick?(): void;
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
            <Button onClick={props.onSkeletonLoadingClick}>Скелетон</Button>
            <Button onClick={props.onTripleSkeletonLoadingClick}>3 скелетона</Button>
            <Button onClick={props.onSpinnerClick}>Спиннер</Button>
            <Button onClick={props.onEditTitleClick}>Заголовок</Button>
            <Button onClick={props.onLookupSetClick}>Задать срок хранения</Button>
            <Button onClick={props.onNameSetClick}>Задать наименование</Button>
            <Button onClick={props.onLookupMultiSetClick}>Задать особенности</Button>
            <Button onClick={props.onReloadItemClick}>ReloadItem</Button>
            <Button onClick={props.onReloadClick}>Reload</Button>
            <Button onClick={props.onSetFiveCountClick}>SetCount(5)</Button>
            <Button onClick={props.onClearCountClick}>SetCount(undefined)</Button>
            <Button onClick={props.onSetZeroCountClick}>SetCount(0)</Button>
            <Button onClick={props.onEnableFieldsClick}>Enable fields</Button>
            <Button onClick={props.onDisableFieldsClick}>Disable fields</Button>
        </div>
        <div>{text}</div>
    </div>);
});
