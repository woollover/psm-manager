"use client";

import { useQuery } from "@tanstack/react-query";
import { SlamListReadModelShape } from "../../api/responses/GetSlamList.response";
import { Card, Title } from "@mantine/core";

export default function SlamList() {
  const { data, isLoading, isPending } = useQuery<SlamListReadModelShape>({
    queryKey: ["slams-list"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/slams/list`).then((res) =>
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
    <>
      <Title> Found {data.data.count} slams </Title>
      <div>{data.data.countries}</div>
      <ul>
        {data.data.slams.map((slam, index) => {
          return (
            <li key={index}>
              <Card>
                <h5>{slam.name}</h5>
                <p>{slam.venue}</p>
                <p>{slam.dateTime}</p>
                {slam.isEnded ? "ENDED" : "OPEN"}
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
