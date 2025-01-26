import { Container, Space, Title } from "@mantine/core";
import { CreatePoetForm } from "./poets/components/forms/CreatePoetForm";

export default function Home() {
  return (
    <>
      <Container>
        <Title>Test Components</Title>
        <Space />
        <CreatePoetForm />
      </Container>
    </>
  );
}
