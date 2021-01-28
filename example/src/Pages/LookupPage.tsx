import React, { FunctionComponent } from 'react';
import { SmartButton } from "eos-webui-controls";
import { useBackUrlHistory, IHistorySlimItem } from "eos-webui-formgen";

const LookupPage: FunctionComponent = () => {
    const { toBack } = useBackUrlHistory();


    const isnKeepClause = [{
        code: null,
        deleted: false,
        description: null,
        isEpk: "N",
        isFolder: 0,
        isPersonal: "N",
        isnKeepClause: 1,
        keepYears: 1,
        key: "1",
        name: "1 год",
        note: null,
        protected: "N",
        title: "1 год",
        data: {
            code: null,
            deleted: "N",
            isEpk: "N",
            isPersonal: "N",
            isnKeepClause: 1,
            keepYears: 1,
            name: "1 год",
            note: null,
            protected: "N"
        }
    }];
    const isnKeepPeriod = [{
        code: null,
        deleted: false,
        description: null,
        isEpk: "N",
        isFolder: 0,
        isPersonal: "N",
        isnKeepPeriod: 1,
        keepYears: 1,
        key: "1",
        name: "1 год",
        note: null,
        protected: "N",
        title: "1 год",
        data: {
            code: null,
            deleted: "N",
            isEpk: "N",
            isPersonal: "N",
            isnKeepPeriod: 1,
            keepYears: 1,
            name: "1 год",
            note: null,
            protected: "N"
        }
    }];
    const multiLookup1 = [{
        code: null,
        deleted: false,
        description: null,
        isEpk: "N",
        isFolder: 0,
        isPersonal: "N",
        isnKeepPeriod: 2,
        keepYears: 2,
        key: "2",
        name: "5 лет",
        note: null,
        protected: "N",
        title: "5 лет",
        data: {
            code: null,
            deleted: "N",
            isEpk: "N",
            isPersonal: "N",
            isnKeepPeriod: 2,
            keepYears: 5,
            name: "5 лет",
            note: null,
            protected: "N"
        }
    },
    {
        code: null,
        deleted: false,
        description: null,
        isEpk: "N",
        isFolder: 0,
        isPersonal: "N",
        isnKeepPeriod: 3,
        keepYears: 2,
        key: "2",
        name: "5 лет",
        note: null,
        protected: "N",
        title: "5 лет",
        data: {
            code: null,
            deleted: "N",
            isEpk: "N",
            isPersonal: "N",
            isnKeepPeriod: 3,
            keepYears: 5,
            name: "5 лет",
            note: null,
            protected: "N"
        }
    }];
    const multiLookup2 = [{
        code: null,
        deleted: false,
        description: null,
        isEpk: "N",
        isFolder: 0,
        isPersonal: "N",
        isnKeepPeriod: 2,
        keepYears: 2,
        key: "2",
        name: "5 лет",
        note: null,
        protected: "N",
        title: "5 лет",
        data: {
            code: null,
            deleted: "N",
            isEpk: "N",
            isPersonal: "N",
            isnKeepPeriod: 2,
            keepYears: 5,
            name: "5 лет",
            note: null,
            protected: "N"
        }
    },
    {
        code: null,
        deleted: false,
        description: null,
        isEpk: "N",
        isFolder: 0,
        isPersonal: "N",
        isnKeepPeriod: 3,
        keepYears: 2,
        key: "2",
        name: "5 лет",
        note: null,
        protected: "N",
        title: "5 лет",
        data: {
            code: null,
            deleted: "N",
            isEpk: "N",
            isPersonal: "N",
            isnKeepPeriod: 3,
            keepYears: 5,
            name: "5 лет",
            note: null,
            protected: "N"
        }
    }];

    const url = new URLSearchParams(document.location.search);
    let historyValue: any = null;
    const fieldName = url.get("f");
    switch (fieldName) {
        case "isnKeepClause":
            historyValue = { isnKeepClause: isnKeepClause };
            break;
        case "isnKeepPeriod":
            historyValue = { isnKeepPeriod: isnKeepPeriod };
            break;
        case "multiLookup1":
            historyValue = { multiLookup1: multiLookup1 };
            break;
        case "multiLookup2":
            historyValue = { multiLookup2: multiLookup2 };
            break;
    }



    return (<div>
        <SmartButton htmlType="submit" onClick={() => {
            const items: IHistorySlimItem = {
                name: "LookupDialogResult",
                value: historyValue
            }
            toBack(items);
        }
        }>Завершить выбор</SmartButton>
    </div>)
}
export default LookupPage;