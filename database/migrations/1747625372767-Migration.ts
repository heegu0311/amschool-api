import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747625372767 implements MigrationInterface {
  name = 'Migration1747625372767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`social_id\` varchar(255) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`social_id\`
        `);
  }
}
