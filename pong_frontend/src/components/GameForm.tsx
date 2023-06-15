import React, { ChangeEvent } from "react";

interface FormProps {
  username: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  register: () => void;
}

const Form: React.FC<FormProps> = (props) => {
  return (
    <form>
      <input
        placeholder="Username in game"
        type="text"
        value={props.username}
        onChange={props.onChange}
      />
      <button onClick={props.register}>Register</button>
    </form>
  );
};

export default Form;