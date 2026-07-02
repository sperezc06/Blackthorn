import { APIRequestContext, APIResponse } from '@playwright/test';
import { FAKESTORE_URL } from '../config/test-data';

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export class FakeStoreClient {
  private readonly defaultHeaders = {
    Accept: 'application/json',
    'User-Agent':
      'Mozilla/5.0 (compatible; SauceDemo-QA/1.0; +https://github.com/sperezc06/Blackthorn)',
  };

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string = FAKESTORE_URL,
  ) {}

  async getProducts(): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/products`, { headers: this.defaultHeaders });
  }

  async getProductById(id: number): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/products/${id}`, { headers: this.defaultHeaders });
  }
}
