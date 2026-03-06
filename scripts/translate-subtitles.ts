#!/usr/bin/env node
/**
 * 将中文 SRT 字幕翻译为中英双语 SRT
 * 使用 Google Translate 免费 API
 */
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const CLIPS_DIR = path.join(process.cwd(), 'clips');

interface SrtEntry {
  idx: number;
  timestamp: string;
  text: string;
  startSec: number;
}

function parseSrt(srtText: string): SrtEntry[] {
  const blocks = srtText.trim().split(/\n\s*\n/);
  const entries: SrtEntry[] = [];
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length >= 3) {
      const idx = parseInt(lines[0].trim());
      const timestamp = lines[1].trim();
      let text = lines.slice(2).join(' ').trim();
      // 清理 HTML 标签
      text = text.replace(/<[^>]+>/g, '');
      
      // 解析开始时间
      const startStr = timestamp.split(' --> ')[0].replace(',', '.');
      const parts = startStr.split(':');
      const startSec = parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
      
      if (text) {
        entries.push({ idx, timestamp, text, startSec });
      }
    }
  }
  return entries;
}

function translateBatch(texts: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const query = texts.map(t => `q=${encodeURIComponent(t)}`).join('&');
    const url = `https://translate.googleapis.com/translate_a/t?client=gtx&sl=zh&tl=en&${query}`;
    
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk: Buffer) => data += chunk.toString());
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          // Google Translate API 返回格式：[[翻译1], [翻译2], ...] 或 直接字符串数组
          if (Array.isArray(result)) {
            const translations = result.map((item: any) => {
              if (Array.isArray(item)) return item[0] || '';
              if (typeof item === 'string') return item;
              return '';
            });
            resolve(translations);
          } else if (typeof result === 'string') {
            resolve([result]);
          } else {
            resolve(texts.map(() => ''));
          }
        } catch (e) {
          console.error('Parse error:', data.substring(0, 200));
          resolve(texts.map(() => ''));
        }
      });
    });
    req.on('error', (e) => {
      console.error('Request error:', e.message);
      resolve(texts.map(() => ''));
    });
    req.setTimeout(10000, () => {
      req.destroy();
      resolve(texts.map(() => ''));
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateAll(entries: SrtEntry[]): Promise<string[]> {
  const translations: string[] = [];
  const batchSize = 10;
  
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const texts = batch.map(e => e.text);
    
    const result = await translateBatch(texts);
    translations.push(...result);
    
    if (i + batchSize < entries.length) {
      await sleep(500); // 避免限流
    }
    
    process.stdout.write(`\r   翻译进度: ${Math.min(i + batchSize, entries.length)}/${entries.length}`);
  }
  console.log();
  
  return translations;
}

function writeBilingualSrt(entries: SrtEntry[], translations: string[], outputPath: string) {
  const lines: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const en = translations[i] || '';
    lines.push(`${i + 1}`);
    lines.push(entry.timestamp);
    lines.push(entry.text);
    if (en) {
      lines.push(en);
    }
    lines.push('');
  }
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
}

async function main() {
  // 读取中文字幕
  const zhSrtPath = path.join(CLIPS_DIR, 'subtitles_zh.zh.srt');
  console.log(`📖 读取中文字幕: ${zhSrtPath}`);
  const zhText = fs.readFileSync(zhSrtPath, 'utf-8');
  const entries = parseSrt(zhText);
  console.log(`   找到 ${entries.length} 条中文字幕`);
  
  // 去重（VTT转SRT后可能有重复）
  const deduped: SrtEntry[] = [];
  for (const entry of entries) {
    if (deduped.length === 0 || deduped[deduped.length - 1].text !== entry.text) {
      deduped.push(entry);
    }
  }
  console.log(`   去重后 ${deduped.length} 条`);
  
  // 翻译为英文
  console.log(`🌐 正在翻译为英文...`);
  const translations = await translateAll(deduped);
  
  const successCount = translations.filter(t => t.length > 0).length;
  console.log(`   翻译成功: ${successCount}/${deduped.length}`);
  
  // 输出完整双语字幕
  const fullPath = path.join(CLIPS_DIR, 'full_video_bilingual.srt');
  writeBilingualSrt(deduped, translations, fullPath);
  console.log(`✅ 完整双语字幕: ${fullPath}`);
  
  // 按章节分割
  const chapters = [
    { name: '01_引言', start: 0, end: 52 },
    { name: '02_Opus4.6与GPT-Codex5.3简介', start: 52, end: 156 },
    { name: '03_编程能力小PK', start: 156, end: 605 },
    { name: '04_使用体验总结', start: 605, end: 662 },
  ];
  
  for (const chapter of chapters) {
    const chapterEntries: SrtEntry[] = [];
    const chapterTrans: string[] = [];
    
    for (let i = 0; i < deduped.length; i++) {
      if (deduped[i].startSec >= chapter.start && deduped[i].startSec < chapter.end) {
        chapterEntries.push(deduped[i]);
        chapterTrans.push(translations[i]);
      }
    }
    
    const chapterPath = path.join(CLIPS_DIR, `${chapter.name}_bilingual.srt`);
    writeBilingualSrt(chapterEntries, chapterTrans, chapterPath);
    console.log(`✅ ${chapter.name}: ${chapterEntries.length} 条 -> ${chapterPath}`);
  }
  
  console.log('\n🎉 中英双语字幕生成完成！');
}

main().catch(console.error);
