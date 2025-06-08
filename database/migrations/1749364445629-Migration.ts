import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749364445629 implements MigrationInterface {
  name = 'Migration1749364445629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article_image\` CHANGE \`article_id\` \`article_id\` int NOT NULL COMMENT '기사번호'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article_image\` CHANGE \`article_id\` \`article_id\` int UNSIGNED NOT NULL COMMENT '기사번호'
        `);
  }
}
