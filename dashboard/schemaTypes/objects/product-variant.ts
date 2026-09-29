import {ControlsIcon} from '@sanity/icons/Controls'
import {defineField, defineType} from 'sanity'

/** One bottle size. Price and stock are per size. */
export const productVariant = defineType({
  name: 'productVariant',
  title: 'Bottle size',
  type: 'object',
  icon: ControlsIcon,
  fields: [
    defineField({
      name: 'volume',
      title: 'Volume (ml)',
      type: 'number',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'variantId',
      title: 'Size id',
      type: 'string',
      description: 'Used in the cart and the order message, for example 50ml.',
      validation: (rule) =>
        rule.required().regex(/^[a-z0-9-]+$/, {name: 'lowercase id'}),
    }),
    defineField({
      name: 'label',
      type: 'string',
      description: 'Shown to customers, for example "50 ml".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'inStock',
      title: 'In stock',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {label: 'label', price: 'price', inStock: 'inStock'},
    prepare: ({label, price, inStock}) => ({
      title: `${label ?? 'Size'} · $${price ?? '—'}`,
      subtitle: inStock === false ? 'Out of stock' : 'In stock',
    }),
  },
})
