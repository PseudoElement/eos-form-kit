import React, { FunctionComponent } from 'react';
import { Button } from "eos-webui-controls";
import { useHistorySlim } from "eos-webui-formgen";



const TestPage: FunctionComponent = () => {
    const { pushPopPrevious } = useHistorySlim();

    return (<div>
        <Button htmlType="submit" onClick={()=>{pushPopPrevious("/arc/edit/1")}}>В редактирование</Button>
    </div>)
}
export default TestPage;