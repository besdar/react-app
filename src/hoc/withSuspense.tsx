import React from "react";
import Loader from "../Components/common/Loader/Loader";

export function withSuspense<WCP>(WrappedComponent: React.ComponentType<WCP>) {
    return (props: WCP) => {
        return <React.Suspense fallback={<Loader nameOfProcess="собираем и стилизуем страницу" />}>
            <WrappedComponent {...props} />
        </React.Suspense>
    }
}