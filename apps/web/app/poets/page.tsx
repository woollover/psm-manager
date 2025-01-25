"use client";
import { Container } from "@mantine/core";
import { PoetChips } from "../components/PoetChips";
import PoetsTable from "../components/PoetsTable";

export default function PoetsIndex() {
  return (
    <Container>
      <PoetChips />
      <PoetsTable />
    </Container>
  );
}
