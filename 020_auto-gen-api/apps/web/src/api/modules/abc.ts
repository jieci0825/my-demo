/**
 * 用户管理模块，处理用户的增删改查等操作
 * @module abc
 * 此文件由脚本自动生成，请勿手动修改
 * 生成时间: 2025-11-22T02:11:58.326Z
 */

import request from '../request'
import type { Abc } from '@coderjc/types'

/**
 * 获取 abc 列表
 * @remarks 获取 abc 列表的备注
 * @method GET
 * @path /api/abc/
 * @auth bearer
 * @tags 列表
 */
export async function list(params?: Abc.GetAbcListQueryDTO): Promise<Abc.GetAbcListResponseDTO> {
  return request.get('/api/abc/', { params })
}
