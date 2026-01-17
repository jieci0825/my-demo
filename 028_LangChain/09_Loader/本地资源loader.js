/**
 * https://docs.langchain.com/oss/javascript/integrations/document_loaders
 *
 */

import { TextLoader } from '@langchain/classic/document_loaders/fs/text'

const loader = new TextLoader('abc.txt')
const docs = await loader.load()
console.log(docs)
