import Main from '../index';
import { AssetsOptions } from './index';

abstract class Base {
    main: Main;
    inited: boolean;

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(options: AssetsOptions): Promise<Assets[] | null>;
}

export default Base;
