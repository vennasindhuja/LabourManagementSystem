import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultAdmin();
  }

  async seedDefaultAdmin() {
    try {
      const adminExists = await this.userRepo.findOne({
        where: { username: 'admin' },
      });

      if (!adminExists) {
        const admin = this.userRepo.create({
          username: 'admin',
          password: 'admin123',
          fullName: 'Site Administrator',
          email: 'admin@buildlabour.io',
          role: 'Admin',
        });
        await this.userRepo.save(admin);
        this.logger.log('✅ Default admin account initialized: admin / admin123');
      }
    } catch (err) {
      this.logger.error('Error seeding admin user:', err);
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userRepo.findOne({
      where: { username },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // In a production setup, generate a JWT. For this local LMS setup, return session payload
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token: `auth-token-${user.id}-${Date.now()}`,
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }
}
