export declare function dataUrlToArrayBuffer(dataURI: string): [string, ArrayBuffer];
export declare const checkImageCrossOriginAllowed: (imageUrl: string) => Promise<{
    anonymous: boolean;
    withCredentials: boolean;
}>;
export declare function fileToUrl(file: File | Blob): string;
export declare function revokeUrl(objectUrl: string): void;
export declare const canvasToBlob: (canvas: HTMLCanvasElement, type: string) => Promise<Blob>;
export interface ImportImageResponse {
    img: HTMLImageElement | ImageBitmap;
    imgWidth: number;
    imgHeight: number;
}
export declare const importImage: (image: FormDataEntryValue) => Promise<ImportImageResponse>;
declare type AnyFunction = (...params: any[]) => any;
export declare const composeFn: (...fns: AnyFunction[]) => (...args: any[]) => void;
export declare const makeAjaxHeadRequest: (url: string, withCredentials?: boolean) => Promise<any>;
export {};
