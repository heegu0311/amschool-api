import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748957676401 implements MigrationInterface {
  name = 'Migration1748957676401';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_5a439a16c76d63e046765cdb84f\`
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`comment\`
            ADD CONSTRAINT \`FK_5a439a16c76d63e046765cdb84f\` FOREIGN KEY (\`entity_id\`) REFERENCES \`diary\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
