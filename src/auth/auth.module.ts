import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { EmailModule } from '@email/email.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthStrategy } from '@auth/strategy/local-auth.strategy';

@Module({
  imports: [ConfigModule, UserModule, EmailModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy],
})
export class AuthModule {}
