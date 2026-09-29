import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'

/**
 * Sent from the website's contact form. The owner only changes the status
 * and keeps private notes; what the customer wrote stays read-only.
 */
export const inquiry = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  icon: EnvelopeIcon,
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
          {title: 'Replied', value: 'replied'},
          {title: 'Closed', value: 'closed'},
        ],
      },
    }),
    defineField({name: 'ownerNotes', title: 'Private notes', type: 'text', rows: 3}),
    defineField({name: 'name', type: 'string', readOnly: true}),
    defineField({name: 'email', type: 'string', readOnly: true}),
    defineField({name: 'phone', type: 'string', readOnly: true}),
    defineField({name: 'subject', type: 'string', readOnly: true}),
    defineField({name: 'message', type: 'text', rows: 6, readOnly: true}),
    defineField({name: 'submittedAt', title: 'Received', type: 'datetime', readOnly: true}),
  ],
  orderings: [
    {title: 'Newest first', name: 'newest', by: [{field: 'submittedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {subject: 'subject', name: 'name', status: 'status'},
    prepare: ({subject, name, status}) => ({
      title: subject ?? 'Inquiry',
      subtitle: [name, status?.toUpperCase()].filter(Boolean).join(' · '),
    }),
  },
})
