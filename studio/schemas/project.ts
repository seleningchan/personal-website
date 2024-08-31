import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    type: 'document',
    title: 'Projects',
    fields: [
        defineField({
            name: 'name',
            type: 'internationalizedArrayString',
            title: 'Project name',
            validation: Rule => Rule.required(),
        }),

        defineField({
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
                source: 'name.0.value',
                maxLength: 200,
            },
            validation: Rule => Rule.required(),
        }),

        defineField({
            name: 'url',
            type: 'url',
            title: 'URL',
        }),

        defineField({
            name: 'referer',
            type: 'boolean',
            title: 'Referer',
            initialValue: true,
            description: 'Whether to send the referer header when the user clicks on the URL link. This can be useful for analytics, but it\'s also a privacy concern.',
        }),

        defineField({
            name: 'sourceCodeUrl',
            type: 'url',
            title: 'Source code URL',
        }),

        defineField({
            name: 'description',
            type: 'internationalizedArrayText',
            title: 'Description',
        }),

        defineField({
            name: 'tags',
            type: 'array',
            title: 'Tags',
            of: [{ type: 'string' }],
        }),

        defineField({
            name: 'coverImage',
            type: 'image',
            title: 'Cover image',
            options: {
                hotspot: true,
            },
        }),

        defineField({
            name: 'content',
            type: 'internationalizedArrayFormattedText',
            title: 'Content',
        }),

        defineField({
            name: 'publishDate',
            type: 'datetime',
            title: 'Publish date',
            options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm:ss',
            },
            initialValue: () => {
                const date = new Date()
                const hours = date.getHours(); // 获取小时
                const minutes = date.getMinutes(); // 获取分钟
                const seconds = date.getSeconds(); // 获取秒钟
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            },
        }),

    ],
    preview: {
        select: {
            title: 'name.0.value',
        },
    },
})
