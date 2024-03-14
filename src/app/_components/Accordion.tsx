import classNames from "classnames";
import { useState, type PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  title: string;
};

export default function Accordion({ children, title }: Props) {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <div
      onClick={() => setIsHidden(!isHidden)}
      className="border-y-2 border-gray-700 p-4"
    >
      <div className="flex justify-between">
        <span className="font-bold">{title}</span>
        <span>{isHidden ? "∨" : "∧"}</span>
      </div>
      <div
        className={classNames(
          "flex min-h-0 transform flex-col overflow-hidden transition-all duration-500",
          {
            "max-h-0": isHidden,
            "max-h-[400px]": !isHidden,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
}
