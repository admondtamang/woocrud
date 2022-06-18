import { useQuery } from "react-query";
import API from "../../../API";

export default function useProducts(USER, limit, pager) {
  const getWooProducts = async () => {
    const result = await API.WC_getWooProducts(USER.token, limit, pager);
    return result;
  };

  return useQuery(["products", pager], getWooProducts);
}
