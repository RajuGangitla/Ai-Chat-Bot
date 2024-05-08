import OpenAI from 'openai';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY

if (!apiKey) {
    throw Error("OPEN_AI_API_KEY is required")
}

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

export default openai