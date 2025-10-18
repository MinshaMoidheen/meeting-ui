import { PARTY_URL } from "@/constants";
import { baseApi } from "./baseApi";

export interface Party {
  id: string;
  name: string;
  gstin?: string;
  phone?: string;
  email?: string;
  balance?: number;
  type?: "customer" | "supplier";
  status?: "active" | "inactive";
  billingAddress?: string;
  shippingAddress?: string;
  openingBalance?: number;
  creditLimit?: number;
  gstType?: string;
  state?: string;
  asOfDate?: string;
  noLimit?: boolean;
  customLimitValue?: number;
  additionalField1?: string;
  additionalField2?: string;
  additionalField3?: string;
}

export interface CreatePartyInput {
  name: string;
  gstin?: string;
  phone?: string;
  email?: string;
  billingAddress?: string;
  shippingAddress?: string;
  openingBalance?: number;
  gstType?: string;
  state?: string;
  asOfDate?: string;
  noLimit?: boolean;
  customLimitValue?: number;
  additionalField1?: string;
  additionalField2?: string;
  additionalField3?: string;
}

export interface UpdatePartyInput extends Partial<CreatePartyInput> {
  id: string;
}

export const partyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getParties: builder.query<Party[], void>({
      query: () => ({ url: PARTY_URL, method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Party" as const, id: p.id })),
              { type: "Party" as const, id: "LIST" },
            ]
          : [{ type: "Party" as const, id: "LIST" }],
    }),

    
    getPartyById: builder.query<Party, string>({
      query: (id) => ({ url: `${PARTY_URL}/${id}`, method: "GET" }),
      providesTags: (_res, _err, id) => [{ type: "Party", id }],
    }),


    addParty: builder.mutation<Party, CreatePartyInput>({
      query: (body) => ({ url: PARTY_URL, method: "POST", body }),
      invalidatesTags: [{ type: "Party", id: "LIST" }],
    }),


    updateParty: builder.mutation<Party, UpdatePartyInput>({
      query: ({ id, ...body }) => ({
        url: `${PARTY_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Party", id }],
    }),


    deleteParty: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `${PARTY_URL}/${id}`, method: "DELETE" }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Party", id },
        { type: "Party", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPartiesQuery,
  useGetPartyByIdQuery,
  useAddPartyMutation,
  useUpdatePartyMutation,
  useDeletePartyMutation,
} = partyApi;
