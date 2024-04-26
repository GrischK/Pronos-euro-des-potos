import styles from "./UploadInput.module.css";
import { ChangeEventHandler } from "react";

interface UploadInputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: string | undefined;
  accept?: string | undefined;
}

export default function UploadInput({
  onChange,
  type,
  accept,
}: UploadInputProps) {
  return (
    <>
      <input
        name="file"
        id="file"
        className={`${styles.uploadInput} uploadInput`}
        onChange={onChange}
        type={type || "file"}
        accept={accept || ""}
      />
      <label htmlFor="file">
        Choisis un fichier<span></span>
      </label>
    </>
  );
}
