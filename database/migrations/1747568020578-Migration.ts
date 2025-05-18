import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747568020578 implements MigrationInterface {
  name = 'Migration1747568020578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`is_admin\` tinyint NOT NULL DEFAULT 0
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` DROP FOREIGN KEY \`FK_e6044fecb41fc9ef58e27d3e1b5\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` DROP FOREIGN KEY \`FK_074e6e55817ab8b0652231755bf\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` CHANGE \`user_id\` \`user_id\` int NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` CHANGE \`survey_answer_id\` \`survey_answer_id\` int NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\`
            ADD CONSTRAINT \`FK_e6044fecb41fc9ef58e27d3e1b5\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\`
            ADD CONSTRAINT \`FK_074e6e55817ab8b0652231755bf\` FOREIGN KEY (\`survey_answer_id\`) REFERENCES \`survey_answer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` DROP FOREIGN KEY \`FK_074e6e55817ab8b0652231755bf\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` DROP FOREIGN KEY \`FK_e6044fecb41fc9ef58e27d3e1b5\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` CHANGE \`survey_answer_id\` \`survey_answer_id\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` CHANGE \`user_id\` \`user_id\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\`
            ADD CONSTRAINT \`FK_074e6e55817ab8b0652231755bf\` FOREIGN KEY (\`survey_answer_id\`) REFERENCES \`survey_answer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\`
            ADD CONSTRAINT \`FK_e6044fecb41fc9ef58e27d3e1b5\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`is_admin\`
        `);
  }
}
