/**
 * Nuxt / Unhead–inspired flat SEO meta types (framework-agnostic).
 * CamelCase keys map to `<meta name|property>` / `<link>` / `<title>`.
 */

export type SeoBooleanable = boolean | "true" | "false" | "" | 0 | 1;

export type SeoArrayable<T> = T | readonly T[];

/** Open Graph image descriptor (Nuxt-style object form). */
export interface SeoOgImageObject {
	url?: string;
	secureUrl?: string;
	type?: "image/jpeg" | "image/gif" | "image/png" | "image/webp" | "image/avif" | string;
	width?: string | number;
	height?: string | number;
	alt?: string;
}

/** Open Graph video descriptor. */
export interface SeoOgVideoObject {
	url?: string;
	secureUrl?: string;
	type?: "application/x-shockwave-flash" | "video/mp4" | "video/webm" | string;
	width?: string | number;
	height?: string | number;
	alt?: string;
}

/** Robots directives as a structured object (also accepts a string). */
export interface SeoRobotsObject {
	index?: SeoBooleanable;
	follow?: SeoBooleanable;
	all?: SeoBooleanable;
	noindex?: SeoBooleanable;
	nofollow?: SeoBooleanable;
	none?: SeoBooleanable;
	noarchive?: SeoBooleanable;
	nositelinkssearchbox?: SeoBooleanable;
	nosnippet?: SeoBooleanable;
	indexifembedded?: SeoBooleanable;
	maxSnippet?: number | string;
	maxImagePreview?: "none" | "standard" | "large";
	maxVideoPreview?: number | string;
	notranslate?: SeoBooleanable;
	unavailable_after?: string;
	noimageindex?: SeoBooleanable;
}

export interface SeoMetaArticle {
	articleAuthor?: readonly string[];
	articleExpirationTime?: string;
	articleModifiedTime?: string;
	articlePublishedTime?: string;
	articleSection?: string;
	articleTag?: readonly string[];
}

export interface SeoMetaBook {
	bookAuthor?: readonly string[];
	bookIsbn?: string;
	bookReleaseDate?: string;
	bookTag?: readonly string[];
}

export interface SeoMetaProfile {
	profileFirstName?: string;
	profileGender?: "male" | "female" | string;
	profileLastName?: string;
	profileUsername?: string;
}

/**
 * Flat SEO payload inspired by Nuxt `useSeoMeta` / Unhead `MetaFlat`.
 * All fields optional except when required by your page (`title` recommended).
 */
export interface SeoMetaFlat extends SeoMetaArticle, SeoMetaBook, SeoMetaProfile {
	/** Document `<title>` (not a meta tag). */
	title?: string;
	/** Canonical URL → `<link rel="canonical">`. */
	canonical?: string;

	charset?: "utf-8" | string;
	description?: string;
	keywords?: string;
	colorScheme?: "normal" | "light dark" | "dark light" | "only light" | string;
	applicationName?: string;
	author?: string;
	creator?: string;
	publisher?: string;
	generator?: string;
	referrer?: string;
	viewport?: string | Record<string, string | number | undefined>;
	robots?: "noindex, nofollow" | "index, follow" | string | SeoRobotsObject;
	google?: "nositelinkssearchbox" | "nopagereadaloud" | string;
	googlebot?: string;
	googlebotNews?: string;
	googleSiteVerification?: string;
	rating?: "adult" | string;
	themeColor?: string | { content?: string; media?: string };

	ogUrl?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogType?:
		| "website"
		| "article"
		| "book"
		| "profile"
		| "music.song"
		| "music.album"
		| "music.playlist"
		| "music.radio_station"
		| "video.movie"
		| "video.episode"
		| "video.tv_show"
		| "video.other"
		| string;
	ogLocale?: string;
	ogLocaleAlternate?: SeoArrayable<string>;
	ogDeterminer?: "a" | "an" | "the" | "" | "auto";
	ogSiteName?: string;
	ogImage?: string | SeoArrayable<SeoOgImageObject>;
	ogImageUrl?: string;
	ogImageSecureUrl?: string;
	ogImageType?: string;
	ogImageWidth?: string | number;
	ogImageHeight?: string | number;
	ogImageAlt?: string;
	ogVideo?: string | SeoArrayable<SeoOgVideoObject>;
	ogVideoUrl?: string;
	ogVideoSecureUrl?: string;
	ogVideoType?: string;
	ogVideoWidth?: string | number;
	ogVideoHeight?: string | number;
	ogVideoAlt?: string;
	ogAudio?: string;
	ogAudioUrl?: string;
	ogAudioSecureUrl?: string;
	ogAudioType?: string;

	twitterCard?: "summary" | "summary_large_image" | "app" | "player" | string;
	twitterSite?: string;
	twitterSiteId?: string | number;
	twitterCreator?: string;
	twitterCreatorId?: string | number;
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage?: string;
	twitterImageAlt?: string;
	twitterPlayer?: string;
	twitterPlayerWidth?: string | number;
	twitterPlayerHeight?: string | number;
	twitterPlayerStream?: string;
	twitterAppNameIphone?: string;
	twitterAppIdIphone?: string | number;
	twitterAppUrlIphone?: string;
	twitterAppNameIpad?: string;
	twitterAppIdIpad?: string | number;
	twitterAppUrlIpad?: string;
	twitterAppNameGoogleplay?: string;
	twitterAppIdGoogleplay?: string | number;
	twitterAppUrlGoogleplay?: string;
	twitterData1?: string;
	twitterLabel1?: string;
	twitterData2?: string;
	twitterLabel2?: string;

	fbAppId?: string | number;

	mobileWebAppCapable?: "yes" | string;
	appleMobileWebAppCapable?: "yes" | string;
	appleMobileWebAppStatusBarStyle?: "default" | "black" | "black-translucent" | string;
	appleMobileWebAppTitle?: string;
	appleItunesApp?: string | { appId?: string; appArgument?: string };
	formatDetection?: "telephone=no" | string;
	msapplicationTileImage?: string;
	msapplicationTileColor?: string;
	msapplicationConfig?: string;

	/** Absolute page URL used when merging site defaults (maps to og:url / canonical). */
	url?: string;
}

/** Input accepted by {@link useSeoMeta} — same as Nuxt: a flat object. */
export type SeoMetaInput = {
	[K in keyof SeoMetaFlat]?: SeoMetaFlat[K] | null;
};

/**
 * Legacy page meta used by {@link useSeoTag}. Prefer {@link SeoMetaInput}.
 * @deprecated Prefer Nuxt-style {@link SeoMetaInput} with {@link useSeoMeta}.
 */
export interface SeoMeta {
	title: string;
	description?: string;
	canonical?: string;
	url?: string;
	ogImage?: string;
	ogType?: "website" | "article" | "profile";
	publishedTime?: string;
	modifiedTime?: string;
	author?: string;
	tags?: string[];
	noindex?: boolean;
}

/** One `<head>` node as data (safe to map in any framework / Vanilla DOM). */
export interface SeoTagNode {
	tag: "title" | "meta" | "link" | "script";
	attrs?: Record<string, string>;
	text?: string;
}
