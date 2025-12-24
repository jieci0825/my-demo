# 抖音视频去水印工具

基于抖音移动端分享页面解析的最小实现，无需登录即可获取无水印视频链接并下载。

## 安装依赖

```bash
pip install -r requirements.txt
```

## 使用方法

### 方式一：命令行运行

```bash
python douyin_watermark_remover.py
```

默认会解析测试视频的信息。修改 `main()` 函数中的 `share_url` 为你需要的抖音分享链接。

### 方式二：作为模块导入

```python
import asyncio
from douyin_watermark_remover import DouyinWatermarkRemover

async def main():
    share_url = "https://v.douyin.com/xxx/"
    remover = DouyinWatermarkRemover()
    
    # 获取视频信息（包含无水印链接）
    video_info = await remover.get_video_info(share_url)
    print(video_info)
    
    # 下载视频
    await remover.download_video(share_url, save_path="./downloads")

asyncio.run(main())
```

## 返回数据示例

```python
{
    "aweme_id": "7585113206696217875",
    "desc": "视频描述",
    "author": "作者昵称",
    "author_id": "作者ID",
    "video_url": "无水印视频链接",
    "cover_url": "封面链接",
    "duration": 214135,  # 毫秒
    "width": 1920,
    "height": 1080,
    "create_time": 1766055600,
    "music_title": "音乐标题",
    "music_author": "音乐作者",
    "music_url": "音乐链接",
    "digg_count": 39595,  # 点赞数
    "comment_count": 860,
    "share_count": 903
}
```

## 原理说明

1. 解析抖音分享链接，获取重定向后的移动端分享页面
2. 从页面 HTML 中提取 `_ROUTER_DATA` 数据
3. 解析 JSON 获取视频详细信息，包括无水印播放地址
4. 使用 `play_addr` 而非 `download_addr` 获取无水印版本

## 依赖

- httpx: 异步 HTTP 客户端

## 注意事项

- 仅供学习研究使用
- 请遵守抖音相关服务条款
- 不要用于商业用途或批量下载

