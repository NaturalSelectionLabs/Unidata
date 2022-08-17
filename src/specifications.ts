type AccountInstanceURI = string;
type AssetInstanceURI = string;
type NoteInstanceURI = string;
type InstanceURI = string;
type ProfilesURI = string;
type LinksURI = string;
type BacklinksURI = string;
type AssetsURI = string;
type NotesURI = string;

type URI = string;

type Network = string;
type LinkType = string;
type ProfileSource = string;
type LinkSource = string;
type AssetSource = string;
type NoteSource = string;

// Profiles

export type Profile = {
    date_created?: string;
    date_updated?: string;

    name?: string;
    username?: string;
    avatars?: URI[];
    bio?: string;
    websites?: URI[];
    banners?: URI[];
    tags?: string[];

    connected_accounts?: {
        identity: string;
        platform: string;
        url?: string;
    }[];

    attributes?: {
        display_type?: 'string' | 'number' | 'boolean' | 'date';
        trait_type?: string;
        value: null | string | number | boolean;
    }[];

    source: ProfileSource;

    metadata?: {
        network: Network;
        proof: string;

        raw?: {
            [key: string]: any;
        };

        [key: string]: any;
    };
};

export type Profiles = {
    total: number;
    list: Profile[];
};

// Links

export type Link = {
    date_created?: string;

    from: InstanceURI;
    to: InstanceURI;
    type: LinkType;

    source: LinkSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
};

export type Links = {
    total: number;
    cursor?: any;
    list: Link[];
};

// Notes

export type Note = {
    id: string;

    date_created: string;
    date_updated: string;
    date_published: string; // used for scheduled future notes or synchronized old notes

    related_urls?: string[];

    content_warning?: string;
    applications?: string[];
    tags?: string[];
    authors: AccountInstanceURI[];
    title?: string;

    summary?: {
        content?: string;
        address?: URI;
        mime_type?: string;
        size_in_bytes?: number;
    };

    body?: {
        content?: string;
        address?: URI;
        mime_type?: string;
        size_in_bytes?: number;
    };

    attachments?: {
        name?: string;
        content?: string;
        address?: URI;
        mime_type?: string;
        size_in_bytes?: number;
        alt?: string;
        width?: number;
        height?: number;
    }[];

    attributes?: {
        display_type?: 'string' | 'number' | 'boolean' | 'date';
        trait_type?: string;
        value: null | string | number | boolean;
    }[];

    source: NoteSource;

    metadata?: {
        network: Network;
        proof: string;

        raw?: {
            [key: string]: any;
        };

        [key: string]: any;
    };
};

export type Notes = {
    total: number;
    cursor?: any;
    list: Note[];
};

// Assets

export type Asset = {
    date_created?: string;
    date_updated?: string;

    related_urls?: string[];

    tags?: string[];
    owners: AccountInstanceURI[];
    name?: string;
    description?: string;

    previews?: {
        content?: string;
        address?: URI;
        mime_type?: string;
        size_in_bytes?: number;
    }[];

    items?: {
        content?: string;
        address?: URI;
        mime_type?: string;
        size_in_bytes?: number;
    }[];

    attributes?: {
        key: string;
        value: string;
    }[];

    source: AssetSource;

    metadata?: {
        network: Network;
        proof: string;
        providers: string[];

        [key: string]: any;
    };
};

export type Assets = {
    total: number;
    cursor?: any;
    list: Asset[];
};
