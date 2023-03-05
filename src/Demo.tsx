import { useContext } from "react";
import { DataContext } from "./DataContext";

export default function Demo() {
  const dataContext = useContext(DataContext);
  return <>{dataContext.data.value}</>;
}
