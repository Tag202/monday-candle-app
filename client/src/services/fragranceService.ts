import getAPIBase from "./baseService";
import { FragranceResponseDTO } from "../types/fragrance.types";


export const fetchFragrances = async (): Promise<FragranceResponseDTO[]> => {
  const res = await fetch(`${getAPIBase()}/api/fragrances`);
  if (!res.ok) throw new Error("Failed to fetch fragrances");
  return res.json();
};