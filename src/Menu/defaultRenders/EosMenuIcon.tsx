import { SmartButton } from "@eos/rc-controls";
import React, { useImperativeHandle, useMemo, useRef, useState } from "react";
import { IEosMenuButtonApi, IEosMenuButtonProps } from "../types";
import EosIcon from "./EosIcon";

const EosMenuIcon = React.forwardRef<any, IEosMenuButtonProps>(({ ...props }: IEosMenuButtonProps, ref: React.MutableRefObject<IEosMenuButtonApi>) => {
    const currentRef = ref ?? useRef<IEosMenuButtonApi>()
    useImperativeHandle(currentRef, (): IEosMenuButtonApi => {
        const api: IEosMenuButtonApi = {
            setDisabled: (disabled) => {
                setDisabled(disabled)
            },
            setVisible: setVisible,
            setChecked: () => {}
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
    </SmartButton>, [disabled, visible])
})
EosMenuIcon.displayName = "EosMenuIcon"

export { EosMenuIcon }
