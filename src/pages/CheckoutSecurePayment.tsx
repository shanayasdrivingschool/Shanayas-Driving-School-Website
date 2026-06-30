import { Navigate, useLocation } from "react-router-dom";

const CheckoutSecurePayment = () => {
  const location = useLocation();

  return <Navigate replace to={`/checkout${location.search}`} />;
};

export default CheckoutSecurePayment;
