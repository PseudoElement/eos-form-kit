import React, { FunctionComponent } from 'react';
import { SmartButton } from "eos-webui-controls";
import { useBackUrlHistory, IHistorySlimItem } from "eos-webui-formgen";

const LookupPage: FunctionComponent = () => {
    const { toBack } = useBackUrlHistory();

    return (<div>
        <SmartButton htmlType="submit" onClick={()=>
            {
                const items: IHistorySlimItem = {
                    name: "LookupDialogResult",
                    value: { isnKeepPeriod: 'valueKeepPeriod', multiLookup1: 'valueMultiLookup1' }
                }
                toBack(items);            
                }}>Завершить выбор</SmartButton>
    </div>)
}
export default LookupPage;