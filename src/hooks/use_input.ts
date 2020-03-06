import { useState, ChangeEvent } from "react";

type InputProperty = {
  value: string
  onChange: any
}


export function useInput(initialiValue : string) : [InputProperty, Function] {
  const [value, setValue] = useState(initialiValue);
  return [
    { value, onChange: e => setValue(e.target.value) },
    (value) => setValue(value)
  ];
};
