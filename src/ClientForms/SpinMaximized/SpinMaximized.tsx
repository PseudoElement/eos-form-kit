import { Spin } from "@eos/rc-controls";
import React from "react";

function SpinMaximized(props: any) {
    return (<div className="eos-spin-maximized" style={{ height: "100%" }}><Spin spinning={props.spinning ? true : false}>{props.children}</Spin></div >);
}

export default SpinMaximized;
