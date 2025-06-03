import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748965117612 implements MigrationInterface {
  name = 'Migration1748965117612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`FK_5a439a16c76d63e046765cdb84f\` ON \`comment\`
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE INDEX \`FK_5a439a16c76d63e046765cdb84f\` ON \`comment\` (\`entity_id\`)
        `);
  }
}
