declare global {
  namespace Express {
    interface User {
      admin_id: number;         // Unique identifier for the admin
      email: string;            // Admin's email address
      password: string;         // Hashed password
      last_login: Date | null;  // Timestamp of last login
      created_at: Date;         // Timestamp of when the record was created
      updated_at: Date;         // Timestamp of last update
    }
  }
}

// Ensure the file is treated as a module
export {};