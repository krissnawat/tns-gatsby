import React from 'react'
import { Helmet } from 'react-helmet'
import useSiteDefaults from '../../hooks/useSiteDefaults'

import decodeEntities from '../../utils/decodeEntities'
import SchemaOrg from './SchemaOrg'
import { isPost } from './SeoHelpers'


const SEO = ({
    address,
    author,
    datePublished,
    dateModified,
    description,
    facebookPostImage,
    postType,
    title,
    twitterPostImage,
    startDateTime,
    eventOver,
    url,
    yoastTitle,
    articleBody,
}) => {
    // Pull data from WordPress and Gatsby config
    const { settings, site, facebookImage, twitterImage } = useSiteDefaults()
    const wpSettings = settings.allSettings
    const fallback = site.siteMetadata

    const siteName = wpSettings.generalSettingsTitle || fallback.siteName
    const tagLine =
        wpSettings.generalSettingsDescription || fallback.description
    const facebookImageFallback =
        facebookImage?.childImageSharp?.fixed?.src || false

    const twitterImageFallback =
        twitterImage?.childImageSharp?.fixed?.src || false

    // Set the title from the browser. If there is a page title, set properly. Otherwise fall back
    const browserTitle =
        yoastTitle || title
            ? `${title} | ${siteName}`
            : `${siteName} | ${tagLine}`

    const metaTitle = decodeEntities(yoastTitle || title || siteName)

    const facebookMetaImage =
        facebookPostImage ||
        facebookImageFallback ||
        twitterPostImage ||
        twitterImageFallback ||
        false
    const twitterMetaImage =
        twitterPostImage ||
        twitterImageFallback ||
        facebookPostImage ||
        facebookImageFallback ||
        false

    const postUrl = url ? `${fallback.siteUrl}${url}` : fallback.siteUrl

    return (
        <>
            <Helmet>
                {/* General tags */}
                <title>{decodeEntities(browserTitle)}</title>
                {description && (
                    <meta name="description" content={description} />
                )}
                {facebookMetaImage && (
                    <meta name="image" content={facebookMetaImage} />
                )}
                <link rel="canonical" href={postUrl} />

                {/* OpenGraph tags */}
                <meta property="og:url" content={postUrl} />
                {isPost(postType) ? (
                    <meta property="og:type" content="article" />
                ) : null}
                <meta name="title" property="og:title" content={metaTitle} />
                {description && (
                    <meta
                        name="description"
                        property="og:description"
                        content={description}
                    />
                )}
                {facebookMetaImage && (
                    <meta
                        name="image"
                        property="og:image"
                        content={fallback.siteUrl + facebookMetaImage}
                    />
                )}
                {fallback.facebookAppID && (
                    <meta
                        property="fb:app_id"
                        content={fallback.facebookAppID}
                    />
                )}
                {datePublished && (
                    <meta property="PublishDate" content={datePublished} />
                )}
                {dateModified && (
                    <meta property="LastModifiedDate" content={dateModified} />
                )}
                {author && (
                    <meta name="author" property="Creator" content={author} />
                )}

                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:creator" content={fallback.author} />
                <meta name="twitter:title" content={metaTitle} />
                {description && (
                    <meta name="twitter:description" content={description} />
                )}
                {twitterMetaImage && (
                    <meta
                        name="twitter:image"
                        content={fallback.siteUrl + twitterMetaImage}
                    />
                )}
            </Helmet>
            <SchemaOrg
                author={author}
                url={url}
                title={metaTitle}
                image={fallback.siteUrl + facebookMetaImage}
                description={description}
                datePublished={datePublished}
                dateModified={dateModified}
                address={address}
                startDateTime={startDateTime}
                siteUrl={fallback.siteUrl}
                organization="Thoughts and Stuff"
                postType={postType}
                defaultTitle={tagLine}
                articleBody={articleBody}
            />
        </>
    )
}

export default SEO
