import type { Driver, Job, Truck } from '../types/index';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Driver endpoints
  async getDrivers(): Promise<Driver[]> {
    return this.request<Driver[]>('/drivers/');{}
  }

  async getDriver(id: number): Promise<Driver> {
    return this.request<Driver>(`/drivers/${id}`);
  }

  async createDriver(driver: Omit<Driver, 'id'>): Promise<Driver> {
    return this.request<Driver>('/drivers', {
      method: 'POST',
      body: JSON.stringify(driver),
    });
  }

  async updateDriver(id: number, driver: Partial<Driver>): Promise<Driver> {
    return this.request<Driver>(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driver),
    });
  }

  async deleteDriver(id: number): Promise<void> {
    return this.request<void>(`/drivers/${id}`, {
      method: 'DELETE',
    });
  }

  // Job endpoints
  async getJobs(): Promise<Job[]> {
    return this.request<Job[]>('/jobs');
  }

  async getJob(id: number): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`);
  }

  async createJob(job: Omit<Job, 'id'>): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async updateJob(id: number, job: Partial<Job>): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    });
  }

  async deleteJob(id: number): Promise<void> {
    return this.request<void>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Truck endpoints
  async getTrucks(): Promise<Truck[]> {
    return this.request<Truck[]>('/trucks');
  }

  async getTruck(id: number): Promise<Truck> {
    return this.request<Truck>(`/trucks/${id}`);
  }

  async createTruck(truck: Omit<Truck, 'id'>): Promise<Truck> {
    return this.request<Truck>('/trucks', {
      method: 'POST',
      body: JSON.stringify(truck),
    });
  }

  async updateTruck(id: number, truck: Partial<Truck>): Promise<Truck> {
    return this.request<Truck>(`/trucks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(truck),
    });
  }

  async deleteTruck(id: number): Promise<void> {
    return this.request<void>(`/trucks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();