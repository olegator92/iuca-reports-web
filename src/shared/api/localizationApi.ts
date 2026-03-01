import { ensureSuccess, rtkApi } from "./index";
import type { ResultEnvelope } from "./types";

export interface CultureDto {
    name: string;
    displayName: string;
    nativeName: string;
}

export const localizationApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        getCultures: builder.query<CultureDto[], void>({
            query: () => ({
                url: "/localization/cultures",
            }),
            transformResponse: (response: ResultEnvelope<CultureDto[]>) => ensureSuccess(response).data ?? [],
        }),
    }),
});

export const { useGetCulturesQuery } = localizationApi;
