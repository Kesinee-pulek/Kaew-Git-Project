import { cacheLife } from "next/cache";

export type CityStat = {
  label: string;
  value: string;
  unit?: string;
  note?: string;
};

export type Attraction = {
  name: string;
  description: string;
  emoji: string;
  category: string;
};

export type Highlight = {
  title: string;
  description: string;
  emoji: string;
};

export type ChengduOverview = {
  stats: CityStat[];
  attractions: Attraction[];
  highlights: Highlight[];
};

export async function getChengduOverview(): Promise<ChengduOverview> {
  "use cache";
  cacheLife("days");

  // TODO: fake data — replace with a real data source
  return {
    stats: [
      { label: "จำนวนมณฑลในจีน", value: "23", unit: "มณฑล", note: "เฉิงตูเป็นเมืองเอกของมณฑลเสฉวน" },
      { label: "ประชากรเฉิงตู", value: "21.4", unit: "ล้านคน" },
      { label: "จำนวนเขตในเฉิงตู", value: "20", unit: "เขต" },
      { label: "นักท่องเที่ยวต่อปี", value: "280", unit: "ล้านคน" },
    ],
    attractions: [
      {
        name: "ศูนย์วิจัยแพนด้ายักษ์",
        description: "ชมแพนด้ายักษ์และแพนด้าแดงในพื้นที่ธรรมชาติ แนะนำให้ไปช่วงเช้าที่แพนด้ากำลังกินอาหาร",
        emoji: "🐼",
        category: "ธรรมชาติ",
      },
      {
        name: "ถนนควานจ๋าย-เซียงจื่อ",
        description: "ตรอกโบราณสมัยราชวงศ์ชิง เต็มไปด้วยร้านน้ำชา ร้านอาหาร และของที่ระลึก",
        emoji: "🏮",
        category: "ประวัติศาสตร์",
      },
      {
        name: "วัดเหวินซู",
        description: "วัดพุทธเก่าแก่ที่สุดในเฉิงตู บรรยากาศสงบ มีโรงน้ำชาและร้านอาหารเจภายในวัด",
        emoji: "🛕",
        category: "ศาสนาและวัฒนธรรม",
      },
      {
        name: "ภูเขาชิงเฉิง",
        description: "แหล่งกำเนิดลัทธิเต๋า เส้นทางเดินป่าท่ามกลางป่าเขียวขจีและศาลเจ้าโบราณ",
        emoji: "⛰️",
        category: "ธรรมชาติ",
      },
      {
        name: "ระบบชลประทานตูเจียงเยี่ยน",
        description: "มรดกโลกยูเนสโก ระบบจัดการน้ำอายุกว่า 2,000 ปีที่ยังใช้งานได้จนถึงปัจจุบัน",
        emoji: "🌊",
        category: "มรดกโลก",
      },
      {
        name: "ถนนจินหลี่",
        description: "ถนนคนเดินสไตล์สามก๊ก สวยงามยามค่ำคืนด้วยโคมไฟแดง และของกินท้องถิ่นมากมาย",
        emoji: "🌃",
        category: "ช้อปปิ้งและอาหาร",
      },
    ],
    highlights: [
      {
        title: "หม้อไฟเสฉวน",
        description: "หม้อไฟน้ำซุปพริกหมาล่ารสจัดจ้าน อาหารที่ต้องลองเมื่อมาเฉิงตู",
        emoji: "🍲",
      },
      {
        title: "วัฒนธรรมร้านน้ำชา",
        description: "นั่งจิบชาในสวนสาธารณะ ฟังเสียงพูดคุย และลองบริการแคะหูแบบดั้งเดิม",
        emoji: "🍵",
      },
      {
        title: "งิ้วเปลี่ยนหน้า",
        description: "ศิลปะการแสดงงิ้วเสฉวนที่นักแสดงเปลี่ยนหน้ากากได้ในพริบตา",
        emoji: "🎭",
      },
    ],
  };
}
