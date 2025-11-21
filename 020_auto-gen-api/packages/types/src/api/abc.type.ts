/**
 * 用户管理模块，处理用户的增删改查等操作
 * @module abc
 * 此文件由脚本自动生成，请勿手动修改
 * 生成时间: 2025-11-21T10:28:03.541Z
 */

export namespace Abc {
  // ========== API 请求和响应类型 ==========

  /**
   * 获取 abc 列表的描述
   * @method GET
   * @path /api/abc/
   * @remarks 获取 abc 列表的备注
   */
  export interface GetAbcListQueryDTO {
    /** 页码 */
    page: number;
    /** 每页条数 */
    pageSize: number;
  }

  export interface GetAbcListResponseDTO {
    list: string[];
    total: number;
  }

}
