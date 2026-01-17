import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'

const webUrl =
    'https://docs.langchain.com/oss/javascript/integrations/document_loaders/file_loaders/directory'

// 抓取指定网页，并提取需要的纯文本数据
const loader = new CheerioWebBaseLoader(webUrl, {
    // selector: 'p'
})
const docs = await loader.load()
console.log(docs)
