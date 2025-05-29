import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationTableWithPartitioning1748440798576
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE notification (
        id INT AUTO_INCREMENT,
        type VARCHAR(255) NOT NULL,
        receiver_user_id CHAR(36) NOT NULL COMMENT '알림을 받는 사용자 ID',
        sender_user_id CHAR(36) NOT NULL COMMENT '알림을 발생시킨 사용자 ID',
        target_id CHAR(36) NOT NULL,
        target_type VARCHAR(255) NOT NULL,
        entity_id CHAR(36) NOT NULL,
        entity_type VARCHAR(255) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        PRIMARY KEY (id, created_at)
      )
      PARTITION BY RANGE (UNIX_TIMESTAMP(created_at)) (
        -- 현재 시점 (5월 28일) 이전 데이터를 위한 파티션
        PARTITION p_before_jun2025 VALUES LESS THAN (UNIX_TIMESTAMP('2025-06-01')) -- TO_DAYS('2025-06-01')
        -- NestJS 스케줄러가 이후 파티션을 추가할 예정이므로 MAXVALUE 파티션은 제외
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE notification;
    `);
  }
}
