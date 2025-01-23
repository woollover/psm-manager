"use client";

import { useQuery } from "@tanstack/react-query";
import { GetPoetListResponse } from "../api/responses/GetPoetList.response";

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
