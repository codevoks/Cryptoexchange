// components/AuthButton.tsx
import { MouseEvent } from "@/types/events";
interface AuthButtonProp {
  text: string,
  clickHandler?: (e: MouseEvent) => Promise<void>
}

export default function AuthButton({ text, clickHandler }: AuthButtonProp) {
    return (
      <button
        type="submit"
        onClick={clickHandler}
        className="w-full py-3 mt-4 font-semibold text-white transition bg-orange-600 rounded-md hover:bg-orange-500"
      >
        {text}
      </button>
    );
  }