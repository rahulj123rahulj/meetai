import { DEFAULT_PAGE } from "@/constants";
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const filterSearchParams = {
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
    search: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
}

export const loadSearchParams = createLoader(filterSearchParams);

//  synchronize search params with your usestate hook