import type { ResolvedSanityImage } from '@sanity/asset-utils'
import type { Value } from 'sanity-plugin-internationalized-array'

const projectsQuery = groq`
*[_type == "project"]{
    "id": _id,
    name,
    description,
    "slug": slug.current,
    tags,
    url,
    publishDate,
    sourceCodeUrl,
    coverImage{
      asset->
    }
} | order(
    select(
        publishDate != null => publishDate,
    )
    desc
)`

export interface Project {
    id: string
    name: Value[]
    description: Value[]
    slug: string
    url: string
    sourceCodeUrl?: string
    tags: string[]
    coverImage: ResolvedSanityImage
    publishDate: `${string}-${string}-${string} ${string}:${string}:${string}`
}

export default defineEventHandler(async () => {
    return await useSanity().fetch<Project[]>(projectsQuery)
})
