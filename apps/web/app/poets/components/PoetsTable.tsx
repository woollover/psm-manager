"use client";

import { useQuery } from "@tanstack/react-query";
import {
  GetPoetListResponse,
  Poet,
} from "../../api/responses/GetPoetList.response.js";
import { Table } from "@mantine/core";

export default function PoetsTable() {
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

  const rows = (elements: Poet[]) => {
    return elements.map((element: Poet) => (
      <Table.Tr key={element.id}>
        <Table.Td>
          {element.firstName} {element.lastName}
        </Table.Td>
        <Table.Td>{element.email}</Table.Td>
        <Table.Td>{element.birthDate}</Table.Td>
        <Table.Td>{element.instagramHandle}</Table.Td>
        <Table.Td>{element.isMC ? "MC" : "POET"}</Table.Td>
      </Table.Tr>
    ));
  };
  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Birthday</Table.Th>
          <Table.Th>Instagram Handle</Table.Th>
          <Table.Th>Mc</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows(data.data.poets)}</Table.Tbody>
    </Table>
  );
}
