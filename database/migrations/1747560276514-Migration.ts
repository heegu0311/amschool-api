import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747560276514 implements MigrationInterface {
  name = 'Migration1747560276514';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`agree_service\` tinyint NOT NULL DEFAULT 0
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`agree_privacy\` tinyint NOT NULL DEFAULT 0
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`agree_marketing\` tinyint NOT NULL DEFAULT 0
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`agree_marketing\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`agree_privacy\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`agree_service\`
        `);
  }
}
