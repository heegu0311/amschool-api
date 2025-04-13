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
      user = await this.usersService.create(socialUser as any);
    }

    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
