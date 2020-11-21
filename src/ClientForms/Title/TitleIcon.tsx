import { EMailIcon } from "@eos/rc-controls";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";

/**API компонента отображения иконки перед наименование формы. */
export interface ITitleIconApi {
    /**Показывает иконку @. */
    show(): void;
    /**Скрывает иконку @. */
    hide(): void;
}

/**Настройки компонента отображения иконки перед наименование формы. */
export interface ITitleIcon {
    enableLeftIcon?: boolean;
    isHiddenLeftIcon?: boolean;
    leftIconTitle?: string;
}

/**Компонент отображения иконки перед наименование формы. */
const TitleIcon = forwardRef<any, ITitleIcon>((props: ITitleIcon, ref: any) => {
    const [isIconVisible, setIconVisible] = useState(props.isHiddenLeftIcon === true ? false : true);

    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, () => {
        const api: ITitleIconApi = {
            show() {
                if (props.enableLeftIcon)
                    setIconVisible(true);
            },
            hide() {
                if (props.enableLeftIcon)
                    setIconVisible(false);
            }
        }
        return api;
    });

    return (
        <React.Fragment>
            {props.enableLeftIcon &&
                <span title={props.leftIconTitle}>
                    <EMailIcon visibility={isIconVisible ? "visible" : "hidden"} width={24} color={"#D32F2F"} style={{ verticalAlign: "middle", marginRight: 5 }} />
                </span>
            }
        </React.Fragment>
    )
});
export default TitleIcon;