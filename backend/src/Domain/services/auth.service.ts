import jwt from 'jsonwebtoken';
import { UserRepository } from '../../Infrastructure/repositories/user.repository';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(data: { email: string; password: string; fullName: string; role?: string }) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await this.userRepository.create(data);

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  async loginUser(email: string, password: string) {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isPasswordValid = await this.userRepository.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate token
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    };
  }

  private generateToken(user: any) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
  }
}