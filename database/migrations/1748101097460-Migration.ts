import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748101097460 implements MigrationInterface {
  name = 'Migration1748101097460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\` DROP FOREIGN KEY \`FK_6bbe63d2fe75e7f0ba1710351d4\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\` DROP FOREIGN KEY \`FK_14c30a7be4a8c080ab884d750f7\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\` DROP FOREIGN KEY \`FK_6e115a5fcf13142545f9bd73032\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`reply\` DROP FOREIGN KEY \`FK_0d98e8ade07b472e8af8b856e1b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\`
            ADD \`deleted_at\` datetime(6) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\`
            ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\`
            ADD \`deleted_at\` datetime(6) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\`
            ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) 
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\`
            ADD \`deleted_at\` datetime(6) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\`
            ADD CONSTRAINT \`FK_6bbe63d2fe75e7f0ba1710351d4\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\`
            ADD CONSTRAINT \`FK_6e115a5fcf13142545f9bd73032\` FOREIGN KEY (\`cancer_id\`) REFERENCES \`cancer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`reply\`
            ADD CONSTRAINT \`FK_0d98e8ade07b472e8af8b856e1b\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`reply\` DROP FOREIGN KEY \`FK_0d98e8ade07b472e8af8b856e1b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\` DROP FOREIGN KEY \`FK_6e115a5fcf13142545f9bd73032\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\` DROP FOREIGN KEY \`FK_6bbe63d2fe75e7f0ba1710351d4\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` DROP COLUMN \`deleted_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`survey_answer_user\` DROP COLUMN \`created_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\` DROP COLUMN \`deleted_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\` DROP COLUMN \`created_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\` DROP COLUMN \`deleted_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`reply\`
            ADD CONSTRAINT \`FK_0d98e8ade07b472e8af8b856e1b\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\`
            ADD CONSTRAINT \`FK_6e115a5fcf13142545f9bd73032\` FOREIGN KEY (\`cancer_id\`) REFERENCES \`cancer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\`
            ADD CONSTRAINT \`FK_14c30a7be4a8c080ab884d750f7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\`
            ADD CONSTRAINT \`FK_6bbe63d2fe75e7f0ba1710351d4\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
