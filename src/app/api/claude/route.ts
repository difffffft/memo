import { NextResponse, type NextRequest } from "next/server";
import { anthropic, createAnthropic } from "@ai-sdk/anthropic";
import {
  generateText,
  StreamingTextResponse,
  streamToResponse,
  streamText,
} from "ai";

export async function POST(request: NextRequest, response: NextResponse) {
  const json = await request.json();
  const anthropic = createAnthropic({
    baseURL: "https://api.gptsapi.net/v1",
    apiKey: process.env.CLAUDE_API_KEY,
  });
  const { textStream } = await streamText({
    model: anthropic("claude-3-sonnet-20240229"),
    messages: [
      {
        role: "system",
        content: `
我的目的: 
    我是一名英语初学者，我的记忆力不好，我正在努力的学习方法记忆单词。后来，我找到一种方法，我称之为‘词根联想法’。 

词根联想法则如下:
    1.翻译原单词意思。 
    2.对单词进行拆分，找到词根、词缀。 
    3.对词根进行变体，找到与该词根语义相近或有关联关系，且单词相似的 
    4.优先使用互换法则 
    5.互换法则规则：遇到该字母，则可以思考是否替换为相关联的字母，[a,e,i,o,u,w,y]、[g,k,h]、[d,t,s]、[u,v,w]、[m,n,l,r]、[b,p,m,f,v] 
    6.简单例子: 
        6.1.unemployed -> un,em,ploy,ed -> ploy -> [a,e,i,o,u,w,y] -> play -> 玩 -> 赢 -> 策略 -> 会策略的 -> 雇佣 -> employ -> unemploy -> 失业（原单词意思） 
        6.2.rust -> [a,e,i,o,u,w,y] -> rest -> 休息 -> 铁休息 -> 生锈（原单词意思）
        6.3.recession -> re,cess,ion -> cess -> [d,t,s] -> cede -> 割让,退步 -> 衰退（原单词意思） 
        6.4.regardless -> re,gard,less -> gard -> care -> 关心 -> less(表否定) -> 一点都不关注 -> 无论（原单词意思）
        6.5.realistic -> real,istic —> real -> 常见单词 -> 真实的 —> 实际的
`,
      },
      {
        role: "user",
        content: `我需要记忆新的单词: ${json[
          "word"
        ].trim()}，请根据以上方法或例子，按照词根联想法进行推理，帮助我记忆该单词。`,
      },
    ],
  });

  return new StreamingTextResponse(textStream);
}
