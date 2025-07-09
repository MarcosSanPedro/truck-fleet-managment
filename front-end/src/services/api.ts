
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

/**
 * ApiService class for handling API requests to the backend.
 * Provides methods for CRUD operations on entities.
 */
class ApiService {
  private baseUrl: string;

  /**
   * Creates an instance of ApiService.
   * 
   * @param {string} baseUrl - The base URL of the API.
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Makes an API request to the specified endpoint and returns the JSON response.
   * 
   * @template T - The expected response type.
   * @param {string} endpoint - The API endpoint to request.
   * @param {RequestInit} [options] - Optional fetch options.
   * @returns {Promise<T>} A promise that resolves to the response data.
   * @throws {Error} If the API request fails.
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = new URL(endpoint + "/", this.baseUrl).toString();
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      let backendDetail = "";
      let code = undefined;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          backendDetail = errorData.detail;
          errorMessage = errorData.detail;
        }
        if (errorData.code) {
          code = errorData.code;
        }
      } catch {
        // Ignore if response is not JSON
      }
      const error: any = new Error(errorMessage);
      error.status = response.status;
      if (code) error.code = code;
      throw error;
    }

    return response.json();
  }

  /**
   * Retrieves a list of entities from the specified endpoint.
   * 
   * @template T - The type of the entities.
   * @param {string} endpoint - The API endpoint for the entities.
   * @returns {Promise<T[]>} A promise that resolves to an array of entities.
   * @throws {Error} If the API request fails.
   */
  async get<T>(endpoint: string): Promise<T[]> {
    return this.request<T[]>(endpoint);
  }

  async getById<T>(endpoint: string, id: number): Promise<T> {
    return this.request<T>(`${endpoint}/${id}`);
  }


  /**
   * Creates a new entity at the specified endpoint.
   * 
   * @template T - The type of the entity.
   * @param {string} endpoint - The API endpoint for the entities.
   * @param {Omit<T, "id">} body - The entity data to create, excluding the id.
   * @returns {Promise<T>} A promise that resolves to the created entity.
   * @throws {Error} If the API request fails.
   */
  async create<T>(endpoint: string, body: Omit<T, "id">): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * Updates an existing entity at the specified endpoint.
   * 
   * @template T - The type of the entity.
   * @param {string} endpoint - The API endpoint for the entities.
   * @param {number} id - The ID of the entity to update.
   * @param {Partial<T>} body - The partial entity data to update.
   * @returns {Promise<T>} A promise that resolves to the updated entity.
   * @throws {Error} If the API request fails.
   */
  async update<T>(endpoint: string, id: number, body: Partial<T>): Promise<T> {
    return this.request<T>(`${endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  /**
   * Deletes an entity at the specified endpoint.
   * 
   * @param {string} endpoint - The API endpoint for the entities.
   * @param {number} id - The ID of the entity to delete.
   * @returns {Promise<void>} A promise that resolves when the entity is deleted.
   * @throws {Error} If the API request fails.
   */
  async delete(endpoint: string, id: number): Promise<void> {
    const url = new URL(`${endpoint}/${id}`, this.baseUrl).toString();
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch {
        // Ignore if response is not JSON
      }
      throw new Error(errorMessage);
    }
  }
}



export const apiService = new ApiService(API_BASE_URL);

