import { z } from "zod";

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  product_type: string;
  tags: string[];
  images: {
    id: string;
    src: string;
    alt?: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: string;
    compare_at_price?: string;
    inventory_quantity: number;
    sku?: string;
  }[];
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: {
    src: string;
    alt?: string;
  };
  products_count: number;
  sort_order: string;
}

export interface ShopifyStore {
  id: string;
  name: string;
  email: string;
  domain: string;
  currency: string;
  timezone: string;
  country_name: string;
  province?: string;
  city?: string;
  phone?: string;
  description?: string;
}

export interface ShopifyStoreData {
  store: ShopifyStore;
  products: ShopifyProduct[];
  collections: ShopifyCollection[];
  totalProducts: number;
  totalCollections: number;
  totalOrders: number;
}

export class ShopifyAPI {
  private baseUrl: string;
  private accessToken: string;

  constructor(shopDomain: string, accessToken: string) {
    this.baseUrl = `https://${shopDomain}.myshopify.com/admin/api/2023-10`;
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/shop.json');
      return true;
    } catch (error) {
      console.error('Shopify connection validation failed:', error);
      return false;
    }
  }

  async getStore(): Promise<ShopifyStore> {
    const response = await this.makeRequest('/shop.json');
    const shop = response.shop;
    
    return {
      id: shop.id.toString(),
      name: shop.name,
      email: shop.email,
      domain: shop.domain,
      currency: shop.currency,
      timezone: shop.timezone,
      country_name: shop.country_name,
      province: shop.province,
      city: shop.city,
      phone: shop.phone,
      description: shop.description,
    };
  }

  async getProducts(limit: number = 250): Promise<ShopifyProduct[]> {
    const response = await this.makeRequest(`/products.json?limit=${limit}&status=active`);
    
    return response.products.map((product: any) => ({
      id: product.id.toString(),
      title: product.title,
      handle: product.handle,
      description: product.body_html || '',
      vendor: product.vendor,
      product_type: product.product_type,
      tags: product.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
      images: product.images.map((image: any) => ({
        id: image.id.toString(),
        src: image.src,
        alt: image.alt,
      })),
      variants: product.variants.map((variant: any) => ({
        id: variant.id.toString(),
        title: variant.title,
        price: variant.price,
        compare_at_price: variant.compare_at_price,
        inventory_quantity: variant.inventory_quantity || 0,
        sku: variant.sku,
      })),
      options: product.options.map((option: any) => ({
        id: option.id.toString(),
        name: option.name,
        values: option.values,
      })),
    }));
  }

  async getCollections(limit: number = 250): Promise<ShopifyCollection[]> {
    const response = await this.makeRequest(`/custom_collections.json?limit=${limit}`);
    const smartResponse = await this.makeRequest(`/smart_collections.json?limit=${limit}`);
    
    const allCollections = [...response.custom_collections, ...smartResponse.smart_collections];
    
    return allCollections.map((collection: any) => ({
      id: collection.id.toString(),
      title: collection.title,
      handle: collection.handle,
      description: collection.body_html || '',
      image: collection.image ? {
        src: collection.image.src,
        alt: collection.image.alt,
      } : undefined,
      products_count: collection.products_count || 0,
      sort_order: collection.sort_order || 'manual',
    }));
  }

  async getOrdersCount(): Promise<number> {
    try {
      const response = await this.makeRequest('/orders/count.json');
      return response.count;
    } catch (error) {
      console.error('Failed to get orders count:', error);
      return 0;
    }
  }

  async getProductsCount(): Promise<number> {
    try {
      const response = await this.makeRequest('/products/count.json');
      return response.count;
    } catch (error) {
      console.error('Failed to get products count:', error);
      return 0;
    }
  }

  async getCollectionsCount(): Promise<number> {
    try {
      const customResponse = await this.makeRequest('/custom_collections/count.json');
      const smartResponse = await this.makeRequest('/smart_collections/count.json');
      return customResponse.count + smartResponse.count;
    } catch (error) {
      console.error('Failed to get collections count:', error);
      return 0;
    }
  }

  async getAllStoreData(): Promise<ShopifyStoreData> {
    try {
      const [store, products, collections, totalProducts, totalCollections, totalOrders] = await Promise.all([
        this.getStore(),
        this.getProducts(),
        this.getCollections(),
        this.getProductsCount(),
        this.getCollectionsCount(),
        this.getOrdersCount(),
      ]);

      return {
        store,
        products,
        collections,
        totalProducts,
        totalCollections,
        totalOrders,
      };
    } catch (error) {
      console.error('Failed to fetch complete store data:', error);
      throw new Error('Failed to fetch store data from Shopify');
    }
  }
}

export function createShopifyAPI(shopDomain: string, accessToken: string): ShopifyAPI {
  return new ShopifyAPI(shopDomain, accessToken);
}