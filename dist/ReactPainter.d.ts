import * as PropTypes from 'prop-types';
import * as React from 'react';
export declare type LineJoinType = 'round' | 'bevel' | 'miter';
export declare type LineCapType = 'round' | 'butt' | 'square';
export interface CanvasProps {
    onMouseDown: React.MouseEventHandler<HTMLCanvasElement>;
    onTouchStart: React.TouchEventHandler<HTMLCanvasElement>;
    onMouseMove: React.MouseEventHandler<HTMLCanvasElement>;
    onTouchMove: React.TouchEventHandler<HTMLCanvasElement>;
    onMouseUp: React.MouseEventHandler<HTMLCanvasElement>;
    onTouchEnd: React.TouchEventHandler<HTMLCanvasElement>;
    style: React.CSSProperties;
    ref: (ref: HTMLCanvasElement) => void;
}
export interface PropsGetterInput extends Partial<CanvasProps> {
    [key: string]: any;
}
export interface PropsGetterResult extends CanvasProps {
    [key: string]: any;
}
export interface RenderProps {
    canvas: JSX.Element;
    triggerSave: () => void;
    getCanvasProps: (props: PropsGetterInput) => PropsGetterResult;
    imageCanDownload: boolean;
    imageDownloadUrl: string;
    setColor: (color: string) => void;
    setLineWidth: (width: number) => void;
    setLineJoin: (type: LineJoinType) => void;
    setLineCap: (type: LineCapType) => void;
    resetDrawingOnCanvas: () => void;
    writeTextToCanvas: () => void;
    handleTextInput: (textToWrite: string) => void;
}
export interface ReactPainterProps {
    height?: number;
    width?: number;
    initialColor?: string;
    initialLineWidth?: number;
    initialLineJoin?: LineJoinType;
    initialLineCap?: LineCapType;
    onSave?: (blob: Blob) => void;
    image?: File | string;
    render?: (props: RenderProps) => JSX.Element;
}
export interface PainterState {
    canvasHeight: number;
    canvasWidth: number;
    imageCanDownload: boolean;
    imageDownloadUrl: string;
    isDrawing: boolean;
    isWritting: boolean;
    textToWrite: string;
    color: string;
    lineWidth: number;
    lineJoin: LineJoinType;
    lineCap: LineCapType;
}
export declare class ReactPainter extends React.Component<ReactPainterProps, PainterState> {
    static propTypes: {
        color: PropTypes.Requireable<string>;
        height: PropTypes.Requireable<number>;
        image: PropTypes.Requireable<string | File>;
        lineCap: PropTypes.Requireable<string>;
        lineJoin: PropTypes.Requireable<string>;
        lineWidth: PropTypes.Requireable<number>;
        onSave: PropTypes.Requireable<(...args: any[]) => any>;
        render: PropTypes.Requireable<(...args: any[]) => any>;
        width: PropTypes.Requireable<number>;
    };
    static defaultProps: Partial<ReactPainterProps>;
    canvasRef: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    lastX: number;
    lastY: number;
    scalingFactor: number;
    state: PainterState;
    extractOffSetFromEvent: (e: React.SyntheticEvent<HTMLCanvasElement, Event>) => {
        offsetX: number;
        offsetY: number;
    };
    initializeCanvas: (width: number, height: number, imgWidth?: number, imgHeight?: number) => void;
    getDrawImageCanvasSize: (cWidth: number, cHeight: number, imageWidth: number, imageHeight: number) => number[];
    handleMouseDown: (e: React.SyntheticEvent<HTMLCanvasElement, Event>) => void;
    handleResetDrawingOnCanvas: () => void;
    writeTextToCanvas: () => void;
    handleMouseMove: (e: React.SyntheticEvent<HTMLCanvasElement, Event>) => void;
    handleMouseUp: (e: React.SyntheticEvent<HTMLCanvasElement, Event>) => void;
    handleSave: () => void;
    handleSetColor: (color: string) => void;
    handleSetLineWidth: (lineWidth: number) => void;
    handleSetLineJoin: (type: LineJoinType) => void;
    handleSetLineCap: (type: LineCapType) => void;
    handleSetTextToWrite: (textToWrite: string) => void;
    getCanvasProps: (props?: PropsGetterInput) => PropsGetterResult;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
