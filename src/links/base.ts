import Main from '../index';

abstract class Base {
    main: Main;
    inited: boolean;

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(
        identity: string,
        reversed?: boolean,
        options?: {
            limit?: number;
            offset?: number;
            last?: string;
        },
    ): Promise<Links | null>;
}

export default Base;
