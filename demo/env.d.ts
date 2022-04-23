/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'colorthief' {
    type Color = [number, number, number];
    export default class ColorThief {
        getColor: (img: HTMLImageElement | null) => Color;
        getPalette: (img: HTMLImageElement | null) => Color[];
    }
}
