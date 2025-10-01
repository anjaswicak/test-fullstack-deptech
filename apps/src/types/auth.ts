export interface User {
  id: number;
  name: string;
  nama_depan: string;
  nama_belakang: string;
  email: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  role: 'super_admin' | 'admin' | 'user';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}