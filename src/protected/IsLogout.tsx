import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {
  children: React.ReactNode;
}

function IsLogout({ children }: Props) {
  const userTocken = useSelector(
    (state: RootState) => state.userTokenSlice.userToken
  );

  if (userTocken) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default IsLogout;
