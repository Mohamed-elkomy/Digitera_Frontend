import {BasketIcon} from '@sanity/icons/Basket'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Created by the website when a customer places an order. The owner follows
 * up on WhatsApp and moves the status along; what was ordered is read-only.
 */
export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'new',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'New', value: 'new'},
          {title: 'Confirmed', value: 'confirmed'},
          {title: 'Delivered', value: 'delivered'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
      },
    }),
    defineField({name: 'ownerNotes', title: 'Private notes', type: 'text', rows: 3}),
    defineField({name: 'orderNumber', type: 'string', readOnly: true}),
    defineField({name: 'placedAt', title: 'Placed', type: 'datetime', readOnly: true}),
    defineField({
      name: 'customer',
      type: 'object',
      readOnly: true,
      fields: ['fullName', 'phone', 'email', 'address', 'city', 'postalCode', 'notes'].map((name) =>
        defineField({name, type: name === 'notes' ? 'text' : 'string'}),
      ),
    }),
    defineField({
      name: 'items',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          name: 'orderItem',
          type: 'object',
          fields: [
            defineField({name: 'name', type: 'string'}),
            defineField({name: 'productSlug', type: 'string'}),
            defineField({name: 'size', type: 'string'}),
            defineField({name: 'quantity', type: 'number'}),
            defineField({name: 'unitPrice', title: 'Unit price (USD)', type: 'number'}),
            defineField({name: 'giftWrapping', type: 'boolean'}),
          ],
          preview: {
            select: {name: 'name', size: 'size', quantity: 'quantity', unitPrice: 'unitPrice'},
            prepare: ({name, size, quantity, unitPrice}) => ({
              title: `${quantity ?? 1} × ${name ?? ''} (${size ?? ''})`,
              subtitle: `$${unitPrice ?? 0} each`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'paymentMethod',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          {title: 'Cash on delivery', value: 'cash-on-delivery'},
          {title: 'Bank transfer', value: 'bank-transfer'},
        ],
      },
    }),
    defineField({name: 'subtotal', type: 'number', readOnly: true}),
    defineField({name: 'shipping', type: 'number', readOnly: true}),
    defineField({name: 'giftWrapping', title: 'Gift wrapping fee', type: 'number', readOnly: true}),
    defineField({name: 'total', type: 'number', readOnly: true}),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'placedAt', direction: 'desc'}]}],
  preview: {
    select: {number: 'orderNumber', name: 'customer.fullName', total: 'total', status: 'status'},
    prepare: ({number, name, total, status}) => ({
      title: `${number ?? 'Order'} · $${total ?? 0}`,
      subtitle: [name, status?.toUpperCase()].filter(Boolean).join(' · '),
    }),
  },
})
