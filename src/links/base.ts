import Main from '../index';
import { LinksOptions, LinkSetOptions, LinkInput } from './index';
import type { Links } from '../specifications';

abstract class Base {
    main: Main;
    inited: boolean;

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(options: LinksOptions): Promise<Links | null>;

    abstract set?(
        options: LinkSetOptions,
        input: LinkInput,
    ): Promise<{
        code: number;
        message: string;
    }>;
}

export default Base;
