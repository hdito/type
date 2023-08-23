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
      <div>
        {renderBlocks.map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
      <div className="flex h-6">
        {renderUserInput.map((char, index) => (
          <span
            className={`inline-block h-6 w-[9.6px] ${
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
