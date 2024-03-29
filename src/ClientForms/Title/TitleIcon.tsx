import React, { forwardRef, FunctionComponent, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import Animate from "rc-animate";
import { EMailIcon } from "@eos/rc-controls";
import { FormContext } from "../../Context/Context";

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
    const context = useContext(FormContext);
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

    useEffect(() => {
        if (context.header) {
            if (context.header.isLeftIconVisible === true)
                setIconVisible(true);
            else if (context.header.isLeftIconVisible === false)
                setIconVisible(false);
            else
                setIconVisible(props.isHiddenLeftIcon === true ? false : true)
        }
        else {
            setIconVisible(props.isHiddenLeftIcon === true ? false : true)
        }
    }, [context, props.isHiddenLeftIcon]);

    return (
        <React.Fragment>
            {props.enableLeftIcon &&
                <span title={props.leftIconTitle}>
                    <Animate showProp="visibility" transitionName="fade">
                        <AnimatedEMailIcon key="1" visibility={isIconVisible} />
                    </Animate>
                </span>
            }
        </React.Fragment>
    )
});
export default TitleIcon;

interface IAnimatedEMailIcon {
    visible?: any;
    visibility?: boolean;
}
const AnimatedEMailIcon: FunctionComponent<IAnimatedEMailIcon> = (props: IAnimatedEMailIcon) => {
    return (<EMailIcon visibility={props.visibility ? "visible" : "hidden"} width={24} color={"#D32F2F"} style={{ verticalAlign: "middle", marginRight: 5 }} />
    );
}




