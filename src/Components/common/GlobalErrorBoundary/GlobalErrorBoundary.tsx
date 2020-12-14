import React, { Component, ErrorInfo, ReactNode } from "react";
// import style from './GlobalErrorBoundary.module.css';

interface Props {
    children: ReactNode;
}

interface State {
    errorInfo: string;
}

class GlobalErrorBoundary extends Component<Props, State> {
    state: State = {
        errorInfo: ''
    };

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { errorInfo: error.message };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.errorInfo) {
            return <React.Fragment>
                <h1>Просим прощения! Возникла непредвиденная ошибка.</h1>
                <span>Мы будем благодарны если вы нам сообщите следующую информацию: </span>
                <p>{this.state.errorInfo}</p>
            </React.Fragment>
        } else { return this.props.children; }
    }
}

export default GlobalErrorBoundary;