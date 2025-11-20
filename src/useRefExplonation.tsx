import { useRef, useState } from 'react';

export default function RefExplanetion() {
  const [count, setCount] = useState<number>(0);
  const someNumber = useRef<number>(0);

  //   const [text, setText] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFocus() {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.focus();
  }

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
    someNumber.current = someNumber.current + 1;
  };

  return (
    <div className="App">
      <h1>Count: {count}</h1>
      <h2>Number: {someNumber.current}</h2>
      <button onClick={incrementCount}>Increment count</button>
      <div
        style={{
          border: '1px solid black',
          width: 'max-content',
          height: '50px',
        }}
      >
        <input type="text" ref={inputRef} />
        <Button handleFocus={handleFocus} />
      </div>
    </div>
  );
}

type Props = {
  handleFocus: () => void;
};
function Button({ handleFocus }: Props) {
  return (
    <>
      <button onClick={handleFocus}> click Me</button>
    </>
  );
}
