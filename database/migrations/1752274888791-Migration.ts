import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1752274888791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 기존 테이블을 파티셔닝으로 변경
    await queryRunner.query(`
            ALTER TABLE \`notification\` 
            PARTITION BY RANGE (UNIX_TIMESTAMP(created_at)) (
                -- 현재 시점 (8월 1일) 이전 데이터를 위한 파티션
                PARTITION p_before_august2025 VALUES LESS THAN (UNIX_TIMESTAMP('2025-08-01'))
                -- NestJS 스케줄러가 이후 파티션을 추가할 예정이므로 MAXVALUE 파티션은 제외
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 파티셔닝 제거
    await queryRunner.query(`
            ALTER TABLE \`notification\` REMOVE PARTITIONING
        `);
  }
}
