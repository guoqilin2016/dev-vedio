# 背景音乐目录

将背景音乐文件放在这个目录下。

## 推荐音乐来源

1. **Pixabay Music**（推荐）
   - 网址：https://pixabay.com/music/search/inspirational/
   - 特点：30,000+ 免版权曲目，无需署名，可商用
   - 推荐搜索：`inspirational corporate` 或 `upbeat motivational`

2. **Chosic**
   - 网址：https://chosic.com/free-music/motivational
   - 特点：按心情/风格分类，有专门的"演示文稿"类别

3. **Freesound**
   - 网址：https://freesound.org/
   - 特点：社区贡献的免费音效和音乐

## 建议选择的音乐风格

- **节奏**：120 BPM 左右（适中节奏，不会太快）
- **风格**：企业激励型（Corporate Inspiring）
- **时长**：2-3分钟，可循环播放
- **情绪**：积极、向上、专业

## 使用方法

1. 下载音乐文件（MP3 格式）
2. 将文件重命名为简单的名称，如 `background.mp3`
3. 放到这个目录下
4. 在渲染时通过 props 指定音乐路径：

```json
{
  "audio": {
    "backgroundMusic": "music/background.mp3",
    "backgroundMusicVolume": 0.3
  }
}
```

## 推荐曲目

以下是一些推荐的 Pixabay 曲目（需要手动下载）：

1. **Upbeat Corporate Inspiring** - 2:25
   - https://pixabay.com/music/upbeat-upbeat-corporate-inspiring-335162/
   - 适合：商务演示、产品介绍

2. **Motivational Technology** - 2:20
   - https://pixabay.com/music/upbeat-motivational-technology-13920/
   - 适合：科技主题、创新展示

3. **Corporate Background** - 3:00
   - https://pixabay.com/music/search/corporate%20background/
   - 适合：通用背景音乐

## 注意事项

- 确保音乐文件格式为 MP3 或 WAV
- 文件名不要包含空格或特殊字符
- 音量建议设置为 0.2-0.4，避免盖过配音
