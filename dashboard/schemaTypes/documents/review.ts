import {StarIcon} from '@sanity/icons/Star'
import {defineField, defineType} from 'sanity'

/** A client review. Only approved reviews are shown on the website. */
export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({name: 'product', type: 'reference', to: [{type: 'product'}], validation: (r) => r.required()}),
    defineField({name: 'author', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'rating',
      type: 'number',
      options: {list: [1, 2, 3, 4, 5], layout: 'radio', direction: 'horizontal'},
      validation: (r) => r.required().integer().min(1).max(5),
    }),
    defineField({name: 'comment', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({name: 'createdAt', title: 'Date', type: 'date', initialValue: () => new Date().toISOString().slice(0, 10)}),
    defineField({
      name: 'approved',
      title: 'Show on website',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {author: 'author', rating: 'rating', product: 'product.name', approved: 'approved'},
    prepare: ({author, rating, product, approved}) => ({
      title: `${'★'.repeat(rating ?? 0)} ${author ?? ''}`,
      subtitle: [product, approved ? 'Visible' : 'Hidden'].filter(Boolean).join(' · '),
    }),
  },
})
