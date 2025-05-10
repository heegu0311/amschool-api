import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionSecondaryDto } from './create-section_secondary.dto';

export class UpdateSectionSecondaryDto extends PartialType(CreateSectionSecondaryDto) {}
