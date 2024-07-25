"use client";

import InputWithButton from "../components/ui/InputWithButton";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface Word {
  word: string;
  desc: string;
}

export default function Home() {
  const { toast } = useToast();
  let [activeWord, setActiveWord] = useState("");
  let [loading, setLoading] = useState(false);
  let [words, setWords] = useState<Word[]>([]);
  let [aiResponse, setAiResponse] = useState("");

  const handleSaveWord = async ({
    word,
    desc,
  }: {
    word: string;
    desc: string;
  }) => {
    try {
      await fetch("/api/word", {
        method: "POST",
        body: JSON.stringify({ word, desc }),
      });
    } catch (error) {
      toast({
        title: "警告",
        description: "保存失败",
        action: <ToastAction altText="Try again">知道了</ToastAction>,
      });
    }
  };

  const handleSubmit = async (inputStr: string) => {
    if (!inputStr) {
      toast({
        title: "提示",
        description: "请填写单词",
        action: <ToastAction altText="Try again">知道了</ToastAction>,
      });
      return;
    }
    setActiveWord((activeWord = inputStr.trim()));
    setAiResponse((aiResponse = ""));
    setLoading((loading = true));

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        body: JSON.stringify({ word: inputStr }),
      });
      const reader = res.body!.getReader();
      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("stream completed");
            break;
          }
          let chunk = new TextDecoder("utf-8").decode(value);
          setAiResponse((aiResponse += chunk));
        }
      };
      await processStream();
      await handleSaveWord({ word: inputStr, desc: aiResponse });
      await handleQueryAllWord();
    } catch (error) {
    } finally {
      setLoading((loading = false));
    }
  };

  const handleQueryAllWord = async () => {
    const res = await fetch("/api/word/all", {
      method: "POST",
      body: JSON.stringify({}),
    });
    setWords((words = [...(await res.json())]));
  };

  const handleShowWord = (word: Word) => {
    setActiveWord((activeWord = word.word));
    setAiResponse((aiResponse = word.desc));
  };

  useEffect(() => {
    handleQueryAllWord();
  }, []);

  return (
    <main className="h-full">
      <div className="container h-full flex flex-col items-center ">
        <div className="w-full mt-24 flex justify-center ">
          <InputWithButton
            inputPlaceholder={"请输入英语单词"}
            buttonText={"开始分析"}
            loading={loading}
            onClick={handleSubmit}
          ></InputWithButton>
        </div>
        <pre className="mt-12 text-wrap">{aiResponse}</pre>
      </div>

      <div className="fixed top-20 left-20 bottom-20 w-72 overflow-y-auto p-8">
        <ul>
          {words.map((word) => {
            return (
              <li className="mb-2">
                <Button
                  className={
                    (activeWord == word.word ? "  bg-zinc-300" : "") + " w-full"
                  }
                  variant="secondary"
                  onClick={() => handleShowWord(word)}
                >
                  {word.word}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
