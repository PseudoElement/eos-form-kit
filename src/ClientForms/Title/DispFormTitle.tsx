import { Button, CloseIcon, Col, Divider, EditIcon, Row, Space, Typography } from "@eos/rc-controls";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import TitleIcon, { ITitleIconApi } from "./TitleIcon";
import TitleText, { ITitleTextApi } from "./TitleText";
import { IFormTitleApi } from "./FormTitle";

/**API компонента отображения заголовка формы просмотра. */
export interface IDispFormTitleApi extends IFormTitleApi{ }

/**Настройки компонента отображения заголовка формы просмотра. */
export interface IDispFormTitle {
    title: string;
    onEditClick?: (event: any) => void;
    onCancelClick?: (event: any) => void;

    /**Включает отрисовку иконки @ перед наименованием. */
    enableLeftIcon?: boolean;
    /**При включенной отрисовке левой иконки @ перед наименование изначальная её скрытость. */
    isHiddenLeftIcon?: boolean;
    /**Текст по наведению на иконку @ перед наименованием */
    leftIconTitle?: string;
}

/**Компонент отображения заголовка формы просмотра. */
const DispFormTitle = forwardRef<any, IDispFormTitle>((props: IDispFormTitle, ref: any) => {
    const { Paragraph } = Typography;

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
        <div>
            <Row align="middle" style={{ margin: "", flexWrap: "nowrap", height: 48, background: "#f5f5f5" }} gutter={[40, 0]}>
                <Col flex="auto" style={{ overflow: "hidden" }}>
                    <Paragraph ellipsis style={{ margin: 0 }}>
                        <TitleIcon ref={titleIconApi} enableLeftIcon={props.enableLeftIcon} isHiddenLeftIcon={props.isHiddenLeftIcon} leftIconTitle={props.leftIconTitle} />
                        <TitleText ref={titleTextApi} title={props.title} />
                    </Paragraph>
                </Col>
                <Col flex="0 0 auto">
                    <Space size="small" direction="horizontal">
                        {/* {(<SimplePagination actionTarget={props.actionTarget} />)} */}
                        <Button onClick={props.onEditClick} type="link">
                            <EditIcon />
                        </Button>
                        <Button onClick={props.onCancelClick} type="link">
                            <CloseIcon />
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Divider style={{ margin: 0 }} />
        </div>
    );
});
export default DispFormTitle;
