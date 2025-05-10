import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746865651576 implements MigrationInterface {
  name = 'Migration1746865651576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`refresh_token\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NULL,
                \`token\` varchar(255) NOT NULL,
                \`expires_at\` datetime NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`is_revoked\` tinyint NOT NULL DEFAULT 0,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`cancer\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`cancer_user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`cancer_id\` int NOT NULL,
                \`user_id\` int NULL,
                \`cancer_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`ai_answer\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`content\` text NOT NULL,
                \`question_id\` int NOT NULL,
                \`feedback_point\` float NOT NULL DEFAULT '0',
                \`notice\` text NULL,
                \`language\` varchar(255) NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`question_id\` int NULL,
                UNIQUE INDEX \`REL_10cf6ea0791b7f778343c2da4a\` (\`question_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`question\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`type\` varchar(255) NOT NULL DEFAULT 'question',
                \`author_id\` int NOT NULL,
                \`question_summary\` varchar(255) NULL,
                \`content\` text NOT NULL,
                \`access_level\` enum ('public', 'private') NOT NULL DEFAULT 'private',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`author_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`image\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`url\` varchar(255) NOT NULL,
                \`original_name\` varchar(255) NOT NULL,
                \`mime_type\` varchar(255) NOT NULL,
                \`size\` int NOT NULL,
                \`entity_type\` varchar(255) NOT NULL,
                \`entity_id\` int NOT NULL,
                \`order\` int NOT NULL DEFAULT '1',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`entity_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`reply\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`content\` text NOT NULL,
                \`author_id\` int NOT NULL,
                \`entity_type\` varchar(255) NOT NULL,
                \`entity_id\` int NOT NULL,
                \`comment_id\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`comment_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`reaction\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`emoji\` varchar(255) NOT NULL,
                \`reaction_entities_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`reaction_entity\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`entity_type\` enum ('diary', 'comment', 'reply') NOT NULL COMMENT '공감 대상 엔티티 타입',
                \`entity_id\` int NOT NULL,
                \`reaction_id\` int NOT NULL,
                \`user_id\` int NOT NULL,
                \`user_id\` int NULL,
                \`entity_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`emotion\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`code\` varchar(255) NOT NULL,
                \`image_url\` varchar(255) NOT NULL,
                \`order\` int NOT NULL,
                \`parent_id\` int NULL,
                \`parent_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`diary\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`type\` varchar(255) NOT NULL DEFAULT 'diary',
                \`author_id\` int NOT NULL,
                \`content\` text NOT NULL,
                \`access_level\` varchar(255) NOT NULL DEFAULT 'public',
                \`emotion_id\` int NOT NULL,
                \`sub_emotion_id\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`author_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`comment\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`type\` varchar(255) NOT NULL DEFAULT 'comment',
                \`content\` text NOT NULL,
                \`author_id\` int NOT NULL,
                \`entity_type\` varchar(255) NOT NULL,
                \`entity_id\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`entity_id\` int NULL,
                \`author_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`survey_answer\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`value\` varchar(255) NOT NULL,
                \`answer\` varchar(255) NOT NULL,
                \`emoji\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`survey_answer_user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NULL,
                \`survey_answer_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(60) NOT NULL,
                \`password\` varchar(255) NULL,
                \`birthday\` date NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`provider\` varchar(255) NULL,
                \`user_type\` enum ('patient', 'supporter') NOT NULL,
                \`username\` varchar(30) NOT NULL,
                \`profile_type\` enum ('default', 'upload') NOT NULL,
                \`profile_image\` varchar(255) NOT NULL,
                \`intro\` varchar(255) NOT NULL,
                \`gender\` enum ('M', 'F') NULL,
                \`is_public\` tinyint NOT NULL DEFAULT 0,
                \`signin_provider\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`email_verification\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`code\` varchar(255) NOT NULL,
                \`is_verified\` tinyint NOT NULL DEFAULT 0,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`expires_at\` datetime NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\`
            ADD CONSTRAINT \`FK_6bbe63d2fe75e7f0ba1710351d4\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\`
            ADD CONSTRAINT \`FK_14c30a7be4a8c080ab884d750f7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\`
            ADD CONSTRAINT \`FK_6e115a5fcf13142545f9bd73032\` FOREIGN KEY (\`cancer_id\`) REFERENCES \`cancer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`ai_answer\`
            ADD CONSTRAINT \`FK_10cf6ea0791b7f778343c2da4aa\` FOREIGN KEY (\`question_id\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_45a57d766acc2084c45a8a8a35f\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`reply\`
            ADD CONSTRAINT \`FK_aa280a5b48fd06db0868a6fa4e1\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`reaction\`
            ADD CONSTRAINT \`FK_94ebd4963cf79dac1f64bc9dd24\` FOREIGN KEY (\`reaction_entities_id\`) REFERENCES \`reaction_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE \`comment\`
            ADD CONSTRAINT \`FK_5a439a16c76d63e046765cdb84f\` FOREIGN KEY (\`entity_id\`) REFERENCES \`diary\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`comment\`
            ADD CONSTRAINT \`FK_3ce66469b26697baa097f8da923\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_3ce66469b26697baa097f8da923\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_5a439a16c76d63e046765cdb84f\`
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
            ALTER TABLE \`reaction\` DROP FOREIGN KEY \`FK_94ebd4963cf79dac1f64bc9dd24\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`reply\` DROP FOREIGN KEY \`FK_aa280a5b48fd06db0868a6fa4e1\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_45a57d766acc2084c45a8a8a35f\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`ai_answer\` DROP FOREIGN KEY \`FK_10cf6ea0791b7f778343c2da4aa\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\` DROP FOREIGN KEY \`FK_6e115a5fcf13142545f9bd73032\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`cancer_user\` DROP FOREIGN KEY \`FK_14c30a7be4a8c080ab884d750f7\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`refresh_token\` DROP FOREIGN KEY \`FK_6bbe63d2fe75e7f0ba1710351d4\`
        `);
    await queryRunner.query(`
            DROP TABLE \`email_verification\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`survey_answer_user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`survey_answer\`
        `);
    await queryRunner.query(`
            DROP TABLE \`comment\`
        `);
    await queryRunner.query(`
            DROP TABLE \`diary\`
        `);
    await queryRunner.query(`
            DROP TABLE \`emotion\`
        `);
    await queryRunner.query(`
            DROP TABLE \`reaction_entity\`
        `);
    await queryRunner.query(`
            DROP TABLE \`reaction\`
        `);
    await queryRunner.query(`
            DROP TABLE \`reply\`
        `);
    await queryRunner.query(`
            DROP TABLE \`image\`
        `);
    await queryRunner.query(`
            DROP TABLE \`question\`
        `);
    await queryRunner.query(`
            DROP INDEX \`REL_10cf6ea0791b7f778343c2da4a\` ON \`ai_answer\`
        `);
    await queryRunner.query(`
            DROP TABLE \`ai_answer\`
        `);
    await queryRunner.query(`
            DROP TABLE \`cancer_user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`cancer\`
        `);
    await queryRunner.query(`
            DROP TABLE \`refresh_token\`
        `);
  }
}
