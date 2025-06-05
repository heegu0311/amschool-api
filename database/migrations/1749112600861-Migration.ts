import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749112600861 implements MigrationInterface {
    name = 'Migration1749112600861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`article\` CHANGE \`cancer_category\` \`cancer_id\` int NULL COMMENT '암 카테고리'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`article\` CHANGE \`cancer_id\` \`cancer_category\` int NULL COMMENT '암 카테고리'
        `);
    }

}
