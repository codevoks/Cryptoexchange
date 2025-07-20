// components/AuthInput.tsx
import { ChangeEvent } from "@/types/events";
interface AuthInputProps {
  type: string;
  name: string;
  placeholder: string;
  changeHandler? : (e: ChangeEvent) => void
}
  
export default function AuthInput({ type, name, placeholder, changeHandler }: AuthInputProps) {
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  return (
  <div>
      <label className="block mb-2 text-sm font-medium text-accent">{label}</label>
      <input type={type} name={name} placeholder={placeholder} onChange={changeHandler} className="w-full px-4 py-3 mb-4 text-white border rounded-md bg-zinc-800 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"/>
  </div>
  );
}