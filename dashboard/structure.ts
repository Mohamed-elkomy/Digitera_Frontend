import {BasketIcon} from '@sanity/icons/Basket'
import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {WarningOutlineIcon} from '@sanity/icons/WarningOutline'
import type {StructureResolver} from 'sanity/structure'

/** The owner's day-to-day views first; taxonomies at the bottom. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Odoratus')
    .items([
      S.listItem()
        .title('New orders')
        .icon(BasketIcon)
        .child(
          S.documentList()
            .title('New orders')
            .filter('_type == "order" && status == "new"')
            .defaultOrdering([{field: 'placedAt', direction: 'desc'}]),
        ),
      S.documentTypeListItem('order').title('All orders'),
      S.documentTypeListItem('customer').title('Customers'),
      S.divider(),
      S.documentTypeListItem('product').title('Products'),
      S.listItem()
        .title('Out of stock')
        .icon(WarningOutlineIcon)
        .child(
          S.documentList()
            .title('Out of stock')
            .filter('_type == "product" && (availability == "out-of-stock" || count(variants[inStock == false]) > 0)'),
        ),
      S.divider(),
      S.listItem()
        .title('New inquiries')
        .icon(EnvelopeIcon)
        .child(
          S.documentList()
            .title('New inquiries')
            .filter('_type == "inquiry" && status == "new"')
            .defaultOrdering([{field: 'submittedAt', direction: 'desc'}]),
        ),
      S.documentTypeListItem('inquiry').title('All inquiries'),
      S.divider(),
      S.listItem()
        .title('Reviews awaiting approval')
        .icon(CheckmarkCircleIcon)
        .child(
          S.documentList()
            .title('Awaiting approval')
            .filter('_type == "review" && approved != true'),
        ),
      S.documentTypeListItem('review').title('All reviews'),
      S.divider(),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('scentFamily').title('Scent families'),
      S.documentTypeListItem('occasion').title('Occasions'),
    ])
