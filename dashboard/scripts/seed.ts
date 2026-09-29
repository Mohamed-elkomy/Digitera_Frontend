import {createReadStream} from 'node:fs'
import {basename, resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'
import catalogue from '../seed/catalogue.json'

/**
 * Loads the storefront's catalogue into Sanity: taxonomies, 24 products with
 * their photographs, and approved reviews. Safe to run again — every document
 * has a fixed id, so a second run updates instead of duplicating.
 */
const client = getCliClient({apiVersion: '2026-09-23'})
const PUBLIC_DIR = resolve(process.cwd(), '../public')

type Taxonomy = 'category' | 'scentFamily' | 'occasion'
const taxonomyId = (type: Taxonomy, slug: string) => `${type}-${slug}`
const ref = (id: string) => ({_type: 'reference', _ref: id})

const uploaded = new Map<string, string>()
async function uploadImage(publicPath: string): Promise<string> {
  const cached = uploaded.get(publicPath)
  if (cached) return cached
  const asset = await client.assets.upload(
    'image',
    createReadStream(resolve(PUBLIC_DIR, `.${publicPath}`)),
    {filename: basename(publicPath)},
  )
  uploaded.set(publicPath, asset._id)
  return asset._id
}

async function seed() {
  for (const [type, entries] of Object.entries(catalogue.taxonomies)) {
    for (const [slug, title] of Object.entries(entries)) {
      await client.createOrReplace({
        _id: taxonomyId(type as Taxonomy, slug),
        _type: type,
        title,
        slug: {_type: 'slug', current: slug},
      })
    }
    console.log(`✓ ${type}`)
  }

  for (const product of catalogue.products) {
    const images = []
    for (const [index, path] of product.images.entries()) {
      images.push({
        _type: 'image',
        _key: `image-${index}`,
        alt: `${product.name} perfume bottle`,
        asset: ref(await uploadImage(path)),
      })
    }

    await client.createOrReplace({
      _id: `product-${product.id}`,
      _type: 'product',
      name: product.name,
      slug: {_type: 'slug', current: product.id},
      sku: product.sku,
      description: product.description,
      notes: product.notes,
      scentNotes: product.scentNotes,
      availability: product.availability,
      giftWrappingAvailable: product.giftWrappingAvailable,
      variants: product.variants.map(({id, ...variant}) => ({
        _type: 'productVariant',
        _key: id,
        variantId: id,
        ...variant,
      })),
      images,
      category: ref(taxonomyId('category', product.category)),
      scentFamily: ref(taxonomyId('scentFamily', product.scentFamily)),
      occasion: ref(taxonomyId('occasion', product.occasion)),
    })
    console.log(`✓ product ${product.id}`)
  }

  for (const review of catalogue.reviews) {
    await client.createOrReplace({
      _id: review.id,
      _type: 'review',
      product: ref(`product-${review.productId}`),
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      approved: true,
    })
  }
  console.log(`✓ ${catalogue.reviews.length} reviews`)
}

seed().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
