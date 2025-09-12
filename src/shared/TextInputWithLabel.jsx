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
    <div className={styles.textInputWithLabel}>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        onChange={onChange}
        value={value}
        ref={ref}
        placeholder={placeholder}
      />
    </div>
  );
}

export default TextInputWithLabel
