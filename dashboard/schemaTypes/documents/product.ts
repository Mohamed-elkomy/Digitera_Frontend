import {BottleIcon} from '@sanity/icons/Bottle'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {validateUniqueSlug} from '../shared/slug'

const noteList = (name: string, title: string) =>
  defineField({name, title, type: 'array', of: [defineArrayMember({type: 'string'})]})

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: BottleIcon,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'stock', title: 'Prices & stock'},
    {name: 'scent', title: 'Scent'},
    {name: 'media', title: 'Images'},
    {name: 'arabic', title: 'العربية'},
  ],
  fields: [
    defineField({name: 'name', type: 'string', group: 'details', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      description: 'The product URL, for example /products/fleur-de-lune.',
      options: {source: 'name', maxLength: 96},
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return 'Required'
          if (!/^[a-z0-9-]+$/.test(slug.current)) return 'Lowercase letters, numbers and hyphens only'
          return validateUniqueSlug(slug.current, context)
        }),
    }),
    defineField({name: 'sku', title: 'SKU', type: 'string', group: 'details'}),
    defineField({name: 'description', type: 'text', rows: 4, group: 'details', validation: (r) => r.required()}),
    defineField({
      name: 'notes',
      title: 'Card line',
      type: 'string',
      group: 'details',
      description: 'Short scent line on product cards, e.g. Floral / Jasmine & White Musk.',
    }),
    defineField({name: 'category', type: 'reference', to: [{type: 'category'}], group: 'details', validation: (r) => r.required()}),
    defineField({name: 'scentFamily', title: 'Scent family', type: 'reference', to: [{type: 'scentFamily'}], group: 'details', validation: (r) => r.required()}),
    defineField({name: 'occasion', type: 'reference', to: [{type: 'occasion'}], group: 'details', validation: (r) => r.required()}),
    defineField({
      name: 'availability',
      type: 'string',
      group: 'stock',
      initialValue: 'in-stock',
      options: {
        layout: 'radio',
        list: [
          {title: 'Available', value: 'in-stock'},
          {title: 'Made to order', value: 'made-to-order'},
          {title: 'Out of stock', value: 'out-of-stock'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'variants',
      title: 'Bottle sizes',
      type: 'array',
      group: 'stock',
      of: [defineArrayMember({type: 'productVariant'})],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'giftWrappingAvailable',
      title: 'Offer gift wrapping',
      type: 'boolean',
      group: 'stock',
      initialValue: true,
    }),
    defineField({
      name: 'scentNotes',
      title: 'Scent pyramid',
      type: 'object',
      group: 'scent',
      fields: [noteList('top', 'Top notes'), noteList('heart', 'Heart notes'), noteList('base', 'Base notes')],
    }),
    defineField({
      name: 'ar',
      title: 'Arabic copy (النص العربي)',
      description: 'What Arabic-language visitors read. Leave empty to use the built-in translation.',
      type: 'object',
      group: 'arabic',
      options: {collapsible: false},
      fields: [
        defineField({name: 'name', title: 'الاسم', type: 'string'}),
        defineField({name: 'notes', title: 'سطر الكارت', type: 'string'}),
        defineField({name: 'description', title: 'الوصف', type: 'text', rows: 4}),
        defineField({
          name: 'scentNotes',
          title: 'هرم الرائحة',
          type: 'object',
          fields: [noteList('top', 'المقدمة'), noteList('heart', 'القلب'), noteList('base', 'القاعدة')],
        }),
      ],
    }),
    defineField({
      name: 'images',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (r) => r.required().warning('Describe the image for screen readers'),
            }),
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [
    {title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', availability: 'availability', category: 'category.title', media: 'images.0'},
    prepare: ({title, availability, category, media}) => ({
      title,
      subtitle: [category, availability === 'out-of-stock' ? 'Out of stock' : null]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
