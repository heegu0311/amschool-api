import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749363086112 implements MigrationInterface {
  name = 'Migration1749363086112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article_image\` DROP FOREIGN KEY \`FK_3028aca90c01501293e055ee394\`
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article_image\`
            ADD CONSTRAINT \`FK_3028aca90c01501293e055ee394\` FOREIGN KEY (\`article_id\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
