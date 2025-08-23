function TextInputWithLabel({elementId, labelText, onChange, ref, value}) {
  return (
    <>
      <label htmlFor={elementId}>
        {labelText}
        <input
          type="text"
          id={elementId}
          onChange={onChange}
          value={value}
          ref={ref}
        />
      </label>
    </>
  );
}

export default TextInputWithLabel
