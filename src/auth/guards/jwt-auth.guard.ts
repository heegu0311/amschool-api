import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JWT 인증을 처리하는 가드
 * AuthGuard('jwt')를 상속받아 기본 JWT 인증 기능을 확장
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Reflector를 주입받아 메타데이터(데코레이터 정보)를 읽을 수 있게 함
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * NestJS가 자동으로 호출하는 인증 처리 메서드
   * 라우트 핸들러가 실행되기 전에 실행됨
   * @param context 실행 컨텍스트 (요청/응답 정보를 포함)
   * @returns true면 요청 진행, false면 요청 거부
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (isPublic) {
      if (token) {
        return super.canActivate(context);
      }

      return true;
    } else {
      if (token) {
        return super.canActivate(context);
      }

      throw new UnauthorizedException('토큰이 필요합니다.');
    }
  }

  /**
   * HTTP 요청 헤더에서 Bearer 토큰을 추출하는 헬퍼 메서드
   * Authorization: Bearer {token} 형식에서 토큰 부분만 추출
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
