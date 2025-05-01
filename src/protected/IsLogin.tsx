import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {
  children: React.ReactNode;
}
function IsLogin({ children }: Props) {
  const userToken = useSelector(
    (state: RootState) => state.userTokenSlice.userToken
  );

  if (!userToken) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}

export default IsLogin;
