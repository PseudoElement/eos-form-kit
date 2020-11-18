import React, { useImperativeHandle, useRef, useState } from 'react';
import { Button, Row, Col, Space, Typography, Divider } from "@eos/rc-controls";

/**Настройки компонента заголовка формы поиска. */
export interface IFormTitle {
    /**Текст заголовка. */
    title?: string;

    /**Скрыть кнопку "Очитить". */
    hideClearButton?: boolean;
    /**Скрыть кнопку "Скрыть". */
    hideCloseButton?: boolean;
    /**Скрыть кнопку "Применить". */
    hideSearchButton?: boolean;

    /**Переопределяет клик по кнопке "Очистить". */
    onClearClick?(event: any): void;
    /**Переопределяет клик по кнопке "Скрыть". */
    onCloseClick?(event: any): void;
    // /**Переопределяет клик по кнопке "Применить". */
    // onSearchClick?: Promise<void>;

    /**Текст кнопки "Очистить". */
    clearTitle?: string;
    /**Текст кнопки "Скрыть". */
    closeTitle?: string;
    /**Текст кнопки "Применить". */
    searchTitle?: string;
}

export interface IFormTitleApi {
    /**Деактивирует кнопку "Очистить". */
    disableClearButton(): void;
    /**Активирует кнопку "Очистить". */
    enableClearButton(): void;
    /**Деактивирует кнопку "Скрыть". */
    disableCloseButton(): void;
    /**Активирует кнопку "Скрыть". */
    enableCloseButton(): void;
    /**Деактивирует кнопку "Применить". */
    disableSearchButton(): void;
    /**Активирует кнопку "Применить". */
    enableSearchButton(): void;
}

// const AjaxClientForm = React.forwardRef<any, IAjaxClientForm>((props: IAjaxClientForm, ref) => {
/**Компонент заголовока формы поиска. */
const FormTitle = React.forwardRef<any, IFormTitle>((props: IFormTitle, ref: any) => {
    const DEFAULT_TITLE = "Поиск";
    const DEFAULT_CLEAR_TEXT = "Очистить";
    const DEFAULT_CLOSE_TEXT = "Скрыть";
    const DEFAULT_SEARCH_TEXT = "Применить";
    const { Paragraph } = Typography;

    const [clearDisabled, setClearDisabled] = useState(false);
    const [closeDisabled, setCloseDisabled] = useState(false);
    const [searchDisabled, setSearchDisabled] = useState(false);

    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, (): IFormTitleApi => {
        const api: IFormTitleApi = {
            disableClearButton() {
                setClearDisabled(true);
            },
            enableClearButton() {
                setClearDisabled(false);
            },
            disableCloseButton() {
                setCloseDisabled(true);
            },
            enableCloseButton() {
                setCloseDisabled(false);
            },
            disableSearchButton() {
                setSearchDisabled(true);
            },
            enableSearchButton() {
                setSearchDisabled(false);
            }
        }

        return api;
    });

    return (
        <React.Fragment>
            <Row align="middle" style={{ margin: "", flexWrap: "nowrap", height: 48, background: "#f5f5f5" }} gutter={[40, 0]}>
                <Col flex="auto" style={{ overflow: "hidden" }}>
                    <Paragraph ellipsis style={{ fontSize: "18px", color: "#646464", margin: 0 }}>{props.title ?? DEFAULT_TITLE}</Paragraph>
                </Col>
                <Col flex="0 0 auto">
                    <Space size="small" direction="horizontal">
                        <Button disabled={clearDisabled} onClick={props.onClearClick}>{props.clearTitle ?? DEFAULT_CLEAR_TEXT}</Button>
                        <Button disabled={closeDisabled} onClick={props.onCloseClick}>{props.closeTitle ?? DEFAULT_CLOSE_TEXT}</Button>
                        <Button disabled={searchDisabled} type="primary" htmlType="submit">{props.searchTitle ?? DEFAULT_SEARCH_TEXT}</Button>
                    </Space>
                </Col>
            </Row>
            <Divider style={{ margin: 0 }} />
        </React.Fragment>
    )
});
export default FormTitle;