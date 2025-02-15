import React from "react";

export const inputChange = (e, setState) => {
  const { name, value } = e.target;
  setState((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};
