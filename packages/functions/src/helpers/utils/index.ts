export const combineString = (
  firstName: string | null | undefined,
  lastName: string | null | undefined
) => {
  const trimmedFirstName = (firstName ?? "").trim();
  const trimmedLastName = (lastName ?? "").trim();

  if (trimmedFirstName && trimmedLastName) {
    return `${trimmedFirstName} ${trimmedLastName}`;
  }

  return trimmedFirstName || trimmedLastName || "";
};

export const print = (str: string) => {
  console.log(str);
};
