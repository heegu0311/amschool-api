import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionPrimaryDto } from './create-section_primary.dto';

export class UpdateSectionPrimaryDto extends PartialType(CreateSectionPrimaryDto) {}
