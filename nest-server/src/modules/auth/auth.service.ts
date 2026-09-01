import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Session, SessionDocument } from './schemas/session.schema';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async createSession(createSessionDto: CreateSessionDto, userAgent: string) {
    const user = await this.usersService.findByEmail(createSessionDto.email);
    if (!user || !user.comparePassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await user.comparePassword(createSessionDto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const session = await this.sessionModel.create({
      user: user._id,
      userAgent,
      valid: true,
    });

    const userObj = user.toObject();
    delete userObj.password;

    const payload = {
      ...userObj,
      _id: user._id.toString(),
      session: session._id.toString(),
    };

    const accessTokenTtl = (this.configService.get<string>('accessTokenTtl') || '15m') as any;
    const refreshTokenTtl = (this.configService.get<string>('refreshTokenTtl') || '1y') as any;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenTtl,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwtRefreshSecret') || 'supersecretrefreshjwtkey1234567890',
      expiresIn: refreshTokenTtl,
    });

    return { accessToken, refreshToken };
  }

  async findUserSessions(userId: string) {
    return this.sessionModel.find({ user: new mongoose.Types.ObjectId(userId), valid: true }).exec();
  }

  async deleteSession(sessionId: string) {
    await this.sessionModel.updateOne({ _id: new mongoose.Types.ObjectId(sessionId) }, { valid: false }).exec();
    return {
      accessToken: null,
      refreshToken: null,
    };
  }
}
