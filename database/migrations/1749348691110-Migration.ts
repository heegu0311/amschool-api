import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749348691110 implements MigrationInterface {
  name = 'Migration1749348691110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article_image\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`article_image\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article_image\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`article_image\` CHANGE \`created_at\` \`created_at\` datetime(6) NULL
        `);
  }
}
