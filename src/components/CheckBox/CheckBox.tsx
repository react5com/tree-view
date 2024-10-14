import clsx from 'clsx';
import './CheckBox.css'
import { ChangeEvent } from 'react';
export interface ICheckBoxProps {
  className?: string;
  checked?: boolean;
  id: string;
  onChange: (isChecked: boolean) => void;
}
export const CheckBox = (props: ICheckBoxProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.checked);
  }
  return (
    <label className={clsx("treeview-checkbox", props.className)}>
      <input
        id={props.id}
        className="treeview-checkbox-input"
        type="checkbox"
        checked={props.checked}
        onChange={handleChange}
      />
      <span className="treeview-checkbox-ui"></span>
    </label>
  )
}
export default CheckBox