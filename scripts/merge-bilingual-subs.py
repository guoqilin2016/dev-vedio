#!/usr/bin/env python3
"""
从 YouTube 获取英文翻译字幕并与中文字幕合并为双语 SRT
"""
import re
import sys
import urllib.request
import json
import ssl

# 跳过 SSL 验证（解决本地证书问题）
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

VIDEO_ID = "2KdFO7M_UaI"

def parse_srt(srt_text):
    """解析 SRT 格式字幕"""
    blocks = re.split(r'\n\s*\n', srt_text.strip())
    entries = []
    for block in blocks:
        lines = block.strip().split('\n')
        if len(lines) >= 3:
            idx = lines[0].strip()
            timestamp = lines[1].strip()
            text = '\n'.join(lines[2:]).strip()
            # 清理 HTML 标签
            text = re.sub(r'<[^>]+>', '', text)
            entries.append({
                'idx': idx,
                'timestamp': timestamp,
                'text': text,
            })
    return entries

def parse_vtt(vtt_text):
    """解析 VTT 格式字幕"""
    lines = vtt_text.strip().split('\n')
    entries = []
    i = 0
    idx = 1
    while i < len(lines):
        # 跳过 WEBVTT 头部和空行
        if lines[i].startswith('WEBVTT') or lines[i].startswith('Kind:') or lines[i].startswith('Language:') or lines[i].strip() == '':
            i += 1
            continue
        # 检查是否是时间戳行
        if '-->' in lines[i]:
            timestamp = lines[i].strip()
            # 转换 VTT 时间格式到 SRT 格式
            timestamp = timestamp.replace('.', ',')
            # 确保时间格式是 HH:MM:SS,mmm
            parts = timestamp.split(' --> ')
            new_parts = []
            for p in parts:
                p = p.strip()
                # 如果缺少小时部分，添加 00:
                if p.count(':') == 1:
                    p = '00:' + p
                new_parts.append(p)
            timestamp = ' --> '.join(new_parts)
            
            text_lines = []
            i += 1
            while i < len(lines) and lines[i].strip() != '' and '-->' not in lines[i]:
                line = lines[i].strip()
                # 清理 HTML 标签
                line = re.sub(r'<[^>]+>', '', line)
                if line:
                    text_lines.append(line)
                i += 1
            if text_lines:
                text = ' '.join(text_lines)
                # 去重：如果文字和前一条完全相同，跳过
                if not entries or entries[-1]['text'] != text:
                    entries.append({
                        'idx': str(idx),
                        'timestamp': timestamp,
                        'text': text,
                    })
                    idx += 1
        else:
            i += 1
    return entries

def merge_bilingual(zh_entries, en_entries):
    """合并中英字幕为双语格式"""
    # 解析时间戳用于匹配
    def parse_time(ts):
        """将时间戳转换为秒"""
        parts = ts.split(' --> ')
        start = parts[0].strip()
        # 处理 HH:MM:SS,mmm 格式
        time_parts = start.replace(',', '.').split(':')
        if len(time_parts) == 3:
            return float(time_parts[0]) * 3600 + float(time_parts[1]) * 60 + float(time_parts[2])
        elif len(time_parts) == 2:
            return float(time_parts[0]) * 60 + float(time_parts[1])
        return 0
    
    bilingual = []
    en_idx = 0
    
    for zh in zh_entries:
        zh_time = parse_time(zh['timestamp'])
        
        # 找到时间最接近的英文字幕
        best_en = None
        best_diff = float('inf')
        for j in range(max(0, en_idx - 2), min(len(en_entries), en_idx + 5)):
            en_time = parse_time(en_entries[j]['timestamp'])
            diff = abs(en_time - zh_time)
            if diff < best_diff:
                best_diff = diff
                best_en = en_entries[j]
                en_idx = j
        
        en_text = best_en['text'] if best_en and best_diff < 3.0 else ''
        
        bilingual.append({
            'idx': zh['idx'],
            'timestamp': zh['timestamp'],
            'zh': zh['text'],
            'en': en_text,
        })
    
    return bilingual

def write_bilingual_srt(bilingual, output_path):
    """写入双语 SRT 文件"""
    with open(output_path, 'w', encoding='utf-8') as f:
        for i, entry in enumerate(bilingual):
            f.write(f"{i+1}\n")
            f.write(f"{entry['timestamp']}\n")
            f.write(f"{entry['zh']}\n")
            if entry['en']:
                f.write(f"{entry['en']}\n")
            f.write('\n')

def main():
    clips_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    # 读取中文 SRT
    zh_srt_path = f"{clips_dir}/subtitles_zh.zh.srt"
    print(f"📖 读取中文字幕: {zh_srt_path}")
    with open(zh_srt_path, 'r', encoding='utf-8') as f:
        zh_text = f.read()
    zh_entries = parse_srt(zh_text)
    print(f"   找到 {len(zh_entries)} 条中文字幕")
    
    # 读取英文 VTT（如果存在）或尝试下载
    en_vtt_path = f"{clips_dir}/subtitles_en.en-zh.vtt"
    en_srt_path = f"{clips_dir}/subtitles_en.en-zh.srt"
    en_entries = []
    
    try:
        import os
        if os.path.exists(en_srt_path):
            with open(en_srt_path, 'r', encoding='utf-8') as f:
                en_entries = parse_srt(f.read())
        elif os.path.exists(en_vtt_path):
            with open(en_vtt_path, 'r', encoding='utf-8') as f:
                en_entries = parse_vtt(f.read())
    except Exception as e:
        print(f"   ⚠️ 读取英文字幕失败: {e}")
    
    # 如果没有英文字幕，尝试直接从 YouTube API 获取
    if not en_entries:
        print("🌐 尝试从 YouTube API 获取英文翻译字幕...")
        try:
            # 先获取视频页面拿到字幕 URL
            url = f"https://www.youtube.com/watch?v={VIDEO_ID}"
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'Accept-Language': 'en-US,en;q=0.9',
            })
            resp = urllib.request.urlopen(req, context=ctx)
            html = resp.read().decode('utf-8')
            
            # 提取 captionTracks
            import re
            caption_match = re.search(r'"captionTracks":\s*(\[.*?\])', html)
            if caption_match:
                tracks = json.loads(caption_match.group(1))
                for track in tracks:
                    if 'zh' in track.get('languageCode', ''):
                        base_url = track['baseUrl']
                        # 请求英文翻译
                        en_url = base_url + '&tlang=en&fmt=srv3'
                        print(f"   下载英文翻译: {en_url[:80]}...")
                        req2 = urllib.request.Request(en_url, headers={
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                        })
                        resp2 = urllib.request.urlopen(req2, context=ctx)
                        en_xml = resp2.read().decode('utf-8')
                        
                        # 解析 srv3 XML 格式
                        import xml.etree.ElementTree as ET
                        root = ET.fromstring(en_xml)
                        idx = 1
                        for p in root.iter('p'):
                            start_ms = int(p.get('t', 0))
                            dur_ms = int(p.get('d', 0))
                            text = ''.join(p.itertext()).strip()
                            if text:
                                start_s = start_ms / 1000
                                end_s = (start_ms + dur_ms) / 1000
                                start_ts = f"{int(start_s//3600):02d}:{int(start_s%3600//60):02d}:{start_s%60:06.3f}".replace('.', ',')
                                end_ts = f"{int(end_s//3600):02d}:{int(end_s%3600//60):02d}:{end_s%60:06.3f}".replace('.', ',')
                                en_entries.append({
                                    'idx': str(idx),
                                    'timestamp': f"{start_ts} --> {end_ts}",
                                    'text': text,
                                })
                                idx += 1
                        print(f"   找到 {len(en_entries)} 条英文字幕")
                        break
        except Exception as e:
            print(f"   ⚠️ API 获取失败: {e}")
    
    if not en_entries:
        print("⚠️ 无法获取英文字幕，将只输出中文字幕")
        # 直接输出中文作为双语（无英文）
        bilingual = [{'idx': e['idx'], 'timestamp': e['timestamp'], 'zh': e['text'], 'en': ''} for e in zh_entries]
    else:
        print("🔀 合并中英双语字幕...")
        bilingual = merge_bilingual(zh_entries, en_entries)
    
    # 输出完整双语字幕
    full_path = f"{clips_dir}/full_video_bilingual.srt"
    write_bilingual_srt(bilingual, full_path)
    print(f"✅ 完整双语字幕: {full_path}")
    
    # 按章节分割双语字幕
    chapters = [
        ("01_引言", 0, 52),
        ("02_Opus4.6与GPT-Codex5.3简介", 52, 156),
        ("03_编程能力小PK", 156, 605),
        ("04_使用体验总结", 605, 662),
    ]
    
    for name, start_sec, end_sec in chapters:
        chapter_entries = []
        for entry in bilingual:
            ts = entry['timestamp']
            parts = ts.split(' --> ')
            start_str = parts[0].strip().replace(',', '.')
            time_parts = start_str.split(':')
            entry_time = float(time_parts[0]) * 3600 + float(time_parts[1]) * 60 + float(time_parts[2])
            if start_sec <= entry_time < end_sec:
                chapter_entries.append(entry)
        
        chapter_path = f"{clips_dir}/{name}_bilingual.srt"
        write_bilingual_srt(chapter_entries, chapter_path)
        print(f"✅ {name}: {len(chapter_entries)} 条字幕 -> {chapter_path}")
    
    print("\n🎉 双语字幕生成完成！")

if __name__ == '__main__':
    main()
