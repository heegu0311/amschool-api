import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746946646982 implements MigrationInterface {
  name = 'Migration1746946646982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`section_secondary\`
            ADD \`is_visible\` enum ('Y', 'N') NULL COMMENT '노출'
        `);
    await queryRunner.query(`
            ALTER TABLE \`section_secondary\`
            ADD \`order\` int NULL COMMENT '순서'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`section_secondary\` DROP COLUMN \`order\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`section_secondary\` DROP COLUMN \`is_visible\`
        `);
  }
}
