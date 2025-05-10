import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746866831415 implements MigrationInterface {
  name = 'Migration1746866831415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article\`
            ADD \`deleted_at\` datetime(6) NULL COMMENT '삭제일'
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\` CHANGE \`external_exposure\` \`external_exposure\` enum ('O', 'F') NOT NULL COMMENT '온/ 오프' DEFAULT 'O'
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL COMMENT '등록일' DEFAULT CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    await queryRunner.query(`
            ALTER TABLE \`article_image\`
            ADD CONSTRAINT \`FK_3028aca90c01501293e055ee394\` FOREIGN KEY (\`article_id\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\`
            ADD CONSTRAINT \`FK_fa4e45a374237c3bc8a0e6cba11\` FOREIGN KEY (\`section_primary_code\`) REFERENCES \`section_primary\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\`
            ADD CONSTRAINT \`FK_979f6017bf11ab569c8729588d7\` FOREIGN KEY (\`section_secondary_code\`) REFERENCES \`section_secondary\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_979f6017bf11ab569c8729588d7\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_fa4e45a374237c3bc8a0e6cba11\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`article_image\` DROP FOREIGN KEY \`FK_3028aca90c01501293e055ee394\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\` CHANGE \`updated_at\` \`updated_at\` datetime(0) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\` CHANGE \`external_exposure\` \`external_exposure\` enum CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" ('O', 'F') NOT NULL COMMENT '온/오프' DEFAULT 'O'
        `);
    await queryRunner.query(`
            ALTER TABLE \`article\` DROP COLUMN \`deleted_at\`
        `);
  }
}
