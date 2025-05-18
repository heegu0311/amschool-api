import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747546315189 implements MigrationInterface {
  name = 'Migration1747546315189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`reply\`
            ADD CONSTRAINT \`FK_0d98e8ade07b472e8af8b856e1b\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`reply\` DROP FOREIGN KEY \`FK_0d98e8ade07b472e8af8b856e1b\`
        `);
  }
}
