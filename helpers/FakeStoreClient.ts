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
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string = FAKESTORE_URL,
  ) {}

  async getProducts(): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/products`);
  }

  async getProductById(id: number): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/products/${id}`);
  }
}
