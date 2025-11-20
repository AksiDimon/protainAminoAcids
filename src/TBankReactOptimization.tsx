import React, { useCallback } from 'react';

function useForceUpdate() {
  const [, setCount] = React.useState(0);
  return () => setCount((c) => c + 1);
}

export default function TBankReactOptimization() {
  const forceUpdate = useForceUpdate();
  console.log('FormPage');
  return (
    <div style={{ margin: '20px', padding: '20px', border: '2px solid green' }}>
      <button onClick={() => forceUpdate}>Render</button>
      {/* <RenderCount /> */}
      <Parent />
      <div style={{ maxWidth: '800px', display: 'flex' }}></div>
    </div>
  );
}

const Parent = () => {
  const [value, setValue] = React.useState('');
  console.log('Parent');
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  return (
    <form style={{ margin: '20px', padding: '20px', border: '2px solid blue' }}>
      Input value is: {value}
      {/* <RenderCount /> */}
      <Child onChange={handleChange} />
    </form>
  );
};

type PropsChild = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Child = React.memo(({ onChange }: PropsChild) => {
  console.log('Child');
  return (
    <div style={{ padding: '20px', margin: '20px', border: '2px solid red' }}>
      <input type="text" name="value" onChange={onChange} />
      <RenderCount />
    </div>
  );
});

function RenderCount() {
  const renderCount = React.useRef(1);
  console.log('renderCount');
  React.useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div style={{ marginTop: '10px' }}>Render count: {renderCount.current}</div>
  );
}
