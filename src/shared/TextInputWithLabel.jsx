import styles from './textInputWithLabel.module.css'
function TextInputWithLabel({
  elementId,
  labelText = '',
  onChange,
  ref,
  value,
  placeholder,
}) {
  return (
    <>
      <label htmlFor={elementId}>
        {labelText}
        <input
          className={styles.textInputWithLabel}
          type="text"
          id={elementId}
          onChange={onChange}
          value={value}
          ref={ref}
          placeholder={placeholder}
        />
      </label>
    </>
  );
}

export default TextInputWithLabel
