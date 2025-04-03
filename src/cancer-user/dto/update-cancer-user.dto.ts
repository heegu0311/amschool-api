import { PartialType } from '@nestjs/mapped-types';
import { CreateCancerUserDto } from './create-cancer-user.dto';

export class UpdateCancerUserDto extends PartialType(CreateCancerUserDto) {}
