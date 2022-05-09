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

type Profile = {
    name?: string;
    avatars?: URI[];
    bio?: string;
    websites?: URI[];
    banners?: URI[];

    connected_accounts?: {
        identity: string;
        platform: string;
        url?: string;
    }[];

    source: ProfileSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
};

type Profiles = {
    total: number;
    list: Profile[];
};

type Link = {
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

type Links = {
    total: number;
    list: Link[];
};

type Note = {
    date_created: string;
    date_updated: string;

    related_urls?: string[];

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
        type?: string;
        content?: string;
        address?: URI;
        mime_type?: string;
        size_in_bytes?: number;
    }[];

    source: NoteSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
};

type Notes = {
    total: number;
    list: Note[];
};

type Asset = {
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

type Assets = {
    total: number;
    list: Asset[];
};
