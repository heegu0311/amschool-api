import { DataSource } from 'typeorm';
import { SectionSecondary } from '../../src/section_secondary/entities/section_secondary.entity';

// 허용된 sectionPrimaryCode 목록
const allowedSectionPrimaryCodes = [
  'S1N4',
  'S1N5',
  'S1N6',
  'S1N7',
  'S1N8',
  'S1N11',
  'S1N12',
  'S1N13',
  'S1N14',
];

export const sectionSecondarySeeds = [
  { id: 18, sectionPrimaryCode: 'S1N4', code: 'S2N18', name: '기본정보' },
  { id: 19, sectionPrimaryCode: 'S1N4', code: 'S2N19', name: '암별문답' },
  { id: 20, sectionPrimaryCode: 'S1N4', code: 'S2N20', name: '치료법' },
  { id: 21, sectionPrimaryCode: 'S1N4', code: 'S2N21', name: '식품과 운동' },
  { id: 25, sectionPrimaryCode: 'S1N6', code: 'S2N25', name: '위암' },
  { id: 26, sectionPrimaryCode: 'S1N6', code: 'S2N26', name: '간암' },
  { id: 27, sectionPrimaryCode: 'S1N6', code: 'S2N27', name: '폐암' },
  { id: 28, sectionPrimaryCode: 'S1N6', code: 'S2N28', name: '대장암' },
  { id: 29, sectionPrimaryCode: 'S1N6', code: 'S2N29', name: '유방암' },
  { id: 30, sectionPrimaryCode: 'S1N6', code: 'S2N30', name: '자궁경부암' },
  { id: 31, sectionPrimaryCode: 'S1N7', code: 'S2N31', name: '백혈병' },
  { id: 32, sectionPrimaryCode: 'S1N7', code: 'S2N32', name: '갑상선암' },
  { id: 33, sectionPrimaryCode: 'S1N7', code: 'S2N33', name: '방광암' },
  { id: 34, sectionPrimaryCode: 'S1N7', code: 'S2N34', name: '뇌종양' },
  { id: 35, sectionPrimaryCode: 'S1N7', code: 'S2N35', name: '전립선암' },
  { id: 36, sectionPrimaryCode: 'S1N7', code: 'S2N36', name: '기타암' },
  { id: 37, sectionPrimaryCode: 'S1N8', code: 'S2N37', name: '증상 1' },
  { id: 38, sectionPrimaryCode: 'S1N8', code: 'S2N38', name: '증상 2' },
  { id: 39, sectionPrimaryCode: 'S1N9', code: 'S2N39', name: '암정보사이트' },
  {
    id: 40,
    sectionPrimaryCode: 'S1N9',
    code: 'S2N40',
    name: 'YouTube 암투병극복',
  },
  { id: 41, sectionPrimaryCode: 'S1N9', code: 'S2N41', name: '암스쿨TV' },
  {
    id: 44,
    sectionPrimaryCode: 'S1N9',
    code: 'S2N44',
    name: '암을 이기는사람들',
  },
  { id: 55, sectionPrimaryCode: 'S1N5', code: 'S2N55', name: '피솔기사' },
  { id: 56, sectionPrimaryCode: 'S1N5', code: 'S2N56', name: '최신뉴스' },
  {
    id: 57,
    sectionPrimaryCode: 'S1N11',
    code: 'S2N57',
    name: '미국립암연구소',
  },
  {
    id: 58,
    sectionPrimaryCode: 'S1N11',
    code: 'S2N58',
    name: '엠디엔더슨암센터',
  },
  {
    id: 59,
    sectionPrimaryCode: 'S1N11',
    code: 'S2N59',
    name: '일국립암연구센터',
  },
  { id: 60, sectionPrimaryCode: 'S1N11', code: 'S2N60', name: '기타 기관' },
  { id: 61, sectionPrimaryCode: 'S1N12', code: 'S2N61', name: '암학교' },
  { id: 62, sectionPrimaryCode: 'S1N12', code: 'S2N62', name: '암 대처하기' },
  {
    id: 63,
    sectionPrimaryCode: 'S1N12',
    code: 'S2N63',
    name: '암을 이기는 식탁',
  },
  {
    id: 64,
    sectionPrimaryCode: 'S1N12',
    code: 'S2N64',
    name: '암을 이기는 생활',
  },
  { id: 65, sectionPrimaryCode: 'S1N12', code: 'S2N65', name: '복지 TIP' },
  { id: 66, sectionPrimaryCode: 'S1N12', code: 'S2N66', name: '보호자 역할' },
  {
    id: 67,
    sectionPrimaryCode: 'S1N12',
    code: 'S2N67',
    name: 'YouTube암투병극복기',
  },
  { id: 68, sectionPrimaryCode: 'S1N13', code: 'S2N68', name: '치료' },
  {
    id: 69,
    sectionPrimaryCode: 'S1N13',
    code: 'S2N69',
    name: '합병증 및 부작용',
  },
  { id: 70, sectionPrimaryCode: 'S1N13', code: 'S2N70', name: '생활 관리' },
  { id: 72, sectionPrimaryCode: 'S1N13', code: 'S2N72', name: '진단' },
  { id: 73, sectionPrimaryCode: 'S1N13', code: 'S2N73', name: '기타' },
  { id: 74, sectionPrimaryCode: 'S1N5', code: 'S2N74', name: '시니어 건강' },
  { id: 75, sectionPrimaryCode: 'S1N5', code: 'S2N75', name: '기획기사' },
  { id: 76, sectionPrimaryCode: 'S1N11', code: 'S2N76', name: '슬론케터링' },
  {
    id: 77,
    sectionPrimaryCode: 'S1N11',
    code: 'S2N77',
    name: '메이요클리닉',
  },
].filter((seed) =>
  allowedSectionPrimaryCodes.includes(seed.sectionPrimaryCode),
);

export async function seedSectionSecondary(dataSource: DataSource) {
  const repository = dataSource.getRepository(SectionSecondary);

  for (const seed of sectionSecondarySeeds) {
    const existing = await repository.findOne({ where: { id: seed.id } });
    if (!existing) {
      await repository.save(seed);
    }
  }
}
