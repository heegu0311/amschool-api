import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748966068113 implements MigrationInterface {
  name = 'Migration1748966068113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`reaction_entity\`
            ADD \`target_type\` enum ('diary', 'post', 'comment', 'reply') NOT NULL COMMENT '공감 대상 엔티티 타입'
        `);
    await queryRunner.query(`
            ALTER TABLE \`reaction_entity\`
            ADD \`target_id\` int NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`reaction_entity\` DROP COLUMN \`target_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`reaction_entity\` DROP COLUMN \`target_type\`
        `);
  }
}
