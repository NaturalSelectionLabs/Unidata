import Main from '../index';
import { ProfilesOptions, ProfileSetOptions, ProfileInput } from './index';
import type { Profiles } from '../specifications';

abstract class Base {
    main: Main;
    inited: boolean;

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(options: ProfilesOptions): Promise<Profiles>;

    abstract set?(
        options: ProfileSetOptions,
        input: ProfileInput,
    ): Promise<{
        code: number;
        message: string;
    }>;
}

export default Base;
