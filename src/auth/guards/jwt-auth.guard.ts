import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';

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
    // @Public() 데코레이터가 있는지 확인
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // 메소드 레벨 데코레이터 확인
      context.getClass(), // 클래스 레벨 데코레이터 확인
    ]);

    // 공개 라우트인 경우 인증 없이 통과
    if (isPublic) {
      return true;
    }

    // HTTP 요청에서 토큰 추출
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    // 토큰이 없으면 401 Unauthorized 에러
    if (!token) {
      throw new UnauthorizedException('토큰이 필요합니다.');
    }

    // 부모 클래스(AuthGuard)의 JWT 검증 로직 실행
    return super.canActivate(context);
  }

  /**
   * HTTP 요청 헤더에서 Bearer 토큰을 추출하는 헬퍼 메서드
   * Authorization: Bearer {token} 형식에서 토큰 부분만 추출
   */
  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : '';
  }
}
