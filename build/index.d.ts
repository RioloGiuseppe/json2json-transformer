export declare function parseTemplate(data: object, template: object, options?: Options): any;
export interface Options {
    ignore: string;
    clone: boolean;
    transformProps: (s: string) => string;
}
