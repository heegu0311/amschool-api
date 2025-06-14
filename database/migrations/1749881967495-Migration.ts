import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749881967495 implements MigrationInterface {
  name = 'Migration1749881967495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`post\`
            ADD \`is-anonymous\` tinyint NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`post\` DROP COLUMN \`is-anonymous\`
        `);
  }
}
