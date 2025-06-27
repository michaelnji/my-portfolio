export interface SiteSettings {
    siteName: string;
    siteUrl: string;
    defaultLanguage: string;
    theme: 'light' | 'dark';
    seo: {
        title: string;
        description: string;
    };
    socialMediaLinks: {
        twitter?: string;
        github?: string;
        discord?: string;
        linkedin?: string;
    };
}

export const defaultSiteSettings: SiteSettings = {
    siteName: 'Michael Nji - Web Developer',
    siteUrl: 'https://njicodes.vercel.app',
    defaultLanguage: 'en-US',
    theme: 'dark',
    seo: {
        title: 'Welcome to my Portfolio - Michael Nji',
        description: 'This is the home to all my tech experiences & skills',

    },
    socialMediaLinks: {
        github: 'https://github.com/michaelnji',
    },
};
