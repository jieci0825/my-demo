"""
抖音视频去水印最小实现
直接解析抖音移动端分享页面，无需依赖 f2 库
"""

import asyncio
import re
import json
import httpx
from typing import Optional
from urllib.parse import unquote


class DouyinWatermarkRemover:
    """抖音视频去水印工具"""
    
    def __init__(self):
        # 使用移动端 UA
        self.headers = {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9",
        }
    
    def extract_aweme_id(self, url: str) -> Optional[str]:
        """
        从 URL 中提取视频 ID (aweme_id)
        """
        patterns = [
            r'/video/(\d+)',
            r'/note/(\d+)',
            r'modal_id=(\d+)',
            r'vid=(\d+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        return None
    
    async def get_video_info(self, share_url: str) -> dict:
        """
        获取视频信息（包含无水印视频链接）
        
        Args:
            share_url: 抖音分享链接
            
        Returns:
            包含视频信息的字典
        """
        async with httpx.AsyncClient(
            headers=self.headers, 
            timeout=30.0, 
            follow_redirects=True
        ) as client:
            # 1. 获取移动端分享页面
            response = await client.get(share_url)
            redirect_url = str(response.url)
            html = response.text
            
            print(f"重定向 URL: {redirect_url}")
            
            # 2. 提取视频 ID
            aweme_id = self.extract_aweme_id(redirect_url)
            if not aweme_id:
                raise ValueError(f"无法从 URL 中提取视频 ID: {redirect_url}")
            
            print(f"视频 ID: {aweme_id}")
            
            # 3. 从 HTML 中提取 _ROUTER_DATA
            render_data = self._extract_router_data(html)
            
            if not render_data:
                raise ValueError("无法从页面中提取视频数据")
            
            # 4. 解析视频信息
            result = self._parse_video_data(render_data, aweme_id)
            
            return result
    
    def _extract_router_data(self, html: str) -> Optional[dict]:
        """
        从 HTML 中提取 _ROUTER_DATA
        """
        # 匹配 window._ROUTER_DATA = {...}
        pattern = r'window\._ROUTER_DATA\s*=\s*(\{.*?\})\s*(?:;|</script>)'
        match = re.search(pattern, html, re.DOTALL)
        
        if match:
            try:
                data_str = match.group(1)
                return json.loads(data_str)
            except json.JSONDecodeError as e:
                print(f"JSON 解析错误: {e}")
        
        return None
    
    def _parse_video_data(self, render_data: dict, aweme_id: str) -> dict:
        """
        从渲染数据中解析视频信息
        """
        # 在 loaderData 中查找视频信息
        loader_data = render_data.get("loaderData", {})
        
        aweme = None
        
        # 遍历 loaderData 查找视频数据
        for key, value in loader_data.items():
            if isinstance(value, dict):
                # 查找 aweme_detail 或 videoInfoRes
                if "aweme_detail" in value:
                    aweme = value["aweme_detail"]
                    break
                if "videoInfoRes" in value:
                    video_info_res = value["videoInfoRes"]
                    if "item_list" in video_info_res and video_info_res["item_list"]:
                        aweme = video_info_res["item_list"][0]
                        break
                # 递归查找
                aweme = self._find_aweme_in_data(value, aweme_id)
                if aweme:
                    break
        
        if not aweme:
            raise ValueError(f"在页面数据中未找到视频 {aweme_id}")
        
        # 提取视频信息
        video = aweme.get("video", {})
        author = aweme.get("author", {})
        music = aweme.get("music", {})
        statistics = aweme.get("statistics", {})
        
        # 获取无水印视频地址
        video_url = self._extract_video_url(video)
        
        # 获取封面
        cover_url = self._extract_cover_url(video)
        
        # 获取音乐链接
        music_url = self._extract_music_url(music)
        
        result = {
            "aweme_id": aweme.get("aweme_id", aweme_id),
            "desc": aweme.get("desc", ""),
            "author": author.get("nickname", ""),
            "author_id": author.get("sec_uid", ""),
            "uid": author.get("uid", ""),
            "video_url": video_url,
            "cover_url": cover_url,
            "duration": video.get("duration", 0),
            "width": video.get("width", 0),
            "height": video.get("height", 0),
            "create_time": aweme.get("create_time", 0),
            "music_title": music.get("title", ""),
            "music_author": music.get("author", ""),
            "music_url": music_url,
            "digg_count": statistics.get("digg_count", 0),
            "comment_count": statistics.get("comment_count", 0),
            "share_count": statistics.get("share_count", 0),
        }
        
        return result
    
    def _find_aweme_in_data(self, obj, target_id: str):
        """递归查找视频数据"""
        if isinstance(obj, dict):
            if obj.get("aweme_id") == target_id:
                return obj
            for value in obj.values():
                result = self._find_aweme_in_data(value, target_id)
                if result:
                    return result
        elif isinstance(obj, list):
            for item in obj:
                result = self._find_aweme_in_data(item, target_id)
                if result:
                    return result
        return None
    
    def _extract_video_url(self, video: dict) -> str:
        """提取无水印视频地址"""
        video_url = ""
        
        # 优先使用 play_addr (无水印)
        play_addr = video.get("play_addr", {})
        if isinstance(play_addr, dict):
            url_list = play_addr.get("url_list", [])
            if url_list:
                video_url = url_list[0]
        
        # 尝试从 bit_rate 获取最高清晰度
        if not video_url:
            bit_rate_list = video.get("bit_rate", [])
            if bit_rate_list:
                bit_rate_list.sort(key=lambda x: x.get("bit_rate", 0), reverse=True)
                best = bit_rate_list[0]
                play_addr = best.get("play_addr", {})
                if isinstance(play_addr, dict):
                    url_list = play_addr.get("url_list", [])
                    if url_list:
                        video_url = url_list[0]
        
        # 清理视频链接 - 替换 playwm 为 play 以获取无水印版本
        if video_url:
            video_url = video_url.replace("playwm", "play")
            # 确保是 https
            if video_url.startswith("//"):
                video_url = "https:" + video_url
        
        return video_url
    
    def _extract_cover_url(self, video: dict) -> str:
        """提取封面地址"""
        cover = video.get("cover", video.get("origin_cover", {}))
        if isinstance(cover, dict):
            url_list = cover.get("url_list", [])
            if url_list:
                return url_list[0]
        elif isinstance(cover, str):
            return cover
        return ""
    
    def _extract_music_url(self, music: dict) -> str:
        """提取音乐地址"""
        play_url = music.get("play_url", {})
        if isinstance(play_url, dict):
            url_list = play_url.get("url_list", [])
            if url_list:
                return url_list[0]
        elif isinstance(play_url, str):
            return play_url
        return ""
    
    async def download_video(self, share_url: str, save_path: str = "./downloads") -> Optional[str]:
        """
        下载抖音无水印视频
        
        Args:
            share_url: 抖音分享链接
            save_path: 保存路径
            
        Returns:
            保存的文件路径，失败返回 None
        """
        import os
        
        # 获取视频信息
        video_info = await self.get_video_info(share_url)
        
        print(f"\n视频信息:")
        print(f"  描述: {video_info['desc']}")
        print(f"  作者: {video_info['author']}")
        if video_info['duration']:
            print(f"  时长: {video_info['duration'] / 1000:.1f} 秒")
        if video_info['width'] and video_info['height']:
            print(f"  分辨率: {video_info['width']}x{video_info['height']}")
        print(f"  点赞: {video_info['digg_count']}")
        
        video_url = video_info["video_url"]
        if not video_url:
            print("未获取到视频链接")
            return None
        
        print(f"  视频链接: {video_url[:100]}...")
        
        # 创建保存目录
        os.makedirs(save_path, exist_ok=True)
        
        # 生成文件名
        filename = f"{video_info['aweme_id']}.mp4"
        filepath = os.path.join(save_path, filename)
        
        print(f"\n正在下载视频到: {filepath}")
        
        # 下载视频
        download_headers = {
            **self.headers,
            "Referer": "https://www.douyin.com/",
        }
        
        async with httpx.AsyncClient(headers=download_headers, timeout=120.0, follow_redirects=True) as client:
            response = await client.get(video_url)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"下载完成! 文件大小: {len(response.content) / 1024 / 1024:.2f} MB")
                return filepath
            else:
                print(f"下载失败，状态码: {response.status_code}")
                return None


async def main():
    """测试示例"""
    # 测试抖音视频分享地址
    share_url = "https://v.douyin.com/8vSP7OJBOCU/"
    
    print("=" * 60)
    print("抖音视频去水印工具")
    print("=" * 60)
    
    remover = DouyinWatermarkRemover()
    
    try:
        # 获取视频信息
        video_info = await remover.get_video_info(share_url)
        
        print("\n" + "=" * 60)
        print("获取到的视频信息:")
        print("=" * 60)
        for key, value in video_info.items():
            if isinstance(value, str) and len(value) > 80:
                value = value[:80] + "..."
            print(f"  {key}: {value}")
        
        # 下载视频（取消下面的注释来启用）
        # await remover.download_video(share_url)
        
    except Exception as e:
        print(f"\n发生错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
