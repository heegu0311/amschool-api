import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749361694761 implements MigrationInterface {
  name = 'Migration1749361694761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article_image\`
            ADD \`deleted_at\` datetime(6) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article_image\` DROP COLUMN \`deleted_at\`
        `);
  }
}
