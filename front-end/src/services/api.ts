import type { Driver, Job, Truck, Maintenance, EntityType } from '../types';

const API_BASE_URL = 'http://localhost:8000/';

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


  async get<T>(endpoint: EntityType): Promise<T[]> {
    return this.request(endpoint)
  }

  async create<T>(endpoint: EntityType, body: Omit<T, "id">): Promise<T> {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body)
    })
  }

  async update<T>(endpoint: EntityType,id:number, body: Partial<T>): Promise<T>{
    return this.request(`${endpoint}/${id}`,{
      method: "PUT",
      body: JSON.stringify(body)
    })
  }

  async delete(endpoint: EntityType, id: number): Promise<{detail: String }>{
    return this.request(`${endpoint}/${id}`, {
      method: "DELETE",
    })
  }

//   // Driver endpoints
//   async getDrivers(): Promise<Driver[]> {
//     return this.request<Driver[]>('/drivers/');{}
//   }

//   async getDriver(id: number): Promise<Driver> {
//     return this.request<Driver>(`/drivers/${id}`);
//   }

//   async createDriver(driver: Omit<Driver, 'id'>): Promise<Driver> {
//     return this.request<Driver>('/drivers', {
//       method: 'POST',
//       body: JSON.stringify(driver),
//     });
//   }

//   async updateDriver(id: number, driver: Partial<Driver>): Promise<Driver> {
//     return this.request<Driver>(`/drivers/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(driver),
//     });
//   }

//   async deleteDriver(id: number): Promise<void> {
//     return this.request<void>(`/drivers/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   // Job endpoints
//   async getJobs(): Promise<Job[]> {
//     return this.request<Job[]>('/jobs');
//   }

//   async getJob(id: number): Promise<Job> {
//     return this.request<Job>(`/jobs/${id}`);
//   }

//   async createJob(job: Omit<Job, 'id'>): Promise<Job> {
//     return this.request<Job>('/jobs', {
//       method: 'POST',
//       body: JSON.stringify(job),
//     });
//   }

//   async updateJob(id: number, job: Partial<Job>): Promise<Job> {
//     return this.request<Job>(`/jobs/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(job),
//     });
//   }

//   async deleteJob(id: number): Promise<void> {
//     return this.request<void>(`/jobs/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   // Truck endpoints
//   async getTrucks(): Promise<Truck[]> {
//     return this.request<Truck[]>('/trucks');
//   }

//   async getTruck(id: number): Promise<Truck> {
//     return this.request<Truck>(`/trucks/${id}`);
//   }

//   async createTruck(truck: Omit<Truck, 'id'>): Promise<Truck> {
//     return this.request<Truck>('/trucks', {
//       method: 'POST',
//       body: JSON.stringify(truck),
//     });
//   }

//   async updateTruck(id: number, truck: Partial<Truck>): Promise<Truck> {
//     return this.request<Truck>(`/trucks/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(truck),
//     });
//   }

//   async deleteTruck(id: number): Promise<void> {
//     return this.request<void>(`/trucks/${id}`, {
//       method: 'DELETE',
//     });
//   }


}

// Maintenance endpoints


export const apiService = new ApiService();




// const pepe = await apiService.createDriver({
//   first_name: "marcos",
//   email: "marcos",
//   is_active: true,
//   license_number:"marcos",
//   last_name:"marcos",
//   license_expiration: "021/123/2123",
//   phone_number: "2313124"
// })

// const pepe = await apiService.post<Job>("jobs", {

// })

// const pepe = await apiService.put<Job>("jobs",{
  
  
  
// })

// const pepito = await apiService.delete("jobs",12)