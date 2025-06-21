import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750515523824 implements MigrationInterface {
  name = 'Migration1750515523824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE INDEX \`IDX_4481f1a6132bd5362a25438287\` ON \`article\` (\`cancer_id\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`IDX_59da892e3e9826488be8231e7a\` ON \`article\` (\`deleted_at\`)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_59da892e3e9826488be8231e7a\` ON \`article\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_4481f1a6132bd5362a25438287\` ON \`article\`
        `);
  }
}
