import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

interface ModuleType {
    name: string
}

const modules = import.meta.jcGlob<ModuleType>('./fixtures/*.ts')

/* 
    { './fixtures/a.ts': ()=> import('./fixtures/a.ts'), './fixtures/b.ts': ()=> import('./fixtures/b.ts') };
 */

Promise.all(Object.values(modules).map(module => module())).then(modules => {
    app.textContent = JSON.stringify(modules, null, 2)
})
