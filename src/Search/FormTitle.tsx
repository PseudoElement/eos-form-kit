import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { SmartButton, Row, Col, Space, SmartTypography, Divider } from "@eos/rc-controls";

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


    /**Скрыть кнопку "Очитить". */
    disabledClearButton?: boolean;
    /**Скрыть кнопку "Скрыть". */
    disabledCloseButton?: boolean;
    /**Скрыть кнопку "Применить". */
    disabledSearchButton?: boolean;
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

/**Компонент заголовока формы поиска. */
const FormTitle = React.forwardRef<any, IFormTitle>((props: IFormTitle, ref: any) => {
    const DEFAULT_TITLE = "Поиск";
    const { Paragraph } = SmartTypography;

    const clearApi = useRef<IButtonApi>();
    const closeApi = useRef<IButtonApi>();
    const searchApi = useRef<IButtonApi>();

    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, (): IFormTitleApi => {
        const api: IFormTitleApi = {
            disableClearButton() {
                clearApi?.current?.disable();
            },
            enableClearButton() {
                clearApi?.current?.enable();
            },
            disableCloseButton() {
                closeApi?.current?.disable();
            },
            enableCloseButton() {
                closeApi?.current?.enable();
            },
            disableSearchButton() {
                searchApi?.current?.disable();
            },
            enableSearchButton() {
                searchApi?.current?.enable();
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
                        <ClearButton ref={clearApi} disabled={props.disabledClearButton} title={props.clearTitle} onClick={props.onClearClick} />
                        <CloseButton ref={closeApi} disabled={props.disabledCloseButton} title={props.closeTitle} onClick={props.onCloseClick} />
                        <SearchButton ref={searchApi} disabled={props.disabledSearchButton} title={props.searchTitle} />
                    </Space>
                </Col>
            </Row>
            <Divider style={{ margin: 0 }} />
        </React.Fragment>
    )
});
export default FormTitle;

interface IButtonApi {
    enable(): void;
    disable(): void;
    setTitle(value: string): void;
}
interface IButton {
    title?: string;
    disabled?: boolean;
    onClick?(event: any): void;
}

const ClearButton = React.forwardRef<any, IButton>((props: IButton, ref: any) => {
    const DEFAULT_TITLE = "Очистить";

    const [isDisabled, setDisabled] = useState(props.disabled);
    const [title, setTitle] = useState(props.title);
    const selfRef = useRef();

    useImperativeHandle(ref ?? selfRef, () => {
        const api: IButtonApi = {
            enable() {
                setDisabled(false);
            },
            disable() {
                setDisabled(true);
            },
            setTitle(value: string) {
                setTitle(value);
            }
        }
        return api;
    });

    useEffect(() => {
        setDisabled(props.disabled === true ? true : false);
    }, [props.disabled]);
    useEffect(() => {
        setTitle(props.title);
    }, [props.title]);

    return (
        <SmartButton disabled={isDisabled} onClick={props.onClick}>{title ?? DEFAULT_TITLE}</SmartButton>
    );
});
const CloseButton = React.forwardRef<any, IButton>((props: IButton, ref: any) => {
    const DEFAULT_TITLE = "Скрыть";

    const [isDisabled, setDisabled] = useState(props.disabled);
    const [title, setTitle] = useState(props.title);
    const selfRef = useRef();

    useImperativeHandle(ref ?? selfRef, () => {
        const api: IButtonApi = {
            enable() {
                setDisabled(false);
            },
            disable() {
                setDisabled(true);
            },
            setTitle(value: string) {
                setTitle(value);
            }
        }
        return api;
    });

    useEffect(() => {
        setDisabled(props.disabled === true ? true : false);
    }, [props.disabled]);
    useEffect(() => {
        setTitle(props.title);
    }, [props.title]);

    return (
        <SmartButton disabled={isDisabled} onClick={props.onClick}>{title ?? DEFAULT_TITLE}</SmartButton>
    );
});
const SearchButton = React.forwardRef<any, IButton>((props: IButton, ref: any) => {
    const DEFAULT_TITLE = "Применить";

    const [isDisabled, setDisabled] = useState(props.disabled);
    const [title, setTitle] = useState(props.title);
    const selfRef = useRef();

    useImperativeHandle(ref ?? selfRef, () => {
        const api: IButtonApi = {
            enable() {
                setDisabled(false);
            },
            disable() {
                setDisabled(true);
            },
            setTitle(value: string) {
                setTitle(value);
            }
        }
        return api;
    });

    useEffect(() => {
        setDisabled(props.disabled === true ? true : false);
    }, [props.disabled]);
    useEffect(() => {
        setTitle(props.title);
    }, [props.title]);

    return (
        <SmartButton type="primary" htmlType="submit" disabled={isDisabled} onClick={props.onClick}>{title ?? DEFAULT_TITLE}</SmartButton>
    );
});