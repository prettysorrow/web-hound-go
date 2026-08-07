export type PersonData = {
  label: string;
  image: string;
  onClick?: () => void;
};

export type GraphData = {
  main: PersonData;
  others: PersonData[];
};
