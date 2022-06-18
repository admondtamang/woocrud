import { useQuery } from "react-query";
import API from "../../../API";

export default function useOrders(USER, limit, pager) {
  const getWooProducts = async () => {
    const result = await API.WC_getWooOrders(USER.token, limit, pager);
    return result;
  };

  return useQuery(["orders", pager], getWooProducts);
}
