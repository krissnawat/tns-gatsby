import React, { useEffect } from 'react'
import { graphql } from 'gatsby'
import contentParser from 'gatsby-wpgraphql-inline-images'
import Prism from 'prismjs'
import CategoryList from '../components/CategoryList'
import RelatedCards from '../components/RelatedCards'
import SEO from '../components/SEO/SEO'
import TagList from '../components/TagList'
import ArticleContainer from '../containers/ArticleContainer'
import Layout from '../containers/Layout'

const PostTemplate = (props) => {
    useEffect(() => {
        Prism.highlightAll()
    }, [])

    const {
        pageContext: { relatedPosts },
        data: {
            wpgraphql: {
                post: {
                    content,
                    date,
                    cleanTitle,
                    cleanExcerpt,
                    modified,
                    modifiedForUser,
                    modifiedForSchema,
                    publishedForUser,
                    publishedForSchema,
                    featuredImage,
                    tags,
                    categories,
                    seo,
                },
            },
        },
        uri,
    } = props

    const image =
        featuredImage?.imageFile?.childImageSharp?.base700?.base64 || false

    const facebookImage =
        featuredImage?.imageFile?.childImageSharp?.facebook?.src || false

    const twitterImage =
        featuredImage?.imageFile?.childImageSharp?.twitter?.src || false

    const featuredAlt = featuredImage.alt_text || ''
    const featuredTitle = featuredImage?.title || ''

    const pluginOptions = {
        wordPressUrl: `http://rest.thoughtsandstuff.com/`,
        uploadsUrl: `http://rest.thoughtsandstuff.com/wp-content/uploads/`,
    }

    return (
        <Layout>
            <SEO
                postType="page"
                yoastTitle={seo.title}
                title={cleanTitle}
                description={cleanExcerpt}
                facebookPostImage={facebookImage}
                twitterPostImage={twitterImage}
                url={uri}
                datePublished={date}
                dateModified={modified}
            />

            <ArticleContainer>
                <article className="post">
                    <h1>{cleanTitle}</h1>

                    <time
                        className="post__date post__date--published"
                        dateTime={publishedForSchema}
                    >
                        {publishedForUser}
                    </time>
                    <time
                        className="post__date post__date--updated"
                        dateTime={modifiedForSchema}
                    >
                        {modifiedForUser}
                    </time>

                    <CategoryList cats={categories.nodes} />

                    {image && (
                        <div>
                            <img
                                className="post__feat-image"
                                src={image}
                                title={featuredTitle || ''}
                                alt={featuredAlt || ''}
                            />
                        </div>
                    )}

                    <div>{contentParser({ content }, pluginOptions)}</div>

                    <TagList tags={tags.nodes} />
                </article>
            </ArticleContainer>

            <RelatedCards relatedPosts={relatedPosts} />
        </Layout>
    )
}

export default PostTemplate

export const pageQuery = graphql`
    query PostById($id: ID!) {
        site {
            siteMetadata {
                siteName
            }
        }
        wpgraphql {
            post(id: $id) {
                id
                slug
                title
                date
                modified
                modifiedForUser
                modifiedForSchema
                publishedForUser
                publishedForSchema
                content
                uri
                excerpt
                cleanTitle
                cleanExcerpt
                seo {
                    metaDesc
                    title
                }
                categories {
                    nodes {
                        name
                        slug
                    }
                }
                tags {
                    nodes {
                        name
                        slug
                    }
                }
                featuredImage {
                    sourceUrl
                    altText
                    title
                    databaseId
                    modified
                    imageFile {
                        childImageSharp {
                            base700: sizes(base64Width: 800, quality: 100) {
                                base64
                            }
                            facebook: fixed(width: 1024, height: 512) {
                                src
                                width
                                height
                            }
                            twitter: fixed(width: 1200, height: 630) {
                                src
                            }
                        }
                    }
                }
            }
        }
    }
`
