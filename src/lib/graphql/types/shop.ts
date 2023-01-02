export const productTypeDef = `
  type ProductCategory {
    id: String!
    title: String!
    slug: String!
    description: String
    products: [String]
    createdAt: Date
    updatedAt: Date
  }

  type Product {
    id: String!
    title: String!
    price: Number!
    slug: String!
    published: Boolean!
    image: {
      publicId: String!
      url: String!
      width: Number!
      height: Number!
    }
    description: String
    category: ProductCategory!
    createdAt: Date
    updatedAt: Date
  }
`

export const orderTypeDef = `
  type OrderStatus = 'PENDING' | 'DISPATCHED'

  type Order {
    id: String!
    user: String!
    products: [String!]!
    status: OrderStatus!
    createdAt: Date
    updatedAt: Date
  }
`