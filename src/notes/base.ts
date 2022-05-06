import Main from '../index';
import { NotesOptions } from './index';

abstract class Base {
    main: Main;
    inited: boolean;
    accountsMap: {
        [key: string]: {
            platform: string;
            url?: string;
        };
    };

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(options: NotesOptions): Promise<Notes | null>;
}

export default Base;
