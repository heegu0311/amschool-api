import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749308072572 implements MigrationInterface {
  name = 'Migration1749308072572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`provider\`
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`provider\` varchar(255) NULL
        `);
  }
}
