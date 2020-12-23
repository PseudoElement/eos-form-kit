import { SmartCheckableButton } from "@eos/rc-controls";
import React, { useImperativeHandle, useMemo, useRef, useState } from "react";
import { IEosMenuButtonApi, IEosMenuButtonProps } from "../types";
import EosIcon from "./EosIcon";

const EosMenuCheckableButton = React.forwardRef<any, IEosMenuButtonProps>(({ ...props }: IEosMenuButtonProps, ref: React.MutableRefObject<IEosMenuButtonApi>) => {
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

    return useMemo(() => <SmartCheckableButton onChange={props.onClickItem}
        hidden={visible === false}
        checked={checkable}
        key={props.name}
        icon={<EosIcon renderArgs={{ iconName: props.iconName }} />}>
        {props.title}
    </SmartCheckableButton>, [disable, checkable, visible])
})

EosMenuCheckableButton.displayName = "EosMenuCheckableButton"

export { EosMenuCheckableButton }
