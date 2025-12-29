import path from 'node:path'

// 工作目录路径（项目根目录）
export const ROOT_DIR = process.cwd()

// src源码目录路径
export const SRC_DIR = path.resolve(ROOT_DIR, 'src')
