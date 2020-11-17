import React from 'react';
import { Input } from '@eos/rc-controls';
import { IOptionItem } from "./AjaxSelect";

export interface IDisplayInput {
    value?: IOptionItem;
}

const DisplayInput = React.forwardRef<any, IDisplayInput>(({value}, ref) => {
    return (
        <Input ref={ref}
            value={value?.value}
            readOnly={true}
            />
    );
});

export default DisplayInput;