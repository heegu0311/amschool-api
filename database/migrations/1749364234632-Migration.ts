import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749364234632 implements MigrationInterface {
    name = 'Migration1749364234632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`FK_3028aca90c01501293e055ee394\` ON \`article_image\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`article_image\` CHANGE \`article_id\` \`article_id\` int UNSIGNED NOT NULL COMMENT '기사번호'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`article_image\` CHANGE \`article_id\` \`article_id\` int UNSIGNED NOT NULL COMMENT '기사번호' DEFAULT '0'
        `);
        await queryRunner.query(`
            CREATE INDEX \`FK_3028aca90c01501293e055ee394\` ON \`article_image\` (\`article_id\`)
        `);
    }

}
