import { Col, Divider, Row } from "@eos/rc-controls";
import React, { FunctionComponent, ReactNode } from "react";

/**Настройки компонента с кнопками формы. */
export interface IToolBar {
    /**
     * Разметка внутри тулбара.
     */
    children?: ReactNode;
}

/**Компонент с кнопками формы. */
const ToolBar: FunctionComponent<IToolBar> = (props: IToolBar) => {
    if (props?.children)
        return (
            <div>
                <Row style={{ height: 48, background: "#f5f5f5", padding: "0px 10px" }} >
                    <Col flex="auto">
                        {props?.children}
                    </Col>
                </Row>
                <Divider style={{ margin: 0 }} />
            </div>
        );
    else
        return (<div />);
}
export default ToolBar;