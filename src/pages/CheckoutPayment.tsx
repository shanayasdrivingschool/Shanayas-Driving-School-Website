import { Navigate, useLocation } from "react-router-dom";

const CheckoutPayment = () => {
  const location = useLocation();

  return <Navigate replace to={`/checkout${location.search}`} />;
};

export default CheckoutPayment;
