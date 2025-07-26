import {
  User,
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
} from '@/types';
import usersData from '@/data/users.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage for session
const SESSION_KEY = 'forge3d_auth_token';
const USER_KEY = 'forge3d_user';

export class AuthService {
  private static users: User[] = usersData as User[];

  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    await delay(800); // Simulate API call

    const user = this.users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
        data: null as any,
      };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };

    const token = `mock_token_${user.id}_${Date.now()}`;

    // Store in localStorage
    localStorage.setItem(SESSION_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: authUser,
        token,
      },
    };
  }

  static async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    await delay(1000); // Simulate API call

    // Check if user already exists
    const existingUser = this.users.find(
      u => u.email === data.email || u.username === data.username
    );

    if (existingUser) {
      return {
        success: false,
        message: 'User with this email or username already exists',
        data: null as any,
      };
    }

    // Create new user
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      ...data,
      avatar: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    const authUser: AuthUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      role: newUser.role,
    };

    const token = `mock_token_${newUser.id}_${Date.now()}`;

    // Store in localStorage
    localStorage.setItem(SESSION_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));

    return {
      success: true,
      message: 'Registration successful',
      data: {
        user: authUser,
        token,
      },
    };
  }

  static async logout(): Promise<ApiResponse<null>> {
    await delay(300);

    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);

    return {
      success: true,
      message: 'Logged out successfully',
      data: null,
    };
  }

  static async getCurrentUser(): Promise<ApiResponse<AuthUser | null>> {
    await delay(200);

    const token = localStorage.getItem(SESSION_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (!token || !userStr) {
      return {
        success: true,
        message: 'No user logged in',
        data: null,
      };
    }

    try {
      const user = JSON.parse(userStr) as AuthUser;
      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch {
      return {
        success: false,
        message: 'Invalid user data',
        data: null,
      };
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(SESSION_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(SESSION_KEY);
  }
}
