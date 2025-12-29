import { renderMD } from '../src/helpers/audit/renderMD.js'

// 用户提供的测试数据
const testAuditResult = {
    actions: [
        {
            action: 'update',
            resolves: [
                {
                    id: 1105772,
                    path: '.>jspdf>dompurify',
                    dev: false,
                    optional: false,
                    bundled: false
                }
            ],
            module: null,
            target: null,
            depth: 3
        },
        {
            action: 'review',
            module: 'vue-template-compiler',
            resolves: [
                {
                    id: 1098721,
                    path: '.>vue-template-compiler',
                    dev: false,
                    bundled: false,
                    optional: false
                }
            ]
        }
    ],
    advisories: {
        1098721: {
            findings: [
                {
                    version: '2.7.16',
                    paths: ['.>vue-template-compiler']
                }
            ],
            created: '2024-07-23T15:31:09.000Z',
            id: 1098721,
            overview:
                'A vulnerability has been discovered in vue-template-compiler, that allows an attacker to perform XSS via prototype pollution.',
            title: 'vue-template-compiler vulnerable to client-side Cross-Site Scripting (XSS)',
            severity: 'moderate',
            module_name: 'vue-template-compiler',
            vulnerable_versions: '>=2.0.0 <3.0.0',
            patched_versions: '>=3.0.0',
            cves: ['CVE-2024-6783'],
            references: ['- https://nvd.nist.gov/vuln/detail/CVE-2024-6783'],
            cvss: {
                score: 4.2,
                vectorString: 'CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:L/I:L/A:N'
            }
        }
    },
    metadata: {
        vulnerabilities: {
            info: 0,
            low: 1,
            moderate: 5,
            high: 5,
            critical: 0
        },
        dependencies: 1020,
        devDependencies: 0,
        optionalDependencies: 0,
        totalDependencies: 1020
    }
}

try {
    const mdContent = renderMD(testAuditResult)
    console.log('✅ Markdown报告生成成功！')
    console.log('报告预览:')
    console.log('='.repeat(50))
    console.log(mdContent.substring(0, 800) + '...')
    console.log('='.repeat(50))
} catch (error) {
    console.error('❌ 测试失败:', error.message)
}
