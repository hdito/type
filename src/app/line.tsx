type LineProps = {
  targetString: string;
  isEditable: boolean;
  userInput: string;
  userErrors: Set<number>;
};

export function Line({
  targetString,
  isEditable,
  userErrors,
  userInput,
}: LineProps) {
  const renderBlocks = targetString.split("");
  const renderUserInput = userInput.split("");

  return (
    <>
      <div className="flex h-6">
        {renderBlocks.map((char, index) => (
          <span className="inline-block w-[9.6px] text-center" key={index}>
            {char}
          </span>
        ))}
      </div>
      <div className="flex h-6">
        {renderUserInput.map((char, index) => (
          <span
            className={`inline-block w-[9.6px] text-center ${
              userErrors.has(index) ? "bg-black text-white" : ""
            }`}
            key={index}
          >
            {char}
          </span>
        ))}
        {isEditable ? <span>_</span> : null}
      </div>
    </>
  );
}
