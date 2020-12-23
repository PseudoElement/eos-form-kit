import { SmartButton } from "@eos/rc-controls";
import React, { useImperativeHandle, useMemo, useRef, useState } from "react";
import { IEosMenuButtonApi, IEosMenuButtonProps } from "../types";
import EosIcon from "./EosIcon";

const EosMenuButton = React.forwardRef<any, IEosMenuButtonProps>(({ ...props }: IEosMenuButtonProps, ref: React.MutableRefObject<IEosMenuButtonApi>) => {

    const currentRef = ref ?? useRef<IEosMenuButtonApi>()
    useImperativeHandle(currentRef, (): IEosMenuButtonApi => {
        const api: IEosMenuButtonApi = {
            setDisabled: setDisabled,
            setVisible: setVisible,
            setChecked: () => { }
        }
        return api;
    });

    const [disabled, setDisabled] = useState<boolean | undefined>(props.disabled)
    const [visible, setVisible] = useState<boolean | undefined>(props.visible)

    return useMemo(() => <SmartButton
        hidden={visible === false}
        type={props.type}
        onClick={props.onClickItem}
        disabled={disabled}
        key={props.name}
        icon={<EosIcon renderArgs={{ iconName: props.iconName }} />}>
        {props.title}
    </SmartButton>, [disabled, visible])
})
EosMenuButton.displayName = "EosMenuButton"

export { EosMenuButton }
