import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749052059787 implements MigrationInterface {
    name = 'Migration1749052059787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`article\`
            ADD \`cancer_category\` int NULL COMMENT '암 카테고리'
        `);
        await queryRunner.query(`
            ALTER TABLE \`article\`
            ADD \`is_used\` tinyint NULL COMMENT '사용여부' DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`article\` DROP COLUMN \`is_used\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`article\` DROP COLUMN \`cancer_category\`
        `);
    }

}
