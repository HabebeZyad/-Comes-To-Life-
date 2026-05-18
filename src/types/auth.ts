export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  name: string;
}

