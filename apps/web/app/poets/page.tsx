"use client";
import { Container } from "@mantine/core";
import PoetsList from "../components/PoetList";
import { PoetChips } from "../components/PoetChips";

export default function PoetsIndex() {
  return (
    <Container>
      <PoetChips />
      <PoetsList />
    </Container>
  );
}
