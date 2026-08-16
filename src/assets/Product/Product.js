import { getCollection, setCollection } from '../../Database/db/Localdb'
import { products as clothingProducts } from '../../Database/Data/Clothing_data'
import { accessoryProducts } from '../../Database/Data/Accessories_data'
import { electricalProducts } from '../../Database/Data/Electronics_data'

const STORAGE_KEY = 'products'

function withUniqueIds(items, department) {
  return items.map((item) => ({
    ...item,
    department,
    id: `${department}-${item.id}`,
  }))
}


const Catalog = [
  ...withUniqueIds(clothingProducts, 'clothing'),
  ...withUniqueIds(accessoryProducts, 'accessories'),
  ...withUniqueIds(electricalProducts, 'electronics'),
]

export async function getProducts() {
  return getCollection(STORAGE_KEY, Catalog)
}

export async function createProduct(product) {
  const current = getCollection(STORAGE_KEY, Catalog)
  const newProduct = {
    ...product,
    id: product.id ?? `custom-${Date.now()}`,
  }
  
  const updated = [...current, newProduct]
  setCollection(STORAGE_KEY, updated)
  return newProduct
}

export async function updateProduct(productId, updates) {
  const current = getCollection(STORAGE_KEY, Catalog)
  let updatedProduct = null
  const updated = current.map((p) => {
    if (p.id === productId) {
      updatedProduct = { ...p, ...updates }
      return updatedProduct
    }
    return p
  })

  if (!updatedProduct) throw new Error('Product not found.')

  setCollection(STORAGE_KEY, updated)
  return updatedProduct
}

export async function deleteProduct(productId) {
  const current = getCollection(STORAGE_KEY, Catalog)
  const exists = current.some((p) => p.id === productId)

  if (!exists) throw new Error('Product not found.')

  const updated = current.filter((p) => p.id !== productId)
  setCollection(STORAGE_KEY, updated)
  return { id: productId, deleted: true }
}