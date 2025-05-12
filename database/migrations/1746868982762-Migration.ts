import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746868982762 implements MigrationInterface {
  name = 'Migration1746868982762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(` 
            CREATE TABLE \`article_image\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '번호',
                \`article_id\` int UNSIGNED NOT NULL COMMENT '기사번호' DEFAULT 0,
                \`file_name\` varchar(250) NOT NULL COMMENT '기사이미지' DEFAULT '',
                \`file_path\` varchar(25) NOT NULL COMMENT '디렉토리' DEFAULT '',
                \`image_title\` varchar(250) NULL COMMENT '제목',
                \`image_caption\` text NULL COMMENT '캡션',
                \`image_ext\` enum ('J', 'G', 'P', 'B', 'S') NOT NULL COMMENT '확장자' DEFAULT 'J',
                \`image_sort\` int UNSIGNED NOT NULL COMMENT '정렬' DEFAULT 0,
                \`is_featured\` enum ('Y', 'N') NOT NULL COMMENT '대표사진' DEFAULT 'Y',
                \`created_at\` datetime(6) NULL,
                \`updated_at\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB COMMENT = "기사사진"
        `);
    await queryRunner.query(`
            CREATE TABLE \`article\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '번호',
                \`title\` varchar(200) NOT NULL COMMENT '제목' DEFAULT '',
                \`subtitle\` text NULL COMMENT '부제목',
                \`content\` longtext NOT NULL COMMENT '내용',
                \`video_tag\` text NOT NULL COMMENT '영상태그',
                \`thumbnail\` varchar(50) NOT NULL COMMENT '대표이미지' DEFAULT '',
                \`admin_id\` varchar(50) NULL COMMENT '아이디',
                \`author\` varchar(50) NOT NULL COMMENT '기자명' DEFAULT '',
                \`admin_email\` varchar(50) NULL COMMENT '이메일',
                \`section_primary_code\` varchar(20) NOT NULL COMMENT '1차섹션' DEFAULT '',
                \`section_secondary_code\` varchar(20) NULL COMMENT '2차섹션',
                \`series\` varchar(20) NULL COMMENT '연재',
                \`article_grade\` enum ('M', 'T', 'I', 'B') NULL COMMENT '등급' DEFAULT 'B',
                \`article_type\` enum ('B', 'P', 'C', 'N', 'M', 'G') NOT NULL COMMENT '기사형태' DEFAULT 'B',
                \`views\` int UNSIGNED NOT NULL COMMENT '조회수' DEFAULT '0',
                \`serial_number\` int UNSIGNED NOT NULL COMMENT '시리얼번호' DEFAULT '0',
                \`exclusive_use\` enum ('Y', 'N') NOT NULL COMMENT '지면사용여부' DEFAULT 'N',
                \`print_page\` int UNSIGNED NOT NULL COMMENT '면' DEFAULT '0',
                \`status\` enum ('I', 'C', 'R', 'E') NOT NULL COMMENT '상태' DEFAULT 'I',
                \`view_rank\` enum ('A', 'M', 'C') NOT NULL COMMENT '조회등급' DEFAULT 'A',
                \`on_off\` enum ('Y', 'N') NOT NULL COMMENT '외부노출여부' DEFAULT 'N',
                \`external_exposure\` enum ('O', 'F') NOT NULL COMMENT '온/ 오프' DEFAULT 'O',
                \`publish_date\` date NOT NULL COMMENT '발행일자' DEFAULT '1000-01-01',
                \`registration_date\` date NOT NULL COMMENT '등록일' DEFAULT '1000-01-01',
                \`registration_time\` time NOT NULL COMMENT '등록시간' DEFAULT '00:00:00',
                \`update_date\` date NULL COMMENT '수정일',
                \`update_time\` time NULL COMMENT '수정시간',
                \`is_visible\` enum ('Y', 'N') NOT NULL COMMENT '노출' DEFAULT 'N',
                \`mba_usage\` enum ('Y', 'N') NOT NULL COMMENT '엠바고사용여부' DEFAULT 'N',
                \`mba_end_time\` int UNSIGNED NOT NULL COMMENT '엠바고시간' DEFAULT '0',
                \`keywords\` text NOT NULL COMMENT '키워드',
                \`created_at\` datetime(6) NULL COMMENT '등록일' DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL COMMENT '삭제일',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB COMMENT = "기사"
        `);
    await queryRunner.query(`
            CREATE TABLE \`section_primary\` (
                \`id\` int UNSIGNED NOT NULL COMMENT '번호' DEFAULT 0,
                \`code\` varchar(20) NOT NULL COMMENT '코드' DEFAULT '',
                \`name\` varchar(200) NOT NULL COMMENT '섹션명' DEFAULT '',
                UNIQUE INDEX \`IDX_e3c57f0cb3f77751003e37fa1d\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB COMMENT = "기사1차섹션"
        `);
    await queryRunner.query(`
            CREATE TABLE \`section_secondary\` (
                \`id\` int UNSIGNED NOT NULL COMMENT '번호' DEFAULT 0,
                \`code\` varchar(20) NOT NULL COMMENT '코드' DEFAULT '',
                \`name\` varchar(200) NOT NULL COMMENT '섹션명' DEFAULT '',
                \`section_primary_code\` varchar(20) NOT NULL COMMENT '1차섹션코드' DEFAULT '',
                UNIQUE INDEX \`IDX_8444c37d63da61595b25bb394f\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB COMMENT = "기사2차섹션"
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
    await queryRunner.query(`
            ALTER TABLE \`section_secondary\`
            ADD CONSTRAINT \`FK_42898b5ffc5e67c87ff32c4c57a\` FOREIGN KEY (\`section_primary_code\`) REFERENCES \`section_primary\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`section_secondary\` DROP FOREIGN KEY \`FK_42898b5ffc5e67c87ff32c4c57a\`
        `);
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
            DROP INDEX \`IDX_8444c37d63da61595b25bb394f\` ON \`section_secondary\`
        `);
    await queryRunner.query(`
            DROP TABLE \`section_secondary\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_e3c57f0cb3f77751003e37fa1d\` ON \`section_primary\`
        `);
    await queryRunner.query(`
            DROP TABLE \`section_primary\`
        `);
    await queryRunner.query(`
            DROP TABLE \`article\`
        `);
    await queryRunner.query(`
            DROP TABLE \`article_image\`
        `);
  }
}
