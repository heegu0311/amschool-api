import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DataSource } from 'typeorm';

dayjs.extend(customParseFormat); // 플러그인 사용 설정

@Injectable()
export class PartitionScheduler {
  private readonly logger = new Logger(PartitionScheduler.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  // 매월 1일 자정에 실행 (예: '0 0 1 * *')
  // 실제 Cron 표현식은 요구사항에 맞게 조정하세요.
  @Cron('0 0 1 * *')
  async handleMonthlyPartitionCreation() {
    this.logger.log('Attempting to add next month notification partition...');

    try {
      // dayjs를 사용하여 날짜 계산 및 포맷팅
      const nextMonth = dayjs().add(1, 'month'); // 다음 달
      const monthAfterNext = dayjs().add(2, 'month'); // 다다음 달

      const partitionName = 'p' + nextMonth.format('YYYYMM'); // dayjs 포맷 사용
      // TO_DAYS 함수는 YYYY-MM-DD 형식 문자열을 받으므로 포맷 변경
      const lessThanDate = monthAfterNext.format('YYYY-MM-DD'); // dayjs 포맷 사용

      // 해당 이름의 파티션이 이미 존재하는지 확인
      // MySQL의 INFORMATION_SCHEMA를 쿼리합니다.
      const [partitionExistsResult] = await this.dataSource.query(
        `SELECT COUNT(*) AS count
         FROM INFORMATION_SCHEMA.PARTITIONS
         WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = ?
         AND PARTITION_NAME = ?;`,
        ['notification', partitionName],
      );

      const partitionExists = +partitionExistsResult.count;

      if (partitionExists === 0) {
        // 파티션 추가 SQL 실행
        // ALTER TABLE notification ADD PARTITION (PARTITION pYYYYMM VALUES LESS THAN (TO_DAYS('YYYY-MM-DD')));
        const alterTableSql = `ALTER TABLE notification ADD PARTITION (PARTITION ${partitionName} VALUES LESS THAN (UNIX_TIMESTAMP('${lessThanDate}')));`;

        this.logger.log(`Executing SQL: ${alterTableSql}`);
        await this.dataSource.query(alterTableSql);

        this.logger.log(`Partition ${partitionName} added successfully.`);
      } else {
        this.logger.log(`Partition ${partitionName} already exists. Skipping.`);
      }
    } catch (error) {
      this.logger.error('Error adding partition:', error);
    }
  }

  // 필요에 따라 다른 스케줄된 작업을 추가할 수 있습니다.
}
