import classNames from "classnames";
import { useState, type PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  title: string;
};

export default function Accordion({ children, title }: Props) {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <div className="border-y-2 border-gray-700">
      <div
        onClick={() => setIsHidden(!isHidden)}
        className="flex cursor-pointer justify-between p-4"
      >
        <span className="font-bold">{title}</span>
        <span>{isHidden ? "∨" : "∧"}</span>
      </div>
      <div
        className={classNames(
          "flex transform flex-col overflow-hidden px-4 transition-all duration-500",
          {
            "max-h-0": isHidden,
            "pb-0": isHidden,
            "max-h-[400px]": !isHidden,
            "pb-4": !isHidden,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
}
