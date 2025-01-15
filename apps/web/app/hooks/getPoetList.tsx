"use client";

import { useQuery } from "@tanstack/react-query";

export interface GetPoetListResponse {
  data: {
    poets: Poet[];
    count: number;
    mcs: Poet[];
    mcCount: number;
    totalCount: number;
  };
}
export interface Poet {
  firstName: string;
  lastName: string;
  isMC: boolean;
  aggregateId: string;
  id: string;
  birthDate: string;
  instagramHandle: string;
  email: string;
  isPoet: boolean;
}

export default function PoetsList() {
  const { data, isLoading, isPending } = useQuery<GetPoetListResponse>({
    queryKey: ["poets-list"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/poets/list`).then((res) =>
        res.json()
      ),
  });
  if (isLoading || !data) {
    return <div>is loading...</div>;
  }

  if (isPending) {
    return <div>is pending...</div>;
  }
  return (
    <ol>
      {data.data.poets.map((el, i) => {
        return (
          <li key={i}>
            {el.firstName} {el.lastName}
          </li>
        );
      })}
    </ol>
  );
}
