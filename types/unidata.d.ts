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
    banner?: URI[];

    attachments?: {
        type?: string;
        content?: string;
        address?: URI;
        mime_type: string;
        size_in_bytes?: number;
    }[];

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

type Item = {
    identifier: AssetInstanceURI | NoteInstanceURI;
    date_created: string;
    date_updated: string;

    related_urls?: string[];

    links: LinksURI;
    backlinks: BacklinksURI;

    tags?: string[];
    authors: AccountInstanceURI[];
    title?: string;
    summary?: string;
    attachments?: {
        type?: string;
        content?: string;
        address?: URI;
        mime_type: string;
        size_in_bytes?: number;
    }[];

    source: AssetSource | NoteSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
};
