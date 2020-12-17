import React, { lazy, Suspense } from 'react'
import { IControlRenderProps } from '../../EosTable/types';

export default function Icon({ renderArgs }: IControlRenderProps) {
    const LazyComponent = lazy(() => import(`@eos/rc-controls/lib/icon/icons/${renderArgs && renderArgs.iconName}.js`)
        .catch(() => import("@eos/rc-controls/lib/icon/icons/EosIcon")));

    return React.useMemo(() =>
        <Suspense fallback>
            <LazyComponent color={renderArgs && renderArgs["color"]} style={renderArgs && { fontSize: renderArgs["size"] }} />
        </Suspense>, [])
}
