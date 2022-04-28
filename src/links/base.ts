import Main from '../index';
import { LinksOptions } from './index';

abstract class Base {
    main: Main;
    inited: boolean;

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(options: LinksOptions): Promise<Links | null>;
}

export default Base;
