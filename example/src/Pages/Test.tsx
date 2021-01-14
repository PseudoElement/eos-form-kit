import React, { FunctionComponent } from 'react';
import { SmartButton } from "eos-webui-controls";
import { useHistorySlim } from "eos-webui-formgen";



const TestPage: FunctionComponent = () => {
    const { pushPopPrevious } = useHistorySlim();

    return (<div>
        <SmartButton htmlType="submit" onClick={()=>{pushPopPrevious("/arc/edit/1")}}>В редактирование</SmartButton>
    </div>)
}
export default TestPage;