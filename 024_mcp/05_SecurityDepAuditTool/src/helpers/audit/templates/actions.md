### 建议操作

{{#each actions}}
#### {{actionType}} 操作

**模块**: `{{module}}`
**目标版本**: {{#if target}}`{{target}}`{{/if}}
**深度**: {{depth}}

**受影响的依赖路径**:
{{#each resolves}}
- `{{path}}` (ID: {{id}})
{{/each}}

{{/each}}
