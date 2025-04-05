import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { SocialUser } from '../interfaces/social-user.interface';

@Injectable()
export class SocialAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async socialLogin(socialUser: SocialUser) {
    let user = await this.usersService.findByEmail(socialUser.email);

    if (!user) {
      user = await this.usersService.create({
        email: socialUser.email,
        name: socialUser.name,
        provider: socialUser.provider,
        providerId: socialUser.providerId,
        username: socialUser.email.split('@')[0],
        password: '',
        signin_provider: socialUser.provider,
        nickname: socialUser.name,
        intro: '',
        user_type: 'user',
        profile: '',
      });
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
