import Main from '../index';
import { LinksOptions, LinksSetOptions, LinkInput } from './index';

abstract class Base {
    main: Main;
    inited: boolean;

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(options: LinksOptions): Promise<Links | null>;

    abstract set?(
        options: LinksSetOptions,
        input: LinkInput,
    ): Promise<{
        code: number;
        message: string;
    }>;
}

export default Base;
