import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

export default function InputWithButton({
  inputPlaceholder = "",
  buttonText = "Button",
  loading = false,
  onClick,
}: {
  inputPlaceholder?: string;
  buttonText?: string;
  loading?: boolean;
  onClick: (inputStr: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input ref={inputRef} type="text" placeholder={inputPlaceholder} />
      <Button
        disabled={loading}
        type="submit"
        onClick={() => onClick(inputRef.current ? inputRef.current.value : "")}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {buttonText}
      </Button>
    </div>
  );
}
