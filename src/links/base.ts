import Main from '../index';

abstract class Base {
    main: Main;
    inited: boolean;

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(identity: string, reversed?: boolean, offset?: number): Promise<Links | null>;
}

export default Base;
