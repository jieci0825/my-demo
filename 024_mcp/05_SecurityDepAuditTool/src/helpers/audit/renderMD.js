import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const templatesDir = join(__dirname, 'templates')

/**
 * 读取模板文件
 */
function readTemplate(templateName) {
    const templatePath = join(templatesDir, `${templateName}.md`)
    return readFileSync(templatePath, 'utf-8')
}

/**
 * 简单的模板引擎
 */
function renderTemplate(template, data) {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
        const keys = path.trim().split('.')
        let value = data

        for (const key of keys) {
            value = value?.[key]
        }

        return value ?? ''
    })
}

/**
 * 渲染带循环的模板
 */
function renderLoopTemplate(template, data, loopKey) {
    const loopRegex = new RegExp(
        `\{\{#each ${loopKey}\}\}(.*?)\{\{/${loopKey}\}\}`,
        'gs'
    )

    return template.replace(loopRegex, (match, content) => {
        const items = data[loopKey] || []
        return items.map(item => renderTemplate(content, item)).join('')
    })
}

/**
 * 获取严重程度徽章
 */
function getSeverityBadge(severity) {
    const badges = {
        critical: '🔴 严重',
        high: '🟠 高危',
        moderate: '🟡 中危',
        low: '🟢 低危',
        info: '🔵 信息'
    }
    return badges[severity] || severity
}

/**
 * 格式化CVEs列表
 */
function formatCVEs(cves, url) {
    if (!cves || cves.length === 0) return '无'
    return cves
        .map(cve => {
            const linkUrl = url || `https://nvd.nist.gov/vuln/detail/${cve}`
            return `[${cve}](${linkUrl})`
        })
        .join(', ')
}

/**
 * 格式化路径列表
 */
function formatPaths(findings) {
    if (!findings || findings.length === 0) return '无路径信息'

    return findings
        .flatMap(finding =>
            (finding.paths || []).map(
                path => `- \`${path}\` (${finding.version})`
            )
        )
        .join('\n')
}

/**
 * 格式化参考链接
 */
function formatReferences(references) {
    if (!references) return '无'

    // 如果references是字符串，转换为数组
    const refsArray = Array.isArray(references)
        ? references
        : references.split('\n').filter(ref => ref.trim())

    if (refsArray.length === 0) return '无'

    return refsArray
        .map(ref => {
            const trimmed = ref.trim()
            if (trimmed.startsWith('- ')) {
                return trimmed
            }
            return `- [${trimmed}](${trimmed})`
        })
        .join('\n')
}

/**
 * 格式化操作类型
 */
function formatActionType(action) {
    const actionTypes = {
        update: '更新',
        review: '审查',
        audit: '审计'
    }
    return actionTypes[action] || action
}

/**
 * 计算总漏洞数
 */
function calculateTotalVulnerabilities(vulnerabilities) {
    return Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0)
}

/**
 * 生成Markdown报告
 */
export function renderMD(auditResult) {
    try {
        // 读取模板
        const mainTemplate = readTemplate('main')
        const statisticsTemplate = readTemplate('statistics')
        const vulnerabilityTemplate = readTemplate('vulnerability')
        const actionsTemplate = readTemplate('actions')

        // 准备数据
        const data = {
            generatedAt: new Date().toLocaleString('zh-CN'),
            totalVulnerabilities: calculateTotalVulnerabilities(
                auditResult.metadata?.vulnerabilities || {}
            ),
            metadata: auditResult.metadata,
            actions: (auditResult.actions || []).map(action => ({
                ...action,
                actionType: formatActionType(action.action)
            })),
            vulnerabilities: Object.values(auditResult.advisories || {}).map(
                advisory => ({
                    ...advisory,
                    severityBadge: getSeverityBadge(advisory.severity),
                    cvesList: formatCVEs(advisory.cves, advisory.url),
                    paths: formatPaths(advisory.findings),
                    references: formatReferences(advisory.references),
                    cvss: advisory.cvss || { score: 'N/A', vectorString: 'N/A' }
                })
            )
        }

        // 渲染统计部分
        const statisticsContent = renderTemplate(statisticsTemplate, data)

        // 渲染漏洞详情部分
        const vulnerabilitiesContent = data.vulnerabilities
            .map(vuln => renderTemplate(vulnerabilityTemplate, vuln))
            .join('\n')

        // 渲染操作建议部分
        const actionsContent = renderLoopTemplate(
            actionsTemplate,
            data,
            'actions'
        )

        // 渲染主模板
        const finalData = {
            ...data,
            statistics: statisticsContent,
            vulnerabilities: vulnerabilitiesContent,
            actions: actionsContent
        }

        return renderTemplate(mainTemplate, finalData)
    } catch (error) {
        console.error('生成Markdown报告失败:', error)
        throw new Error(`渲染Markdown报告失败: ${error.message}`)
    }
}
