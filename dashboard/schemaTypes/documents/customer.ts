import {UserIcon} from '@sanity/icons/User'
import {defineField, defineType} from 'sanity'

/**
 * A customer account created on the website. The password is stored only as
 * a salted scrypt hash and is hidden here; nobody, including the owner, can
 * read it back.
 */
export const customer = defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'name', type: 'string', readOnly: true}),
    defineField({name: 'email', type: 'string', readOnly: true}),
    defineField({name: 'createdAt', title: 'Joined', type: 'datetime', readOnly: true}),
    defineField({name: 'passwordHash', type: 'string', hidden: true, readOnly: true}),
  ],
  preview: {select: {title: 'name', subtitle: 'email'}},
})
