import { SmartButton, CloseIcon, Col, Divider, Row, Space, SmartTypography } from "@eos/rc-controls";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import TitleIcon, { ITitleIconApi } from "./TitleIcon";
import TitleText, { ITitleTextApi } from "./TitleText";
import { IFormTitleApi } from "./FormTitle";

/**API компонента отображения заголовка формы изменения. */
export interface IDispFormTitleApi extends IFormTitleApi { }

/**Настройки компонента отображения заголовка формы изменения. */
export interface IEditFormTitle {
    title: string;
    onCancelClick?: (event: any) => void;

    /**Включает отрисовку иконки @ перед наименованием. */
    enableLeftIcon?: boolean;
    /**При включенной отрисовке левой иконки @ перед наименование изначальная её скрытость. */
    isHiddenLeftIcon?: boolean;
    /**Текст по наведению на иконку @ перед наименованием */
    leftIconTitle?: string;

    /**Текст кнопки "Закрыть". */
    closeTitle?: string;
    /**Текст кнопки "Сохранить". */
    finishTitle?: string;
}

/**Компонент отображения заголовка формы изменения. */
const EditFormTitle = forwardRef<any, IEditFormTitle>((props: IEditFormTitle, ref: any) => {
    const SAVE_TEXT = "Сохранить";
    const { Paragraph } = SmartTypography;

    const selfRef = useRef();
    const titleIconApi = useRef<ITitleIconApi>();
    const titleTextApi = useRef<ITitleTextApi>();
    useImperativeHandle(ref ?? selfRef, () => {
        const api: IFormTitleApi = {
            showLeftIcon() {
                if (props.enableLeftIcon)
                    titleIconApi?.current?.show();
            },
            hideLeftIcon() {
                if (props.enableLeftIcon)
                    titleIconApi?.current?.hide();
            },
            setTitle(title?: string) {
                titleTextApi?.current?.setTitle(title ?? "");
            }
        }
        return api;
    });

    return (
        <React.Fragment>
            <Row align="middle" style={{ margin: "", flexWrap: "nowrap", height: 48, background: "#f5f5f5" }} gutter={[40, 0]}>
                <Col flex="auto" style={{ overflow: "hidden" }}>
                    <Paragraph ellipsis style={{ fontSize: "18px", color: "#646464", margin: 0 }}>
                        <TitleIcon
                            ref={titleIconApi}
                            enableLeftIcon={props.enableLeftIcon}
                            isHiddenLeftIcon={props.isHiddenLeftIcon}
                            leftIconTitle={props.leftIconTitle}
                        />
                        <TitleText ref={titleTextApi} title={props.title} />
                    </Paragraph>
                </Col>
                <Col flex="0 0 auto">
                    <Space size="small" direction="horizontal">
                        <SmartButton tooltip={props.finishTitle ?? SAVE_TEXT} type="primary" htmlType="submit">{props.finishTitle ?? SAVE_TEXT}</SmartButton>
                        <SmartButton tooltip={props.closeTitle} onClick={props.onCancelClick} type="link"><CloseIcon /></SmartButton>
                    </Space>
                </Col>
            </Row>
            <Divider style={{ margin: 0 }} />
        </React.Fragment>
    )
});
export default EditFormTitle;
