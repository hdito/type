import { ComponentProps, PropsWithChildren } from "react";

type Props = ComponentProps<"button"> & PropsWithChildren;

export default function Button(props: Props) {
  return (
    <button
      className={`rounded-md bg-black px-1 py-0.5 text-white ${props.className}`}
      {...props}
    >
      {props.children}
    </button>
  );
}
