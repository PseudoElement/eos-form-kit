import { SmartButton, SmartCheckableButton } from "@eos/rc-controls";
import React, { useImperativeHandle, useMemo, useRef, useState } from "react";
import EosIcon from "./defaultRenders/EosIcon";
import { IEosMenuButtonApi, IEosMenuButtonProps } from "./types";

const ForvardEosMenuItem = React.forwardRef<any, IEosMenuButtonProps>(({ ...props }: IEosMenuButtonProps, ref: React.MutableRefObject<IEosMenuButtonApi>) => {
    const [disable, setDisable] = useState<boolean | undefined>(props.disabled)
    const [checkable, setCheckable] = useState<boolean | undefined>(props.checked)
    const [visible, setVisible] = useState<boolean | undefined>(props.visible)

    const currentRef = ref ?? useRef<IEosMenuButtonApi>()
    useImperativeHandle(currentRef, (): IEosMenuButtonApi => {
        const api: IEosMenuButtonApi = {
            setDisabled: setDisable,
            setChecked: setCheckable,
            setVisible: setVisible
        }
        return api;
    });

    return useMemo(() => {
        switch (props.renderType) {
            case "CheckableButton": {
                return <SmartCheckableButton
                    width={props.title ? undefined : 36}
                    onChange={props.onClickItem}
                    hidden={visible === false}
                    defaultChecked={checkable}
                    key={props.name}
                >
                    {<EosIcon renderArgs={{ iconName: props.iconName }} />}
                    {props.title}
                </SmartCheckableButton >
            }
            case "Icon": {
                return <SmartButton
                    width={36}
                    hidden={visible === false}
                    type={"link"}
                    onClick={props.onClickItem}
                    disabled={disable}
                    key={props.name}
                    icon={<EosIcon renderArgs={{ iconName: props.iconName }} />}>
                </SmartButton>
            }
            case "Button":
            default: {
                return <SmartButton
                    hidden={visible === false}
                    type={props.type}
                    onClick={props.onClickItem}
                    disabled={disable}
                    key={props.name}>
                    <EosIcon renderArgs={{ iconName: props.iconName }} />{props.title}
                </SmartButton>
            }
        }
    }, [disable, checkable, visible])
})

ForvardEosMenuItem.displayName = "EosMenuItem"

export { ForvardEosMenuItem }
