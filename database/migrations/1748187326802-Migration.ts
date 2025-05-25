import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748187326802 implements MigrationInterface {
  name = 'Migration1748187326802';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`id\` int NOT NULL PRIMARY KEY
        `);
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\`
            ADD CONSTRAINT \`FK_6bbe63d2fe75e7f0ba1710351d4\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_45a57d766acc2084c45a8a8a35f\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`reply\`
            ADD CONSTRAINT \`FK_0d98e8ade07b472e8af8b856e1b\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`reaction_entity\`
            ADD CONSTRAINT \`FK_6e2e8ce528b18e1dcd4377b036b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`emotion\`
            ADD CONSTRAINT \`FK_0d6b8c8780445e2524ec6c589bf\` FOREIGN KEY (\`parent_id\`) REFERENCES \`emotion\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`diary\`
            ADD CONSTRAINT \`FK_eba300fd6bc889d6cbde2140182\` FOREIGN KEY (\`emotion_id\`) REFERENCES \`emotion\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`diary\`
            ADD CONSTRAINT \`FK_2d85d5c24a470e1c92f58bd0827\` FOREIGN KEY (\`sub_emotion_id\`) REFERENCES \`emotion\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`diary\`
            ADD CONSTRAINT \`FK_1f959f21deabc56761c5cfb8bcf\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`post\`
            ADD CONSTRAINT \`FK_2f1a9ca8908fc8168bc18437f62\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_2f1a9ca8908fc8168bc18437f62\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`diary\` DROP FOREIGN KEY \`FK_1f959f21deabc56761c5cfb8bcf\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`diary\` DROP FOREIGN KEY \`FK_2d85d5c24a470e1c92f58bd0827\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`diary\` DROP FOREIGN KEY \`FK_eba300fd6bc889d6cbde2140182\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`emotion\` DROP FOREIGN KEY \`FK_0d6b8c8780445e2524ec6c589bf\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`reaction_entity\` DROP FOREIGN KEY \`FK_6e2e8ce528b18e1dcd4377b036b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`reply\` DROP FOREIGN KEY \`FK_0d98e8ade07b472e8af8b856e1b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_45a57d766acc2084c45a8a8a35f\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\` DROP FOREIGN KEY \`FK_6bbe63d2fe75e7f0ba1710351d4\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`id\`
        `);
  }
}
