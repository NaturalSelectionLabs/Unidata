import Main from '../index';
import { AssetsOptions } from './index';

abstract class Base {
    main: Main;
    inited: boolean;

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(options: AssetsOptions): Promise<Assets>;

    generateAttributes(attributes: any): Asset['attributes'] | undefined {
        if (Array.isArray(attributes)) {
            return attributes
                .map((attribute: any) => {
                    if ((attribute.trait_type || attribute.name) && attribute.value) {
                        return {
                            key: attribute.trait_type || attribute.name,
                            value: attribute.value,
                        };
                    } else {
                        return null;
                    }
                })
                .filter((attribute: any) => attribute) as Asset['attributes'];
        }
    }
}

export default Base;
